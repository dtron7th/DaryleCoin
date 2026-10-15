# Build the website from Blend Web (Blender)

You are building the website in this folder. The design was made in Blender with the Blend Web addon,
and everything below was exported from it (the template size, SVG shapes / HTML elements with their
positions, the Main font, the CSS, and the click logic as a prompt). Build or update the website's files
(index.html, CSS and JavaScript) so the page matches it:

- Use the template size as the page / viewport size the design was made for, and keep elements at the
  given positions and sizes (x / y are website pixels from the top-left corner).
- Keep every class name and id exactly as written, and apply the CSS exactly.
- Build every flow in the node logic: its trigger (mouse click and/or touch) on its element, then its
  prompts in order.
- Put fonts in fonts/ and images in images/ as the data says. If a file it names is missing, say so.
- Keep existing work in this folder unless the data replaces it.

Model picked in Blender: SWE-2.
Template: Blend Web data  -  Tablet  949 x 1334 px
Blender file: C:\Users\dtron\OneDrive\Documents\GitHub\DaryleCoin\Blend Web Test.blend

---

Blend Web data  -  Desktop  1366 x 599 px

FRAME RATE  -  target 60 FPS on every device (phones and tablets included)
These rules apply to EVERY animation on the site: CSS animations and transitions, script animations and every canvas animation (the gradient background, waves, sound waves...).
- One clock: run every script and canvas animation from ONE shared requestAnimationFrame loop. No setInterval / setTimeout animation, no second loop per canvas.
- Draw on every requestAnimationFrame tick (60 a second on a 60 Hz screen). On a faster screen (90/120 Hz) skip ticks so drawing stays at 60: only draw when 16.67 ms have passed.
- Movement uses real elapsed time (delta time), never 'one step per frame', so an animation takes the same number of seconds on a slow device as on a fast one. Clamp a delta above 100 ms.
- Each frame must fit in 16.7 ms: no layout reads (offsetWidth, getBoundingClientRect) inside the loop, no creating objects / gradients / arrays per frame - make them once and reuse them.
- CSS animations and transitions animate ONLY transform and opacity (the GPU does those). A keyframed width / height / left / top becomes transform: scale() / translate() with the same look; put will-change: transform on an element only while it animates. Avoid animating box-shadow, filter and backdrop-filter - fade a prepared layer's opacity instead.
- Animated gradient backgrounds (breathing, bent, wave, flowing gradients) are drawn by the GPU: a WebGL fragment shader on the canvas (one full-screen triangle; time, colors, angle, wave height / count / speed as uniforms; the color is computed per pixel in the shader; precision mediump). NEVER build them from many drawImage strips or per-pixel work on a 2D canvas - that is what makes a tablet slow. Several gradients that cross-fade are mixed inside the same shader, not drawn twice. Use a 2D canvas only as the fallback when WebGL is not available.
- Things drawn over the gradient (waves, particles, lines) go on a second, transparent 2D canvas above it, or into the same shader. On the 2D canvas batch the work: all lines of a similar opacity in ONE path and one stroke() (3-4 opacity groups), all dots in one path and one fill() - never one stroke() per line. On a touch device (pointer: coarse) use half the particles.
- Canvas resolution: canvas.width = CSS width x Math.min(devicePixelRatio, 1.5) (same for height) - a tablet must not draw 2-3x the pixels. Resize the canvas only when the window size changes.
- Keep the pace: measure the average frame time over the last ~60 frames. When it is above 21 ms, lower the canvas detail one step (resolution x0.75, down to 0.5x; fewer wave points / layers) and measure again. Changing detail must be cheap (no rebuilding big textures) and must not flip back and forth: step back up only after 30 s of easy frames, and if that step up is slow again stay down for good. Never drop the animation itself.
- Pause what can't be seen: stop the loop on document.hidden (visibilitychange), and skip a canvas that is off screen or covered by an open app window (IntersectionObserver).

PLATFORMS  -  one website, designed for: Desktop 1366 x 599, Tablet 949 x 1334, Phone 390 x 844
Everything else in this file (coordinates, CSS, animations) is the DESKTOP design: it is the BASE.
Make the site responsive in ONE page with CSS media queries (no separate pages, no reload): the layout changes by itself when the screen is a different width, the window is resized or the device is turned.
- Desktop (base): screens 1158px and wider. Designed at 1366 x 599.
- Tablet: screens 670 - 1157px wide  ->  @media (min-width: 670px) and (max-width: 1157px). Designed at 949 x 1334.
- Phone: screens up to 669px wide  ->  @media (max-width: 669px). Designed at 390 x 844.
Also set <html data-platform="..."> to the current platform's name in lowercase (update it on resize), so scripts and the Platform nodes can read it.

Tablet layout - what changes from the base, inside @media (min-width: 670px) and (max-width: 1157px) (same elements, same HTML; x / y / sizes are website px at the designed width 949px):
- .QR_Code_Button (QR Code) [x / y from the top-left of its container]:  x 6.9  y 6.9   |   width: 36.21px; height: 36.21px
- #bw-QR-Code-Background (QR Code Background) [x / y from the top-left of its container]:  x 200  y 455   |   width: 50px; height: 50px
- #bw-Tun-Tzu-AI-Title (Tun Tzu AI Title) [x / y from the top-left of its container]:  x 10  y 10   |   width: 192px; height: 20px
- #bw-p-023 (p.023) [x / y from the top-left of its container]:  x 130  y 455   |   width: 60px; height: 15px
- #bw-p-022 (p.022) [x / y from the top-left of its container]:  x 10  y 370   |   width: 205px; height: 15px
- #bw-p-021 (p.021) [x / y from the top-left of its container]:  x 10  y 355   |   width: 205px; height: 15px
- #bw-p-019 (p.019) [x / y from the top-left of its container]:  x 10  y 340   |   width: 175px; height: 15px
- #bw-Circle-002 (Circle.002) [x / y from the top-left of its container]:  x 10  y 315   |   width: 5px; height: 5px
- #bw-Circle-001 (Circle.001) [x / y from the top-left of its container]:  x 10  y 301   |   width: 5px; height: 5px
- #bw-Circle (Circle) [x / y from the top-left of its container]:  x 10  y 288   |   width: 5px; height: 5px
- #bw-p-020 (p.020) [x / y from the top-left of its container]:  x 10  y 240   |   width: 245px; height: 15px
- #bw-p-018 (p.018) [x / y from the top-left of its container]:  x 10  y 70   |   width: 245px; height: 135px
- #bw-p-017 (p.017) [x / y from the top-left of its container]:  x 20  y 285   |   width: 75px; height: 40px
- #bw-p-016 (p.016) [x / y from the top-left of its container]:  x 10  y 265   |   width: 190px; height: 15px
- #bw-Rectangle-003 (Rectangle.003) [x / y from the top-left of its container]:  x 0  y 60   |   width: 263px; height: 458px
- #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box) [x / y from the top-left of its container]:  x 40  y 780   |   width: 263px; height: 33px
- #bw-Blend-ACS (Blend ACS) [x / y from the top-left of its container]:  x 650  y 890   |   width: 264px; height: 405px
- #bw-Blend-Web-Box (Blend Web Box) [x / y from the top-left of its container]:  x 340  y 890   |   width: 264px; height: 405px
- #bw-What-Works-Text (What Works Text) [x / y from the top-left of its container]:  x 104.3  y 494   |   width: 740.44px; height: 198px
- #bw-p-014 (p.014) [x / y from the top-left of its container]:  x 292.2  y 345   |   width: 364.61px; height: 77px
- #bw-p-013 (p.013) [x / y from the top-left of its container]:  x 453.4  y 254   |   width: 42.16px; height: 48px
- #bw-Triangle (Triangle) [x / y from the top-left of its container]:  x 427  y 228.3   |   width: 95px; height: 83.52px
- #bw-Under-Construction (Under Construction):  width: 949px; height: 1334px
- .Sun_Tzu_AI_Main (Sun Tzu AI Main):  x -2  y 0
Elements not listed keep the base design. Use the numbers above EXACTLY, as px (left / top / width / height) inside this media query: do NOT turn them into % or vw, do not scale them with the screen and do not swap a height for aspect-ratio - at the designed width the page must look exactly like it does in Blender, every element in the same place at the same size. If the site already has media queries from an earlier build, REPLACE them with these: the breakpoints and every value here are the current ones (old values must not stay). For screens wider / narrower than the designed width, the 'Automatic anchors' section (when there is one) says which side each element keeps to; otherwise keep the px values. Every element is the SAME element on every platform: its colours, styles, text and animations do not change with the platform - only the places and sizes listed here do.

Phone layout - what changes from the base, inside @media (max-width: 669px) (same elements, same HTML; x / y / sizes are website px at the designed width 390px):
- .QR_Code_Button (QR Code) [x / y from the top-left of its container]:  x -14.3  y -128.8
- #bw-QR-Code-Background (QR Code Background) [x / y from the top-left of its container]:  x 6.7  y -150.8
- #bw-Tun-Tzu-AI-Title (Tun Tzu AI Title) [x / y from the top-left of its container]:  x -9.2  y -247.4   |   width: 78.9px; height: 8.2px
- #bw-p-023 (p.023) [x / y from the top-left of its container]:  x 26.4  y 88.9   |   width: 84.2px; height: 6.2px
- #bw-p-022 (p.022) [x / y from the top-left of its container]:  x 1.9  y 72.3   |   width: 84.2px; height: 6.2px
- #bw-p-021 (p.021) [x / y from the top-left of its container]:  x 1.9  y 71.3   |   width: 84.2px; height: 6.2px
- #bw-p-019 (p.019) [x / y from the top-left of its container]:  x 1.9  y 66.5   |   width: 71.9px; height: 6.2px
- #bw-Circle-002 (Circle.002) [x / y from the top-left of its container]:  x -9.2  y -187.8   |   width: 2.1px; height: 2.1px
- #bw-Circle-001 (Circle.001) [x / y from the top-left of its container]:  x -9.2  y -190.5   |   width: 2.1px; height: 2.1px
- #bw-Circle (Circle) [x / y from the top-left of its container]:  x -9.2  y -193.1   |   width: 2.1px; height: 2.1px
- #bw-p-020 (p.020) [x / y from the top-left of its container]:  x -9.2  y -202.4   |   width: 100.7px; height: 6.2px
- #bw-p-018 (p.018) [x / y from the top-left of its container]:  x -9.2  y -235.7   |   width: 100.7px; height: 55.5px
- #bw-p-017 (p.017) [x / y from the top-left of its container]:  x -7.3  y -193.6   |   width: 30.8px; height: 16.4px
- #bw-p-016 (p.016) [x / y from the top-left of its container]:  x -9.2  y -197.5   |   width: 78.1px; height: 6.2px
- #bw-Rectangle-003 (Rectangle.003) [x / y from the top-left of its container]:  x -9.3  y -242.3   |   width: 143.6px; height: 72.3px
- #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box) [x / y from the top-left of its container]:  x 20.5  y 380.5   |   width: 143.6px; height: 72.3px
- #bw-Blend-ACS (Blend ACS) [x / y from the top-left of its container]:  x 310.6  y 383.4   |   width: 143.6px; height: 72.3px
- #bw-Blend-Web-Box (Blend Web Box) [x / y from the top-left of its container]:  x 163.2  y 383.4   |   width: 143.6px; height: 72.3px
- #bw-What-Works-Text (What Works Text) [x / y from the top-left of its container]:  x 42.9  y 203   |   width: 304.3px; height: 81.4px
- #bw-p-014 (p.014) [x / y from the top-left of its container]:  x 108.3  y 275.9   |   width: 173.4px; height: 10.5px
- #bw-p-013 (p.013) [x / y from the top-left of its container]:  x 190.3  y 238.3   |   width: 9.4px; height: 12.4px
- #bw-Triangle (Triangle) [x / y from the top-left of its container]:  x 167.3  y 218.3   |   width: 55.5px; height: 48.8px
- #bw-Under-Construction (Under Construction):  width: 390px; height: 844px
Elements not listed keep the base design. Use the numbers above EXACTLY, as px (left / top / width / height) inside this media query: do NOT turn them into % or vw, do not scale them with the screen and do not swap a height for aspect-ratio - at the designed width the page must look exactly like it does in Blender, every element in the same place at the same size. If the site already has media queries from an earlier build, REPLACE them with these: the breakpoints and every value here are the current ones (old values must not stay). For screens wider / narrower than the designed width, the 'Automatic anchors' section (when there is one) says which side each element keeps to; otherwise keep the px values. Every element is the SAME element on every platform: its colours, styles, text and animations do not change with the platform - only the places and sizes listed here do.

NESTING  -  these elements are INSIDE another element (set with Put Inside)
In the HTML each one is a CHILD of its container element (not a sibling). Keep it exactly where it was designed: the container gets position: relative (or keeps its own absolute / fixed), the child is position: absolute with left = its x - the container's x and top = its y - the container's y. Whatever happens to the container happens to its contents: display: none, visibility, Show / Hide, opacity, moving. Do NOT repeat the container's display / visibility / opacity on the contents.
- .QR_Code_Button (QR Code) is inside #bw-QR-Code-Background (QR Code Background)
- #bw-Circle (Circle) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-Circle-001 (Circle.001) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-Circle-002 (Circle.002) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-QR-Code-Background (QR Code Background) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-Rectangle-003 (Rectangle.003) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-Tun-Tzu-AI-Title (Tun Tzu AI Title) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-016 (p.016) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-017 (p.017) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-018 (p.018) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-019 (p.019) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-020 (p.020) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-021 (p.021) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-022 (p.022) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-p-023 (p.023) is inside #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box)
- #bw-Blend-ACS (Blend ACS) is inside #bw-Under-Construction (Under Construction)
- #bw-Blend-Web-Box (Blend Web Box) is inside #bw-Under-Construction (Under Construction)
- #bw-Sun-Tzu-AI-Box (Sun Tzu AI Box) is inside #bw-Under-Construction (Under Construction)
- #bw-Triangle (Triangle) is inside #bw-Under-Construction (Under Construction)
- #bw-What-Works-Text (What Works Text) is inside #bw-Under-Construction (Under Construction)
- #bw-p-013 (p.013) is inside #bw-Under-Construction (Under Construction)
- #bw-p-014 (p.014) is inside #bw-Under-Construction (Under Construction)

Coordinates are website pixels: 0,0 = top-left corner of the boundaries box, y goes down.
Shapes: use every "exact svg" / "exact shape" line as-is, so each outline is exactly as designed.

== SVG shapes (0) ==

== HTML elements (8) ==

Sun Tzu AI Box  <div>
  id="bw-Sun-Tzu-AI-Box"  (it has no class or id: use this id for it)
  x 60   y -60   width 503.09   height 253.21
  shape d="M 60 -60 L 563.09 -60 L 563.09 193.21 L 60 193.21 Z"
  exact shape (use as-is): clip-path: path('M 0 0 L 503.09 0 L 503.09 253.21 L 0 253.21 Z');

Blend Web Box  <div>
  id="bw-Blend-Web-Box"  (it has no class or id: use this id for it)
  x 559.75   y -50   width 503.09   height 253.21
  shape d="M 559.75 -50 L 1062.84 -50 L 1062.84 203.21 L 559.75 203.21 Z"
  exact shape (use as-is): clip-path: path('M 0 0 L 503.09 0 L 503.09 253.21 L 0 253.21 Z');

Blend ACS  <div>
  id="bw-Blend-ACS"  (it has no class or id: use this id for it)
  x 1076.17   y -50   width 503.09   height 253.21
  shape d="M 1076.17 -50 L 1579.26 -50 L 1579.26 203.21 L 1076.17 203.21 Z"
  exact shape (use as-is): clip-path: path('M 0 0 L 503.09 0 L 503.09 253.21 L 0 253.21 Z');

Sun Tzu AI Main  <div>
  x -2   y 0   width 949   height 1334

Under Construction  <div>
  id="bw-Under-Construction"  (it has no class or id: use this id for it)
  x 0   y 0   width 1366   height 599

Triangle  <div>
  id="bw-Triangle"  (it has no class or id: use this id for it)
  x 585.82   y 136.15   width 194.3   height 170.8
  group group-1
  shape d="M 589.5 266.77 L 589.6 266.6 L 660.12 149.08 L 660.23 148.9 L 660.35 148.72 L 660.47 148.54 L 661.69 146.78 L 661.94 146.43 L 662.21 146.1 L 662.48 145.77 L 663.92 144.18 L 664.22 143.87 L 664.52 143.57 L 664.84 143.28 L 666.47 141.88 L 666.8 141.61 L 667.14 141.36 L 667.5 141.11 L 669.29 139.94 L 669.66 139.71 L 670.03 139.5 L 670.41 139.3 L 672.34 138.37 L 672.73 138.2 L 673.13 138.03 L 673.53 137.89 L 675.56 137.21 L 675.98 137.09 L 676.39 136.98 L 676.81 136.88 L 678.91 136.47 L 679.33 136.4 L 679.76 136.34 L 680.19 136.3 L 682.33 136.16 L 682.76 136.15 L 683.18 136.15 L 683.61 136.16 L 685.75 136.3 L 686.18 136.34 L 686.61 136.4 L 687.03 136.47 L 689.13 136.88 L 689.55 136.98 L 689.96 137.09 L 690.38 137.21 L 692.41 137.89 L 692.81 138.03 L 693.21 138.2 L 693.6 138.37 L 695.53 139.3 L 695.91 139.5 L 696.28 139.71 L 696.65 139.94 L 698.44 141.11 L 698.8 141.36 L 699.14 141.61 L 699.47 141.88 L 701.1 143.28 L 701.42 143.57 L 701.72 143.87 L 702.02 144.18 L 703.46 145.77 L 703.73 146.1 L 704 146.43 L 704.25 146.78 L 705.47 148.54 L 705.59 148.72 L 705.71 148.9 L 705.82 149.08 L 776.34 266.6 L 776.44 266.77 L 776.54 266.95 L 776.64 267.14 L 777.59 268.97 L 777.77 269.35 L 777.94 269.72 L 778.1 270.11 L 778.81 272.04 L 778.94 272.44 L 779.06 272.83 L 779.17 273.23 L 779.64 275.25 L 779.72 275.65 L 779.79 276.06 L 779.85 276.47 L 780.07 278.52 L 780.1 278.94 L 780.11 279.35 L 780.12 279.76 L 780.08 281.83 L 780.06 282.24 L 780.03 282.65 L 779.98 283.06 L 779.69 285.11 L 779.62 285.52 L 779.53 285.92 L 779.44 286.33 L 778.89 288.32 L 778.77 288.71 L 778.64 289.11 L 778.49 289.49 L 777.7 291.4 L 777.53 291.78 L 777.35 292.15 L 777.16 292.52 L 776.14 294.32 L 775.93 294.67 L 775.7 295.02 L 775.46 295.36 L 774.23 297.01 L 773.97 297.34 L 773.71 297.65 L 773.43 297.96 L 772 299.45 L 771.7 299.75 L 771.4 300.03 L 771.09 300.3 L 769.49 301.6 L 769.16 301.85 L 768.82 302.09 L 768.48 302.32 L 766.72 303.42 L 766.37 303.63 L 766 303.82 L 765.63 304.01 L 763.76 304.88 L 763.38 305.04 L 762.99 305.19 L 762.6 305.33 L 760.64 305.96 L 760.24 306.08 L 759.84 306.18 L 759.43 306.27 L 757.4 306.65 L 756.99 306.71 L 756.58 306.76 L 756.17 306.8 L 754.11 306.93 L 753.9 306.94 L 753.7 306.95 L 753.49 306.95 L 612.45 306.95 L 612.24 306.95 L 612.04 306.94 L 611.83 306.93 L 609.77 306.8 L 609.36 306.76 L 608.95 306.71 L 608.54 306.65 L 606.51 306.27 L 606.1 306.18 L 605.7 306.08 L 605.3 305.96 L 603.34 305.33 L 602.95 305.19 L 602.56 305.04 L 602.18 304.88 L 600.31 304.01 L 599.94 303.82 L 599.57 303.63 L 599.22 303.42 L 597.46 302.32 L 597.12 302.09 L 596.78 301.85 L 596.45 301.6 L 594.85 300.3 L 594.54 300.03 L 594.24 299.75 L 593.94 299.45 L 592.51 297.96 L 592.23 297.65 L 591.97 297.34 L 591.71 297.01 L 590.48 295.36 L 590.24 295.02 L 590.01 294.67 L 589.8 294.32 L 588.78 292.52 L 588.59 292.15 L 588.41 291.78 L 588.24 291.4 L 587.45 289.49 L 587.3 289.11 L 587.17 288.71 L 587.05 288.32 L 586.5 286.33 L 586.41 285.92 L 586.32 285.52 L 586.25 285.11 L 585.96 283.06 L 585.91 282.65 L 585.88 282.24 L 585.86 281.83 L 585.82 279.76 L 585.83 279.35 L 585.84 278.94 L 585.87 278.52 L 586.09 276.47 L 586.15 276.06 L 586.22 275.65 L 586.3 275.25 L 586.77 273.23 L 586.88 272.83 L 587 272.44 L 587.13 272.04 L 587.84 270.11 L 588 269.72 L 588.17 269.34 L 588.35 268.97 L 589.3 267.14 L 589.4 266.95 Z M 602.89 277.43 L 602.61 278.64 L 602.48 279.87 L 602.5 281.11 L 602.68 282.33 L 603.01 283.53 L 603.48 284.67 L 604.09 285.75 L 604.83 286.75 L 605.69 287.64 L 606.65 288.42 L 607.7 289.08 L 608.82 289.6 L 610 289.98 L 611.22 290.21 L 612.66 290.3 L 753.28 290.3 L 754.72 290.21 L 755.94 289.98 L 757.12 289.6 L 758.24 289.08 L 759.29 288.42 L 760.25 287.64 L 761.11 286.75 L 761.85 285.75 L 762.46 284.67 L 762.93 283.53 L 763.26 282.33 L 763.44 281.11 L 763.46 279.87 L 763.33 278.64 L 763.05 277.43 L 762.62 276.27 L 761.95 274.99 L 691.65 157.83 L 690.8 156.6 L 689.94 155.65 L 688.96 154.81 L 687.89 154.11 L 686.73 153.55 L 685.51 153.14 L 684.25 152.89 L 682.97 152.81 L 681.69 152.89 L 680.43 153.14 L 679.21 153.55 L 678.05 154.11 L 676.98 154.81 L 676 155.65 L 675.14 156.6 L 674.29 157.83 L 603.99 274.99 L 603.32 276.27 Z"
  exact shape (use as-is): clip-path: path('M 3.68 130.62 L 3.78 130.45 L 74.3 12.93 L 74.41 12.75 L 74.53 12.57 L 74.65 12.39 L 75.87 10.63 L 76.12 10.28 L 76.39 9.95 L 76.66 9.62 L 78.1 8.03 L 78.4 7.72 L 78.7 7.42 L 79.02 7.13 L 80.65 5.73 L 80.98 5.46 L 81.32 5.21 L 81.68 4.96 L 83.47 3.79 L 83.84 3.56 L 84.21 3.35 L 84.59 3.15 L 86.52 2.22 L 86.91 2.04 L 87.31 1.88 L 87.71 1.74 L 89.74 1.06 L 90.16 0.93 L 90.57 0.82 L 90.99 0.73 L 93.09 0.32 L 93.51 0.25 L 93.94 0.19 L 94.37 0.15 L 96.51 0.01 L 96.94 0 L 97.36 0 L 97.79 0.01 L 99.93 0.15 L 100.36 0.19 L 100.79 0.25 L 101.21 0.32 L 103.31 0.73 L 103.73 0.82 L 104.14 0.93 L 104.56 1.06 L 106.59 1.74 L 106.99 1.88 L 107.39 2.04 L 107.78 2.22 L 109.71 3.15 L 110.09 3.35 L 110.46 3.56 L 110.83 3.79 L 112.62 4.96 L 112.98 5.21 L 113.32 5.46 L 113.65 5.73 L 115.28 7.13 L 115.6 7.42 L 115.9 7.72 L 116.2 8.03 L 117.64 9.62 L 117.91 9.95 L 118.18 10.28 L 118.43 10.63 L 119.65 12.39 L 119.77 12.57 L 119.89 12.75 L 120 12.93 L 190.52 130.45 L 190.62 130.62 L 190.72 130.8 L 190.82 130.99 L 191.77 132.82 L 191.95 133.19 L 192.12 133.57 L 192.28 133.96 L 192.99 135.89 L 193.12 136.29 L 193.24 136.68 L 193.35 137.08 L 193.82 139.09 L 193.9 139.5 L 193.97 139.91 L 194.03 140.32 L 194.25 142.37 L 194.28 142.79 L 194.29 143.2 L 194.3 143.61 L 194.26 145.68 L 194.24 146.09 L 194.21 146.5 L 194.16 146.91 L 193.87 148.96 L 193.8 149.37 L 193.71 149.77 L 193.62 150.17 L 193.07 152.17 L 192.95 152.56 L 192.82 152.95 L 192.67 153.34 L 191.88 155.25 L 191.71 155.63 L 191.53 156 L 191.34 156.37 L 190.32 158.17 L 190.11 158.52 L 189.88 158.87 L 189.64 159.2 L 188.41 160.86 L 188.15 161.19 L 187.89 161.5 L 187.61 161.81 L 186.18 163.3 L 185.88 163.59 L 185.58 163.87 L 185.27 164.15 L 183.67 165.45 L 183.34 165.7 L 183 165.94 L 182.66 166.17 L 180.9 167.27 L 180.55 167.48 L 180.18 167.67 L 179.81 167.86 L 177.94 168.73 L 177.56 168.89 L 177.17 169.04 L 176.78 169.18 L 174.82 169.81 L 174.42 169.93 L 174.02 170.03 L 173.61 170.12 L 171.58 170.5 L 171.17 170.56 L 170.76 170.61 L 170.35 170.65 L 168.29 170.78 L 168.08 170.79 L 167.88 170.8 L 167.67 170.8 L 26.63 170.8 L 26.42 170.8 L 26.22 170.79 L 26.01 170.78 L 23.95 170.65 L 23.54 170.61 L 23.13 170.56 L 22.72 170.5 L 20.69 170.12 L 20.28 170.03 L 19.88 169.93 L 19.48 169.81 L 17.52 169.18 L 17.13 169.04 L 16.74 168.89 L 16.36 168.73 L 14.49 167.86 L 14.12 167.67 L 13.75 167.47 L 13.4 167.27 L 11.64 166.17 L 11.3 165.94 L 10.96 165.7 L 10.63 165.45 L 9.03 164.15 L 8.72 163.87 L 8.42 163.59 L 8.12 163.3 L 6.69 161.81 L 6.41 161.5 L 6.15 161.19 L 5.89 160.86 L 4.66 159.2 L 4.42 158.87 L 4.19 158.52 L 3.98 158.17 L 2.96 156.37 L 2.77 156 L 2.59 155.63 L 2.42 155.25 L 1.63 153.34 L 1.48 152.95 L 1.35 152.56 L 1.23 152.17 L 0.68 150.17 L 0.59 149.77 L 0.5 149.37 L 0.43 148.96 L 0.14 146.91 L 0.09 146.5 L 0.06 146.09 L 0.04 145.68 L 0 143.61 L 0.01 143.2 L 0.02 142.79 L 0.05 142.37 L 0.27 140.32 L 0.33 139.91 L 0.4 139.5 L 0.48 139.09 L 0.95 137.08 L 1.06 136.68 L 1.18 136.29 L 1.31 135.89 L 2.02 133.96 L 2.18 133.57 L 2.35 133.19 L 2.53 132.82 L 3.48 130.99 L 3.58 130.8 Z M 17.07 141.28 L 16.79 142.49 L 16.66 143.72 L 16.68 144.96 L 16.86 146.18 L 17.19 147.38 L 17.66 148.52 L 18.27 149.6 L 19.01 150.59 L 19.87 151.49 L 20.83 152.27 L 21.88 152.93 L 23 153.45 L 24.18 153.83 L 25.4 154.06 L 26.84 154.15 L 167.46 154.15 L 168.9 154.06 L 170.12 153.83 L 171.3 153.45 L 172.42 152.93 L 173.47 152.27 L 174.43 151.49 L 175.29 150.59 L 176.03 149.6 L 176.64 148.52 L 177.11 147.38 L 177.44 146.18 L 177.62 144.96 L 177.64 143.72 L 177.51 142.49 L 177.23 141.28 L 176.8 140.12 L 176.13 138.83 L 105.83 21.68 L 104.98 20.45 L 104.12 19.5 L 103.14 18.66 L 102.07 17.96 L 100.91 17.4 L 99.69 16.99 L 98.43 16.74 L 97.15 16.66 L 95.87 16.74 L 94.61 16.99 L 93.39 17.4 L 92.23 17.96 L 91.16 18.66 L 90.18 19.5 L 89.32 20.45 L 88.47 21.68 L 18.17 138.83 L 17.5 140.12 Z');

p.013  <p>
  id="bw-p-013"  (it has no class or id: use this id for it)
  x 680.51   y 212   width 4.99   height 8.26
  text "!"
  group group-1

p.014  <p>
  id="bw-p-014"  (it has no class or id: use this id for it)
  x 552   y 264   width 262   height 19.11
  text "Sozin - X is under construction"

== Main_*{} ==
Main Font: "Drafting* Mono"  (file: C:\Users\dtron\OneDrive\Documents\GitHub\DaryleCoin\fonts\DraftingMono\ttf\DraftingMono-Regular.ttf)
Main Font Size: 10px

/* the whole website */
@font-face {
  font-family: "Drafting* Mono";
  src: url("fonts/DraftingMono-Regular.ttf") format("truetype");
}
body {
  font-family: "Drafting* Mono", sans-serif;
  font-size: 10px;
}

/* Uploaded fonts: copy each file into the website's fonts/ folder (they are in fonts/ next to the .blend) */
@font-face {
  font-family: "Bank Gothic Light";
  src: url("fonts/Bank Gothic Light Regular.otf") format("opentype");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Silkscreen";
  src: url("fonts/Silkscreen-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Drafting* Mono";
  src: url("fonts/DraftingMono-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Courier Prime";
  src: url("fonts/CourierPrime-Regular.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

== CSS (24 elements) ==
Text: Blender lays every text out with line-height: normal (the font's own ascent / descent) unless the element's CSS below sets a line-height. Do NOT add a fixed line-height to p / span / headings / buttons (e.g. 'p { line-height: 20px }'): it moves every text up or down from where it is in Blender.
Colours: Blender's default text colour is #e6e6e6, so currentcolor is #e6e6e6 and any border / outline below with no colour of its own is drawn #e6e6e6. Put 'body { color: #e6e6e6; }' in the stylesheet (and give such borders border-color: #e6e6e6) - the browser default (black) makes them invisible on dark pages.
Box model: Blender uses box-sizing: content-box (width / height are the inside; borders and padding are added outside). Do NOT add box-sizing: border-box unless the element's CSS below lists it.
New objects: every element listed here and in the HTML section must be on the page - add any that are missing from index.html with the given id, never skip one.

/* <div>  object "Blend ACS"  (no class or id: give it id="bw-Blend-ACS") */
#bw-Blend-ACS {
  background-color: none;
  z-index: 3;
  background: none;
  border-width: 1px;
  border-style: solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #ffffff 0%, #00baff 100%);
}

/* <div>  object "Blend Web Box"  (no class or id: give it id="bw-Blend-Web-Box") */
#bw-Blend-Web-Box {
  background-color: none;
  z-index: 3;
  background: none;
  border-width: 1px;
  border-style: solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #ffffff 0%, #88ff00 100%);
}

/* <div>  object "Circle"  (no class or id: give it id="bw-Circle") */
#bw-Circle {
  width: 7.2px;
  height: 7.2px;
  background-color: #51d900;
  border-radius: 50%;
  z-index: 6;
}

/* <div>  object "Circle.001"  (no class or id: give it id="bw-Circle-001") */
#bw-Circle-001 {
  width: 7.2px;
  height: 7.2px;
  background-color: #51d900;
  border-radius: 50%;
  z-index: 7;
}

/* <div>  object "Circle.002"  (no class or id: give it id="bw-Circle-002") */
#bw-Circle-002 {
  width: 7.2px;
  height: 7.2px;
  background-color: #51d900;
  border-radius: 50%;
  z-index: 8;
}

/* <p>  object "p.013"  (no class or id: give it id="bw-p-013") */
#bw-p-013 {
  z-index: 2;
  width: 4.99px;
  height: 8.26px;
  font-size: 48px;
  font-family: "Bank Gothic Light";
  text-align: center;
  align-items: center;
  text-justify: auto;
  background-color: #71717100;
  color: #ffffff;
}

/* <p>  object "p.014"  (no class or id: give it id="bw-p-014") */
#bw-p-014 {
  width: 262px;
  height: 19.11px;
  font-family: "Courier Prime";
  text-align: center;
  font-size: 32px;
  background-color: #4c4c4c00;
  color: #ffffff;
  z-index: 2;
}

/* <p>  object "p.016"  (no class or id: give it id="bw-p-016") */
#bw-p-016 {
  width: 273.5px;
  height: 21.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 2;
}

/* <p>  object "p.017"  (no class or id: give it id="bw-p-017") */
#bw-p-017 {
  width: 108px;
  height: 57.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 3;
}

/* <p>  object "p.018"  (no class or id: give it id="bw-p-018") */
#bw-p-018 {
  width: 352.7px;
  height: 194.3px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 4;
}

/* <p>  object "p.019"  (no class or id: give it id="bw-p-019") */
#bw-p-019 {
  width: 251.9px;
  height: 21.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 9;
}

/* <p>  object "p.020"  (no class or id: give it id="bw-p-020") */
#bw-p-020 {
  width: 352.7px;
  height: 21.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 5;
}

/* <p>  object "p.021"  (no class or id: give it id="bw-p-021") */
#bw-p-021 {
  width: 295.1px;
  height: 21.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 10;
}

/* <p>  object "p.022"  (no class or id: give it id="bw-p-022") */
#bw-p-022 {
  width: 295.1px;
  height: 21.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 11;
}

/* <p>  object "p.023"  (no class or id: give it id="bw-p-023") */
#bw-p-023 {
  width: 295.1px;
  height: 21.6px;
  font-family: "Courier Prime";
  font-size: 12px;
  z-index: 12;
}

/* <div>  object "QR Code" */
.QR_Code_Button {
  width: 36.21px;
  height: 36.21px;
  background-color: #000000;
  z-index: 4;
}

/* <div>  object "QR Code Background"  (no class or id: give it id="bw-QR-Code-Background") */
#bw-QR-Code-Background {
  width: 50px;
  height: 50px;
  background-color: #ffffff;
  z-index: 3;
}

/* <div>  object "Rectangle.003"  (no class or id: give it id="bw-Rectangle-003") */
#bw-Rectangle-003 {
  background-color: none;
  z-index: 1;
  background: none;
  border-width: 1px;
  border-style: solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #ffffff 0%, #9c1800 100%);
}

/* <div>  object "Sun Tzu AI Box"  (no class or id: give it id="bw-Sun-Tzu-AI-Box") */
#bw-Sun-Tzu-AI-Box {
  background-color: none;
  z-index: 3;
  background: none;
  border-width: 1px;
  border-style: solid;
  border-image-slice: 1;
  border-image-source: linear-gradient(180deg, #ffffff 0%, #ff2100 100%);
}

/* <div>  object "Sun Tzu AI Main" */
.Sun_Tzu_AI_Main {
  background-image: url("images/Wallpaper/katerina-kirillova-katerina-kirillova-friz-final.jpg");
  background-position: 41.55% 16.71%;
  background-size: 2447.9px 1376.9px;
  z-index: 2;
  display: none;
}

/* <div>  object "Triangle"  (no class or id: give it id="bw-Triangle") */
#bw-Triangle {
  width: 194.3px;
  height: 170.8px;
  background-color: #ffcf00;
}

/* <p>  object "Tun Tzu AI Title"  (no class or id: give it id="bw-Tun-Tzu-AI-Title") */
#bw-Tun-Tzu-AI-Title {
  width: 276.4px;
  height: 28.8px;
  font-family: "Courier Prime";
  color: #ffffff;
  z-index: 13;
}

/* <div>  object "Under Construction"  (no class or id: give it id="bw-Under-Construction") */
#bw-Under-Construction {
  display: flex;
  backdrop-filter: blur(10px);
  z-index: 1;
  background-color: #000000;
}

/* <p>  object "What Works Text"  (no class or id: give it id="bw-What-Works-Text") */
#bw-What-Works-Text {
  width: 1065.8px;
  height: 285px;
  font-size: 20px;
  text-align: center;
  z-index: 2;
  color: #ffffff;
  font-family: "Courier Prime";
}

== Node logic (AI prompt) ==
Build these interactions into the website. Each flow starts with its trigger, then does its numbered
steps in order (indented steps belong to the step above them). .name = elements with that class,
#name = the element with that id, #rrggbb = a color.
SCRIPTING: write ALL of the website's logic from these nodes - the JavaScript, and any other language a
node needs (server code, SQL for database nodes, API routes for network nodes, CSS @keyframes for effects).
The Node Editor is the only source of behaviour: don't add interactions that aren't here, and don't leave
any flow out. "Node data" at the end lists every node's exact settings and wires.

Components (build these on the page):
   - App link "Sun Tzu AI": the address the site's own address + #sun-tzu-ai opens Sun Tzu AI directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Sun_Tzu_AI does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Sun Tzu AI". An unknown link just shows the normal page.
   - App link "Blend Web": the address the site's own address + #blend-web opens Blend Web directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_Web does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend Web". An unknown link just shows the normal page.
   - App link "Blend EDA": the address the site's own address + #blend-eda opens Blend EDA directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_EDA does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend EDA". An unknown link just shows the normal page.
   - App link "Blend ACS": the address the site's own address + #blend-acs opens Blend ACS directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_ACS does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend ACS". An unknown link just shows the normal page.
   - App link "Kin Flow": the address the site's own address + #kin-flow opens Kin Flow directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Kin_Flow does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Kin Flow". An unknown link just shows the normal page.
   - Responsive layout: the page uses the layout of the platform that fits the screen (the PLATFORMS section has each platform's layout as CSS media queries: Phone = screens up to 669px wide; Tablet = screens 670 - 1157px wide; Desktop = screens 1158px and wider). It switches by itself when the window is resized and when the device is turned, with no reload and without losing what is open or typed.

Flow 1 - When the user double-clicks (or double-taps) .Blend_Web:
   (nothing connected yet)

Flow 2 - When the user double-clicks (or double-taps) .Blend_EDA:
   (nothing connected yet)

Flow 3 - When the user double-clicks (or double-taps) .Blend_ACS:
   (nothing connected yet)

Flow 4 - When the user double-clicks (or double-taps) .Kin_Flow:
   (nothing connected yet)

Flow 5 - "Click Step 1": when the user clicks or taps (touch) .QR_Code_Button:
   Every time:
      1. Set the CSS property display of .Sun_Tzu_AI_Main to flex.

Elements used:
   .QR_Code_Button = <div> (object QR Code)
   .Sun_Tzu_AI_Main = <div> (object Sun Tzu AI Main)
   #sun-tzu-ai (not in the website yet)
   .Sun_Tzu_AI (not in the website yet)
   #blend-web (not in the website yet)
   .Blend_Web (not in the website yet)
   #blend-eda (not in the website yet)
   .Blend_EDA (not in the website yet)
   #blend-acs (not in the website yet)
   .Blend_ACS (not in the website yet)
   #kin-flow (not in the website yet)
   .Kin_Flow (not in the website yet)

Node data (every node in the Node Editor: [id] node (folder): settings -> wires out):
   [n1] Get Element by Class Name (Values): .Sun_Tzu_AI  ->  Elements -> n10.Opens (what a click on it does)
   [n2] Double Click (Triggers > Mouse & Touch): Element = .Blend_Web (wired)
   [n3] Get Element by Class Name (Values): .Blend_Web  ->  Elements -> n2.Element, Elements -> n11.Opens (what a click on it does)
   [n4] Double Click (Triggers > Mouse & Touch): Element = .Blend_EDA (wired)
   [n5] Get Element by Class Name (Values): .Blend_EDA  ->  Elements -> n4.Element, Elements -> n12.Opens (what a click on it does)
   [n6] Double Click (Triggers > Mouse & Touch): Element = .Blend_ACS (wired)
   [n7] Get Element by Class Name (Values): .Kin_Flow  ->  Elements -> n8.Element, Elements -> n14.Opens (what a click on it does)
   [n8] Double Click (Triggers > Mouse & Touch): Element = .Kin_Flow (wired)
   [n9] Get Element by Class Name (Values): .Blend_ACS  ->  Elements -> n6.Element, Elements -> n13.Opens (what a click on it does)
   [n10] App Link (Links & QR > App Links): App name = Sun Tzu AI; Link name (blank = from the name) = sun-tzu-ai; Opens (what a click on it does) = .Sun_Tzu_AI (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n11] App Link (Links & QR > App Links): App name = Blend Web; Link name (blank = from the name) = blend-web; Opens (what a click on it does) = .Blend_Web (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n12] App Link (Links & QR > App Links): App name = Blend EDA; Link name (blank = from the name) = blend-eda; Opens (what a click on it does) = .Blend_EDA (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n13] App Link (Links & QR > App Links): App name = Blend ACS; Link name (blank = from the name) = blend-acs; Opens (what a click on it does) = .Blend_ACS (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n14] App Link (Links & QR > App Links): App name = Kin Flow; Link name (blank = from the name) = kin-flow; Opens (what a click on it does) = .Kin_Flow (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n15] Responsive Layout (Platforms): Also when the window is resized = True; Also when the device is turned = True; Animate the change (s) = 0
   [n16] Get Element by Class Name (Values): .QR_Code_Button  ->  Elements -> n17.Element
   [n17] Click Step (Triggers): "Click Step 1" on .QR_Code_Button  ->  Clicked -> n18.Run
   [n18] display (CSS > Display): Element = .Sun_Tzu_AI_Main (wired); Value = flex; Change over (s) = 0; Back to its stylesheet value = False
   [n19] Get Element by Class Name (Values): .Sun_Tzu_AI_Main  ->  Elements -> n18.Element


Animations  (24 fps; px = website pixels; transforms are relative to where each element sits)
========================================================================

Timeline animations (Animations panel):
   (no animation has been created)

Animation nodes (Node Editor):
   (no animation nodes)

Anchors  (points pinned to the page's edges; page = 1366 x 599 px, x right, y down from its top-left)
========================================================================
An anchored point keeps its distance to the edge(s) it's anchored to when the page changes size: right /
bottom anchors move with that edge, left + right (or top + bottom) keep the point's place as a percentage.
Build the layout so each element behaves like this at every screen size (CSS left / right / top / bottom,
percentages, or flex / grid that gives the same result).

(nothing is anchored yet: use the Anchor tool to pin points to the page's edges)


Automatic anchors  (elements with no anchors of their own; page = 1366 x 599 px, x right, y down)
========================================================================
Between screen sizes NOTHING is scaled: every element keeps its width and height in px (a square stays a
square) unless it stretches. It keeps its distance to the side it belongs to - the left edge, the right
edge, or the middle line when it is centred - so the page fits every screen: any desktop monitor, tablet,
iPad and phone. Elements inside another element keep to that element's sides the same way. Use the CSS
given (position: absolute in the page / in its container), or flex / grid that gives the same result.
The same rules hold on every platform, worked out from that platform's own layout: an element (or a row
of elements side by side, taken together) with equal space on both sides is centred, one nearer the right
is kept to the right, one that fills the width stretches, everything else is kept to the left; up / down
it is kept to the top unless it fills the height, is centred, or hugs the bottom.

"Blend ACS" (#bw-Blend-ACS)  -  in the page, left / top  (a row of 2 kept together)  ->  left: 1076.17px; width: 503.09px; top: -50px; height: 253.21px
"Blend Web Box" (#bw-Blend-Web-Box)  -  in the page, left / top  ->  left: 559.75px; width: 503.09px; top: -50px; height: 253.21px
"Circle" (#bw-Circle)  -  in the page, left / bottom  ->  left: 113.26px; width: 11.99px; bottom: -695.04px; height: 11.99px
"Circle.001" (#bw-Circle-001)  -  in the page, left / bottom  ->  left: 113.26px; width: 11.99px; bottom: -726.22px; height: 11.99px
"Circle.002" (#bw-Circle-002)  -  in the page, left / bottom  (a row of 2 kept together)  ->  left: 113.26px; width: 11.99px; bottom: -759.79px; height: 11.99px
"p.013" (#bw-p-013)  -  inside "Under Construction" (#bw-Under-Construction), center / top  ->  left: calc(50% - 2.49px); width: 4.99px; top: 212px; height: 8.26px
"p.014" (#bw-p-014)  -  inside "Under Construction" (#bw-Under-Construction), center / top  ->  left: calc(50% - 131px); width: 262px; top: 264px; height: 19.11px
"p.016" (#bw-p-016)  -  in the page, left / bottom  ->  left: 113.26px; width: 455.61px; bottom: -663.89px; height: 35.98px
"p.017" (#bw-p-017)  -  in the page, left / bottom  (a row of 2 kept together)  ->  left: 137.23px; width: 179.91px; bottom: -771.82px; height: 95.95px
"p.018" (#bw-p-018)  -  in the page, left / bottom  ->  left: 113.26px; width: 587.55px; bottom: -483.99px; height: 323.67px
"p.019" (#bw-p-019)  -  in the page, left / bottom  ->  left: 83.97px; width: 419.63px; bottom: -192.25px; height: 35.98px
"p.020" (#bw-p-020)  -  in the page, left / bottom  ->  left: 113.26px; width: 587.55px; bottom: -603.93px; height: 35.98px
"p.021" (#bw-p-021)  -  in the page, left / bottom  ->  left: 83.97px; width: 491.59px; bottom: -252.19px; height: 35.98px
"p.022" (#bw-p-022)  -  in the page, left / bottom  ->  left: 83.97px; width: 491.59px; bottom: -264.18px; height: 35.98px
"p.023" (#bw-p-023)  -  in the page, left / bottom  ->  left: 383.71px; width: 491.59px; bottom: -468px; height: 35.98px
"QR Code" (.QR_Code_Button)  -  inside "QR Code Background" (#bw-QR-Code-Background), center / center  ->  left: calc(50% - 30.16px); width: 60.32px; top: calc(50% - 30.16px); height: 60.32px
"QR Code Background" (#bw-QR-Code-Background)  -  in the page, left / bottom  ->  left: 393.17px; width: 83.29px; bottom: -182.25px; height: 83.29px
"Rectangle.003" (#bw-Rectangle-003)  -  in the page, left / top  ->  left: 93.32px; width: 838.07px; top: -1642.56px; height: 421.81px
"Sun Tzu AI Box" (#bw-Sun-Tzu-AI-Box)  -  in the page, left / top  ->  left: 60px; width: 503.09px; top: -60px; height: 253.21px
"Sun Tzu AI Main" (.Sun_Tzu_AI_Main)  -  in the page, right / stretch  (a row of 2 kept together)  ->  right: 419px; width: 949px; top: -0px; bottom: -735px
"Triangle" (#bw-Triangle)  -  inside "Under Construction" (#bw-Under-Construction), center / top  ->  left: calc(50% - 97.18px); width: 194.3px; top: 136.15px; height: 170.8px
"Tun Tzu AI Title" (#bw-Tun-Tzu-AI-Title)  -  in the page, left / bottom  ->  left: 113.26px; width: 460.44px; bottom: -64.43px; height: 47.98px
"Under Construction" (#bw-Under-Construction)  -  in the page, stretch / stretch  ->  left: 0px; right: 0px; top: -0px; bottom: 0px
"What Works Text" (#bw-What-Works-Text)  -  in the page, center / bottom  ->  left: calc(50% - 532.9px); width: 1065.8px; bottom: -397.07px; height: 285px

== Shader information (1 element) ==
These are the effects Blender draws with shaders: shadows, blur, glass (backdrop-filter), gradients and
see-through. The website must show every one of them exactly. For each element below:
  1. Put its CSS in the stylesheet as written (it's also in the CSS section).
  2. An element marked "no clip-path" must NOT have a clip-path (remove one if the page has it): its
     rounded corners come from border-radius, and a clip-path cuts off the shadow around it.
  3. No parent of it may have overflow: hidden / clip closer than the shadow reaches, and nothing may
     cover it (keep the z-order from the coordinates).
  4. backdrop-filter also needs -webkit-backdrop-filter, and a background that is partly see-through.

/* <div>  object "Under Construction"  -  no clip-path */
#bw-Under-Construction {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}


