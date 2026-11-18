export function GlobeDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      className={`pointer-events-none text-doodle/45 ${className}`}
    >
      <circle cx="32" cy="28" r="16" />
      <ellipse cx="32" cy="28" rx="7" ry="16" />
      <line x1="16" y1="28" x2="48" y2="28" />
      <path d="M18 12 A21 21 0 0 1 46 44" />
      <line x1="32" y1="49" x2="32" y2="56" />
      <line x1="22" y1="56" x2="42" y2="56" />
    </svg>
  );
}

export function SpiralPaperDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      className={`pointer-events-none text-doodle/45 ${className}`}
    >
      <rect x="14" y="10" width="36" height="44" rx="3" />
      <path d="M10 16 h8 M10 24 h8 M10 32 h8 M10 40 h8 M10 48 h8" />
      <line x1="23" y1="22" x2="42" y2="22" />
      <line x1="23" y1="30" x2="42" y2="30" />
      <line x1="23" y1="38" x2="36" y2="38" />
    </svg>
  );
}

export function ScissorsDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      className={`pointer-events-none text-doodle/45 ${className}`}
    >
      <circle cx="18" cy="44" r="6" />
      <circle cx="36" cy="48" r="6" />
      <line x1="22" y1="39" x2="44" y2="12" />
      <line x1="32" y1="43" x2="18" y2="14" />
    </svg>
  );
}

export function BrushDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      className={`pointer-events-none text-doodle/45 ${className}`}
    >
      <path d="M28 10 L36 10 L34 38 L30 38 Z" />
      <rect x="29" y="38" width="6" height="6" />
      <path d="M29 44 C26 50 30 56 32 56 C34 56 38 50 35 44 Z" />
    </svg>
  );
}

export function TestTubeDoodle({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden="true"
      className={`pointer-events-none text-white/30 ${className}`}
    >
      <path d="M24 12 h16 M28 12 v14 L18 46 a4 4 0 0 0 3.5 6 h21 a4 4 0 0 0 3.5-6 L36 26 V12" />
      <line x1="22" y1="40" x2="42" y2="40" />
    </svg>
  );
}
