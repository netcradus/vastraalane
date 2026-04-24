export function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-shimmer rounded-3xl bg-[linear-gradient(110deg,#ebe4d8,45%,#f8f3ea,55%,#ebe4d8)] bg-[length:200%_100%] ${className}`}
    />
  );
}
