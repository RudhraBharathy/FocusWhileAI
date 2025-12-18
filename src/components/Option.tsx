import { cn } from "../lib/utils";

const Option = ({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 px-5 py-3 rounded-2xl",
        "border transition-all duration-300 ease-out",
        "cursor-pointer select-none",
        active
          ? [
              "border-brand-accent",
              "bg-linear-to-br from-brand-accent/15 to-brand-accent/5",
              "ring-1 ring-brand-accent/40",
              "shadow-[0_0_14px_var(--color-brand-glow)]",
              "scale-[1.03]",
            ].join(" ")
          : [
              "border-brand-accent/60",
              "bg-transparent",
              "hover:border-brand-accent",
              "hover:bg-brand-accent/5",
              "hover:shadow-[0_0_10px_var(--color-brand-glow)]",
              "hover:scale-[1.01]",
            ].join(" ")
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center size-10 rounded-full",
          "transition-all duration-300",
          active
            ? "bg-brand-accent text-black shadow-sm"
            : "bg-brand-accent/90 text-black group-hover:bg-brand-accent group-hover:scale-105"
        )}
      >
        {icon}
      </div>

      <span
        className={cn(
          "text-sm font-medium tracking-wide transition-colors duration-300",
          active
            ? "text-text-main"
            : "text-text-muted group-hover:text-text-main"
        )}
      >
        {label}
      </span>

      {active && (
        <span className="pointer-events-none absolute inset-0 rounded-2xl bg-brand-accent/5" />
      )}
    </button>
  );
};

export default Option;
