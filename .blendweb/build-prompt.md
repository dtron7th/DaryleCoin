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
Template: Blend Web data  -  Windows PC · Chrome  1366 x 599 px
Blender file: C:\Users\dtron\OneDrive\Documents\GitHub\DaryleCoin\Blend Web Test.blend

---

Blend Web data  -  Windows PC · Chrome  1366 x 599 px

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

NESTING  -  these elements are INSIDE another element (set with Put Inside)
In the HTML each one is a CHILD of its container element (not a sibling). Keep it exactly where it was designed: the container gets position: relative (or keeps its own absolute / fixed), the child is position: absolute with left = its x - the container's x and top = its y - the container's y. Whatever happens to the container happens to its contents: display: none, visibility, Show / Hide, opacity, moving. Do NOT repeat the container's display / visibility / opacity on the contents.
- .Sun_Tzu_AI_Content (Sun_Szu_AI_Content) is inside .Sun_Tzu_AI (Sun Tzu AI)
- #bw-Circle (Circle) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)
- #bw-Circle-001 (Circle.001) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)
- #bw-Circle-002 (Circle.002) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)
- #bw-Circle-003 (Circle.003) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)
- #bw-Circle-004 (Circle.004) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)
- #bw-Rectangle (Rectangle) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)
- #bw-STU_Title (STU_Title) is inside .Sun_Tzu_AI_Content (Sun_Szu_AI_Content)

Coordinates are website pixels: 0,0 = top-left corner of the boundaries box, y goes down.
Shapes: use every "exact svg" / "exact shape" line as-is, so each outline is exactly as designed.

== SVG shapes (0) ==

== HTML elements (20) ==

p.001  <p>
  id="bw-p-001"  (it has no class or id: use this id for it)
  x 20   y 20   width 131   height 40
  text "Sozin - X"

p.002  <p>
  x 140   y 20   width 120   height 20
  text "October 7th, 2026"

p.004  <p>
  id="bw-p-004"  (it has no class or id: use this id for it)
  x 260   y 20   width 20   height 20
  text "--"

p  <p>
  x 280   y 20   width 80   height 20
  text "4:20:00 pm"

Rectangle.005  <div>
  id="bw-Rectangle-005"  (it has no class or id: use this id for it)
  x 840   y 120   width 440   height 420

p.005  <p>
  id="bw-p-005"  (it has no class or id: use this id for it)
  x 80   y 140   width 60   height 40
  text "Apps"

p.003  <p>
  x 160   y 140   width 420   height 40
  text "--"

Sun Tzu AI  <div>
  x 80   y 200   width 140   height 140

Sun_Szu_AI_Content  <div>
  x 80   y 200   width 140   height 140
  shape d="M 80 205 L 80.04 204.35 L 80.17 203.71 L 80.38 203.09 L 80.67 202.5 L 81.03 201.96 L 81.46 201.46 L 81.96 201.03 L 82.5 200.67 L 83.09 200.38 L 83.71 200.17 L 84.35 200.04 L 85 200 L 215 200 L 215.65 200.04 L 216.29 200.17 L 216.91 200.38 L 217.5 200.67 L 218.04 201.03 L 218.54 201.46 L 218.97 201.96 L 219.33 202.5 L 219.62 203.09 L 219.83 203.71 L 219.96 204.35 L 220 205 L 220 335 L 219.96 335.65 L 219.83 336.29 L 219.62 336.91 L 219.33 337.5 L 218.97 338.04 L 218.54 338.54 L 218.04 338.97 L 217.5 339.33 L 216.91 339.62 L 216.29 339.83 L 215.65 339.96 L 215 340 L 85 340 L 84.35 339.96 L 83.71 339.83 L 83.09 339.62 L 82.5 339.33 L 81.96 338.97 L 81.46 338.54 L 81.03 338.04 L 80.67 337.5 L 80.38 336.91 L 80.17 336.29 L 80.04 335.65 L 80 335 Z"
  exact shape (use as-is): clip-path: path('M 0 5 L 0.04 4.35 L 0.17 3.71 L 0.38 3.09 L 0.67 2.5 L 1.03 1.96 L 1.46 1.46 L 1.96 1.03 L 2.5 0.67 L 3.09 0.38 L 3.71 0.17 L 4.35 0.04 L 5 0 L 135 0 L 135.65 0.04 L 136.29 0.17 L 136.91 0.38 L 137.5 0.67 L 138.04 1.03 L 138.54 1.46 L 138.97 1.96 L 139.33 2.5 L 139.62 3.09 L 139.83 3.71 L 139.96 4.35 L 140 5 L 140 135 L 139.96 135.65 L 139.83 136.29 L 139.62 136.91 L 139.33 137.5 L 138.97 138.04 L 138.54 138.54 L 138.04 138.97 L 137.5 139.33 L 136.91 139.62 L 136.29 139.83 L 135.65 139.96 L 135 140 L 5 140 L 4.35 139.96 L 3.71 139.83 L 3.09 139.62 L 2.5 139.33 L 1.96 138.97 L 1.46 138.54 L 1.03 138.04 L 0.67 137.5 L 0.38 136.91 L 0.17 136.29 L 0.04 135.65 L 0 135 Z');

Blend Web  <div>
  x 260   y 200   width 140   height 140

Blend EDA  <div>
  x 440   y 200   width 140   height 140

Blend ACS  <div>
  x 620   y 200   width 140   height 140

STU_Title  <p>
  id="bw-STU_Title"  (it has no class or id: use this id for it)
  x 100   y 220   width 140.46   height 22
  text "A paragraph of text."

Circle  <div>
  id="bw-Circle"  (it has no class or id: use this id for it)
  x 120   y 260   width 40   height 40

Circle.001  <div>
  id="bw-Circle-001"  (it has no class or id: use this id for it)
  x 180   y 260   width 20   height 20

Rectangle  <div>
  id="bw-Rectangle"  (it has no class or id: use this id for it)
  x 160   y 280   width 180   height 20

Circle.004  <div>
  id="bw-Circle-004"  (it has no class or id: use this id for it)
  x 180   y 320   width 20   height 20

Circle.002  <div>
  id="bw-Circle-002"  (it has no class or id: use this id for it)
  x 200   y 320   width 40   height 40

Circle.003  <div>
  id="bw-Circle-003"  (it has no class or id: use this id for it)
  x 140   y 340   width 20   height 20

Kin Flow  <div>
  x 80   y 380   width 140   height 140

== Main_*{} ==
Main Font: "Manrope"  (file: C:\Users\dtron\OneDrive\Desktop\Sun Tzu AI Kickstarter\Website\fonts\Manrope-VariableFont_wght.ttf)
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

== CSS (21 elements) ==

/* <div>  object "Blend ACS" */
.Blend_ACS {
  width: 140px;
  height: 140px;
  background-color: #d9d9d9;
  box-shadow: 0px 2px 6px 0 9e9e9e;
  border-radius: 5px;
  z-index: 1;
  opacity: 1;
}

/* <div>  object "Blend EDA" */
.Blend_EDA {
  width: 140px;
  height: 140px;
  background-color: #d9d9d9;
  box-shadow: 0px 2px 6px 0px 9e9e9e;
  border-radius: 5px;
  z-index: 1;
  opacity: 1;
}

/* <div>  object "Blend Web" */
.Blend_Web {
  width: 140px;
  height: 140px;
  background-color: #d9d9d9;
  box-shadow: 0px 2px 6px 0px 9e9e9e;
  border-radius: 5px;
  z-index: 1;
  opacity: 1;
}

/* <div>  object "Circle"  (no class or id: give it id="bw-Circle") */
#bw-Circle {
  width: 40px;
  height: 40px;
  background-color: #676767;
  border-radius: 50%;
  z-index: 2;
}

/* <div>  object "Circle.001"  (no class or id: give it id="bw-Circle-001") */
#bw-Circle-001 {
  width: 20px;
  height: 20px;
  background-color: #676767;
  border-radius: 50%;
  z-index: 2;
}

/* <div>  object "Circle.002"  (no class or id: give it id="bw-Circle-002") */
#bw-Circle-002 {
  width: 40px;
  height: 40px;
  background-color: #676767;
  border-radius: 50%;
  z-index: 2;
}

/* <div>  object "Circle.003"  (no class or id: give it id="bw-Circle-003") */
#bw-Circle-003 {
  width: 20px;
  height: 20px;
  background-color: #676767;
  border-radius: 50%;
  z-index: 2;
}

/* <div>  object "Circle.004"  (no class or id: give it id="bw-Circle-004") */
#bw-Circle-004 {
  width: 20px;
  height: 20px;
  background-color: #676767;
  border-radius: 50%;
  z-index: 2;
}

/* <div>  object "Kin Flow" */
.Kin_Flow {
  width: 140px;
  height: 140px;
  background-color: #d9d9d9;
  box-shadow: 0px 2px 6px 0px 9e9e9e;
  border-radius: 5px;
  z-index: 1;
  opacity: 1;
}

/* <p>  object "p" */
.Front_Page_Time {
  text-align: start;
  width: 80px;
  height: 20px;
  font-size: 11px;
  color: #ffffff;
  z-index: 1;
}

/* <p>  object "p.001"  (no class or id: give it id="bw-p-001") */
#bw-p-001 {
  z-index: 1;
  color: #ffffff;
  width: 131px;
  height: 40px;
  font-size: 24px;
  text-align: center;
  font-family: "Bank Gothic Light";
}

/* <p>  object "p.002" */
.Front_Page_Date {
  text-align: end;
  width: 120px;
  height: 20px;
  font-size: 11px;
  color: #ffffff;
  z-index: 1;
}

/* <p>  object "p.003" */
.App_Counter {
  width: 420px;
  height: 40px;
  font-size: 24px;
  color: #ffffff;
}

/* <p>  object "p.004"  (no class or id: give it id="bw-p-004") */
#bw-p-004 {
  text-align: center;
  width: 20px;
  height: 20px;
  font-size: 11px;
  color: #ffffff;
  z-index: 1;
}

/* <p>  object "p.005"  (no class or id: give it id="bw-p-005") */
#bw-p-005 {
  width: 60px;
  height: 40px;
  font-size: 24px;
  border-bottom-style: none;
  color: #ffffff;
}

/* <div>  object "Rectangle"  (no class or id: give it id="bw-Rectangle") */
#bw-Rectangle {
  width: 180px;
  height: 20px;
  background-color: #2e327f;
  z-index: 2;
  background: #5a3d6c;
  display: block;
}

/* <div>  object "Rectangle.005"  (no class or id: give it id="bw-Rectangle-005") */
#bw-Rectangle-005 {
  width: 440px;
  height: 420px;
  background-color: #d9d9d9;
  box-shadow: 0 2px 6px #9e9e9e;
  border-radius: 5px;
  z-index: 1;
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

/* <p>  object "STU_Title"  (no class or id: give it id="bw-STU_Title") */
#bw-STU_Title {
  z-index: 2;
  color: #767676;
}

/* <div>  object "Sun Tzu AI" */
.Sun_Tzu_AI {
  width: 140px;
  height: 140px;
  background-color: #d9d9d9;
  box-shadow: 0px 2px 6px 0 9e9e9e;
  border-radius: 5px;
  z-index: 1;
  opacity: 1;
}

/* <div>  object "Sun_Szu_AI_Content" */
.Sun_Tzu_AI_Content {
  width: 140px;
  height: 140px;
  background-color: none;
  z-index: 1;
  display: none;
  opacity: 1;
  border-radius: 5px;
  box-shadow: 0px 2px 6px 0 9e9e9e;
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
   - Link delay: an app opened by its link (any app link) waits 1 second after the page is ready before it opens; a normal click on the app still opens it at once.
   - App link "Sun Tzu AI": the address the site's own address + #sun-tzu-ai opens Sun Tzu AI directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Sun_Tzu_AI does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Sun Tzu AI". An unknown link just shows the normal page.
   - App link "Blend Web": the address the site's own address + #blend-web opens Blend Web directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_Web does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend Web". An unknown link just shows the normal page.
   - App link "Blend EDA": the address the site's own address + #blend-eda opens Blend EDA directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_EDA does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend EDA". An unknown link just shows the normal page.
   - App link "Blend ACS": the address the site's own address + #blend-acs opens Blend ACS directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Blend_ACS does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Blend ACS". An unknown link just shows the normal page.
   - App link "Kin Flow": the address the site's own address + #kin-flow opens Kin Flow directly - when the page loads with that address (typed, a link, or a scanned QR code), wait until the page is ready, then wait 1 more second, and then do exactly what a click / tap on .Kin_Flow does, without the visitor clicking (run that element's click flow once; if it has an opening animation, play it); when it is opened by a click, put the link in the address bar (history.pushState), and take it out again when it closes; the browser's Back button closes it (popstate) instead of leaving the site; while it is open the tab title is "Kin Flow". An unknown link just shows the normal page.

Flow 1 - When the mouse enters .Sun_Tzu_AI:
   1. Change the text of (no element chosen) to "Sun Tzu AI".
   and When the mouse leaves .Sun_Tzu_AI:
   1. Change the text of (no element chosen) to "--".

Flow 2 - When the mouse enters .Blen_Web:
   1. Change the text of (no element chosen) to "Blend Web".
   and When the mouse leaves .Blen_Web:
   1. Change the text of (no element chosen) to "--".

Flow 3 - When the mouse enters .Blend_EDA:
   1. Change the text of (no element chosen) to "Blend EDA".
   and When the mouse leaves .Blend_EDA:
   1. Change the text of (no element chosen) to "--".

Flow 4 - When the mouse enters .Blend_ACS:
   1. Change the text of (no element chosen) to "Owl".
   and When the mouse leaves .Blend_ACS:
   1. Change the text of (no element chosen) to "--".

Flow 5 - "SunTzuAI_OpenApp": when the user clicks or taps (touch) .Sun_Tzu_AI:
   Every time:
      1. Go on only if the gate "Sun Tzu AI" is open (it starts open; Open / Close Gate steps change it):
         If it's open:
            1.1. Close the gate "Sun Tzu AI".
            1.2. Animate .Sun_Tzu_AI exactly like the Blender timeline animation "Sun Tzu AI-Open/Close Animation" on "Sun Tzu AI" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).
            1.3. Wait 1 seconds, then go on.
            1.4. Set the CSS property display of .Sun_Tzu_AI_Content to flex.
            1.5. Fade .Sun_Tzu_AI_Content in (over 0.6s, ease-out easing).

Flow 6 - "BlendWeb_OpenApp": when the user clicks or taps (touch) .Blen_Web:
   Every time:
      1. Go on only if the gate "Blend Web" is open (it starts open; Open / Close Gate steps change it):
         If it's open:
            1.1. Close the gate "Blend Web".
            1.2. Animate .Blend_Web exactly like the Blender timeline animation "Blend Web-Open/Close Animation" on "Blend Web" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-web-blend-web-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-web-blend-web-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).

Flow 7 - When the user double-clicks (or double-taps) .Sun_Tzu_AI:
   1. Animate .Sun_Tzu_AI exactly like the Blender timeline animation "Sun Tzu AI-Open/Close Animation" on "Sun Tzu AI" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   2. Open the gate "Sun Tzu AI".

Flow 8 - When the user double-clicks (or double-taps) .Blend_Web:
   1. Animate .Blend_Web exactly like the Blender timeline animation "Blend Web-Open/Close Animation" on "Blend Web" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-web-blend-web-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-web-blend-web-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-web-blend-web-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-web-blend-web-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-web-blend-web-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   2. Open the gate "Blend Web".

Flow 9 - When the user double-clicks (or double-taps) .Blend_EDA:
   1. Animate .Blend_EDA exactly like the Blender timeline animation "Blend EDA-Open/Close Animation" on "Blend EDA" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-eda-blend-eda-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-eda-blend-eda-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   2. Open the gate "Blend EDA".

Flow 10 - "BlendEDA_OpenApp": when the user clicks or taps (touch) .Blend_EDA:
   Every time:
      1. Go on only if the gate "Blend EDA" is open (it starts open; Open / Close Gate steps change it):
         If it's open:
            1.1. Close the gate "Blend EDA".
            1.2. Animate .Blend_EDA exactly like the Blender timeline animation "Blend EDA-Open/Close Animation" on "Blend EDA" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-eda-blend-eda-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).

Flow 11 - When the user double-clicks (or double-taps) .Blend_ACS:
   1. Animate .Blend_ACS exactly like the Blender timeline animation "Blend ACS-Open/Close Animation" on "Blend ACS" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-acs-blend-acs-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-acs-blend-acs-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   2. Open the gate "Blend ACS".

Flow 12 - "BlendACS_OpenApp": when the user clicks or taps (touch) .Blend_ACS:
   Every time:
      1. Go on only if the gate "Blend ACS" is open (it starts open; Open / Close Gate steps change it):
         If it's open:
            1.1. Close the gate "Blend ACS".
            1.2. Animate .Blend_ACS exactly like the Blender timeline animation "Blend ACS-Open/Close Animation" on "Blend ACS" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-acs-blend-acs-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).

Flow 13 - "KinFow_OpenApp": when the user clicks or taps (touch) .Kin_Flow:
   Every time:
      1. Go on only if the gate "Kin Flow" is open (it starts open; Open / Close Gate steps change it):
         If it's open:
            1.1. Close the gate "Kin Flow".
            1.2. Animate .Kin_Flow exactly like the Blender timeline animation "Kin Flow-Open/Close Animation" on "Kin Flow" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-kin-flow-kin-flow-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).

Flow 14 - When the user double-clicks (or double-taps) .Kin_Flow:
   1. Animate .Kin_Flow exactly like the Blender timeline animation "Kin Flow-Open/Close Animation" on "Kin Flow" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-kin-flow-kin-flow-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-kin-flow-kin-flow-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   2. Open the gate "Kin Flow".

Also do these (nothing triggers them yet - do them when the page loads unless they say otherwise):
   P1. Change the text of .Front_Page_Date to "now written as long (September 27, 2026) in the visitor's language (Intl)".
   P2. Change the text of .Front_Page_Time to "now written as 12:40:00 in the visitor's language (Intl)".

Elements used:
   .Sun_Tzu_AI = <div> (object Sun Tzu AI)
   .Sun_Tzu_AI_Content = <div> (object Sun_Szu_AI_Content)
   .Blen_Web (not in the website yet)
   .Blend_Web = <div> (object Blend Web)
   .Blend_EDA = <div> (object Blend EDA)
   .Blend_ACS = <div> (object Blend ACS)
   .Kin_Flow = <div> (object Kin Flow)
   #sun-tzu-ai (not in the website yet)
   #blend-web (not in the website yet)
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
   [n16] Hover (Triggers): Element = .Blend_EDA (wired)  ->  On Leave -> n19.Run, On Enter -> n20.Run
   [n17] Text (Values): Text = Blend EDA  ->  Text -> n20.Text
   [n18] Text (Values): Text = --  ->  Text -> n19.Text
   [n19] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n20] Change Text (Actions): Element = (choose); Text = Blend EDA (wired)
   [n21] Hover (Triggers): Element = .Blend_ACS (wired)  ->  On Leave -> n24.Run, On Enter -> n25.Run
   [n22] Text (Values): Text = Owl  ->  Text -> n25.Text
   [n23] Text (Values): Text = --  ->  Text -> n24.Text
   [n24] Change Text (Actions): Element = (choose); Text = -- (wired)
   [n25] Change Text (Actions): Element = (choose); Text = Owl (wired)
   [n26] Get Element by Class Name (Values): .Blen_Web  ->  Elements -> n12.Element
   [n27] Get Element by Class Name (Values): .Blend_EDA  ->  Elements -> n16.Element
   [n28] Get Element by Class Name (Values): .Blend_ACS  ->  Elements -> n21.Element
   [n29] Text (Values): Text = Blend Web  ->  Text -> n15.Text
   [n30] Click Step (Triggers): "SunTzuAI_OpenApp" on .Sun_Tzu_AI  ->  Clicked -> n31.Run
   [n31] Gate (Flow > Branches): Gate name = Sun Tzu AI; Starts open = True  ->  Then -> n33.Run
   [n32] Get Element by Class Name (Values): .Sun_Tzu_AI  ->  Elements -> n57.Element, Elements -> n85.Opens (what a click on it does)
   [n33] Open / Close Gate (Actions): Gate name = Sun Tzu AI; Do = close it  ->  Next -> n53.Run
   [n34] Open / Close Gate (Actions): Gate name = Sun Tzu AI; Do = open it
   [n35] Reverse Animation (Animation > Play): Element = .Sun_Tzu_AI; Animated object = Sun Tzu AI; Animation (blank = its own) = Sun Tzu AI-Open/Close Animation; Play = all its keys; From marker = (choose); To marker = (choose); From frame = 1; To frame = 60; When it ends = stay on the first frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n34.Run
   [n36] Color (Values): #ffffff  ->  Color -> n42.Color
   [n37] Waves (Canvas > Canvas Effects): Element (empty = page) = .Front_Page_Visual_Effects (wired); Draw in = the page background (behind everything); Wave lines = 4; Height (px) = 100; Color = (empty)
   [n38] Color (Values): #848ab1  ->  Color -> n39.Color 2
   [n39] Gradient (Color > Make): Type = linear; Angle (deg) = 135; Color 1 = #d5cbd3 (wired); Color 2 = #848ab1 (wired); Color 3 (optional) = (empty)  ->  Gradient -> n43.Colors
   [n40] Get Element by Class Name (Values): .Front_Page_Visual_Effects  ->  Elements -> n37.Element (empty = page), Elements -> n42.Element (empty = page), Elements -> n43.Element (empty = page)
   [n41] Color (Values): #d5cbd3  ->  Color -> n39.Color 1
   [n42] Particle Network (Canvas > Canvas Effects): Element (empty = page) = .Front_Page_Visual_Effects (wired); Draw in = the page background (behind everything); Dots = 80; Color = #ffffff (wired); React to the mouse = True
   [n43] Animated Gradient (Canvas > Gradient Animation): Element (empty = page) = .Front_Page_Visual_Effects (wired); Draw in = the page background (behind everything); Type = linear; Colors = linear-gradient(135deg, #d5cbd3, #848ab1) (wired); Angle (deg) = 135; Motion = breathe (grow / shrink); Seconds per loop = 12; Distortion = waves; Distortion amount (0-100) = 30  ->  Next -> n44.Run
   [n44] Wait (Flow): Seconds = 1  ->  Then -> n48.Run
   [n45] Color (Values): #d5988b  ->  Color -> n47.Color 1
   [n46] Color (Values): #55aeb1  ->  Color -> n47.Color 2
   [n47] Gradient (Color > Make): Type = linear; Angle (deg) = 135; Color 1 = #d5988b (wired); Color 2 = #55aeb1 (wired); Color 3 (optional) = (empty)  ->  Gradient -> n48.Colors
   [n48] Animated Gradient (Canvas > Gradient Animation): Element (empty = page) = (choose); Draw in = the page background (behind everything); Type = linear; Colors = linear-gradient(135deg, #d5988b, #55aeb1) (wired); Angle (deg) = 135; Motion = breathe (grow / shrink); Seconds per loop = 12; Distortion = waves; Distortion amount (0-100) = 30
   [n49] Gate (Flow > Branches): Gate name = Blend Web; Starts open = True  ->  Then -> n50.Run
   [n50] Open / Close Gate (Actions): Gate name = Blend Web; Do = close it  ->  Next -> n56.Run
   [n51] Open / Close Gate (Actions): Gate name = Blend Web; Do = open it
   [n52] Reverse Animation (Animation > Play): Element = .Blend_Web; Animated object = Blend Web; Animation (blank = its own) = Blend Web-Open/Close Animation; Play = all its keys; From marker = (choose); To marker = (choose); From frame = 1; To frame = 60; When it ends = stay on the first frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n51.Run
   [n53] Timeline Animation (Effects > From Blender): Element = .Sun_Tzu_AI; Animated object = Sun Tzu AI; Action (blank = its own) = Sun Tzu AI-Open/Close Animation; Play = a frame range; From marker = (choose); To marker = (choose); From frame = 0; To frame = 12; When it ends = stay on the last frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n90.Run
   [n54] Get Element by Class Name (Values): .Sun_Tzu_AI  ->  Elements -> n7.Element
   [n55] Click Step (Triggers): "BlendWeb_OpenApp" on .Blen_Web  ->  Clicked -> n49.Run
   [n56] Timeline Animation (Effects > From Blender): Element = .Blend_Web; Animated object = Blend Web; Action (blank = its own) = Blend Web-Open/Close Animation; Play = a frame range; From marker = (choose); To marker = (choose); From frame = 0; To frame = 12; When it ends = stay on the last frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0
   [n57] Double Click (Triggers > Mouse & Touch): Element = .Sun_Tzu_AI (wired)  ->  Then -> n35.Run
   [n58] Double Click (Triggers > Mouse & Touch): Element = .Blend_Web (wired)  ->  Then -> n52.Run
   [n59] Get Element by Class Name (Values): .Blend_Web  ->  Elements -> n58.Element, Elements -> n86.Opens (what a click on it does)
   [n60] Gate (Flow > Branches): Gate name = Blend EDA; Starts open = True  ->  Then -> n61.Run
   [n61] Open / Close Gate (Actions): Gate name = Blend EDA; Do = close it  ->  Next -> n65.Run
   [n62] Open / Close Gate (Actions): Gate name = Blend EDA; Do = open it
   [n63] Reverse Animation (Animation > Play): Element = .Blend_EDA; Animated object = Blend EDA; Animation (blank = its own) = Blend EDA-Open/Close Animation; Play = all its keys; From marker = (choose); To marker = (choose); From frame = 1; To frame = 60; When it ends = stay on the first frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n62.Run
   [n64] Double Click (Triggers > Mouse & Touch): Element = .Blend_EDA (wired)  ->  Then -> n63.Run
   [n65] Timeline Animation (Effects > From Blender): Element = .Blend_EDA; Animated object = Blend EDA; Action (blank = its own) = Blend EDA-Open/Close Animation; Play = a frame range; From marker = (choose); To marker = (choose); From frame = 0; To frame = 12; When it ends = stay on the last frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0
   [n66] Get Element by Class Name (Values): .Blend_EDA  ->  Elements -> n64.Element, Elements -> n87.Opens (what a click on it does)
   [n67] Click Step (Triggers): "BlendEDA_OpenApp" on .Blend_EDA  ->  Clicked -> n60.Run
   [n68] Gate (Flow > Branches): Gate name = Blend ACS; Starts open = True  ->  Then -> n69.Run
   [n69] Open / Close Gate (Actions): Gate name = Blend ACS; Do = close it  ->  Next -> n72.Run
   [n70] Open / Close Gate (Actions): Gate name = Blend ACS; Do = open it
   [n71] Double Click (Triggers > Mouse & Touch): Element = .Blend_ACS (wired)  ->  Then -> n74.Run
   [n72] Timeline Animation (Effects > From Blender): Element = .Blend_ACS; Animated object = Blend ACS; Action (blank = its own) = Blend ACS-Open/Close Animation; Play = a frame range; From marker = (choose); To marker = (choose); From frame = 0; To frame = 12; When it ends = stay on the last frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0
   [n73] Click Step (Triggers): "BlendACS_OpenApp" on .Blend_ACS  ->  Clicked -> n68.Run
   [n74] Reverse Animation (Animation > Play): Element = .Blend_ACS; Animated object = Blend ACS; Animation (blank = its own) = Blend ACS-Open/Close Animation; Play = all its keys; From marker = (choose); To marker = (choose); From frame = 1; To frame = 60; When it ends = stay on the first frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n70.Run
   [n75] Gate (Flow > Branches): Gate name = Kin Flow; Starts open = True  ->  Then -> n76.Run
   [n76] Open / Close Gate (Actions): Gate name = Kin Flow; Do = close it  ->  Next -> n82.Run
   [n77] Open / Close Gate (Actions): Gate name = Kin Flow; Do = open it
   [n78] Reverse Animation (Animation > Play): Element = .Kin_Flow; Animated object = Kin Flow; Animation (blank = its own) = Kin Flow-Open/Close Animation; Play = all its keys; From marker = (choose); To marker = (choose); From frame = 1; To frame = 60; When it ends = stay on the first frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0  ->  Next -> n77.Run
   [n79] Click Step (Triggers): "KinFow_OpenApp" on .Kin_Flow  ->  Clicked -> n75.Run
   [n80] Get Element by Class Name (Values): .Kin_Flow  ->  Elements -> n81.Element, Elements -> n89.Opens (what a click on it does)
   [n81] Double Click (Triggers > Mouse & Touch): Element = .Kin_Flow (wired)  ->  Then -> n78.Run
   [n82] Timeline Animation (Effects > From Blender): Element = .Kin_Flow; Animated object = Kin Flow; Action (blank = its own) = Kin Flow-Open/Close Animation; Play = a frame range; From marker = (choose); To marker = (choose); From frame = 0; To frame = 12; When it ends = stay on the last frame; Seconds (0 = Blender's) = 0; Delay (s) = 0; Easing = linear; Repeat = Once; Back and forth = False; Stagger (s) = 0
   [n83] Link Delay (Links & QR > App Links): Wait (s) = 1; Link name (blank = every app link) = (empty); Meanwhile show = nothing; Only for links (clicks open at once) = True
   [n84] Get Element by Class Name (Values): .Blend_ACS  ->  Elements -> n71.Element, Elements -> n88.Opens (what a click on it does)
   [n85] App Link (Links & QR > App Links): App name = Sun Tzu AI; Link name (blank = from the name) = sun-tzu-ai; Opens (what a click on it does) = .Sun_Tzu_AI (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n86] App Link (Links & QR > App Links): App name = Blend Web; Link name (blank = from the name) = blend-web; Opens (what a click on it does) = .Blend_Web (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n87] App Link (Links & QR > App Links): App name = Blend EDA; Link name (blank = from the name) = blend-eda; Opens (what a click on it does) = .Blend_EDA (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n88] App Link (Links & QR > App Links): App name = Blend ACS; Link name (blank = from the name) = blend-acs; Opens (what a click on it does) = .Blend_ACS (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n89] App Link (Links & QR > App Links): App name = Kin Flow; Link name (blank = from the name) = kin-flow; Opens (what a click on it does) = .Kin_Flow (wired); Wait before opening (s) = 1; Address = #name   (works everywhere, no server setup); Show it in the address bar while open = True; Back button closes it = True; Put the app name in the tab title = True
   [n90] Wait (Flow): Seconds = 1  ->  Then -> n92.Run
   [n91] Get Element by Class Name (Values): .Sun_Tzu_AI_Content  ->  Elements -> n92.Element, Elements -> n93.Element
   [n92] display (CSS > Display): Element = .Sun_Tzu_AI_Content (wired); Value = flex; Change over (s) = 0; Back to its stylesheet value = False  ->  Next -> n93.Run
   [n93] Fade (Effects): Element = .Sun_Tzu_AI_Content (wired); Fade = in (appear); To opacity (0-1) = 0.5; Seconds = 0.6; Delay (s) = 0; Easing = ease-out; Repeat = Once; Back and forth = False; Stagger (s) = 0


Animations  (24 fps; px = website pixels; transforms are relative to where each element sits)
========================================================================

Timeline animations (Animations panel):

/* Animation "Sun Tzu AI-Open/Close Animation" */
/* "Sun Tzu AI" (.Sun_Tzu_AI) - action "Sun Tzu AI-Open/Close Animation", frames 0-12 (0.5s); animates color, css border-radius, css box-shadow, css height, css opacity, css width, css z-index, location, rotation_euler, scale */
/* played by 2 animation nodes (see below), not on page load */
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move {
  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color {
  0% { background-color: #d9d9d9; }
  25% { background-color: #d9d9d9; }
  100% { background-color: #d9d9d9; }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius {
  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { border-radius: 0px; }
  100% { border-radius: 0px; }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow {
  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height {
  0% { height: 140px; }
  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { height: 599px; }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity {
  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { opacity: 1; }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width {
  0% { width: 140px; }
  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { width: 1366px; }
}
@keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index {
  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { z-index: 2; }
  100% { z-index: 2; }
}

/* Animation "Blend Web-Open/Close Animation" */
/* "Blend Web" (.Blend_Web) - action "Blend Web-Open/Close Animation", frames 0-12 (0.5s); animates color, css border-radius, css box-shadow, css height, css opacity, css width, css z-index, location, rotation_euler, scale */
/* played by 2 animation nodes (see below), not on page load */
@keyframes bw-blend-web-blend-web-open-close-animation-move {
  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
}
@keyframes bw-blend-web-blend-web-open-close-animation-color {
  0% { background-color: #d9d9d9; }
  25% { background-color: #d9d9d9; }
  100% { background-color: #d9d9d9; }
}
@keyframes bw-blend-web-blend-web-open-close-animation-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes bw-blend-web-blend-web-open-close-animation-css-border-radius {
  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { border-radius: 0px; }
  100% { border-radius: 0px; }
}
@keyframes bw-blend-web-blend-web-open-close-animation-css-box-shadow {
  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
}
@keyframes bw-blend-web-blend-web-open-close-animation-css-height {
  0% { height: 140px; }
  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { height: 599px; }
}
@keyframes bw-blend-web-blend-web-open-close-animation-css-opacity {
  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { opacity: 1; }
}
@keyframes bw-blend-web-blend-web-open-close-animation-css-width {
  0% { width: 140px; }
  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { width: 1366px; }
}
@keyframes bw-blend-web-blend-web-open-close-animation-css-z-index {
  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { z-index: 2; }
  100% { z-index: 2; }
}

/* Animation "Blend EDA-Open/Close Animation" */
/* "Blend EDA" (.Blend_EDA) - action "Blend EDA-Open/Close Animation", frames 0-12 (0.5s); animates color, css border-radius, css box-shadow, css height, css opacity, css width, css z-index, location, rotation_euler, scale */
/* played by 2 animation nodes (see below), not on page load */
@keyframes bw-blend-eda-blend-eda-open-close-animation-move {
  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-color {
  0% { background-color: #d9d9d9; }
  25% { background-color: #d9d9d9; }
  100% { background-color: #d9d9d9; }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-css-border-radius {
  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { border-radius: 0px; }
  100% { border-radius: 0px; }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-css-box-shadow {
  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-css-height {
  0% { height: 140px; }
  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { height: 599px; }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-css-opacity {
  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { opacity: 1; }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-css-width {
  0% { width: 140px; }
  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { width: 1366px; }
}
@keyframes bw-blend-eda-blend-eda-open-close-animation-css-z-index {
  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { z-index: 2; }
  100% { z-index: 2; }
}

/* Animation "Blend ACS-Open/Close Animation" */
/* "Blend ACS" (.Blend_ACS) - action "Blend ACS-Open/Close Animation", frames 0-12 (0.5s); animates color, css border-radius, css box-shadow, css height, css opacity, css width, css z-index, location, rotation_euler, scale */
/* played by 2 animation nodes (see below), not on page load */
@keyframes bw-blend-acs-blend-acs-open-close-animation-move {
  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-color {
  0% { background-color: #d9d9d9; }
  25% { background-color: #d9d9d9; }
  100% { background-color: #d9d9d9; }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-css-border-radius {
  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { border-radius: 0px; }
  100% { border-radius: 0px; }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-css-box-shadow {
  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-css-height {
  0% { height: 140px; }
  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { height: 599px; }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-css-opacity {
  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { opacity: 1; }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-css-width {
  0% { width: 140px; }
  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { width: 1366px; }
}
@keyframes bw-blend-acs-blend-acs-open-close-animation-css-z-index {
  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { z-index: 2; }
  100% { z-index: 2; }
}

/* Animation "Kin Flow-Open/Close Animation" */
/* "Kin Flow" (.Kin_Flow) - action "Kin Flow-Open/Close Animation", frames 0-12 (0.5s); animates color, css border-radius, css box-shadow, css height, css opacity, css width, css z-index, location, rotation_euler, scale */
/* played by 2 animation nodes (see below), not on page load */
@keyframes bw-kin-flow-kin-flow-open-close-animation-move {
  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-color {
  0% { background-color: #d9d9d9; }
  25% { background-color: #d9d9d9; }
  100% { background-color: #d9d9d9; }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-css-border-radius {
  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { border-radius: 0px; }
  100% { border-radius: 0px; }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-css-box-shadow {
  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-css-height {
  0% { height: 140px; }
  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { height: 599px; }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-css-opacity {
  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { opacity: 1; }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-css-width {
  0% { width: 140px; }
  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { width: 1366px; }
}
@keyframes bw-kin-flow-kin-flow-open-close-animation-css-z-index {
  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { z-index: 2; }
  100% { z-index: 2; }
}

/* Animation "Sun_Szu_AI_Content - Sun Tzu AI-Open/Close Animation" */
/* "Sun_Szu_AI_Content" (.Sun_Tzu_AI_Content) - action "Sun_Szu_AI_Content - Sun Tzu AI-Open/Close Animation", frames 0-12 (0.5s); animates color, css border-radius, css box-shadow, css height, css opacity, css width, css z-index, location, rotation_euler, scale */
/* NOT played anywhere yet: do NOT add an animation rule for it - the element stays as it is until a node plays it (its keyframes follow, for when one does) */
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-move {
  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  25% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
  100% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-color {
  0% { background-color: #d9d9d9; }
  25% { background-color: #d9d9d9; }
  100% { background-color: #d9d9d9; }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-fade {
  0% { opacity: 1; }
  25% { opacity: 1; }
  100% { opacity: 1; }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-css-border-radius {
  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { border-radius: 0px; }
  100% { border-radius: 0px; }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-css-box-shadow {
  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-css-height {
  0% { height: 140px; }
  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { height: 599px; }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-css-opacity {
  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { opacity: 1; }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-css-width {
  0% { width: 140px; }
  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  100% { width: 1366px; }
}
@keyframes bw-sun_szu_ai_content-sun_szu_ai_content---sun-tzu-ai-open-close-animation-css-z-index {
  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
  25% { z-index: 2; }
  100% { z-index: 2; }
}

Animation nodes (Node Window):

- Reverse Animation node (runs when: Double Click):
   Animate .Sun_Tzu_AI exactly like the Blender timeline animation "Sun Tzu AI-Open/Close Animation" on "Sun Tzu AI" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-reverse-sun-tzu-ai-sun-tzu-ai-open-close-animation to .Sun_Tzu_AI to play it backwards:
   .bw-reverse-sun-tzu-ai-sun-tzu-ai-open-close-animation { animation: bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0%; }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Reverse Animation node (runs when: Double Click):
   Animate .Blend_Web exactly like the Blender timeline animation "Blend Web-Open/Close Animation" on "Blend Web" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-web-blend-web-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-web-blend-web-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-web-blend-web-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-web-blend-web-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-web-blend-web-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-web-blend-web-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-reverse-blend-web-blend-web-open-close-animation to .Blend_Web to play it backwards:
   .bw-reverse-blend-web-blend-web-open-close-animation { animation: bw-blend-web-blend-web-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-web-blend-web-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0%; }
   @keyframes bw-blend-web-blend-web-open-close-animation-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Timeline Animation node (runs on Click Step 1):
   Animate .Sun_Tzu_AI exactly like the Blender timeline animation "Sun Tzu AI-Open/Close Animation" on "Sun Tzu AI" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-play-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12 to .Sun_Tzu_AI to play it:
   .bw-play-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12 { animation: bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0%; }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-80px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Timeline Animation node (runs on Click Step 2):
   Animate .Blend_Web exactly like the Blender timeline animation "Blend Web-Open/Close Animation" on "Blend Web" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-web-blend-web-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-web-blend-web-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-play-blend-web-blend-web-open-close-animation-0-12 to .Blend_Web to play it:
   .bw-play-blend-web-blend-web-open-close-animation-0-12 { animation: bw-blend-web-blend-web-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-web-blend-web-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0%; }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-260px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-blend-web-blend-web-open-close-animation-0-12-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Reverse Animation node (runs when: Double Click):
   Animate .Blend_EDA exactly like the Blender timeline animation "Blend EDA-Open/Close Animation" on "Blend EDA" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-eda-blend-eda-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-eda-blend-eda-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-reverse-blend-eda-blend-eda-open-close-animation to .Blend_EDA to play it backwards:
   .bw-reverse-blend-eda-blend-eda-open-close-animation { animation: bw-blend-eda-blend-eda-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-eda-blend-eda-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0%; }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Timeline Animation node (runs on Click Step 3):
   Animate .Blend_EDA exactly like the Blender timeline animation "Blend EDA-Open/Close Animation" on "Blend EDA" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-eda-blend-eda-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-play-blend-eda-blend-eda-open-close-animation-0-12 to .Blend_EDA to play it:
   .bw-play-blend-eda-blend-eda-open-close-animation-0-12 { animation: bw-blend-eda-blend-eda-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-eda-blend-eda-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0%; }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-440px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-blend-eda-blend-eda-open-close-animation-0-12-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Timeline Animation node (runs on Click Step 4):
   Animate .Blend_ACS exactly like the Blender timeline animation "Blend ACS-Open/Close Animation" on "Blend ACS" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-acs-blend-acs-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-play-blend-acs-blend-acs-open-close-animation-0-12 to .Blend_ACS to play it:
   .bw-play-blend-acs-blend-acs-open-close-animation-0-12 { animation: bw-blend-acs-blend-acs-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-blend-acs-blend-acs-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0%; }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-0-12-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Reverse Animation node (runs when: Double Click):
   Animate .Blend_ACS exactly like the Blender timeline animation "Blend ACS-Open/Close Animation" on "Blend ACS" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-blend-acs-blend-acs-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-blend-acs-blend-acs-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-blend-acs-blend-acs-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-reverse-blend-acs-blend-acs-open-close-animation to .Blend_ACS to play it backwards:
   .bw-reverse-blend-acs-blend-acs-open-close-animation { animation: bw-blend-acs-blend-acs-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-blend-acs-blend-acs-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0%; }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-620px, -200px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-blend-acs-blend-acs-open-close-animation-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Reverse Animation node (runs when: Double Click):
   Animate .Kin_Flow exactly like the Blender timeline animation "Kin Flow-Open/Close Animation" on "Kin Flow" (frames 0-12 = 0.5s at 24 fps), PLAYED BACKWARDS - from its last keyframe to its first (animation-direction: reverse) - relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-kin-flow-kin-flow-open-close-animation-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-kin-flow-kin-flow-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-reverse-kin-flow-kin-flow-open-close-animation to .Kin_Flow to play it backwards:
   .bw-reverse-kin-flow-kin-flow-open-close-animation { animation: bw-kin-flow-kin-flow-open-close-animation-move 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-color 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-fade 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-border-radius 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-box-shadow 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-height 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-opacity 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-width 0.5s linear 0s 1 reverse both, bw-kin-flow-kin-flow-open-close-animation-css-z-index 0.5s linear 0s 1 reverse both; transform-origin: 0% 0%; }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Timeline Animation node (runs on Click Step 5):
   Animate .Kin_Flow exactly like the Blender timeline animation "Kin Flow-Open/Close Animation" on "Kin Flow" (frames 0-12 = 0.5s at 24 fps), relative to where it is, with this CSS (each key's own timing is kept): @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-move {  0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }  100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-color {  0% { background-color: #d9d9d9; }  25% { background-color: #d9d9d9; }  100% { background-color: #d9d9d9; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-fade {  0% { opacity: 1; }  25% { opacity: 1; }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-border-radius {  0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { border-radius: 0px; }  100% { border-radius: 0px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-box-shadow {  0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }  25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }  100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-height {  0% { height: 140px; }  25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { height: 599px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-opacity {  0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { opacity: 1; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-width {  0% { width: 140px; }  25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  100% { width: 1366px; } } @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-z-index {  0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }  25% { z-index: 2; }  100% { z-index: 2; } }; run it with animation: bw-kin-flow-kin-flow-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0% (linear easing).
   CSS - add the class bw-play-kin-flow-kin-flow-open-close-animation-0-12 to .Kin_Flow to play it:
   .bw-play-kin-flow-kin-flow-open-close-animation-0-12 { animation: bw-kin-flow-kin-flow-open-close-animation-0-12-move 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-color 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-fade 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-border-radius 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-box-shadow 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-height 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-opacity 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-width 0.5s linear 0s 1 normal both, bw-kin-flow-kin-flow-open-close-animation-0-12-css-z-index 0.5s linear 0s 1 normal both; transform-origin: 0% 0%; }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-move {
     0% { transform: translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
     100% { transform: translate(-80px, -380px) rotateX(0deg) rotateY(0deg) rotate(0deg) scale(1, 1); }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-color {
     0% { background-color: #d9d9d9; }
     25% { background-color: #d9d9d9; }
     100% { background-color: #d9d9d9; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-fade {
     0% { opacity: 1; }
     25% { opacity: 1; }
     100% { opacity: 1; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-border-radius {
     0% { border-radius: 5px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { border-radius: 0px; }
     100% { border-radius: 0px; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-box-shadow {
     0% { box-shadow: 0px 2px 6px 0px 9e9e9e; animation-timing-function: steps(1, end); }
     25% { box-shadow: 0 0px 0 0 rgba(89, 89, 89, 0.675); animation-timing-function: steps(1, end); }
     100% { box-shadow: 3px 0px 6px 2px rgba(89, 89, 89, 0.675); }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-height {
     0% { height: 140px; }
     25% { height: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { height: 599px; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-opacity {
     0% { opacity: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { opacity: 0; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { opacity: 1; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-width {
     0% { width: 140px; }
     25% { width: 140px; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     100% { width: 1366px; }
   }
   @keyframes bw-kin-flow-kin-flow-open-close-animation-0-12-css-z-index {
     0% { z-index: 1; animation-timing-function: cubic-bezier(0.333, 0, 0.667, 1); }
     25% { z-index: 2; }
     100% { z-index: 2; }
   }

- Fade node (runs on Click Step 1):
   Fade .Sun_Tzu_AI_Content in (over 0.6s, ease-out easing).

Anchors  (points pinned to the page's edges; page = 1366 x 599 px, x right, y down from its top-left)
========================================================================
An anchored point keeps its distance to the edge(s) it's anchored to when the page changes size: right /
bottom anchors move with that edge, left + right (or top + bottom) keep the point's place as a percentage.
Build the layout so each element behaves like this at every screen size (CSS left / right / top / bottom,
percentages, or flex / grid that gives the same result).

(nothing is anchored yet: use the Anchor tool to pin points to the page's edges)


== Shader information (8 elements) ==
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
  box-shadow: 0px 2px 6px 0 9e9e9e;
  opacity: 1;
  border-radius: 5px;
}

/* <div>  object "Blend EDA"  -  no clip-path */
.Blend_EDA {
  box-shadow: 0px 2px 6px 0px 9e9e9e;
  opacity: 1;
  border-radius: 5px;
}

/* <div>  object "Blend Web"  -  no clip-path */
.Blend_Web {
  box-shadow: 0px 2px 6px 0px 9e9e9e;
  opacity: 1;
  border-radius: 5px;
}

/* <div>  object "Kin Flow"  -  no clip-path */
.Kin_Flow {
  box-shadow: 0px 2px 6px 0px 9e9e9e;
  opacity: 1;
  border-radius: 5px;
}

/* <div>  object "Rectangle.005"  -  no clip-path */
#bw-Rectangle-005 {
  box-shadow: 0 2px 6px #9e9e9e;
  border-radius: 5px;
}

/* <div>  object "Rectangle.007"  -  no clip-path */
#bw-Rectangle-007 {
  background-image: linear-gradient(138deg, #ffffff 0%, #ffffff 100%);
}

/* <div>  object "Sun Tzu AI"  -  no clip-path */
.Sun_Tzu_AI {
  box-shadow: 0px 2px 6px 0 9e9e9e;
  opacity: 1;
  border-radius: 5px;
}

/* <div>  object "Sun_Szu_AI_Content"  -  custom outline: keeps its clip-path, see the wrapper below */
.Sun_Tzu_AI_Content {
  opacity: 1;
  box-shadow: 0px 2px 6px 0 9e9e9e;
}
/* its outline is a custom shape (clip-path), and a clip-path hides box-shadow: wrap it in a
   <div> (same position) and put the shadow on the wrapper, which follows the clipped shape: */
.Sun_Tzu_AI_Content-shadow-wrap { filter: drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.5)); }


