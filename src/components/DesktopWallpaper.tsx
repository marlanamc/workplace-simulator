import type { DesktopScene } from "@/lib/tracks-content";

/** Unsplash stand-in until each act has its own room.
 *  Photo: Jonas Jacobsson - https://unsplash.com/photos/RFHFV7lVQBY */
export default function DesktopWallpaper({ scene: _scene }: { scene: DesktopScene }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element -- full-bleed wallpaper */}
      <img
        src="/wallpapers/latte.jpg"
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
