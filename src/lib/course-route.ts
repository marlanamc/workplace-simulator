import type { Localized } from './task-types';

export const COURSE_ROUTES = ['lead', 'healthcare', 'office', 'college', 'pause'] as const;
export type CourseRoute = typeof COURSE_ROUTES[number];
export const COURSE_ROUTE_PREFIX = 'course-route:';
export const COURSE_ROUTE_LABELS: Record<CourseRoute, Localized> = {
  lead: { en: 'Stay and lead', es: 'Quedarme y liderar' },
  healthcare: { en: 'Healthcare / front desk', es: 'Salud / recepción' },
  office: { en: 'Office / admin', es: 'Oficina / administración' },
  college: { en: 'College preparation (optional)', es: 'Preparación universitaria (opcional)' },
  pause: { en: 'Stop here for now', es: 'Terminar aquí por ahora' },
};
/** Story sittings, not class sessions: learners can stop and return at any point. */
export const COURSE_ROUTE_DESCRIPTIONS: Record<CourseRoute, Localized> = {
  lead: {
    en: '7 story days. You stay at the cafe with Renata. Plan shifts, meetings, and a budget.',
    es: '7 días de la historia. Sigues en el café con Renata. Organizas turnos, reuniones y un presupuesto.',
  },
  healthcare: {
    en: '4 story days. You leave the cafe to try a clinic front desk with Thuy. Book visits, check forms, and keep patient information private.',
    es: '4 días de la historia. Dejas el café para probar la recepción de una clínica con Thuy. Agendas citas, revisas formularios y proteges la información de los pacientes.',
  },
  office: {
    en: '13 story days. You apply for an office job at Harborside HQ and leave the cafe. Then you work with Anita on files, calls, and reports.',
    es: '13 días de la historia. Solicitas un empleo en la oficina central de Harborside y dejas el café. Luego trabajas con Anita en archivos, llamadas y reportes.',
  },
  college: {
    en: '4 story days, from fall to spring. Harborside will pay for one class. Marcus, a college advisor, helps you apply, read an aid letter, and plan your coursework.',
    es: '4 días de la historia, del otoño a la primavera. Harborside pagará una clase. Marcus, un asesor universitario, te ayuda con la solicitud, la carta de ayuda y las tareas del curso.',
  },
  pause: {
    en: 'Keep a summary of your skills. Your finished work stays saved. You can choose a direction later.',
    es: 'Guarda un resumen de tus habilidades. Tu trabajo terminado queda guardado. Puedes elegir un camino después.',
  },
};
/**
 * The short line under each chooser button: story days, place, manager.
 * Short on purpose, so all five choices fit on a Chromebook at 150% zoom.
 * The full sentence (COURSE_ROUTE_DESCRIPTIONS) shows on the confirm step.
 */
export const COURSE_ROUTE_TAGS: Record<CourseRoute, Localized> = {
  lead: { en: '7 days · At the cafe · Renata', es: '7 días · En el café · Renata' },
  healthcare: { en: '4 days · A clinic · Thuy', es: '4 días · Una clínica · Thuy' },
  office: { en: '13 days · HQ office · Anita', es: '13 días · Oficina HQ · Anita' },
  college: { en: '4 days · One class · Marcus', es: '4 días · Una clase · Marcus' },
  pause: { en: 'Keep your skills summary', es: 'Guarda tu resumen de habilidades' },
};

/**
 * Which line the chooser opens with. `first`: no direction yet. `change`: in
 * the middle of a direction. `another`: the direction ended (or the learner
 * stopped), so the choice is what to explore next.
 */
export type RouteChooserMode = 'first' | 'change' | 'another';
export function routeChooserMode(route: CourseRoute | null, routeFinished: boolean): RouteChooserMode {
  if (route === null) return 'first';
  return route !== 'pause' && !routeFinished ? 'change' : 'another';
}
export const ROUTE_CHOOSER_LINES: Record<RouteChooserMode, Localized> = {
  first: {
    en: 'You finished the cafe basics. Choose a direction, or stop here and keep your skills summary.',
    es: 'Terminaste la práctica básica del café. Elige un camino o termina aquí y guarda tu resumen de habilidades.',
  },
  change: {
    en: 'Change your direction? Your finished work stays saved.',
    es: '¿Quieres cambiar de camino? Tu trabajo terminado queda guardado.',
  },
  another: {
    en: 'Your finished work stays saved. Choose a direction to explore, or stop here and keep your skills summary.',
    es: 'Tu trabajo terminado queda guardado. Elige un camino para explorar o termina aquí y guarda tu resumen de habilidades.',
  },
};

/**
 * Where "Change direction" lives once a direction is chosen. After a
 * direction ends (or at Stop here) it is a quiet link on the ending card.
 * In the middle of a direction it waits inside Help, so it is never one tap
 * away above the day's main button.
 */
export type ChangeDirectionPlacement = 'none' | 'link' | 'help';
export function changeDirectionPlacement(route: CourseRoute | null, routeFinished: boolean): ChangeDirectionPlacement {
  if (route === null) return 'none';
  return route === 'pause' || routeFinished ? 'link' : 'help';
}

/** Whether a chooser button can be picked: finished and in-progress directions cannot. */
export function routeChoiceState(
  route: CourseRoute,
  current: CourseRoute | null,
  finished: boolean,
): 'open' | 'finished' | 'current' {
  if (route !== 'pause' && finished) return 'finished';
  if (route !== 'pause' && route === current) return 'current';
  return 'open';
}

/** Help copy for changing direction in the middle of one (see changeDirectionPlacement). */
export const ROUTE_HELP_COPY = {
  open: { en: 'Help and options', es: 'Ayuda y opciones' },
  close: { en: 'Close help', es: 'Cerrar ayuda' },
  kicker: { en: 'Help', es: 'Ayuda' },
  current: (route: CourseRoute): Localized => ({
    en: `Your direction now: ${COURSE_ROUTE_LABELS[route].en}.`,
    es: `Tu camino ahora: ${COURSE_ROUTE_LABELS[route].es}.`,
  }),
  line: {
    en: 'You can try a different direction. Your finished work stays saved.',
    es: 'Puedes probar otro camino. Tu trabajo terminado queda guardado.',
  },
  change: { en: 'Change direction', es: 'Cambiar de camino' },
  back: { en: 'Back to my job', es: 'Volver a mi trabajo' },
  keep: { en: 'Keep my direction', es: 'Seguir en mi camino' },
  notNow: { en: 'Not now', es: 'Ahora no' },
  confirm: { en: 'Choose this direction', es: 'Elegir este camino' },
  confirmPause: { en: 'Stop here for now', es: 'Terminar aquí por ahora' },
  backToChoices: { en: 'Back to choices', es: 'Volver a las opciones' },
  storyDays: {
    en: 'These are days in the story. Take as much time as you need.',
    es: 'Son días de la historia. Tómate el tiempo que necesites.',
  },
  finished: { en: '✓ Finished', es: '✓ Terminado' },
  inProgress: { en: 'Your direction now', es: 'Tu camino ahora' },
} as const;
export function isCourseRoute(value: unknown): value is CourseRoute {
  return COURSE_ROUTES.some((r) => r === value);
}
export function courseRouteFromBadges(keys: readonly string[]): CourseRoute | null {
  const value = keys.find((k) => k.startsWith(COURSE_ROUTE_PREFIX))?.slice(COURSE_ROUTE_PREFIX.length);
  return isCourseRoute(value) ? value : null;
}
export function routeForLevel(key: string, path?: 'a' | 'b' | null): CourseRoute | null {
  if (/^level19h/.test(key) || /^level2[0-7]$/.test(key)) return 'office';
  if (/^level1[6-9]$/.test(key)) return path === 'b' ? 'healthcare' : 'college';
  if (/^level(9|1[0-5])$/.test(key)) return 'lead';
  return null;
}
export function routeIncludesLevel(route: CourseRoute | null, key: string): boolean {
  const owner = routeForLevel(key);
  return owner === null || owner === route || (owner === 'college' && route === 'healthcare');
}
export function routeBridgePath(route: CourseRoute | null): 'a' | 'b' | null {
  return route === 'college' ? 'a' : route === 'healthcare' ? 'b' : null;
}
