import type { DesktopScene } from "@/lib/tracks-content";

type Palette = {
  wall: string;
  wallShadow: string;
  floor: string;
  skyTop: string;
  skyBot: string;
  water: string;
  waterDeep: string;
  town: string;
  sash: string;
  wood: string;
  woodTop: string;
  woodEdge: string;
  machine: string;
  machineSide: string;
  machineDark: string;
  lamp: string;
  spill: string;
};

const PALETTES: Record<DesktopScene, Palette> = {
  "harborside-open": {
    wall: "#d2c4b0",
    wallShadow: "#3a281c",
    floor: "#6a5040",
    skyTop: "#9eb4c4",
    skyBot: "#e7dfd2",
    water: "#6a8694",
    waterDeep: "#4a6878",
    town: "#7e847c",
    sash: "#2a1c14",
    wood: "#4a301e",
    woodTop: "#6e4a32",
    woodEdge: "#8a6244",
    machine: "#c5c8cc",
    machineSide: "#9aa0a6",
    machineDark: "#2a2c30",
    lamp: "transparent",
    spill: "rgba(255,244,220,0.28)",
  },
  "harborside-shift": {
    wall: "#2c1e18",
    wallShadow: "#120c0a",
    floor: "#1c1410",
    skyTop: "#1e1634",
    skyBot: "#c47848",
    water: "#16101e",
    waterDeep: "#0a0810",
    town: "#1a1214",
    sash: "#120c0a",
    wood: "#241410",
    woodTop: "#3c261a",
    woodEdge: "#5a3c28",
    machine: "#b4b7bc",
    machineSide: "#8a8e94",
    machineDark: "#1a1c1e",
    lamp: "rgba(232,176,80,0.55)",
    spill: "rgba(232,160,80,0.2)",
  },
};

/** You're on shift: the bar is under your hands, the harbor is past the guests. */
export default function DesktopWallpaper({ scene }: { scene: DesktopScene }) {
  const p = PALETTES[scene];
  const night = scene === "harborside-shift";

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.skyTop} />
            <stop offset="1" stopColor={p.skyBot} />
          </linearGradient>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.water} />
            <stop offset="1" stopColor={p.waterDeep} />
          </linearGradient>
          <linearGradient id="barTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.woodEdge} />
            <stop offset="0.12" stopColor={p.woodTop} />
            <stop offset="1" stopColor={p.wood} />
          </linearGradient>
          <linearGradient id="machineFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.machine} />
            <stop offset="1" stopColor={p.machineSide} />
          </linearGradient>
          <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={p.lamp} />
            <stop offset="1" stopColor="transparent" />
          </radialGradient>
        </defs>

        <rect width="1600" height="900" fill={p.wall} />
        <rect width="480" height="900" fill={p.wallShadow} />

        {/* guest floor between our bar and the window wall */}
        <rect y="430" width="1600" height="140" fill={p.floor} />

        <g transform="translate(620, 48)">
          <rect width="920" height="390" fill={p.sash} />
          <g transform="translate(22, 22)">
            <rect width="876" height="346" fill="url(#sky)" />
            <rect y="198" width="876" height="148" fill="url(#water)" />
            <path
              d="M0 210 L60 196 L100 204 L170 188 L230 200 L310 180 L380 196 L470 176 L550 194 L630 174 L720 192 L800 178 L876 196 L876 214 L0 214 Z"
              fill={p.town}
            />
            <rect x="64" y="178" width="16" height="32" fill={p.town} />
            <rect x="188" y="168" width="20" height="42" fill={p.town} />
            <rect x="408" y="164" width="14" height="46" fill={p.town} />
            <rect x="638" y="168" width="18" height="42" fill={p.town} />
            <ellipse cx="280" cy="232" rx="30" ry="6" fill={p.waterDeep} opacity="0.75" />
            <rect x="268" y="218" width="3" height="16" fill={p.sash} />
            <ellipse cx="680" cy="246" rx="24" ry="5" fill={p.waterDeep} opacity="0.75" />
            {night && (
              <>
                <circle cx="196" cy="182" r="2.5" fill="#f4d078" />
                <circle cx="414" cy="176" r="2.5" fill="#f4c060" />
                <circle cx="646" cy="180" r="2.5" fill="#f4d078" />
              </>
            )}
            <rect x="286" y="0" width="8" height="346" fill={p.sash} />
            <rect x="582" y="0" width="8" height="346" fill={p.sash} />
            <rect y="170" width="876" height="8" fill={p.sash} />
          </g>
        </g>

        {/* two stools on the guest side, by the window — not our station */}
        <g fill={p.wood} opacity="0.85">
          <ellipse cx="860" cy="548" rx="22" ry="8" />
          <rect x="850" y="500" width="8" height="50" />
          <ellipse cx="860" cy="498" rx="20" ry="7" />
          <ellipse cx="1120" cy="542" rx="22" ry="8" />
          <rect x="1110" y="494" width="8" height="50" />
          <ellipse cx="1120" cy="492" rx="20" ry="7" />
        </g>

        {night && (
          <>
            <circle cx="820" cy="28" r="80" fill="url(#lampGlow)" />
            <circle cx="1140" cy="20" r="96" fill="url(#lampGlow)" />
            <rect x="818" y="0" width="4" height="36" fill={p.sash} />
            <rect x="1138" y="0" width="4" height="28" fill={p.sash} />
            <path d="M804 36 L836 36 L828 48 L812 48 Z" fill={p.sash} />
            <path d="M1124 28 L1156 28 L1148 40 L1132 40 Z" fill={p.sash} />
          </>
        )}

        {/* our bar, close to camera, looking slightly down */}
        <ellipse cx="1100" cy="620" rx="380" ry="70" fill={p.spill} />
        <path d="M-40 560 L1640 520 L1680 900 L-80 900 Z" fill="url(#barTop)" />
        <path d="M-40 560 L1640 520 L1640 548 L-40 588 Z" fill={p.woodEdge} opacity="0.65" />

        <EspressoMachine x={300} y={368} p={p} />

        {/* tools on our side of the drip tray */}
        <rect x="690" y="642" width="64" height="22" rx="3" fill={p.machineDark} />
        <ellipse cx="820" cy="652" rx="15" ry="10" fill={p.machine} />
        <rect x="808" y="622" width="24" height="32" rx="2" fill={p.machine} />
        <Cup cx={910} cy={636} />
        <Cup cx={948} cy={638} />
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(12,8,6,0.46) 0%, rgba(12,8,6,0.14) 26%, transparent 46%)",
        }}
      />
    </div>
  );
}

function Cup({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="16" ry="7" fill="#efe6d8" />
      <path d={`M${cx - 16} ${cy} L${cx - 14} ${cy + 34} L${cx + 14} ${cy + 34} L${cx + 16} ${cy} Z`} fill="#efe6d8" />
      <ellipse cx={cx} cy={cy + 34} rx="14" ry="5" fill="#e0d4c4" />
    </g>
  );
}

function EspressoMachine({ x, y, p }: { x: number; y: number; p: Palette }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* 3/4 view: face toward the worker, back toward the harbor */}
      <path d="M48 24 L290 4 L326 44 L84 64 Z" fill={p.machine} />
      <path d="M290 4 L326 44 L326 198 L290 158 Z" fill={p.machineSide} />
      <path d="M84 64 L290 4 L290 158 L84 218 Z" fill="url(#machineFace)" />

      <ellipse cx="140" cy="28" rx="13" ry="5" fill="#efe6d8" />
      <ellipse cx="200" cy="22" rx="13" ry="5" fill="#efe6d8" />

      <circle cx="148" cy="86" r="4" fill={p.machineDark} />
      <circle cx="166" cy="82" r="4" fill={p.machineDark} />
      <circle cx="228" cy="72" r="4" fill={p.machineDark} />
      <circle cx="246" cy="68" r="4" fill={p.machineDark} />

      <Portafilter cx={150} cy={118} p={p} />
      <Portafilter cx={236} cy={102} p={p} />

      <path
        d="M318 78 C350 86, 358 128, 348 176"
        fill="none"
        stroke={p.machineDark}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="348" cy="180" r="5" fill={p.machineDark} />

      <path d="M70 200 L300 150 L308 176 L78 226 Z" fill={p.machineDark} />
    </g>
  );
}

function Portafilter({ cx, cy, p }: { cx: number; cy: number; p: Palette }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx="22" ry="11" fill={p.machine} stroke={p.machineDark} strokeWidth="5" />
      <ellipse cx={cx} cy={cy} rx="9" ry="4" fill="#141618" />
      <path
        d={`M${cx - 4} ${cy + 8} L${cx - 7} ${cy + 36} L${cx + 7} ${cy + 36} L${cx + 4} ${cy + 8} Z`}
        fill={p.machineSide}
      />
      <rect x={cx - 6} y={cy + 34} width="12" height="28" rx="6" fill="#3a2418" />
      <ellipse cx={cx} cy={cy + 64} rx="9" ry="6" fill="#2a1810" />
    </g>
  );
}
