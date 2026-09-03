import type { ReactNode } from "react";

/**
 * The Google Forms chrome — a white "Forms" header bar with the purple mark,
 * a light purple page, a title card with a purple top stripe and a "* Required"
 * line, and `QuestionCard`s for each field. Shared by every task that stands in
 * for a Google Form (`incident`, `performance-review`) so a learner who meets
 * "a Google Form" twice in the program sees the same thing both times.
 *
 * The purple is Forms' own `#673ab7` / `#7248b9`. Font is Roboto, like the rest
 * of the Google-app clones.
 */

export const FORMS_PURPLE = "#673ab7";

export function FormsShell({
  children,
  header = "Forms",
}: {
  children: ReactNode;
  /** The word in the top bar. Real Forms just says "Forms". */
  header?: string;
}) {
  return (
    <div
      className="flex h-full min-h-0 flex-col bg-[#f0ebf8] text-[14px] text-[#202124]"
      style={{ fontFamily: "Roboto, Arial, sans-serif" }}
    >
      <div className="flex items-center gap-3 border-b border-[#dadce0] bg-white px-4 py-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-[4px]"
          style={{ background: FORMS_PURPLE }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6" fill="#d1c4e9" />
            <path d="M8 13h8v1.5H8zm0 3h5v1.5H8z" />
          </svg>
        </span>
        <span className="text-[18px] text-[#5f6368]">{header}</span>
        <div className="flex-1" />
      </div>
      {children}
    </div>
  );
}

/** The purple-topped title card at the top of a Google Form. */
export function FormTitleCard({
  title,
  description,
  requiredLabel,
}: {
  title: string;
  description?: string;
  /** e.g. "Required" / "Obligatorio". Shows the red "* Required" line when set. */
  requiredLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-[0_1px_2px_rgba(0,0,0,.15)]">
      <div className="h-[10px]" style={{ background: FORMS_PURPLE }} />
      <div className="px-6 pb-5 pt-4">
        <h1 className="text-[32px] font-normal leading-tight text-[#202124]">{title}</h1>
        {description && (
          <p className="mt-2 text-[14px] leading-relaxed text-[#444746]">{description}</p>
        )}
        {requiredLabel && (
          <p className="mt-3 text-[13px] text-[#d93025]">* {requiredLabel}</p>
        )}
      </div>
    </div>
  );
}

/** One white field card, with a label and (optionally) a red required asterisk. */
export function QuestionCard({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="rounded-lg bg-white px-6 py-5 shadow-[0_1px_2px_rgba(0,0,0,.15)]">
      <div className="mb-3 text-[16px] text-[#202124]">
        {label}
        {required && <span className="ml-0.5 text-[#d93025]">*</span>}
      </div>
      {children}
    </div>
  );
}

/** A Forms-styled short-answer underline input. */
export function FormInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "w-full border-0 border-b border-[#e0e0e0] bg-transparent py-2 text-[16px] outline-none focus:border-b-2 focus:border-[#673ab7] " +
        (props.className ?? "")
      }
    />
  );
}

/** A Forms-styled paragraph textarea. */
export function FormTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={
        "min-h-[96px] w-full resize-y border-0 border-b border-[#e0e0e0] bg-transparent py-2 text-[16px] leading-relaxed outline-none placeholder:text-[#80868b] focus:border-b-2 focus:border-[#673ab7] " +
        (props.className ?? "")
      }
    />
  );
}

/** The purple submit button a Google Form ends with. */
export function FormSubmitButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex min-h-[40px] items-center rounded px-6 text-[14px] font-medium text-white cursor-pointer hover:brightness-95"
      style={{ background: FORMS_PURPLE }}
    >
      {children}
    </button>
  );
}
