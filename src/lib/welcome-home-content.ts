import { ACT_INTROS, actIntroFor, type ActIntroActKey } from "@/lib/act-intro-content";
import { CAST } from "@/lib/cast";
import type { SkillTile } from "@/components/welcome-shell";
import { WELCOME_SKILLS } from "@/lib/welcome-content";
import type { Localized } from "@/lib/task-types";

/**
 * What the Browser's Welcome tab shows after Day One — a quiet re-read of
 * "where am I?" for the learner's current act. The full-page ActIntro stays
 * the one-shot arrival; this is the always-there copy. It must not tell the
 * learner what to do next (that is the Job Card's job).
 */

export interface WelcomeHome {
  actLabel: Localized;
  /** Short line in the tab chrome kicker slot. */
  packetKicker: Localized;
  /** Act + role in the tab chrome title slot. */
  packetTitle: Localized;
  role: Localized;
  roleLine: Localized;
  manager: Localized;
  bridge: Localized;
  skillsTitle: Localized;
  skills: SkillTile[];
  reassurance: Localized;
}

const REASSURANCE: Localized = {
  en: "This is practice. You cannot break anything, and mistakes do not cost points.",
  es: "Esto es práctica. No puedes romper nada, y los errores no cuestan puntos.",
};

const ACT1_HOME: WelcomeHome = {
  actLabel: { en: "Act I", es: "Acto I" },
  packetKicker: { en: "Harborside Cafe · Your place", es: "Harborside Cafe · Tu lugar" },
  packetTitle: { en: "Act I · New Hire", es: "Acto I · Personal nuevo" },
  role: { en: "You're a new hire", es: "Eres personal nuevo" },
  roleLine: {
    en: "You're learning the cafe computer. Small tasks, Help when you need it, and you can try again.",
    es: "Estás aprendiendo la computadora del café. Tareas pequeñas, Ayuda cuando la necesites, y puedes intentarlo de nuevo.",
  },
  manager: {
    en: CAST.maria.title
      ? `Your manager is ${CAST.maria.name}, the ${CAST.maria.title.en}.`
      : `Your manager is ${CAST.maria.name}.`,
    es: CAST.maria.title
      ? `Tu jefa es ${CAST.maria.name}, la ${CAST.maria.title.es}.`
      : `Tu jefa es ${CAST.maria.name}.`,
  },
  bridge: {
    en: "The blue card in the corner tells you what to do next. Come back here any time you want to remember where you are.",
    es: "La tarjeta azul de la esquina te dice qué hacer. Vuelve aquí cuando quieras recordar dónde estás.",
  },
  skillsTitle: { en: "You will practice:", es: "Vas a practicar:" },
  skills: WELCOME_SKILLS,
  reassurance: REASSURANCE,
};

const PACKET_TITLES: Record<ActIntroActKey, Localized> = {
  act2: { en: "Act II · Shift Lead", es: "Acto II · Líder de turno" },
  act3: { en: "Act III · Shift Supervisor", es: "Acto III · Supervisor de turno" },
  act4: { en: "Act IV · Assistant Manager", es: "Acto IV · Asistente de gerencia" },
  act5: { en: "Act V · Pick a path", es: "Acto V · Elige un camino" },
  act6: { en: "Act VI · Office Administrator", es: "Acto VI · Administrador de oficina" },
  act7: { en: "Act VII · Team Lead", es: "Acto VII · Team Lead" },
};

const PACKET_KICKER: Localized = {
  en: "Harborside · Your place",
  es: "Harborside · Tu lugar",
};

/** Orientation for the Welcome tab, keyed by the learner's current act. */
export function welcomeHomeFor(actKey: string): WelcomeHome {
  if (actKey === "act1") return ACT1_HOME;

  const intro = actIntroFor(actKey);
  const key = actKey as ActIntroActKey;
  if (!intro || !(key in ACT_INTROS)) return ACT1_HOME;

  return {
    actLabel: intro.actLabel,
    packetKicker: PACKET_KICKER,
    packetTitle: PACKET_TITLES[key],
    role: intro.role,
    roleLine: intro.roleLine,
    manager: intro.manager,
    bridge: intro.bridge,
    skillsTitle: intro.skillsTitle,
    skills: intro.skills,
    reassurance: REASSURANCE,
  };
}
