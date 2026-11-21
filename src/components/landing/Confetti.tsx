interface ConfettiProps {
  variant: "white" | "red";
  preset: "welcome" | "stats" | "news" | "announcements";
}

interface ConfettiShape {
  id: string;
  kind: "circle-outline" | "dot" | "triangle" | "square" | "plus" | "squiggle";
  pos: string;
  size: string;
  colorClass: string;
  visibility?: string;
  floatDuration?: string;
}

const PRESETS: Record<ConfettiProps["preset"], ConfettiShape[]> = {
  welcome: [
    {
      id: "w1",
      kind: "dot",
      pos: "left-[4%] top-[12%]",
      size: "h-2.5 w-2.5 sm:h-3 sm:w-3",
      colorClass: "text-brand",
      floatDuration: "5s",
    },
    {
      id: "w2",
      kind: "triangle",
      pos: "left-[16%] top-[6%]",
      size: "h-3.5 w-3.5 sm:h-4 sm:w-4",
      colorClass: "text-teal",
      visibility: "hidden sm:block",
    },
    {
      id: "w3",
      kind: "squiggle",
      pos: "left-[10%] bottom-[16%]",
      size: "h-5 w-5 sm:h-6 sm:w-6",
      colorClass: "text-brand/75",
    },
    {
      id: "w4",
      kind: "square",
      pos: "left-[3%] bottom-[8%]",
      size: "h-3 w-3 sm:h-3.5 sm:w-3.5",
      colorClass: "text-brand",
      visibility: "hidden md:block",
    },
    {
      id: "w5",
      kind: "triangle",
      pos: "left-[23%] bottom-[12%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-ink/60",
      visibility: "hidden lg:block",
    },
    {
      id: "w6",
      kind: "circle-outline",
      pos: "right-[5%] top-[10%]",
      size: "h-4 w-4 sm:h-5 sm:w-5",
      colorClass: "text-ink/50",
      floatDuration: "6.5s",
    },
    {
      id: "w7",
      kind: "plus",
      pos: "right-[14%] top-[18%]",
      size: "h-3.5 w-3.5 sm:h-4 sm:w-4",
      colorClass: "text-brand/80",
    },
    {
      id: "w8",
      kind: "squiggle",
      pos: "right-[6%] bottom-[26%]",
      size: "h-5 w-5 sm:h-6 sm:w-6",
      colorClass: "text-gold",
      visibility: "hidden sm:block",
      floatDuration: "5.8s",
    },
    {
      id: "w9",
      kind: "circle-outline",
      pos: "right-[20%] bottom-[8%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-brand/60",
      visibility: "hidden md:block",
    },
    {
      id: "w10",
      kind: "dot",
      pos: "right-[10%] bottom-[6%]",
      size: "h-2.5 w-2.5",
      colorClass: "text-teal",
      visibility: "hidden lg:block",
    },
  ],
  stats: [
    {
      id: "s1",
      kind: "circle-outline",
      pos: "left-[5%] top-[16%]",
      size: "h-4 w-4 sm:h-5 sm:w-5",
      colorClass: "text-white/55",
      floatDuration: "6s",
    },
    {
      id: "s2",
      kind: "plus",
      pos: "left-[18%] top-[12%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-white/65",
      visibility: "hidden sm:block",
    },
    {
      id: "s3",
      kind: "squiggle",
      pos: "left-[10%] top-[48%]",
      size: "h-5 w-5 sm:h-6 sm:w-6",
      colorClass: "text-white/60",
    },
    {
      id: "s4",
      kind: "dot",
      pos: "left-[7%] bottom-[16%]",
      size: "h-2.5 w-2.5",
      colorClass: "text-white/70",
      visibility: "hidden md:block",
    },
    {
      id: "s5",
      kind: "square",
      pos: "left-[24%] bottom-[12%]",
      size: "h-3 w-3",
      colorClass: "text-white/45",
      visibility: "hidden lg:block",
    },
    {
      id: "s6",
      kind: "plus",
      pos: "right-[16%] top-[14%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-white/70",
      floatDuration: "5.2s",
    },
    {
      id: "s7",
      kind: "squiggle",
      pos: "right-[6%] top-[30%]",
      size: "h-5 w-5 sm:h-6 sm:w-6",
      colorClass: "text-white/55",
    },
    {
      id: "s8",
      kind: "circle-outline",
      pos: "right-[12%] bottom-[22%]",
      size: "h-4 w-4",
      colorClass: "text-white/60",
      visibility: "hidden sm:block",
    },
    {
      id: "s9",
      kind: "triangle",
      pos: "right-[4%] bottom-[12%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-white/50",
      visibility: "hidden md:block",
    },
    {
      id: "s10",
      kind: "dot",
      pos: "right-[26%] top-[24%]",
      size: "h-2.5 w-2.5",
      colorClass: "text-white/65",
      visibility: "hidden lg:block",
    },
  ],
  news: [
    {
      id: "n1",
      kind: "square",
      pos: "left-[4%] top-[8%]",
      size: "h-3 w-3 sm:h-3.5 sm:w-3.5",
      colorClass: "text-brand",
    },
    {
      id: "n2",
      kind: "circle-outline",
      pos: "right-[14%] top-[6%]",
      size: "h-4 w-4 sm:h-5 sm:w-5",
      colorClass: "text-brand/70",
      floatDuration: "5.5s",
    },
    {
      id: "n3",
      kind: "triangle",
      pos: "left-[12%] top-[16%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-teal",
      visibility: "hidden sm:block",
    },
    {
      id: "n4",
      kind: "plus",
      pos: "right-[5%] top-[14%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-brand/75",
      visibility: "hidden sm:block",
    },
    {
      id: "n5",
      kind: "squiggle",
      pos: "left-[3%] bottom-[12%]",
      size: "h-5 w-5",
      colorClass: "text-gold",
      visibility: "hidden md:block",
      floatDuration: "6.2s",
    },
    {
      id: "n6",
      kind: "triangle",
      pos: "right-[6%] bottom-[10%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-teal",
    },
    {
      id: "n7",
      kind: "dot",
      pos: "right-[18%] bottom-[8%]",
      size: "h-2.5 w-2.5",
      colorClass: "text-navy/60",
      visibility: "hidden lg:block",
    },
    {
      id: "n8",
      kind: "circle-outline",
      pos: "left-[16%] bottom-[6%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-ink/40",
      visibility: "hidden lg:block",
    },
  ],
  announcements: [
    {
      id: "a1",
      kind: "circle-outline",
      pos: "left-[5%] top-[10%]",
      size: "h-4 w-4",
      colorClass: "text-brand/60",
      floatDuration: "5.8s",
    },
    {
      id: "a2",
      kind: "triangle",
      pos: "right-[7%] top-[12%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-teal",
    },
    {
      id: "a3",
      kind: "plus",
      pos: "left-[8%] bottom-[14%]",
      size: "h-3.5 w-3.5",
      colorClass: "text-brand/70",
      visibility: "hidden sm:block",
    },
    {
      id: "a4",
      kind: "squiggle",
      pos: "right-[5%] bottom-[16%]",
      size: "h-5 w-5",
      colorClass: "text-gold",
      visibility: "hidden sm:block",
      floatDuration: "6.4s",
    },
    {
      id: "a5",
      kind: "dot",
      pos: "left-[14%] top-[44%]",
      size: "h-2.5 w-2.5",
      colorClass: "text-teal",
      visibility: "hidden lg:block",
    },
    {
      id: "a6",
      kind: "square",
      pos: "right-[12%] top-[48%]",
      size: "h-3 w-3",
      colorClass: "text-brand/70",
      visibility: "hidden lg:block",
    },
  ],
};

function renderShape(kind: ConfettiShape["kind"]) {
  switch (kind) {
    case "circle-outline":
      return (
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2.2" />
        </svg>
      );
    case "dot":
      return (
        <svg viewBox="0 0 16 16" fill="none" className="h-full w-full">
          <circle cx="8" cy="8" r="6" fill="currentColor" />
        </svg>
      );
    case "triangle":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <polygon points="10,2 18,17 2,17" fill="currentColor" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <rect x="3" y="3" width="14" height="14" rx="2" fill="currentColor" />
        </svg>
      );
    case "plus":
      return (
        <svg viewBox="0 0 20 20" fill="none" className="h-full w-full">
          <path
            d="M10 3V17M3 10H17"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      );
    case "squiggle":
      return (
        <svg viewBox="0 0 28 16" fill="none" className="h-full w-full">
          <path
            d="M2 10C5 4 9 4 12 10C15 16 19 16 22 10C24 6 25 5 26 5"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

export function Confetti({ variant, preset }: ConfettiProps) {
  const shapes = PRESETS[preset];

  return (
    <div
      aria-hidden="true"
      data-confetti-variant={variant}
      className="pointer-events-none absolute inset-0 overflow-hidden select-none"
    >
      {shapes.map((shape) => (
        <span
          key={shape.id}
          style={
            shape.floatDuration
              ? { animationDuration: shape.floatDuration }
              : undefined
          }
          className={`absolute ${shape.pos} ${shape.size} ${shape.colorClass} ${
            shape.visibility ?? ""
          } ${shape.floatDuration ? "motion-float" : ""}`}
        >
          {renderShape(shape.kind)}
        </span>
      ))}
    </div>
  );
}
