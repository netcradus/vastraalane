import { cn } from "../../utils/cn";

export function Button({ className, variant = "primary", ...props }) {
  return (
    <button
      className={cn(
        "button-3d inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300",
        variant === "primary" &&
          "bg-ink text-white shadow-card hover:-translate-y-0.5 hover:bg-clay",
        variant === "secondary" &&
          "border border-ink/15 bg-white/70 text-ink hover:bg-white",
        variant === "ghost" && "text-ink hover:bg-ink/5",
        className
      )}
      {...props}
    />
  );
}
