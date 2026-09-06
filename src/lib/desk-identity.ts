import {
  CAFE_NAME,
  COLLEGE_NAME,
  HEALTH_NAME,
  HQ_NAME,
} from "@/lib/cast";
import type { BridgePath } from "@/lib/bridge-path";
import type { Localized } from "@/lib/task-types";

/**
 * Quiet lock-screen plaque under the desktop clock: who the learner is in
 * the story right now. Orientation only — not a task instruction.
 */

export interface DeskIdentity {
  title: Localized;
  company: string;
}

const CAFE_TITLES: Record<"act1" | "act2" | "act3" | "act4", DeskIdentity> = {
  act1: {
    title: { en: "New Hire", es: "Personal nuevo" },
    company: CAFE_NAME,
  },
  act2: {
    title: { en: "Shift Lead", es: "Líder de turno" },
    company: CAFE_NAME,
  },
  act3: {
    title: { en: "Shift Supervisor", es: "Supervisor de turno" },
    company: CAFE_NAME,
  },
  act4: {
    title: { en: "Assistant Manager", es: "Asistente de gerencia" },
    company: CAFE_NAME,
  },
};

const ACT5_PICK: DeskIdentity = {
  title: { en: "Choosing a path", es: "Eligiendo un camino" },
  company: CAFE_NAME,
};

const ACT5_COLLEGE: DeskIdentity = {
  title: { en: "College pathway", es: "Camino universitario" },
  company: COLLEGE_NAME,
};

const ACT5_HEALTH: DeskIdentity = {
  title: { en: "Front Desk", es: "Recepción" },
  company: HEALTH_NAME,
};

const ACT6: DeskIdentity = {
  title: { en: "Office Administrator", es: "Administrador de oficina" },
  company: HQ_NAME,
};

const ACT7: DeskIdentity = {
  title: { en: "Team Lead", es: "Team Lead" },
  company: HQ_NAME,
};

/** Job title and workplace for the desktop clock plaque. */
export function deskIdentityFor(actKey: string, path?: BridgePath | null): DeskIdentity {
  if (actKey === "act1" || actKey === "act2" || actKey === "act3" || actKey === "act4") {
    return CAFE_TITLES[actKey];
  }
  if (actKey === "act5") {
    if (path === "a") return ACT5_COLLEGE;
    if (path === "b") return ACT5_HEALTH;
    return ACT5_PICK;
  }
  if (actKey === "act6") return ACT6;
  if (actKey === "act7") return ACT7;
  return CAFE_TITLES.act1;
}
