export function Logo({ width, height }: { width: number; height: number }) {
  return (
    <img
      className="relative"
      src="/logo.png"
      alt="Paperflow Logo"
      width={width}
      height={height}
    />
  );
}
