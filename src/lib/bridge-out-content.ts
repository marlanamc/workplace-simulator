import type { TaskKey } from "@/lib/desktop-content";
import type { BridgeOutCopy } from "@/components/task/BridgeOutCard";

const KICKER: BridgeOutCopy["kicker"] = {
  en: "Do this one for real",
  es: "Haz esta de verdad",
};

const MAIL_STEPS: BridgeOutCopy["steps"] = [
  { en: "Open your own email on your own phone or computer.", es: "Abre tu propio correo en tu teléfono o computadora." },
  { en: "Write to me, your teacher. Any short message.", es: "Escríbeme a mí, tu maestro. Cualquier mensaje corto." },
  { en: "Put a photo or a file in it before you send.", es: "Pon una foto o un archivo antes de enviar." },
];

const GENERIC_STEPS: BridgeOutCopy["steps"] = [
  { en: "Find a real place to do this - your own account, your own device.", es: "Busca un lugar real para hacerlo - tu propia cuenta, tu propio dispositivo." },
  { en: "Do the same job you just did here, for real.", es: "Haz el mismo trabajo que acabas de hacer aquí, mas de verdad." },
  { en: "If it goes wrong, that's the interesting part. Bring it Wednesday.", es: "Si sale mal, esa es la parte interesante. Tráelo el miércoles." },
];

const FOOTER: BridgeOutCopy["footer"] = {
  en: "A skill practiced only here stays here. The same skill done once for real is the one you keep.",
  es: "Una destreza practicada solo aquí se queda aquí. La misma destreza hecha una vez de verdad es la que se te queda.",
};

const DONE_CTA: BridgeOutCopy["doneCta"] = { en: "I did it for real", es: "Lo hice de verdad" };
const PRINT_CTA: BridgeOutCopy["printCta"] = { en: "Print the steps", es: "Imprimir los pasos" };
const NOT_YET_CTA: BridgeOutCopy["notYetCta"] = { en: "Not yet", es: "Todavía no" };

const TITLE_BY_TASK: Partial<Record<TaskKey, BridgeOutCopy["title"]>> = {
  "mail-reply": { en: "You can do this here. Now do it once with your own email.", es: "Puedes hacer esto aquí. Ahora hazlo una vez con tu propio correo." },
  "mail-attach": { en: "You can do this here. Now do it once with your own email.", es: "Puedes hacer esto aquí. Ahora hazlo una vez con tu propio correo." },
};

const DEFAULT_TITLE: BridgeOutCopy["title"] = {
  en: "You can do this here. Now do it once for real.",
  es: "Puedes hacer esto aquí. Ahora hazlo una vez de verdad.",
};

const STEPS_BY_TASK: Partial<Record<TaskKey, BridgeOutCopy["steps"]>> = {
  "mail-reply": MAIL_STEPS,
  "mail-attach": MAIL_STEPS,
};

/** Bridge-out copy for a skill that just reached rung 4 - falls back to a generic 3-step template for any skill without dedicated copy. */
export function bridgeOutCopyFor(taskKey: TaskKey): BridgeOutCopy {
  return {
    kicker: KICKER,
    title: TITLE_BY_TASK[taskKey] ?? DEFAULT_TITLE,
    steps: STEPS_BY_TASK[taskKey] ?? GENERIC_STEPS,
    footer: FOOTER,
    doneCta: DONE_CTA,
    printCta: PRINT_CTA,
    notYetCta: NOT_YET_CTA,
  };
}
