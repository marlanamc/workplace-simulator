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
