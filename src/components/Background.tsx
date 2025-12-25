import { cn } from "@/utils/utils";

const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex w-full items-center justify-center bg-slate-50 dark:bg-black min-h-screen">
      <div
        className={cn(
          "absolute inset-0",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-white mask-[radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
      {children}
    </div>
  );
};

export default Background;
