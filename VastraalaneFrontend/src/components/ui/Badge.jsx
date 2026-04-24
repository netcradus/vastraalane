import { cn } from "../../utils/cn";

export function Badge({ className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-clay/20 bg-clay/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-clay",
        className
      )}
    >
      {children}
    </span>
  );
}
