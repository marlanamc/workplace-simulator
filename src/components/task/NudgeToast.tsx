export default function NudgeToast({ text, bottom = 32 }: { text: string; bottom?: number }) {
  if (!text) return null;
  return (
    <div
      className="fixed left-1/2 z-[90] max-w-[520px] -translate-x-1/2 rounded-xl bg-[#3c4043] px-5 py-3.5 text-center text-[15px] font-medium leading-snug text-white shadow-lg animate-fade-up"
      style={{ bottom }}
    >
      {text}
    </div>
  );
}
