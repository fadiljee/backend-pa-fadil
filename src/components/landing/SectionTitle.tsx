interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  showTriangleIcon?: boolean;
  className?: string;
}

export function SectionTitle({
  title,
  subtitle,
  tone = "dark",
  as = "h2",
  showTriangleIcon = false,
  className = "",
}: SectionTitleProps) {
  const HeadingTag = as;
  const headingColor = tone === "light" ? "text-white font-semibold" : "text-ink font-bold";
  const subtitleColor = tone === "light" ? "text-white/90" : "text-muted";

  return (
    <div className={`text-center ${className}`}>
      <HeadingTag
        className={`inline-flex items-center justify-center gap-3 text-[26px] leading-[1.2] md:text-[32px] lg:text-[40px] lg:leading-[1.15] tracking-tight ${headingColor}`}
      >
        {showTriangleIcon && (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-ink sm:h-5 sm:w-5"
            fill="none"
          >
            <polygon
              points="10,2 18,17 2,17"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
        <span>{title}</span>
      </HeadingTag>

      {subtitle && (
        <p
          className={`mt-2 text-sm leading-relaxed md:text-[15px] lg:text-base ${subtitleColor}`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
