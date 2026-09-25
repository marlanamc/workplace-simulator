/**
 * Sign-in can be paused per deployment (set LOGINS_PAUSED=true in the Vercel
 * production environment) while the simulator is not ready for staff. The
 * login action enforces it; the page only mirrors it. Existing sessions keep working.
 */
export const loginsPaused = () => process.env.LOGINS_PAUSED === "true";
