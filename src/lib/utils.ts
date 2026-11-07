export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDateLabel(value?: string | number | Date): string {
  const date = value ? new Date(value) : new Date();
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function hexToRgbString(hex: string): string {
  const clean = hex.replace("#", "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  const int = Number.parseInt(full, 16);
  if (Number.isNaN(int)) return "102, 140, 255";
  return `${(int >> 16) & 255}, ${(int >> 8) & 255}, ${int & 255}`;
}
