import type { MailSignature as Signature } from "@/lib/mail-greeting";
import type { Lang } from "@/lib/task-types";

/**
 * The block a real work email ends with. Set apart by a hairline rule the way
 * a mail client renders one, and deliberately quieter than the message body —
 * a learner should be able to tell at a glance that this part is boilerplate
 * the sender types once, not something new they have to read every time.
 *
 * Rendered as text, not an image: the read-aloud mode has to be able to speak
 * it, and a learner looking for Maria's phone number has to be able to select
 * it. See signatureLines() for the spoken form.
 */
export default function MailSignature({ sig, lang }: { sig: Signature; lang: Lang }) {
  return (
    <div className="mt-5 max-w-[62ch] border-t border-[#e8eaed] pt-3 text-[13px] leading-[1.5] text-[#5f6368]">
      <div className="font-medium text-[#3c4043]">{sig.name}</div>
      <div>
        {sig.title[lang]}, {sig.org}
      </div>
      <div>{sig.email}</div>
      {sig.phone && <div>{sig.phone}</div>}
    </div>
  );
}
