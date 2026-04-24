const sizeStyles = {
  sm: {
    mark: "h-10 w-10 text-base md:h-12 md:w-12 md:text-lg",
    title: "text-base md:text-lg",
    subtitle: "text-xs",
  },
  md: {
    mark: "h-12 w-12 text-lg md:h-14 md:w-14 md:text-xl",
    title: "text-lg md:text-xl",
    subtitle: "text-sm",
  },
  lg: {
    mark: "h-14 w-14 text-xl md:h-16 md:w-16 md:text-2xl",
    title: "text-xl md:text-2xl",
    subtitle: "text-sm md:text-base",
  },
};

export default function BrandLogo({ size = "md", subtitle, className = "", textClassName = "" }) {
  const styles = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={`flex items-center gap-3.5 md:gap-4 ${className}`.trim()}>
      <div
        className={`${styles.mark} relative flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-300 ring-1 ring-white/15 shadow-lg shadow-cyan-500/15`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_55%)]" />
        <div className="absolute inset-[2px] rounded-full bg-slate-950/12" />
        <span className="relative font-bold tracking-[-0.08em] text-white drop-shadow-sm">DG</span>
      </div>
      <div className={`min-w-0 ${textClassName}`.trim()}>
        <div className={`${styles.title} font-semibold tracking-tight text-slate-100`}>Deadline Guardian</div>
        {subtitle && <p className={`${styles.subtitle} text-slate-400`}>{subtitle}</p>}
      </div>
    </div>
  );
}
