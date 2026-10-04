"use client";

import { practiceEmailMatches, LESSON_EMAIL_CORRECTION } from "@/lib/tasks/account-recovery/content";

import { useRef, useState } from "react";
import { useLesson } from "@/lib/lesson-context";
import { useProgress } from "@/lib/progress-context";
import { useJobCard } from "@/lib/job-card-context";
import { isConfidenceKey, l } from "@/lib/lessons/confidence";
import { CONFIDENCE_SCENARIOS, confidenceProblem } from "@/lib/tasks/confidence/content";
import RightNowBar from "@/components/task/RightNowBar";
import HelpDrawer from "@/components/task/HelpDrawer";
import PickerModal from "@/components/task/PickerModal";
import PhoneTexts from "@/components/task/PhoneTexts";
import { ReadOnlyGrid, SheetsFrame } from "@/components/task/SheetsFrame";
import { SentEmailRecap } from "@/app/browser/sheet-lesson-parts";

const button = "min-h-11 rounded-full border border-[#dadce0] px-5 py-2 text-[#0b57d0] font-medium hover:bg-[#e8f0fe]";
const input = "mt-1 min-h-11 w-full rounded border border-[#747775] px-3 py-2 text-[#202124] focus:outline-2 focus:outline-[#0b57d0]";

/** Fresh examples in the same Browser. Shared picker, phone, sheet and recap controls. */
export default function ConfidencePractice() {
  const lesson = useLesson()!;
  if (!isConfidenceKey(lesson.taskKey) || !lesson.scenario || lesson.scenario === "classroom") return null;
  return <Practice key={`${lesson.taskKey}:${lesson.scenario}`} />;
}
function Practice() {
  const lesson = useLesson()!;
  const { lang, markComplete, completedTaskKeys } = useProgress();
  const { correct, clearCorrection } = useJobCard();
  const key = lesson.taskKey;
  const s = CONFIDENCE_SCENARIOS[key as keyof typeof CONFIDENCE_SCENARIOS][lesson.scenario as "try" | "home"];
  const t = (en: string, es: string) => lang === "es" ? es : en;
  const [values, setValues] = useState<Record<string, string>>({ recipient: s.recipient ?? "" });
  const [stage, setStage] = useState<"source" | "edit" | "review" | "sent">("source");
  const [help, setHelp] = useState(false);
  const [picker, setPicker] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selected, setSelected] = useState({ row: 1, col: "A" });
  const [signedIn, setSignedIn] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [sharing, setSharing] = useState(false);
  const sourceRef = useRef<HTMLElement>(null);
  const editor = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const done = completedTaskKeys.includes(key);
  const mail = key === "mail-reply" || key === "mail-attach";
  const calendar = key === "calendar" || key === "schedule";
  const recovery = key === "account-recovery";
  const sheet = key === "spreadsheet";
  const files = key === "files";
  const coursework = key === "coursework";
  const chosenFile = s.files?.find(f => f.key === values.file);
  const set = (name: string, value: string) => { clearCorrection(); setValues(v => ({ ...v, [name]: value })); };
  const closePicker = () => { setPicker(false); requestAnimationFrame(() => opener.current?.focus()); };
  const review = () => {
    const problem = confidenceProblem(s, values);
    if (problem) { correct(problem[lang]); return; }
    clearCorrection(); setStage("review");
  };
  const status = coursework ? t("Turned in", "Entregado") : files ? t("Shared", "Compartido") : recovery ? t("Signed in", "Sesión iniciada") : t("Sent", "Enviado");
  const action = coursework ? t("Turn in", "Entregar") : files ? t("Save access", "Guardar acceso") : recovery ? t("Verify", "Verificar") : t("Send", "Enviar");
  const instruction = stage === "review" ? l("Compare this review with the request. Edit if needed, then confirm.", "Compara esta revisión con la solicitud. Edita si hace falta y confirma.") : stage === "sent" ? l("Check the result and its status. What did you check? What would you try if something went wrong? You can point, speak, or write.", "Revisa el resultado y su estado. ¿Qué revisaste? ¿Qué intentarías si algo saliera mal? Puedes señalar, hablar o escribir.") : s.guidance;
  const timeLabel = (value: string) => {
    const [hour, minute] = value.split(":");
    const h = Number(hour);
    return `${h % 12 || 12}:${minute} ${h < 12 ? t("AM", "a. m.") : t("PM", "p. m.")}`;
  };
  const resultFacts = Object.entries(values).filter(([field]) => field !== "password" && field !== "text");
  const labels: Record<string, string> = { email: t("Email", "Correo"), recipient: t("To", "Para"), body: t("Message", "Mensaje"), file: t("File", "Archivo"), name: t("Name", "Nombre"), permission: t("Access", "Acceso"), date: t("Date", "Fecha"), time: t("Time", "Hora"), code: t("Code", "Código"), deadline: t("Due date", "Fecha de entrega"), total: t("Total", "Total") };
  const display = (field: string, value: string) => field === "file" ? chosenFile?.name : field === "permission" ? (value === "view" ? t("Viewer", "Lector") : t("Editor", "Editor")) : field === "time" ? timeLabel(value) : field === "date" ? s.dates?.find(d => d.value === value)?.label[lang] ?? value : value;
  const fileButton = <button ref={opener} type="button" className={button} onClick={() => { setPreview(null); setPicker(true); }}>{files ? t("Open file", "Abrir archivo") : coursework ? t("Add file", "Agregar archivo") : t("Attach", "Adjuntar")}</button>;
  const fileChip = chosenFile && <div className="my-3 flex flex-wrap items-center gap-3 rounded border p-3"><span className="break-all">{values.name || chosenFile.name}</span><button type="button" className={button} onClick={() => { set("file", ""); setRenaming(false); setSharing(false); }}>{t("Remove", "Quitar")}</button></div>;
  return <div data-testid="confidence-practice" className="h-full overflow-y-auto bg-white p-4 text-[#202124] sm:p-6">
    {!done && <RightNowBar taskKey={key} stepIndex={stage === "sent" ? 3 : stage === "review" ? 2 : stage === "edit" ? 1 : 0} stepCount={4}
      instruction={instruction} goal={stage === "review" || stage === "sent" ? instruction : s.request}
      onHelp={() => setHelp(true)} onShowMe={() => sourceRef.current?.scrollIntoView({ block: "nearest" })}
      {...(stage === "sent" ? { primaryLabel: t("I checked the result", "Revisé el resultado"), onPrimary: () => { markComplete(key); } } : {})} />}
    <h1 className="mb-5 text-xl font-medium">{s.title[lang]}</h1>
    <section ref={sourceRef} aria-label={t("Source material", "Documentos")} className="mb-5 space-y-3">
      {/* The request is a realistic received message, not an extra instruction banner. */}
      {!recovery && <article className="rounded-lg border border-[#dadce0] p-4"><h2 className="font-semibold">{mail || calendar ? t("Inbox", "Bandeja de entrada") : t("Request", "Solicitud")}{s.recipient ? ` · ${s.recipient}` : ""}</h2><p className="mt-2">{s.request[lang]}</p></article>}
      {!recovery && s.sources.map((src, i) => <article key={i} className="rounded-lg border border-[#dadce0] p-4"><h2 className="font-semibold">{src.title[lang]}</h2><p className="mt-2 whitespace-pre-line">{src.text[lang]}</p></article>)}
    </section>
    {stage === "source" && <button type="button" className={button} onClick={() => setStage("edit")}>{mail ? t("Reply", "Responder") : calendar ? t("Open invitation / schedule", "Abrir invitación / horario") : recovery ? t("Sign in", "Iniciar sesión") : sheet ? t("Open sheet", "Abrir hoja") : coursework ? t("Open assignment", "Abrir tarea") : t("Open Drive", "Abrir Drive")}</button>}
    {stage === "edit" && <form onSubmit={e => { e.preventDefault(); review(); }} className="@container max-w-3xl space-y-4">
      {s.recipient && <label className="block">{t("To", "Para")}<input aria-label={t("To", "Para")} className={input} value={values.recipient ?? ""} onChange={e => set("recipient", e.target.value)} /></label>}
      {mail && <label className="block">{t("Message", "Mensaje")}<textarea aria-label={t("Message", "Mensaje")} className={`${input} min-h-28`} value={values.body ?? ""} onChange={e => set("body", e.target.value)} /></label>}
      {(mail && s.files || coursework || files) && <>{fileButton}{fileChip}</>}
      {files && chosenFile && <>
        <article className="rounded border p-4"><h2 className="font-medium">{chosenFile.name}</h2><p>{chosenFile.detail[lang]}</p></article>
        <button type="button" className={button} onClick={() => { setRenaming(true); if (!values.name) set("name", chosenFile.name); }}>{t("Rename", "Cambiar nombre")}</button>
        {renaming && <label className="block">{t("New file name", "Nombre nuevo")}<input aria-label={t("New file name", "Nombre nuevo")} className={input} value={values.name ?? ""} onChange={e => set("name", e.target.value)} /></label>}
        <button type="button" className={button} onClick={() => setSharing(true)}>{t("Share", "Compartir")}</button>
        {sharing && <label className="block">{t("Access", "Acceso")}<select aria-label={t("Access", "Acceso")} className={input} value={values.permission ?? ""} onChange={e => set("permission", e.target.value)}><option value="">{t("Choose access", "Elegir acceso")}</option><option value="view">{t("Viewer", "Lector")}</option><option value="edit">{t("Editor", "Editor")}</option></select></label>}
      </>}
      {calendar && <>
        <p className="font-medium">{key === "calendar" ? t("Propose new time", "Proponer otra hora") : t("Request schedule change", "Solicitar cambio de horario")}</p>
        <label className="block">{t("Date", "Fecha")}<select aria-label={t("Date", "Fecha")} className={input} value={values.date ?? ""} onChange={e => set("date", e.target.value)}><option value="">{t("Choose date", "Elegir fecha")}</option>{s.dates?.map(d => <option key={d.value} value={d.value}>{d.label[lang]}</option>)}</select></label>
        <label className="block">{t("Start time", "Hora de inicio")}<select aria-label={t("Start time", "Hora de inicio")} className={input} value={values.time ?? ""} onChange={e => set("time", e.target.value)}><option value="">{t("Choose time", "Elegir hora")}</option>{s.times?.map(time => <option key={time} value={time}>{timeLabel(time)}</option>)}</select></label>
      </>}
      {recovery && <>
        {!signedIn && <label className="block">{t("Email", "Correo")}<input aria-label={t("Email", "Correo")} inputMode="email" autoComplete="off" autoCapitalize="none" spellCheck={false} className={input} value={values.email ?? ""} onChange={e => set("email", e.target.value)} /></label>}
        {!signedIn && <label className="block">{t("Practice password", "Contraseña de práctica")}<input aria-label={t("Practice password", "Contraseña de práctica")} autoComplete="off" className={input} value={values.password ?? ""} onChange={e => set("password", e.target.value)} /></label>}
        {!signedIn ? <button type="button" className={button} onClick={() => { if (!practiceEmailMatches(values.email ?? "", s.expected.email)) return correct(LESSON_EMAIL_CORRECTION[lang]); if (values.password?.trim() !== s.expected.password) return correct(s.correction[lang]); clearCorrection(); setSignedIn(true); }}>{t("Next", "Siguiente")}</button> : <div className="grid grid-cols-1 items-start gap-4 @min-[520px]:grid-cols-[236px_minmax(0,1fr)]">
          <PhoneTexts heading={t("Messages", "Mensajes")} emptyLabel={t("No messages", "Sin mensajes")} chosenKey={values.text} onTap={value => set("text", value)} texts={s.sources.map((src, i) => ({ key: String(i), from: src.title[lang], body: src.text[lang], when: "" }))} />
          <label className="block">{values.text && <span className="mb-3 block rounded border bg-[#e8f0fe] p-3 text-sm @min-[520px]:hidden">{s.sources[Number(values.text)]?.text[lang]}</span>}{t("Verification code", "Código de verificación")}<input aria-label={t("Verification code", "Código de verificación")} className={input} autoComplete="off" inputMode="numeric" value={values.code ?? ""} onChange={e => set("code", e.target.value)} /></label>
        </div>}
      </>}
      {sheet && <>
        <SheetsFrame fileName={s.title[lang]}>
          <ReadOnlyGrid columns={[{ key: "A", width: 160, header: t("Item", "Artículo") }, { key: "B", width: 100, header: t("Delivered", "Entregado") }]}
            rows={[...(s.rows ?? []).map((row, i) => ({ row: i + 2, cells: { A: row.label[lang], B: values[`B${i + 2}`] ?? "" } })), { row: 4, cells: { A: t("Total", "Total"), B: String(Number(values.B2?.replace(",", ".") || 0) + Number(values.B3?.replace(",", ".") || 0)) }, total: true }]}
            selected={selected} onSelect={cell => { setSelected(cell); if (cell.col === "B" && (cell.row === 2 || cell.row === 3)) requestAnimationFrame(() => editor.current?.focus()); }} formulaFor={(row, col) => row === 4 && col === "B" ? "=SUM(B2:B3)" : undefined} />
          {selected.col === "B" && (selected.row === 2 || selected.row === 3) && <label className="block px-4 pb-4">{t("Edit cell", "Editar celda")} {`B${selected.row}`}<input aria-label={`${t("Edit cell", "Editar celda")} B${selected.row}`} ref={editor} className={input} inputMode="decimal" value={values[`B${selected.row}`] ?? ""} onChange={e => set(`B${selected.row}`, e.target.value)} /></label>}
        </SheetsFrame>
        <label className="block">{t("Total to send", "Total para enviar")}<input aria-label={t("Total to send", "Total para enviar")} className={input} inputMode="decimal" value={values.total ?? ""} onChange={e => set("total", e.target.value)} /></label>
      </>}
      {coursework && <label className="block">{t("Due date", "Fecha de entrega")}<input aria-label={t("Due date", "Fecha de entrega")} type="date" className={input} value={values.deadline ?? ""} onChange={e => set("deadline", e.target.value)} /></label>}
      {(!recovery || signedIn) && <button type="submit" className={`${button} block`} data-testid="confidence-review">{t("Review", "Revisar")}</button>}
    </form>}
    {(stage === "review" || stage === "sent") && <section data-testid="confidence-result" className="max-w-3xl space-y-4 rounded-lg border p-4">
      <h2 className="text-lg font-medium">{stage === "sent" ? status : t("Review", "Revisión")}</h2>
      {mail ? <SentEmailRecap heading={stage === "sent" ? status : t("Draft", "Borrador")} toLabel={t("To", "Para")} to={values.recipient} subjectLabel={t("Subject", "Asunto")} subject={s.title[lang]} body={values.body ?? ""} fact={chosenFile ? { label: t("Attachment", "Adjunto"), value: chosenFile.name } : undefined} /> : <dl className="space-y-3">{resultFacts.map(([field, value]) => <div key={field}><dt className="font-medium">{labels[field] ?? field}</dt><dd className="break-words">{display(field, value)}</dd></div>)}</dl>}
      {stage === "review" && <div className="flex flex-wrap gap-3"><button type="button" className={button} onClick={() => setStage("edit")}>{t("Edit", "Editar")}</button><button type="button" className={button} data-testid="confidence-confirm" onClick={() => setStage("sent")}>{action}</button></div>}
    </section>}
    {picker && <PickerModal title={t("Files", "Archivos")} categoryLabel={t("Name", "Nombre")} columnLabels={[]} items={(s.files ?? []).map(f => ({ key: f.key, label: f.name, isTarget: f.key === s.expected.file }))}
      onCancel={closePicker} cancelLabel={t("Cancel", "Cancelar")} onSelect={f => { set("file", f.key); if (files) { set("name", ""); setRenaming(false); setSharing(false); } closePicker(); }}
      preview={{ selectedKey: preview, onFocus: f => setPreview(f.key), render: f => <article className="h-fit w-full rounded bg-white p-4"><h2 className="break-all font-medium">{f.label}</h2><p className="mt-3">{s.files?.find(item => item.key === f.key)?.detail[lang]}</p></article>, empty: t("File preview", "Vista previa"), confirmLabel: files ? t("Open", "Abrir") : t("Attach", "Adjuntar") }} />}
    <HelpDrawer open={help} onClose={() => setHelp(false)} kicker={t("Practice", "Práctica")} lesson={{ t: s.title[lang], s: [s.help[lang]], tip: t("Help stays available. Your draft is kept.", "La ayuda sigue disponible. Tu borrador se conserva.") }} tipLabel={t("Tip", "Consejo")} gotItLabel={t("Back to my task", "Volver a mi tarea")} />
  </div>;
}
