/**
 * Reference-counted body scroll lock.
 *
 * The mobile menu and the command palette can both want to lock scrolling at
 * the same moment (opening the palette from the menu closes one while the other
 * is opening). A naive `body.style.overflow = ""` in either component's cleanup
 * used to unlock the page while a dialog was still on screen. Counting owners
 * makes the two independent.
 */

let owners = 0;
let previousOverflow = "";
let previousPaddingRight = "";

export function lockScroll(): void {
  if (typeof document === "undefined") return;
  owners += 1;
  if (owners > 1) return;

  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  previousOverflow = document.body.style.overflow;
  previousPaddingRight = document.body.style.paddingRight;
  document.body.style.overflow = "hidden";
  if (scrollbar > 0) {
    // Prevent the layout from jumping when the scrollbar disappears.
    document.body.style.paddingRight = `${scrollbar}px`;
  }
}

export function unlockScroll(): void {
  if (typeof document === "undefined") return;
  owners = Math.max(0, owners - 1);
  if (owners > 0) return;

  document.body.style.overflow = previousOverflow;
  document.body.style.paddingRight = previousPaddingRight;
}

export function isScrollLocked(): boolean {
  return owners > 0;
}
