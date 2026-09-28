import type { DesktopScene } from "@/lib/tracks-content";

/**
 * One Unsplash room per act. Act V has one per path.
 *
 *  harborside-open   — Jonas Jacobsson      https://unsplash.com/photos/RFHFV7lVQBY
 *  harborside-shift  — Rendy Novantino      https://unsplash.com/photos/X0gqzFEjvkU
 *  harborside-floor  — Adrien Olichon       https://unsplash.com/photos/s640Zvexccc
 *  college-library   — Priscilla Du Preez   https://unsplash.com/photos/ggeZ9oyI-PE
 *  clinic-front-desk — Raj Rana             https://unsplash.com/photos/zCQsBI7ZltQ
 *  hq-office         — Annie Spratt         https://unsplash.com/photos/FSFfEQkd1sc
 *  hq-team-room      — S O C I A L . C U T  https://unsplash.com/photos/1RT4txDDAbM
 */
const WALLPAPER: Record<DesktopScene, string> = {
  "harborside-open": "/wallpapers/latte.jpg",
  "harborside-shift": "/wallpapers/espresso.jpg",
  "harborside-floor": "/wallpapers/dining.jpg",
  "college-library": "/wallpapers/college.jpg",
  "clinic-front-desk": "/wallpapers/front-desk.jpg",
  "hq-office": "/wallpapers/office.jpg",
  "hq-team-room": "/wallpapers/team-lead.jpg",
};

export default function DesktopWallpaper({ scene }: { scene: DesktopScene }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed wallpaper */}
      <img
        src={WALLPAPER[scene]}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(28,16,10,0.45) 0%, rgba(28,16,10,0.18) 28%, transparent 52%)",
        }}
      />
    </div>
  );
}
