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
Template: Blend Web data  -  Tablet  820 x 1180 px
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

PLATFORMS  -  one website, designed for: Desktop 1366 x 599, Tablet 820 x 1180, Phone 390 x 844
Everything else in this file (coordinates, CSS, animations) is the DESKTOP design: it is the BASE.
Make the site responsive in ONE page with CSS media queries (no separate pages, no reload): the layout changes by itself when the screen is a different width, the window is resized or the device is turned.
- Desktop (base): screens 1094px and wider. Designed at 1366 x 599.
- Tablet: screens 606 - 1093px wide  ->  @media (min-width: 606px) and (max-width: 1093px). Designed at 820 x 1180.
- Phone: screens up to 605px wide  ->  @media (max-width: 605px). Designed at 390 x 844.
Also set <html data-platform="..."> to the current platform's name in lowercase (update it on resize), so scripts and the Platform nodes can read it.

Tablet layout - what changes from the base, inside @media (min-width: 606px) and (max-width: 1093px) (same elements, same HTML; x / y / sizes are website px at the designed width 820px):
- #bw-p-001 (p.001):  x 20  y 20   |   width: 120px; height: 24px
- #bw-p-004 (p.004):  x 260  y 20   |   width: 12px; height: 12px
- .Front_Page_Time (p):  x 280  y 20   |   width: 80px; height: 12px
- .Front_Page_Date (p.002):  x 140  y 20   |   width: 115.96px; height: 12px
- .App_Counter (p.003):  x 100  y 80   |   width: 252.1px; height: 24px
- #bw-p-005 (p.005):  x 40  y 80   |   width: 36px; height: 24px
- #bw-Rectangle-007 (Rectangle.007):  width: 820px; height: 1180px
- .Blend_EDA (Blend EDA):  x 180  y 160   |   width: 50px; height: 50px
- .Sun_Tzu_AI (Sun Tzu AI):  x 40  y 160   |   width: 50px; height: 50px
- .Kin_Flow (Kin Flow):  x 320  y 160   |   width: 50px; height: 50px
- .Blend_Web (Blend Web):  x 110  y 160   |   width: 50px; height: 50px
- .Blend_ACS (Blend ACS):  x 250  y 160   |   width: 50px; height: 50px
- .Sun_Tzu_AI_Content (Sun Tzu AI Content) [x / y inside its container]:  x 60  y 120   |   width: 820px; height: 1180px
- #bw-div (div) [x / y inside its container]:  width: 820px; height: 1180px
- #bw-p-006 (p.006) [x / y inside its container]:  x 160  y 160   |   width: 339px; height: 74px
- #bw-button-001 (button.001) [x / y inside its container]:  x 0  y 1140   |   width: 190px; height: 40px
- #bw-button-002 (button.002) [x / y inside its container]:  x 180  y 380   |   width: 200px; height: 60px
- .Donation_Progress_Label (Donation Progress Label) [x / y inside its container]:  x 260  y 520   |   width: 300px; height: 16px
- .Donation_Progress (Donation Progress) [x / y inside its container]:  x 260  y 560   |   width: 300px; height: 12px
- .Donation_Progress_Fill (Donation Progress Fill) [x / y inside its container]:  x 265  y 468   |   width: 12px; height: 12px
- #bw-p-007 (p.007) [x / y inside its container]:  x 380  y 700   |   width: 100px; height: 20px
- #bw-p-008 (p.008) [x / y inside its container]:  x 260  y 700   |   width: 90px; height: 20px
- #bw-p-009 (p.009) [x / y inside its container]:  x 260  y 660   |   width: 90px; height: 20px
- #bw-p-010 (p.010) [x / y inside its container]:  x 380  y 620   |   width: 100px; height: 20px
- #bw-button-003 (button.003) [x / y inside its container]:  x 440  y 380   |   width: 200px; height: 60px
- #bw-button-004 (button.004) [x / y inside its container]:  x 210  y 1140   |   width: 190px; height: 40px
- #bw-button-005 (button.005) [x / y inside its container]:  x 420  y 1140   |   width: 190px; height: 40px
- #bw-button-006 (button.006) [x / y inside its container]:  x 630  y 1140   |   width: 190px; height: 40px
- #bw-p-011 (p.011) [x / y inside its container]:  x 380  y 660   |   width: 100px; height: 20px
- #bw-p-012 (p.012) [x / y inside its container]:  x 260  y 620   |   width: 90px; height: 20px
Elements not listed keep the base design. Between the designed widths keep the proportions (scale x and width with the screen width, or use % / vw), so nothing overflows sideways - unless this file has an 'Automatic anchors' section: then follow that instead (nothing is scaled, every element keeps to the side it belongs to). When an element's width scales with the screen, its height scales the same way (the same unit, or aspect-ratio), so it keeps the shape it has here - a square stays a square. Every element is the SAME element on every platform: its colours, styles, text and animations do not change with the platform - only the places and sizes listed here do.

Phone layout - what changes from the base, inside @media (max-width: 605px) (same elements, same HTML; x / y / sizes are website px at the designed width 390px):
- #bw-p-001 (p.001):  x 10  y 10   |   width: 130px; height: 30px
- #bw-p-004 (p.004):  x 290  y 10   |   width: 10px; height: 20px
- .Front_Page_Time (p):  x 310  y 10   |   width: 70px; height: 20px
- .Front_Page_Date (p.002):  x 160  y 10   |   width: 120px; height: 20px
- .App_Counter (p.003):  x 100  y 60   |   width: 270px; height: 40px
- #bw-p-005 (p.005):  x 20  y 60   |   width: 70px; height: 40px
- #bw-Rectangle-007 (Rectangle.007):  width: 390px; height: 844px
- .Blend_EDA (Blend EDA):  x 140  y 120   |   width: 39.971px; height: 39.971px
- .Sun_Tzu_AI (Sun Tzu AI):  x 20  y 120   |   width: 39.971px; height: 39.971px
- .Kin_Flow (Kin Flow):  x 260  y 120   |   width: 39.971px; height: 39.971px
- .Blend_Web (Blend Web):  x 80  y 120   |   width: 39.971px; height: 39.971px
- .Blend_ACS (Blend ACS):  x 200  y 120   |   width: 39.971px; height: 39.971px
Elements not listed keep the base design. Between the designed widths keep the proportions (scale x and width with the screen width, or use % / vw), so nothing overflows sideways - unless this file has an 'Automatic anchors' section: then follow that instead (nothing is scaled, every element keeps to the side it belongs to). When an element's width scales with the screen, its height scales the same way (the same unit, or aspect-ratio), so it keeps the shape it has here - a square stays a square. Every element is the SAME element on every platform: its colours, styles, text and animations do not change with the platform - only the places and sizes listed here do.

NESTING  -  these elements are INSIDE another element (set with Put Inside)
In the HTML each one is a CHILD of its container element (not a sibling). Keep it exactly where it was designed: the container gets position: relative (or keeps its own absolute / fixed), the child is position: absolute with left = its x - the container's x and top = its y - the container's y. Whatever happens to the container happens to its contents: display: none, visibility, Show / Hide, opacity, moving. Do NOT repeat the container's display / visibility / opacity on the contents.
- .Donation_Progress_Fill (Donation Progress Fill) is inside .Donation_Progress (Donation Progress)
- .Sun_Tzu_AI_Content (Sun Tzu AI Content) is inside .Sun_Tzu_AI (Sun Tzu AI)
- #bw-button-001 (button.001) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-button-002 (button.002) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-button-003 (button.003) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-button-004 (button.004) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-button-005 (button.005) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-button-006 (button.006) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-div (div) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-div-001 (div.001) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-006 (p.006) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-007 (p.007) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-008 (p.008) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-009 (p.009) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-010 (p.010) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-011 (p.011) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- #bw-p-012 (p.012) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- .Donation_Progress (Donation Progress) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)
- .Donation_Progress_Label (Donation Progress Label) is inside .Sun_Tzu_AI_Content (Sun Tzu AI Content)

Coordinates are website pixels: 0,0 = top-left corner of the boundaries box, y goes down.
Shapes: use every "exact svg" / "exact shape" line as-is, so each outline is exactly as designed.

== SVG shapes (0) ==

== HTML elements (16) ==

Under Construction  <div>
  id="bw-Under-Construction"  (it has no class or id: use this id for it)
  x 0   y 0   width 820   height 1180

div  <div>
  id="bw-div"  (it has no class or id: use this id for it)
  x 0   y 0   width 1366   height 599

Sun Tzu AI Content  <div>
  x 0   y 0   width 1366   height 599

p.001  <p>
  id="bw-p-001"  (it has no class or id: use this id for it)
  x 30   y 30   width 170.9   height 52.2
  text "Sozin - X"

p.002  <p>
  x 180   y 30   width 156.5   height 26.1
  text "October 7th, 2026"

p.004  <p>
  id="bw-p-004"  (it has no class or id: use this id for it)
  x 340   y 30   width 26.1   height 26.1
  text "--"

p  <p>
  x 370   y 30   width 104.4   height 26.1
  text "4:20:00 pm"

div.001  <div>
  id="bw-div-001"  (it has no class or id: use this id for it)
  x 380   y 100   width 300   height 150

p.005  <p>
  id="bw-p-005"  (it has no class or id: use this id for it)
  x 100   y 180   width 78.3   height 52.2
  text "Apps"

p.003  <p>
  x 210   y 180   width 547.9   height 52.2
  text "--"

p.006  <p>
  id="bw-p-006"  (it has no class or id: use this id for it)
  x 600   y 180   width 160   height 50
  text "Sun Tzu AI"

Sun Tzu AI  <div>
  x 100   y 270   width 70   height 70

Blend Web  <div>
  x 200   y 270   width 70   height 70

Blend EDA  <div>
  x 300   y 270   width 70   height 70

Blend ACS  <div>
  x 400   y 270   width 70   height 70

Kin Flow  <div>
  x 500   y 270   width 70   height 70

== Main_*{} ==
Main Font: "Manrope"  (file: C:\Users\dtron\OneDrive\Documents\GitHub\DaryleCoin\fonts\Manrope-VariableFont_wght.ttf)
Main Font Size: 10px

/* the whole website */
@font-face {
  font-family: "Manrope";
  src: url("fonts/Manrope-VariableFont_wght.ttf") format("truetype");
}
body {
  font-family: "Manrope", sans-serif;
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

== CSS (31 elements) ==

/* <div>  object "Blend ACS" */
.Blend_ACS {
  width: 70px;
  height: 70px;
  background-color: #d9d9d9;
  box-shadow: 2px 2px 2px 0px #424242;
  border-radius: 0px;
  z-index: 1;
  opacity: 1;
}

/* <div>  object "Blend EDA" */
.Blend_EDA {
  width: 70px;
  height: 70px;
  background-color: #d9d9d9;
  box-shadow: 2px 2px 2px 0px #424242;
  border-radius: 0px;
  z-index: 1;
  opacity: 1;
}

/* <div>  object "Blend Web" */
.Blend_Web {
  width: 70px;
  height: 70px;
  background-color: #d9d9d9;
  box-shadow: 2px 2px 2px 0px #424242;
  border-radius: 0px;
  z-index: 1;
  opacity: 1;
}

/* <button>  object "button.001"  (no class or id: give it id="bw-button-001") */
#bw-button-001 {
  border-width: 0px;
  border-radius: 0px;
  background-color: #3c0a0000;
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  width: 316.5px;
  height: 66.6px;
  font-family: "Silkscreen";
}

/* <button>  object "button.002"  (no class or id: give it id="bw-button-002") */
#bw-button-002 {
  border-width: 0px;
  border-radius: 0px;
  background-color: #79140000;
  background-image: linear-gradient(0, #57575700 0%, #c52800 100%);
  width: 199.9px;
  height: 66.6px;
  font-family: "Silkscreen";
}

/* <button>  object "button.003"  (no class or id: give it id="bw-button-003") */
#bw-button-003 {
  border-width: 0px;
  border-radius: 0px;
  background-color: #79140000;
  background-image: linear-gradient(0, #57575700 0%, #c52800 100%);
  width: 199.9px;
  height: 66.6px;
  font-family: "Silkscreen";
}

/* <button>  object "button.004"  (no class or id: give it id="bw-button-004") */
#bw-button-004 {
  border-width: 0px;
  border-radius: 0px;
  background-color: #79140000;
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  width: 316.5px;
  height: 66.6px;
  font-family: "Silkscreen";
}

/* <button>  object "button.005"  (no class or id: give it id="bw-button-005") */
#bw-button-005 {
  border-width: 0px;
  border-radius: 0px;
  background-color: #79140000;
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  width: 316.5px;
  height: 66.6px;
  font-family: "Silkscreen";
}

/* <button>  object "button.006"  (no class or id: give it id="bw-button-006") */
#bw-button-006 {
  border-width: 0px;
  border-radius: 0px;
  background-color: #79140000;
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  width: 316.5px;
  height: 66.6px;
  font-family: "Silkscreen";
}

/* <div>  object "div"  (no class or id: give it id="bw-div") */
#bw-div {
  background-color: #00000018;
  background-image: linear-gradient(0, #181818 0%, #68686800 100%);
}

/* <div>  object "Donation Progress" */
.Donation_Progress {
  width: 499.8px;
  height: 20px;
  border-radius: 6px;
  border-width: 0px;
  background-color: #ffffff2e;
}

/* <div>  object "Donation Progress Fill" */
.Donation_Progress_Fill {
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border-width: 0px;
  background-image: linear-gradient(90deg, #c52800 0%, #ff7a1a 100%);
}

/* <p>  object "Donation Progress Label" */
.Donation_Progress_Label {
  width: 483.1px;
  height: 26.7px;
  font-size: 12px;
  color: #ffffff;
  text-align: center;
  font-family: "Silkscreen";
}

/* <div>  object "Kin Flow" */
.Kin_Flow {
  width: 70px;
  height: 70px;
  background-color: #d9d9d9;
  box-shadow: 2px 2px 2px 0px #424242;
  border-radius: 0px;
  z-index: 1;
  opacity: 1;
}

/* <p>  object "p" */
.Front_Page_Time {
  text-align: start;
  width: 104.4px;
  height: 26.1px;
  font-size: 11px;
  color: #ffffff;
  z-index: 1;
}

/* <p>  object "p.001"  (no class or id: give it id="bw-p-001") */
#bw-p-001 {
  z-index: 1;
  color: #ffffff;
  width: 170.9px;
  height: 52.2px;
  font-size: 24px;
  text-align: center;
  font-family: "Bank Gothic Light";
}

/* <p>  object "p.002" */
.Front_Page_Date {
  text-align: end;
  width: 156.5px;
  height: 26.1px;
  font-size: 11px;
  color: #ffffff;
  z-index: 1;
}

/* <p>  object "p.003" */
.App_Counter {
  width: 547.9px;
  height: 52.2px;
  font-size: 24px;
  color: #ffffff;
}

/* <p>  object "p.004"  (no class or id: give it id="bw-p-004") */
#bw-p-004 {
  text-align: center;
  width: 26.1px;
  height: 26.1px;
  font-size: 11px;
  color: #ffffff;
  z-index: 1;
}

/* <p>  object "p.005"  (no class or id: give it id="bw-p-005") */
#bw-p-005 {
  width: 78.3px;
  height: 52.2px;
  font-size: 24px;
  border-bottom-style: none;
  color: #ffffff;
}

/* <p>  object "p.006"  (no class or id: give it id="bw-p-006") */
#bw-p-006 {
  width: 160px;
  height: 50px;
  font-size: 48px;
  text-align: center;
  font-family: "Silkscreen";
}

/* <p>  object "p.007"  (no class or id: give it id="bw-p-007") */
#bw-p-007 {
  width: 166.6px;
  height: 33.3px;
  font-family: "Silkscreen";
}

/* <p>  object "p.008"  (no class or id: give it id="bw-p-008") */
#bw-p-008 {
  width: 149.9px;
  height: 33.3px;
  font-family: "Silkscreen";
}

/* <p>  object "p.009"  (no class or id: give it id="bw-p-009") */
#bw-p-009 {
  width: 149.9px;
  height: 33.3px;
  font-family: "Silkscreen";
}

/* <p>  object "p.010"  (no class or id: give it id="bw-p-010") */
#bw-p-010 {
  width: 166.6px;
  height: 33.3px;
  font-family: "Silkscreen";
}

/* <p>  object "p.011"  (no class or id: give it id="bw-p-011") */
#bw-p-011 {
  width: 166.6px;
  height: 33.3px;
  font-family: "Silkscreen";
}

/* <p>  object "p.012"  (no class or id: give it id="bw-p-012") */
#bw-p-012 {
  width: 149.9px;
  height: 33.3px;
  font-family: "Silkscreen";
}

/* <div>  object "Rectangle.007"  (no class or id: give it id="bw-Rectangle-007") */
#bw-Rectangle-007 {
  width: 1366px;
  height: 599px;
  background-color: #4d4d4d;
  z-index: 0;
  background-image: linear-gradient(138deg, #ffffff 0%, #ffffff 100%);
  background: #ffffff;
}

/* <div>  object "Sun Tzu AI" */
.Sun_Tzu_AI {
  width: 70px;
  height: 70px;
  background-color: #d9d9d9;
  box-shadow: 2px 2px 2px 0px #424242;
  border-radius: 0px;
  z-index: 1;
  opacity: 1;
  display: flex;
}

/* <div>  object "Sun Tzu AI Content" */
.Sun_Tzu_AI_Content {
  display: none;
  background: #2e2e2e;
  background-image: url("images/Wallpaper/katerina-kirillova-katerina-kirillova-friz-final.jpg");
  background-position: 39.53% 0%;
  background-size: 2094.2px 1178.3px;
}

/* <div>  object "Under Construction"  (no class or id: give it id="bw-Under-Construction") */
#bw-Under-Construction {
  display: flex;
  background-image: linear-gradient(0, #6b6b6bd9 0%, #41819d8e 100%);
  backdrop-filter: blur(10px);
}

== Node logic (AI prompt) ==
Build these interactions into the website. Each flow starts with its trigger, then does its numbered
steps in order (indented steps belong to the step above them). .name = elements with that class,
#name = the element with that id, #rrggbb = a color.
SCRIPTING: write ALL of the website's logic from these nodes - the JavaScript, and any other language a
node needs (server code, SQL for database nodes, API routes for network nodes, CSS @keyframes for effects).
The Node Window is the only source of behaviour: don't add interactions that aren't here, and don't leave
any flow out. "Node data" at the end lists every node's exact settings and wires.

Components (build these on the page):
   - Waves: 4 smooth, layered sine waves gently moving, 100px high; draw it on a canvas in the page background, behind everything (full size, sharp on retina, paused when off screen or the tab is hidden, calm for reduced motion).
   - Particle network: 80 slowly drifting dots joined by faint lines when close in #ffffff, reaching toward the mouse; draw it on a canvas in the page background, behind everything (full size, sharp on retina, paused when off screen or the tab is hidden, calm for reduced motion).
   - Animated linear gradient of linear-gradient(135deg, #d5cbd3, #848ab1) at 135deg; motion: it breathes - the gradient's length goes from 60% to 200% of the area and back (the bands visibly widen and narrow), one loop every 12s; distorted by moving waves: the color bands are bent into waves whose height is 30% of the area's height, about 1.5 waves across the width, travelling sideways a full wave every 4s. The movement must be plain to see at a glance, not a faint shimmer: repeat the colors across the area (first color again at the end, 2-3 bands visible) so moving them shows, and keep it smooth (60 fps); draw it on a canvas in the page background, behind everything (full size, sharp on retina, paused when off screen or the tab is hidden, calm for reduced motion).
   - Animated linear gradient of linear-gradient(135deg, #d5988b, #55aeb1) at 135deg; motion: it breathes - the gradient's length goes from 60% to 200% of the area and back (the bands visibly widen and narrow), one loop every 12s; distorted by moving waves: the color bands are bent into waves whose height is 30% of the area's height, about 1.5 waves across the width, travelling sideways a full wave every 4s. The movement must be plain to see at a glance, not a faint shimmer: repeat the colors across the area (first color again at the end, 2-3 bands visible) so moving them shows, and keep it smooth (60 fps); draw it on a canvas in the page background, behind everything (full size, sharp on retina, paused when off screen or the tab is hidden, calm for reduced motion).
   - App link "Sun Tzu AI": the address the site's own address + #sun-tzu-ai opens Sun Tzu AI directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Sun_Tzu_AI does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Sun Tzu AI". An unknown link just shows the normal page.
   - App link "Blend Web": the address the site's own address + #blend-web opens Blend Web directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_Web does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend Web". An unknown link just shows the normal page.
   - App link "Blend EDA": the address the site's own address + #blend-eda opens Blend EDA directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_EDA does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend EDA". An unknown link just shows the normal page.
   - App link "Blend ACS": the address the site's own address + #blend-acs opens Blend ACS directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_ACS does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend ACS". An unknown link just shows the normal page.
   - App link "Kin Flow": the address the site's own address + #kin-flow opens Kin Flow directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Kin_Flow does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Kin Flow". An unknown link just shows the normal page.
   - Responsive layout: the page uses the layout of the platform that fits the screen (the PLATFORMS section has each platform's layout as CSS media queries: Phone = screens up to 605px wide; Tablet = screens 606 - 1093px wide; Desktop = screens 1094px and wider). It switches by itself when the window is resized and when the device is turned, with no reload and without losing what is open or typed.

Flow 1 - When the mouse enters .Sun_Tzu_AI:
   1. Change the text of (no element chosen) to "Sun Tzu AI".
   and When the mouse leaves .Sun_Tzu_AI:
   1. Change the text of (no element chosen) to "--".

Flow 2 - When the mouse enters .Blen_Web:
   1. Change the text of (no element chosen) to "Blend Web".
   and When the mouse leaves .Blen_Web:
   1. Change the text of (no element chosen) to "--".

Flow 3 - When the mouse enters .Blend_ACS:
   1. Change the text of (no element chosen) to "Blend ACS".
   and When the mouse leaves .Blend_ACS:
   1. Change the text of (no element chosen) to "--".

Flow 4 - "SunTzuAI_OpenApp": when the user clicks or taps (touch) .Sun_Tzu_AI:
   Every time:
      1. Go on only if the gate "Sun Tzu AI" is open (it starts open; Open / Close Gate steps change it):
         If it's open:
            1.1. Close the gate "Sun Tzu AI".
            1.2. Animate .Sun_Tzu_AI with the Blender timeline animation of "Sun Tzu AI" (it has no keys in frames 0-12 yet) (linear easing).
            1.3. Wait 0.5 seconds, then go on.
            1.4. Set the CSS property display of .Sun_Tzu_AI_Content to flex.
            1.5. Fade .Sun_Tzu_AI_Content in (over 0.5s, ease-out easing).

Flow 5 - "BlendWeb_OpenApp": when the user clicks or taps (touch) .Blen_Web:
   (nothing connected yet)

Flow 6 - When the user double-clicks (or double-taps) .Sun_Tzu_AI:
   1. Animate .Sun_Tzu_AI with the Blender timeline animation of "Sun Tzu AI" (it has no keys yet yet) (linear easing).
   2. Open the gate "Sun Tzu AI".

Flow 7 - When the user double-clicks (or double-taps) .Blend_Web:
   (nothing connected yet)

Flow 8 - When the user double-clicks (or double-taps) .Blend_EDA:
   (nothing connected yet)

Flow 9 - "BlendEDA_OpenApp": when the user clicks or taps (touch) .Blend_EDA:
   (nothing connected yet)

Flow 10 - When the user double-clicks (or double-taps) .Blend_ACS:
   (nothing connected yet)

Flow 11 - "BlendACS_OpenApp": when the user clicks or taps (touch) .Blend_ACS:
   (nothing connected yet)

Flow 12 - "KinFow_OpenApp": when the user clicks or taps (touch) .Kin_Flow:
   (nothing connected yet)

Flow 13 - When the user double-clicks (or double-taps) .Kin_Flow:
   (nothing connected yet)

Flow 14 - When the mouse enters .Blend_EDA:
   1. Change the text of (no element chosen) to "Blend EDA".
   and When the mouse leaves .Blend_EDA:
   1. Change the text of (no element chosen) to "--".

Flow 15 - When the mouse enters .Kin_Flow:
   1. Change the text of (no element chosen) to "Kinflow".
   and When the mouse leaves .Kin_Flow:
   1. Change the text of (no element chosen) to "--".

Also do these (nothing triggers them yet - do them when the page loads unless they say otherwise):
   P1. Change the text of .Front_Page_Date to "now written as long (September 27, 2026) in the visitor's language (Intl)".
   P2. Change the text of .Front_Page_Time to "now written as 12:40:00 in the visitor's language (Intl)".

Elements used:
   .Sun_Tzu_AI = <div> (object Sun Tzu AI)
   .Sun_Tzu_AI_Content = <div> (object Sun Tzu AI Content)
   .Blen_Web (not in the website yet)
   .Blend_EDA = <div> (object Blend EDA)
   .Blend_ACS = <div> (object Blend ACS)
   .Kin_Flow = <div> (object Kin Flow)
   #sun-tzu-ai (not in the website yet)
   #blend-web (not in the website yet)
   .Blend_Web = <div> (object Blend Web)
   #blend-eda (not in the website yet)
   #blend-acs (not in the website yet)
   #kin-flow (not in the website yet)
   .Front_Page_Date = <p> "October 7th, 2026" (object p.002)
   .Front_Page_Time = <p> "4:20:00 pm" (object p)
   .Front_Page_Visual_Effects (not in the website yet)

Node data (every node in the Node Window: [id] node (folder): settings -> wires out):
   [n1] Format Date (Other Nodes > Date & Time): Date (empty = now) = (empty); As = long (September 27, 2026); Pattern = MMM d, yyyy; Language = (empty)  ->  Text -> n4.Text
   [n2] Format Date (Other Nodes > Date & Time): Date (empty = now) = (empty); As = custom pattern (below); Pattern = 12:40:00; Language = (empty)  ->  Text -> n5.Text
   [n3] Get Element by Class Name (Values): .Front_Page_Time  ->  Elements -> n5.Element
   [n4] Change Text (Actions): Element = .Front_Page_Date (wired); Text = now written as long (September 27, 2026) in the visitor's language (Intl) (wired)
   [n5] Change Text (Actions): Element = .Front_Page_Time (wired); Text = now written as 12:40:00 in the visitor's language (Intl) (wired)
   [n6] Get Element by Class Name (Values): .Front_Page_Date  ->  Elements -> n4.Element
   [n7] Hover (Triggers): Element = .Sun_Tzu_AI (wired)  ->  On Leave -> n10.Run, On Enter -> n11.Run
   [n8] Text (Values): Text = Sun Tzu AI  ->  Text -> n11.Text
   [n9] Text (Values): Text = --  ->  Text -> n10.Text
   [n10] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n11] Change Text (Actions): Element = (choose); Text = Sun Tzu AI (wired)
   [n12] Hover (Triggers): Element = .Blen_Web (wired)  ->  On Leave -> n14.Run, On Enter -> n15.Run
   [n13] Text (Values): Text = --  ->  Text -> n14.Text
   [n14] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n15] Change Text (Actions): Element = (choose); Text = Blend Web (wired)
   [n16] Text (Values): Text = Blend EDA  ->  Text -> n19.Text
   [n17] Text (Values): Text = --  ->  Text -> n18.Text
   [n18] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n19] Change Text (Actions): Element = (choose); Text = Blend EDA (wired)
   [n20] Hover (Triggers): Element = .Blend_ACS (wired)  ->  On Leave -> n23.Run, On Enter -> n24.Run
   [n21] Text (Values): Text = Blend ACS  ->  Text -> n24.Text
   [n22] Text (Values): Text = --  ->  Text -> n23.Text
   [n23] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n24] Change Text (Actions): Element = (choose); Text = Blend ACS (wired)
   [n25] Get Element by Class Name (Values): .Blend_EDA  ->  Elements -> n69.Element
   [n26] Text (Values): Text = Blend Web  ->  Text -> n15.Text
   [n27] Click Step (Triggers): "SunTzuAI_OpenApp" on .Sun_Tzu_AI  ->  Clicked -> n28.Run
   [n28] Gate (Flow > Branches): Gate name = Sun Tzu AI; Starts open = True  ->  Then -> n30.Run
   [n29] Get Element by Class Name (Values): .Sun_Tzu_AI  ->  Elements -> n48.Element, Elements -> n60.Opens (what a click on it does)
   [n30] Open / Close Gate (Actions): Gate name = Sun Tzu AI; Do = close it  ->  Next -> n46.Run
   [n31] Open / Close Gate (Actions): Gate name = Sun Tzu AI; Do = open it
   [n32] Reverse Animation (Animation > Play): Element = .Sun_Tzu_AI; Animated object = Sun Tzu AI; Animation (blank = its own) = Sun Tzu AI-Open/Close Animation; Play = all its keys; From marker = (choose); To marker = (choose); From frame = 1; To frame = 60; When it ends = stay on the first frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n31.Run
   [n33] Color (Values): #ffffff  ->  Color -> n39.Color
   [n34] Waves (Canvas > Canvas Effects): Element (empty = page) = .Front_Page_Visual_Effects (wired); Draw in = the page background (behind everything); Wave lines = 4; Height (px) = 100; Color = (empty)
   [n35] Color (Values): #848ab1  ->  Color -> n36.Color 2
   [n36] Gradient (Color > Make): Type = linear; Angle (deg) = 135; Color 1 = #d5cbd3 (wired); Color 2 = #848ab1 (wired); Color 3 (optional) = (empty)  ->  Gradient -> n40.Colors
   [n37] Get Element by Class Name (Values): .Front_Page_Visual_Effects  ->  Elements -> n34.Element (empty = page), Elements -> n39.Element (empty = page), Elements -> n40.Element (empty = page)
   [n38] Color (Values): #d5cbd3  ->  Color -> n36.Color 1
   [n39] Particle Network (Canvas > Canvas Effects): Element (empty = page) = .Front_Page_Visual_Effects (wired); Draw in = the page background (behind everything); Dots = 80; Color = #ffffff (wired); React to the mouse = True
   [n40] Animated Gradient (Canvas > Gradient Animation): Element (empty = page) = .Front_Page_Visual_Effects (wired); Draw in = the page background (behind everything); Type = linear; Colors = linear-gradient(135deg, #d5cbd3, #848ab1) (wired); Angle (deg) = 135; Motion = breathe (grow / shrink); Seconds per loop = 12; Distortion = waves; Distortion amount (0-100) = 30  ->  Next -> n41.Run
   [n41] Wait (Flow): Seconds = 1  ->  Then -> n45.Run
   [n42] Color (Values): #d5988b  ->  Color -> n44.Color 1
   [n43] Color (Values): #55aeb1  ->  Color -> n44.Color 2
   [n44] Gradient (Color > Make): Type = linear; Angle (deg) = 135; Color 1 = #d5988b (wired); Color 2 = #55aeb1 (wired); Color 3 (optional) = (empty)  ->  Gradient -> n45.Colors
   [n45] Animated Gradient (Canvas > Gradient Animation): Element (empty = page) = (choose); Draw in = the page background (behind everything); Type = linear; Colors = linear-gradient(135deg, #d5988b, #55aeb1) (wired); Angle (deg) = 135; Motion = breathe (grow / shrink); Seconds per loop = 12; Distortion = waves; Distortion amount (0-100) = 30
   [n46] Timeline Animation (Effects > From Blender): Element = .Sun_Tzu_AI; Animated object = Sun Tzu AI; Action (blank = its own) = Sun Tzu AI-Open/Close Animation; Play = a frame range; From marker = (choose); To marker = (choose); From frame = 0; To frame = 12; When it ends = stay on the last frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n65.Run
   [n47] Click Step (Triggers): "BlendWeb_OpenApp" on .Blen_Web
   [n48] Double Click (Triggers > Mouse & Touch): Element = .Sun_Tzu_AI (wired)  ->  Then -> n32.Run
   [n49] Double Click (Triggers > Mouse & Touch): Element = .Blend_Web (wired)
   [n50] Get Element by Class Name (Values): .Blend_Web  ->  Elements -> n49.Element, Elements -> n61.Opens (what a click on it does)
   [n51] Double Click (Triggers > Mouse & Touch): Element = .Blend_EDA (wired)
   [n52] Get Element by Class Name (Values): .Blend_EDA  ->  Elements -> n51.Element, Elements -> n62.Opens (what a click on it does)
   [n53] Click Step (Triggers): "BlendEDA_OpenApp" on .Blend_EDA
   [n54] Double Click (Triggers > Mouse & Touch): Element = .Blend_ACS (wired)
   [n55] Click Step (Triggers): "BlendACS_OpenApp" on .Blend_ACS
   [n56] Click Step (Triggers): "KinFow_OpenApp" on .Kin_Flow
   [n57] Get Element by Class Name (Values): .Kin_Flow  ->  Elements -> n58.Element, Elements -> n64.Opens (what a click on it does)
   [n58] Double Click (Triggers > Mouse & Touch): Element = .Kin_Flow (wired)
   [n59] Get Element by Class Name (Values): .Blend_ACS  ->  Elements -> n54.Element, Elements -> n63.Opens (what a click on it does)
   [n60] App Link (Links & QR > App Links): App name = Sun Tzu AI; Link name (blank = from the name) = sun-tzu-ai; Opens (what a click on it does) = .Sun_Tzu_AI (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n61] App Link (Links & QR > App Links): App name = Blend Web; Link name (blank = from the name) = blend-web; Opens (what a click on it does) = .Blend_Web (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n62] App Link (Links & QR > App Links): App name = Blend EDA; Link name (blank = from the name) = blend-eda; Opens (what a click on it does) = .Blend_EDA (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n63] App Link (Links & QR > App Links): App name = Blend ACS; Link name (blank = from the name) = blend-acs; Opens (what a click on it does) = .Blend_ACS (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n64] App Link (Links & QR > App Links): App name = Kin Flow; Link name (blank = from the name) = kin-flow; Opens (what a click on it does) = .Kin_Flow (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n65] Wait (Flow): Seconds = 0.5  ->  Then -> n67.Run
   [n66] Get Element by Class Name (Values): .Sun_Tzu_AI_Content  ->  Elements -> n67.Element, Elements -> n68.Element
   [n67] display (CSS > Display): Element = .Sun_Tzu_AI_Content (wired); Value = flex; Change over (s) = 0; Back to its stylesheet value = False  ->  Next -> n68.Run
   [n68] Fade (Effects): Element = .Sun_Tzu_AI_Content (wired); Fade = in (appear); To opacity (0-1) = 1; Seconds = 0.5; Delay (s) = 0; Easing = ease-out; Repeat = Once; Back and forth = False; Stagger (s) = 0
   [n69] Hover (Triggers): Element = .Blend_EDA (wired)  ->  On Leave -> n18.Run, On Enter -> n19.Run
   [n70] Get Element by Class Name (Values): .Sun_Tzu_AI  ->  Elements -> n7.Element
   [n71] Get Element by Class Name (Values): .Blen_Web  ->  Elements -> n12.Element
   [n72] Get Element by Class Name (Values): .Blend_ACS  ->  Elements -> n20.Element
   [n73] Hover (Triggers): Element = .Kin_Flow (wired)  ->  On Leave -> n75.Run, On Enter -> n76.Run
   [n74] Text (Values): Text = --  ->  Text -> n75.Text
   [n75] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n76] Change Text (Actions): Element = (choose); Text = Kinflow (wired)
   [n77] Text (Values): Text = Kinflow  ->  Text -> n76.Text
   [n78] Get Element by Class Name (Values): .Kin_Flow  ->  Elements -> n73.Element
   [n79] Responsive Layout (Platforms): Also when the window is resized = True; Also when the device is turned = True; Animate the change (s) = 0


Animations  (24 fps; px = website pixels; transforms are relative to where each element sits)
========================================================================

Timeline animations (Animations panel):
   (no animation has been created)

Animation nodes (Node Window):

- Reverse Animation node (runs when: Double Click):
   Animate .Sun_Tzu_AI with the Blender timeline animation of "Sun Tzu AI" (it has no keys yet yet) (linear easing).

- Timeline Animation node (runs on Click Step 1):
   Animate .Sun_Tzu_AI with the Blender timeline animation of "Sun Tzu AI" (it has no keys in frames 0-12 yet) (linear easing).

- Fade node (runs on Click Step 1):
   Fade .Sun_Tzu_AI_Content in (over 0.5s, ease-out easing).

Anchors  (points pinned to the page's edges; page = 1366 x 599 px, x right, y down from its top-left)
========================================================================
An anchored point keeps its distance to the edge(s) it's anchored to when the page changes size: right /
bottom anchors move with that edge, left + right (or top + bottom) keep the point's place as a percentage.
Build the layout so each element behaves like this at every screen size (CSS left / right / top / bottom,
percentages, or flex / grid that gives the same result).

(nothing is anchored yet: use the Anchor tool to pin points to the page's edges)


== Shader information (15 elements) ==
These are the effects Blender draws with shaders: shadows, blur, glass (backdrop-filter), gradients and
see-through. The website must show every one of them exactly. For each element below:
  1. Put its CSS in the stylesheet as written (it's also in the CSS section).
  2. An element marked "no clip-path" must NOT have a clip-path (remove one if the page has it): its
     rounded corners come from border-radius, and a clip-path cuts off the shadow around it.
  3. No parent of it may have overflow: hidden / clip closer than the shadow reaches, and nothing may
     cover it (keep the z-order from the coordinates).
  4. backdrop-filter also needs -webkit-backdrop-filter, and a background that is partly see-through.

/* <div>  object "Blend ACS"  -  no clip-path */
.Blend_ACS {
  box-shadow: 2px 2px 2px 0px #424242;
  opacity: 1;
  border-radius: 0px;
}

/* <div>  object "Blend EDA"  -  no clip-path */
.Blend_EDA {
  box-shadow: 2px 2px 2px 0px #424242;
  opacity: 1;
  border-radius: 0px;
}

/* <div>  object "Blend Web"  -  no clip-path */
.Blend_Web {
  box-shadow: 2px 2px 2px 0px #424242;
  opacity: 1;
  border-radius: 0px;
}

/* <button>  object "button.001"  -  no clip-path */
#bw-button-001 {
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  border-radius: 0px;
}

/* <button>  object "button.002"  -  no clip-path */
#bw-button-002 {
  background-image: linear-gradient(0, #57575700 0%, #c52800 100%);
  border-radius: 0px;
}

/* <button>  object "button.003"  -  no clip-path */
#bw-button-003 {
  background-image: linear-gradient(0, #57575700 0%, #c52800 100%);
  border-radius: 0px;
}

/* <button>  object "button.004"  -  no clip-path */
#bw-button-004 {
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  border-radius: 0px;
}

/* <button>  object "button.005"  -  no clip-path */
#bw-button-005 {
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  border-radius: 0px;
}

/* <button>  object "button.006"  -  no clip-path */
#bw-button-006 {
  background-image: linear-gradient(0, #57575700 0%, #8a1c00 100%);
  border-radius: 0px;
}

/* <div>  object "div"  -  no clip-path */
#bw-div {
  background-image: linear-gradient(0, #181818 0%, #68686800 100%);
}

/* <div>  object "Donation Progress Fill"  -  no clip-path */
.Donation_Progress_Fill {
  background-image: linear-gradient(90deg, #c52800 0%, #ff7a1a 100%);
  border-radius: 6px;
}

/* <div>  object "Kin Flow"  -  no clip-path */
.Kin_Flow {
  box-shadow: 2px 2px 2px 0px #424242;
  opacity: 1;
  border-radius: 0px;
}

/* <div>  object "Rectangle.007"  -  no clip-path */
#bw-Rectangle-007 {
  background-image: linear-gradient(138deg, #ffffff 0%, #ffffff 100%);
}

/* <div>  object "Sun Tzu AI"  -  no clip-path */
.Sun_Tzu_AI {
  box-shadow: 2px 2px 2px 0px #424242;
  opacity: 1;
  border-radius: 0px;
}

/* <div>  object "Under Construction"  -  no clip-path */
#bw-Under-Construction {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-image: linear-gradient(0, #6b6b6bd9 0%, #41819d8e 100%);
}


