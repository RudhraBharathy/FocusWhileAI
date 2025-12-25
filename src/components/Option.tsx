import { cn } from "@/utils/utils";

type OptionVariant = "onboarding" | "popup";

const STYLES: Record<
  OptionVariant,
  {
    root: string;
    icon: string;
    label: string;
  }
> = {
  onboarding: {
    root: "px-5 py-3 gap-3",
    icon: "size-10",
    label: "text-sm",
  },
  popup: {
    root: "px-3 py-2 gap-3",
    icon: "size-8 p-1.5",
    label: "text-xs text-left",
  },
};

const Option = ({
  label,
  icon,
  active,
  onClick,
  variant = "onboarding",
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
  variant?: OptionVariant;
}) => {
  const styles = STYLES[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex items-center rounded-2xl",
        "border transition-all duration-300 ease-out",
        "cursor-pointer select-none",
        styles.root,
        active
          ? cn(
              "border-brand-accent",
              "bg-brand-accent/10 dark:bg-brand-accent/15",
              "ring-1 ring-brand-accent/40",
              "shadow-[0_0_14px_var(--color-brand-glow)]",
              "scale-[1.03]"
            )
          : cn(
              "border-black/20 dark:border-brand-accent/60",
              "bg-transparent",
              "hover:border-brand-accent",
              "hover:bg-brand-accent/5",
              "hover:shadow-[0_0_10px_var(--color-brand-glow)]",
              "hover:scale-[1.01]"
            )
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full transition-all duration-300",
          styles.icon,
          active
            ? cn("bg-brand-accent", "text-black", "shadow-sm")
            : cn(
                "bg-brand-accent/80 dark:bg-brand-accent/90",
                "text-gray-700",
                "group-hover:bg-brand-accent",
                "group-hover:scale-105"
              )
        )}
      >
        {icon}
      </div>

      <span
        className={cn(
          "font-medium tracking-wide transition-colors duration-300",
          styles.label,
          active
            ? "text-gray-900 dark:text-text-main"
            : "text-gray-600 dark:text-text-muted group-hover:text-gray-900 dark:group-hover:text-text-main"
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
