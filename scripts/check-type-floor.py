#!/usr/bin/env python3
"""
Type-floor guard.

The site's readable type scale is defined in `src/app/globals.css`:

    12px  --fs-micro  decorative meta only
    13px  --fs-xs     dense secondary labels
    14px  --fs-sm     navigation, buttons, tags, captions
    16px  --fs-base   body copy

Nothing a reader has to read may render below 12px, and interactive labels must
be at least 14px. This script fails if that drifts, so a stray `text-[8px]`
cannot creep back in during a refactor.

Decorative artwork is exempt: `ProjectVisual` and `HeroObject` are `aria-hidden`
mock product screenshots, where miniature type is the whole point.

Usage: python3 scripts/check-type-floor.py
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"

MIN_UI_PX = 12
MIN_INTERACTIVE_PX = 14

# aria-hidden illustration components - intentionally miniature.
EXEMPT = {
    "components/projects/ProjectVisual.tsx",
    "components/hero/HeroObject.tsx",
}

# Files where a size is applied to an interactive control.
INTERACTIVE_HINTS = ("btn", "<button", "<input", "<textarea", "<a ")

size_re = re.compile(r"text-\[(\d+(?:\.\d+)?)px\]")
css_re = re.compile(r"font-size:\s*(\d+(?:\.\d+)?)px")

failures = []

for path in sorted(SRC.rglob("*")):
    if path.suffix not in {".tsx", ".ts", ".css"}:
        continue
    rel = path.relative_to(SRC).as_posix()
    text = path.read_text()

    if path.suffix == ".css":
        for match in css_re.finditer(text):
            px = float(match.group(1))
            if px < MIN_UI_PX:
                line = text[: match.start()].count("\n") + 1
                failures.append(f"{rel}:{line} css font-size {px}px < {MIN_UI_PX}px")
        continue

    if rel in EXEMPT:
        continue

    for line_no, line in enumerate(text.splitlines(), start=1):
        for match in size_re.finditer(line):
            px = float(match.group(1))
            if px >= MIN_UI_PX:
                continue
            if px < MIN_INTERACTIVE_PX and any(h in line for h in INTERACTIVE_HINTS):
                failures.append(
                    f"{rel}:{line_no} interactive label {px}px < {MIN_INTERACTIVE_PX}px"
                )
            else:
                failures.append(f"{rel}:{line_no} text {px}px < {MIN_UI_PX}px")

if failures:
    print(f"Type floor violated in {len(failures)} place(s):\n")
    for failure in failures:
        print("  " + failure)
    print("\nRaise these to the scale in src/app/globals.css, or move genuinely")
    print("decorative artwork into an aria-hidden component and exempt it here.")
    sys.exit(1)

print(f"Type floor OK: nothing readable below {MIN_UI_PX}px, controls >= {MIN_INTERACTIVE_PX}px.")
