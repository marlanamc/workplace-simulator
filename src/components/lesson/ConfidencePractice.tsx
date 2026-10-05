"use client";

import LessonMail from './LessonMail';
import { useRef, useState } from 'react';
import { useLesson } from '@/lib/lesson-context';
import { useProgress } from '@/lib/progress-context';
import { useJobCard } from '@/lib/job-card-context';
import { isConfidenceKey, l } from '@/lib/lessons/confidence';
import { practiceScenario } from '@/lib/tasks/confidence/classroom';
import { assessPractice } from '@/lib/tasks/confidence/content';
import RightNowBar from '@/components/task/RightNowBar';
import HelpDrawer from '@/components/task/HelpDrawer';
import PickerModal from '@/components/task/PickerModal';
import LessonSheet from './LessonSheet';
import { LessonPortal, LessonClassroom } from './LessonPortal';
import { SentEmailRecap } from '@/app/browser/sheet-lesson-parts';

const button='min-h-11 rounded-full border border-[#dadce0] bg-white px-5 py-2 font-medium text-[#0b57d0] hover:bg-[#e8f0fe] focus-visible:outline-2 focus-visible:outline-[#0b57d0]';
const primary=`${button} border-[#0b57d0]`;
const input='mt-1 block min-h-11 w-full rounded border border-[#747775] bg-white px-3 py-2 text-[#202124] focus:outline-2 focus:outline-[#0b57d0]';

/** Every lesson scenario uses the same app controls; scenario changes supply facts only. */
export default function ConfidencePractice(){
  const lesson=useLesson()!;
  if(!isConfidenceKey(lesson.taskKey)||lesson.taskKey==='account-recovery') return null;
  return <Practice key={`${lesson.taskKey}:${lesson.scenario}`} />;
}
function Practice(){
  const lesson=useLesson()!;
  const {lang,markComplete,completedTaskKeys}=useProgress();
  const {correct,clearCorrection}=useJobCard();
  const key=lesson.taskKey;
  if(!isConfidenceKey(key)) throw new Error('Unsupported practice');
  const scenario=lesson.scenario??'classroom';
  const [message,setMessage]=useState(0);
  const s=practiceScenario(key,scenario,message);
  const t=(en:string,es:string)=>lang==='es'?es:en;
  const mail=key==='mail-reply'||key==='mail-attach';
  const sheet=key==='spreadsheet';
  const files=key==='files';
  const calendar=key==='calendar';
  const schedule=key==='schedule';
  const coursework=key==='coursework';
  const [values,setValues]=useState<Record<string,string>>({recipient:mail?s.recipient??'':'',scope:'restricted'});
  const [view,setView]=useState<'home'|'read'|'edit'|'sent'>('home');
  const [receipt,setReceipt]=useState<Record<string,string>|null>(null);
  const [sent,setSent]=useState<Record<string,string>[]>([]);
  const [help,setHelp]=useState(false);
  const [draftActive,setDraftActive]=useState(false);
  const [newMessage,setNewMessage]=useState(false);
  const [addMenu,setAddMenu]=useState(false);
  const [picker,setPicker]=useState(false);
  const [preview,setPreview]=useState<string|null>(null);
  const [rename,setRename]=useState(false);
  const [sharing,setSharing]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [names,setNames]=useState<Record<string,string>>({});
  const [grants,setGrants]=useState<Record<string,Record<string,string>>>({});
  const [scopes,setScopes]=useState<Record<string,string>>({});
  const root=useRef<HTMLDivElement>(null);
  const opener=useRef<HTMLButtonElement>(null);
  const done=completedTaskKeys.includes(key);
  const chosen=s.files?.find(f=>f.key===values.file);
  const fileName=chosen?(names[chosen.key]??chosen.name):'';
  const fileGrants=grants[values.file]??{};
  const set=(name:string,value:string)=>{clearCorrection();setValues(v=>({...v,[name]:value}));};
  const begin=()=>{clearCorrection();setReceipt(null);setDraftActive(true);setView('edit');};
  const action=(data=values)=>{clearCorrection();setReceipt({...data});setDraftActive(false);setView('sent');if(mail||sheet)setSent(old=>[...old,{...data,subject:data.subject??s.title[lang]}]);};
  const check=()=>{
    if(!receipt)return;
    const problem=assessPractice(key,scenario,s,receipt,message);
    if(problem){correct(`${t('Practice feedback: ','Comentario de práctica: ')}${problem[lang]}`);return;}
    clearCorrection();
    if(key==='mail-reply'&&scenario==='classroom'&&message<2){
      const next=practiceScenario(key,scenario,message+1);setMessage(message+1);setNewMessage(false);setValues({recipient:next.recipient??''});setReceipt(null);setView('home');return;
    }
    markComplete(key);
  };
  const status=coursework?t('Turned in','Entregado'):files?t('Sharing updated','Acceso actualizado'):calendar?t('Proposal sent · awaiting organizer','Propuesta enviada · pendiente de aceptación'):schedule?t('Request sent · awaiting approval','Solicitud enviada · pendiente de aprobación'):t('Sent','Enviado');
  const instruction=receipt?l('Inspect the result in the app. Use Check my work for practice feedback. You can correct mistakes in the app.','Revisa el resultado en la aplicación. Usa Revisar mi trabajo para recibir comentarios de práctica. Puedes corregir errores en la aplicación.') : s.guidance;
  const field=(name:string,label:string,type='text')=><label className="block">{label}<input aria-label={label} className={input} type={type} required={name!=='recipient'||!files} value={values[name]??''} onChange={e=>set(name,e.target.value)} /></label>;
  const source=<section aria-label={t('Source material','Documentos')} className="space-y-3">{s.sources.map((src,i)=><article key={i} className="rounded-lg border border-[#dadce0] bg-[#f8fafd] p-4"><h3 className="font-semibold">{src.title[lang]}</h3><p className="mt-2 whitespace-pre-line">{src.text[lang]}</p></article>)}</section>;
  const closePicker=()=>{setPicker(false);requestAnimationFrame(()=>opener.current?.focus());};
  const attach=<button ref={opener} type="button" className={button} onClick={()=>{setPreview(null);if(coursework)setAddMenu(v=>!v);else setPicker(true);}}>{coursework?t('Add or create','Agregar o crear'):t('Attach files','Adjuntar archivos')}</button>;
  const chip=chosen&&<div className="my-3 flex flex-wrap items-center gap-2 rounded border p-3"><button className="break-all text-left underline" onClick={()=>setPreview(chosen.key)} type="button">{chosen.name}</button><button type="button" className={button} onClick={()=>set('file','')}>{t('Remove','Quitar')}</button></div>;
  const compose=<form className="space-y-4 rounded-xl border bg-white p-4" onSubmit={e=>{e.preventDefault();action();}}>
    <h2 className="text-lg font-medium">{mail&&!newMessage?t('Reply','Responder'):t('New message','Mensaje nuevo')}</h2>
    {mail?<label className="flex min-h-11 items-center gap-3 border-b border-[#dadce0] text-[#5f6368]"><span>{t('To','Para')}</span><input aria-label={t('To','Para')} type="email" required className="min-h-11 min-w-0 flex-1 bg-transparent text-[#202124] outline-[#0b57d0]" value={values.recipient??''} onChange={e=>set('recipient',e.target.value)} /></label>:field('recipient',t('To','Para'),'email')}
    {mail&&newMessage?field('subject',t('Subject','Asunto')):<p>{t('Subject','Asunto')}: {mail?'Re: ':''}{s.title[lang]}</p>}
    <label className="block"><span className={mail?"sr-only":undefined}>{t('Message','Mensaje')}</span><textarea aria-label={t('Message','Mensaje')} className={mail?"block min-h-40 w-full resize-y bg-white py-3 text-[15px] leading-relaxed outline-[#0b57d0]":`${input} min-h-32`} value={values.body??''} onChange={e=>set('body',e.target.value)} /></label>
    {s.files&&<>{attach}{chip}</>}
    <div className="flex flex-wrap gap-3"><button type="submit" className={mail?"min-h-11 rounded-full bg-[#0b57d0] px-7 py-2 font-medium text-white hover:bg-[#0842a0]":primary}>{t('Send','Enviar')}</button>{sheet&&<button type="button" className={button} onClick={()=>setView('read')}>{t('Back to sheet','Volver a la hoja')}</button>}</div>
  </form>;
  const sentPane=<section className="space-y-3" data-testid="practice-result"><h2 className="text-lg font-medium">{t('Sent','Enviados')}</h2>{sent.map((r,i)=><SentEmailRecap key={i} heading={t('Sent','Enviado')} toLabel={t('To','Para')} to={r.recipient} subjectLabel={t('Subject','Asunto')} subject={r.subject??s.title[lang]} body={r.body??''} fact={r.file?{label:t('Attachment','Adjunto'),value:s.files?.find(f=>f.key===r.file)?.name??r.file}:undefined}/>)}<button className={button} onClick={begin}>{t('Write a follow-up','Escribir otro correo')}</button>{sheet&&<button className={button} onClick={()=>setView('read')}>{t('Back to sheet','Volver a la hoja')}</button>}</section>;
  const courseworkPane=<section className="space-y-4 rounded-xl border bg-white p-5"><h2 className="flex justify-between gap-3 text-lg font-semibold">{t('Your work','Tu trabajo')}<span data-testid="submission-status">{receipt?status:t('Assigned','Asignado')}</span></h2>
      {receipt?<><p>{s.files?.find(f=>f.key===receipt.file)?.name}</p><button className={button} onClick={()=>{setConfirm(true);}}>{t('Unsubmit','Anular entrega')}</button></>:<>{attach}{addMenu&&<div><button className={button} onClick={()=>{setAddMenu(false);setPicker(true);}}>Google Drive</button></div>}{chip}<button className={primary} onClick={()=>setConfirm(true)}>{t('Turn in','Entregar')}</button></>}
    </section>;
  const shiftPane=<section className="space-y-4 rounded-xl border bg-white p-5">
      <h2 className="text-lg font-semibold">{calendar?t('Event invitation','Invitación de evento'):t('Shift change','Cambio de turno')}</h2>
      {receipt&&<div data-testid="practice-result" role="status"><strong>{status}</strong><p>{receipt.date} · {receipt.time}{calendar?` – ${receipt.end}`:''}</p><p>{receipt.body}</p></div>}
      {view!=='edit'?<button className={button} onClick={begin}>{calendar?t('Propose a new time','Proponer otra hora'):t('Request change','Solicitar cambio')}</button>:<form className="space-y-4" onSubmit={e=>{e.preventDefault();if(calendar&&values.end<=values.time){correct(t('End time must be after start time.','La hora de fin debe ser posterior al inicio.'));return;}action({...values,recipient:s.recipient??''});}}>
        {field('date',t('Date','Fecha'),'date')}{field('time',t('Start time','Hora de inicio'),'time')}{calendar&&field('end',t('End time','Hora de fin'),'time')}
        <label className="block">{t('Note (optional)','Nota (opcional)')}<textarea className={input} aria-label={t('Note (optional)','Nota (opcional)')} value={values.body??''} onChange={e=>set('body',e.target.value)}/></label>
        <button className={primary} type="submit">{calendar?t('Send proposal','Enviar propuesta'):t('Send request','Enviar solicitud')}</button>
      </form>}
    </section>;
  return <div ref={root} data-testid="confidence-practice" data-practice-app={key} className="h-full overflow-y-auto bg-[#f6f8fc] text-[#202124]">
    {!done&&<RightNowBar taskKey={key} stepIndex={receipt?2:view==='home'?0:1} stepCount={3} instruction={instruction} goal={receipt?instruction:s.request}
      facts={(files||sheet)&&s.recipient?[{label:l('Recipient','Destinatario'),value:s.recipient}]:undefined}
      onHelp={()=>setHelp(true)} onShowMe={()=>{const selector=receipt?'[data-testid="practice-result"],[data-testid="submission-status"]':view==='edit'?'textarea,input':sheet?'[data-cell="B2"]':files?'table':mail?'article':'section';root.current?.querySelector(selector)?.scrollIntoView({block:'center',behavior:'smooth'});}}
      {...(receipt?{primaryLabel:t('Check my work','Revisar mi trabajo'),onPrimary:check}:{})} />}
    {mail ? <LessonMail key={message} scenario={s} view={view} onView={setView} onReply={()=>{setNewMessage(false);begin();}} onResume={begin} newMessage={newMessage} onCompose={()=>{if(!draftActive){setNewMessage(true);setValues(v=>({...v,recipient:"",subject:"",body:"",file:""}));}begin();}} compose={compose} sources={source} sent={sentPane} sentCount={sent.length} hasDraft={draftActive&&Boolean(values.body||values.file)} /> : sheet ? <LessonSheet scenario={s} lang={lang} values={values} onChange={set} onEmail={begin} overlay={view==='edit'?compose:view==='sent'?sentPane:undefined}/> : schedule ? <LessonPortal scenario={s} lang={lang} onRequest={begin}>{shiftPane}</LessonPortal> : coursework ? <LessonClassroom scenario={s} lang={lang}>{courseworkPane}</LessonClassroom> : <>
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-3">
      <h1 className="text-xl font-medium">{sheet?'Sheets':files?'Drive':coursework?'Classroom':calendar?t('Calendar','Calendario'):t('Schedule portal','Portal de horarios')}</h1>
      <span className="text-sm">{s.title[lang]}</span>
    </header>
    <div className="space-y-5 p-4 sm:p-6">
      <article className="space-y-3 rounded-xl border bg-white p-4"><h2 className="font-semibold">{t('Request','Solicitud')}{s.recipient?` · ${s.recipient}`:''}</h2><p>{s.request[lang]}</p>{source}</article>
    {files&&<>
      <h2 className="text-lg font-semibold">{t('My Drive','Mi unidad')}</h2>
      <div className="overflow-x-auto rounded border bg-white"><table className="w-full text-left"><thead><tr><th className="p-3">{t('Name','Nombre')}</th><th className="p-3">{t('Actions','Acciones')}</th></tr></thead><tbody>{s.files?.map(f=><tr key={f.key} className="border-t"><td className="p-3"><button className="text-left underline" onClick={()=>{set('file',f.key);setPreview(f.key);}}>{names[f.key]??f.name}</button></td><td className="flex flex-wrap gap-2 p-2"><button className={button} onClick={()=>{setValues(v=>({...v,file:f.key,name:names[f.key]??f.name}));setRename(true);}}>{t('Rename','Cambiar nombre')}</button><button className={button} onClick={()=>{setValues(v=>({...v,file:f.key,recipient:'',permission:'view',scope:scopes[f.key]??'restricted'}));setSharing(true);}}>{t('Share','Compartir')}</button></td></tr>)}</tbody></table></div>
      {receipt&&<p data-testid="practice-result" role="status">{status} · {receipt.name}</p>}
    </>}
    {calendar&&shiftPane}
    </div></>}
    {picker&&<PickerModal title={coursework?'Google Drive':t('Downloads','Descargas')} categoryLabel={t('Name','Nombre')} columnLabels={[]} items={(s.files??[]).map(f=>({key:f.key,label:f.name,isTarget:false}))} onCancel={closePicker} cancelLabel={t('Cancel','Cancelar')} onSelect={f=>{set('file',f.key);setPreview(null);closePicker();}} preview={{selectedKey:preview,onFocus:f=>setPreview(f.key),render:f=><article className="p-4"><h2>{f.label}</h2><p>{s.files?.find(x=>x.key===f.key)?.detail[lang]}</p></article>,empty:t('File preview','Vista previa'),confirmLabel:coursework?t('Add','Agregar'):t('Open','Abrir')}} />}
    {preview&&!picker&&<Dialog title={s.files?.find(f=>f.key===preview)?.name??''} close={()=>setPreview(null)} closeLabel={t('Close','Cerrar')}><p>{s.files?.find(f=>f.key===preview)?.detail[lang]}</p></Dialog>}
    {rename&&<Dialog title={t('Rename','Cambiar nombre')} close={()=>setRename(false)} closeLabel={t('Cancel','Cancelar')}><form onSubmit={e=>{e.preventDefault();setNames(n=>({...n,[values.file]:values.name}));setRename(false);setReceipt(null);clearCorrection();}}>{field('name',t('New file name','Nombre nuevo'))}<button className={`${primary} mt-4`} type="submit">{t('Save','Guardar')}</button></form></Dialog>}
    {sharing&&<Dialog title={`${t('Share','Compartir')} · ${fileName}`} close={()=>setSharing(false)} closeLabel={t('Close','Cerrar')}><form className="space-y-4" onSubmit={e=>{e.preventDefault();const address=values.recipient?.trim().toLowerCase();const next={...fileGrants,...(address?{[address]:values.permission}: {})};setGrants(g=>({...g,[values.file]:next}));setScopes(g=>({...g,[values.file]:values.scope}));setSharing(false);action({...values,name:fileName,recipient:s.recipient??'',permission:next[s.recipient??'']??'',recipients:Object.keys(next).sort().join(','),scope:values.scope});}}>
      {field('recipient',t('Add people','Agregar personas'),'email')}<label className="block">{t('Role','Permiso')}<select aria-label={t('Role','Permiso')} className={input} value={values.permission} onChange={e=>set('permission',e.target.value)}><option value="view">{t('Viewer','Lector')}</option><option value="comment">{t('Commenter','Comentador')}</option><option value="edit">{t('Editor','Editor')}</option></select></label>
      <h3 className="font-semibold">{t('People with access','Personas con acceso')}</h3><p>{t('You (owner)','Tú (propietario)')}</p>{Object.entries(fileGrants).map(([address,role])=><div className="flex flex-wrap gap-2" key={address}><span>{address} · {role==='edit'?t('Editor','Editor'):role==='comment'?t('Commenter','Comentador'):t('Viewer','Lector')}</span><button type="button" className={button} onClick={()=>{setGrants(g=>{const updated={...g[values.file]};delete updated[address];return {...g,[values.file]:updated};});setReceipt(null);}}>{t('Remove access','Quitar acceso')}</button></div>)}
      <label className="block">{t('General access','Acceso general')}<select aria-label={t('General access','Acceso general')} className={input} value={values.scope} onChange={e=>set('scope',e.target.value)}><option value="restricted">{t('Restricted','Restringido')}</option><option value="anyone">{t('Anyone with the link','Cualquier persona con el enlace')}</option></select></label><button type="submit" className={primary}>{t('Save','Guardar')}</button>
    </form></Dialog>}
    {confirm&&<Dialog title={receipt?t('Unsubmit work?','¿Anular entrega?'):t('Turn in work?','¿Entregar trabajo?')} close={()=>setConfirm(false)} closeLabel={t('Cancel','Cancelar')}><p>{chosen?.name??t('No attachment','Sin adjunto')}</p><button className={`${primary} mt-4`} onClick={()=>{setConfirm(false);if(receipt){setReceipt(null);clearCorrection();}else action();}}>{receipt?t('Unsubmit','Anular entrega'):t('Turn in','Entregar')}</button></Dialog>}
    <HelpDrawer open={help} onClose={()=>setHelp(false)} kicker={t('Practice help','Ayuda de práctica')} lesson={{t:s.title[lang],s:[s.help[lang],...(sheet?[t('To send the total, open File → Email → Email collaborators.','Para enviar el total, abre Archivo → Correo electrónico → Enviar correo a colaboradores.')]:[])],tip:t('This is practice feedback, not a check performed by the real app.','Son comentarios de práctica, no una revisión de la aplicación real.')}} tipLabel={t('Tip','Consejo')} gotItLabel={t('Back to my task','Volver a mi tarea')} />
  </div>;
}
function Dialog({title,close,closeLabel,children}:{title:string;close:()=>void;closeLabel:string;children:React.ReactNode}){
  const ref=useRef<HTMLDialogElement>(null);
  return <dialog ref={el=>{ref.current=el;if(el&&!el.open)el.showModal();}} onCancel={e=>{e.preventDefault();close();}} aria-label={title} className="m-auto max-h-[85vh] w-[min(92vw,540px)] overflow-y-auto rounded-2xl border p-6 text-[#202124] shadow-xl backdrop:bg-black/35"><h2 className="mb-4 text-xl font-semibold">{title}</h2>{children}<button className={`${button} mt-4`} onClick={close}>{closeLabel}</button></dialog>;
}
