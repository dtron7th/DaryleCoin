// Components (Blend Web node logic):
// - .Front_Page_Visual_Effects (n43, n48): a full-screen <canvas> in the
//   page background - above #bw-Rectangle-007, below every content
//   element - carrying the two animated gradients on the GPU: a WebGL
//   fragment shader on one full-screen triangle computes the colour per
//   pixel (135deg, each colour scheme repeating so the first colour
//   comes again at the end, 2-3 bands visible, the gradient's length
//   breathing from 60% to 200% of the area's gradient length and back
//   every 12s, the bands bent into a wave 30% of the area's height,
//   ~1.5 waves across the width, travelling sideways one full wave
//   every 4s). n43 runs linear-gradient(135deg, #d5cbd3, #848ab1) from
//   page load; after the Wait node (n44, 1s) n48's
//   linear-gradient(135deg, #d5988b, #55aeb1) cross-fades in inside the
//   same shader and the two schemes keep slowly alternating. When WebGL
//   is not available the same bending is drawn in column strips on the
//   overlay's 2D canvas as a fallback.
// - #bw-fx-overlay: a second, transparent 2D canvas above the gradient:
//   - Waves (n37): 4 smooth, layered sine waves gently moving inside a
//     100px-high band at the bottom of the page, filled in #ffffff.
//   - Particle network (n42): 80 slowly drifting dots joined by faint
//     lines when close (lines batched into 4 opacity groups - one path
//     and one stroke() per group - and all dots in one path and one
//     fill()), drawn in #ffffff, gently reaching toward the mouse; a
//     touch (pointer: coarse) device gets half the dots.
// Everything (shader + canvas drawing + the header clock) runs from ONE
// shared requestAnimationFrame loop: drawing is capped at 60 fps even on
// faster screens, motion uses real elapsed time clamped at 100 ms, the
// backing store is capped at 1.5x devicePixelRatio and steps down
// (x0.75, x0.5, coarser strips/wave points) when the average frame time
// over ~60 drawn frames is above 21 ms, stepping back up only after
// 30 s of easy frames - and if that step up is slow again it stays down
// for good. The loop pauses while the canvases are off screen, the tab
// is hidden or an open app window covers them, and stays calm when the
// user prefers reduced motion.

var WAVE_COLOR = '#ffffff';
var WAVE_BAND = 100;     // px-high band at the bottom of the page

var DOT_COUNT = 80;      // halved on touch (pointer: coarse) devices
var LINK_DIST = 120;     // px; dots closer than this get a faint line
var DOT_SPEED = 12;      // px/s drift
var MOUSE_PULL = 18;     // px/s reach toward the mouse

// Bent breathing gradients on .Front_Page_Visual_Effects (n43, n48):
// linear-gradient(135deg, #d5cbd3, #848ab1) from page load, then after the
// 1s Wait (n44) linear-gradient(135deg, #d5988b, #55aeb1) joins in and the
// two schemes keep alternating inside the same shader. Colours repeat so
// the first colour comes again at the end of each cycle (2-3 bands
// visible). The gradient's length breathes from 60% to 200% of the area's
// gradient length and back once every 12s, and the colour bands are bent
// into waves 30% of the area's height, ~1.5 waves across the width,
// travelling sideways one full wave every 4s.
var GRAD_A = '#d5cbd3';
var GRAD_B = '#848ab1';
var GRAD2_A = '#d5988b';
var GRAD2_B = '#55aeb1';
var GRAD_ANGLE = 135;    // deg, CSS angle convention
var GRAD_MIN = 0.6;      // smallest gradient length (x the area's own length)
var GRAD_MAX = 2.0;      // largest gradient length
var BREATHE_LOOP = 12;   // s per breathe loop
var DIST_HEIGHT = 0.30;  // wave height = 30% of the area's height
var DIST_WAVES = 1.5;    // waves across the width
var DIST_LOOP = 4;       // s: the wave travels sideways one full wave
var DIST_STRIP = 4;      // px: column width for the 2D fallback only
var GRAD2_DELAY = 1;     // s: Wait node before the second gradient starts
var GRAD_XFADE = 24;     // s for a full there-and-back crossfade
var WAVE_STEP = 3;       // px between points on each wave line

// Back-to-front wave layers inside the 100px band (base = band centre).
var WAVE_LAYERS = [
  { alpha: 0.30, amp: 13, freq: 0.012, speed: 0.45,  yOff: -21 },
  { alpha: 0.45, amp: 11, freq: 0.008, speed: -0.32, yOff: -7 },
  { alpha: 0.65, amp: 8,  freq: 0.016, speed: 0.24,  yOff:  7 },
  { alpha: 0.85, amp: 6,  freq: 0.006, speed: -0.18, yOff:  21 }
];

// Particle link lines: 4 opacity groups, one batched stroke() each.
var LINE_ALPHA = [0.09, 0.17, 0.26, 0.35];
var lineSegs = [[], [], [], []];   // flat x1,y1,x2,y2 lists, reused each frame

var DIST_STRIP_STEPS = [4, 6, 8];      // fallback column width per detail step
var WAVE_STEP_STEPS = [3, 4, 6];       // wave point spacing per detail step
var RES_STEPS = [1, 0.75, 0.5];        // backing-store scale per detail step
var detail = 0;                        // current detail step (0 = full)
var detailLocked = false;              // a slow step-up: stay down for good
var pxScale = 1;                       // CSS px -> backing store px

var gradCanvas = null;   // .Front_Page_Visual_Effects (WebGL gradient)
var fxCanvas = null;     // #bw-fx-overlay (2D: waves + particle network)
var ctx = null;          // fxCanvas's 2d context
var cssW = 0;
var cssH = 0;
var gradSrc1 = null;     // fallback: offscreen canvas with the flat gradient
var gradSrc2 = null;     // fallback: offscreen canvas with the 2nd gradient

// WebGL state.
var gl = null;
var useGL = false;
var glBuf = null;
var glUniRes = null;
var glUniTime = null;
var glUniMix = null;

var rafId = null;
var lastDraw = 0;
var lastClock = 0;
var frameAcc = 0;        // frame-time sum over the last ~60 drawn frames
var frameCount = 0;
var lastHeavy = 0;       // last time frames were slow (or detail changed)
var testingStepUp = false;
var onScreen = true;
var bgCovered = false;   // an open app window covers the background
var calm = false;

var dots = [];
var mouseX = null;
var mouseY = null;

var timeEl = null;
var dateEl = null;

function hexRGB(h) {
  return [
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255
  ];
}

// The animated gradients run on the GPU: one full-screen triangle, the
// colour computed per pixel in the fragment shader (mediump). s = the
// pixel's position along the 135deg axis (CSS direction (sin a, cos a) in
// the shader's y-up coordinates); the sampled point is shifted vertically
// by the travelling sine wave and scaled by the breathing length, then a
// triangle wave over each cycle gives A -> B -> A repeating bands. The
// two schemes are cross-faded inside the same shader.
var FRAG_SRC =
  'precision mediump float;' +
  'uniform vec2 u_res;' +
  'uniform float u_time;' +
  'uniform float u_mix;' +
  'uniform vec3 u_a1;' +
  'uniform vec3 u_b1;' +
  'uniform vec3 u_a2;' +
  'uniform vec3 u_b2;' +
  'void main(){' +
  '  vec2 p = gl_FragCoord.xy;' +
  '  float lambda = u_res.x / ' + DIST_WAVES + ';' +
  '  float phase = 6.2831853 * u_time / ' + DIST_LOOP + '.0;' +
  '  float dy = ' + (DIST_HEIGHT / 2) + ' * u_res.y *' +
  '      sin(6.2831853 * p.x / lambda - phase);' +
  '  float rad = ' + GRAD_ANGLE + '.0 * 0.017453292519943;' +
  '  vec2 axis = vec2(sin(rad), cos(rad));' +
  '  float axisLen = abs(u_res.x * axis.x) + abs(u_res.y * axis.y);' +
  '  float breathe = ' + ((GRAD_MAX + GRAD_MIN) / 2) +
  '      - ' + ((GRAD_MAX - GRAD_MIN) / 2) +
  '      * cos(6.2831853 * u_time / ' + BREATHE_LOOP + '.0);' +
  '  float s = dot(p + vec2(0.0, dy), axis) - dot(0.5 * u_res, axis);' +
  '  float f = fract(s / (axisLen * breathe));' +
  '  float tri = 1.0 - abs(2.0 * f - 1.0);' +
  '  vec3 c1 = mix(u_a1, u_b1, tri);' +
  '  vec3 c2 = mix(u_a2, u_b2, tri);' +
  '  gl_FragColor = vec4(mix(c1, c2, u_mix), 1.0);' +
  '}';

var VERT_SRC =
  'attribute vec2 a_pos;' +
  'void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }';

function makeShader(type, src) {
  var sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

// Returns false when WebGL is missing or the shader fails: the caller
// falls back to drawing the gradient on the overlay's 2D canvas.
function initGL() {
  try {
    var opts = { alpha: false, antialias: false, depth: false,
                 stencil: false, preserveDrawingBuffer: false };
    gl = gradCanvas.getContext('webgl', opts) ||
         gradCanvas.getContext('experimental-webgl', opts);
    if (!gl) return false;
    var vs = makeShader(gl.VERTEX_SHADER, VERT_SRC);
    var fs = makeShader(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) return false;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return false;
    gl.useProgram(prog);

    glBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, glBuf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    glUniRes = gl.getUniformLocation(prog, 'u_res');
    glUniTime = gl.getUniformLocation(prog, 'u_time');
    glUniMix = gl.getUniformLocation(prog, 'u_mix');
    var a1 = hexRGB(GRAD_A), b1 = hexRGB(GRAD_B);
    var a2 = hexRGB(GRAD2_A), b2 = hexRGB(GRAD2_B);
    gl.uniform3f(gl.getUniformLocation(prog, 'u_a1'), a1[0], a1[1], a1[2]);
    gl.uniform3f(gl.getUniformLocation(prog, 'u_b1'), b1[0], b1[1], b1[2]);
    gl.uniform3f(gl.getUniformLocation(prog, 'u_a2'), a2[0], a2[1], a2[2]);
    gl.uniform3f(gl.getUniformLocation(prog, 'u_b2'), b2[0], b2[1], b2[2]);
    return true;
  } catch (e) {
    gl = null;
    return false;
  }
}

function syncSize() {
  // cap the backing store at 1.5x devicePixelRatio so a tablet doesn't
  // draw 2-3x the pixels; the detail step can shrink it further
  pxScale = Math.min(window.devicePixelRatio || 1, 1.5) * RES_STEPS[detail];
  DIST_STRIP = DIST_STRIP_STEPS[detail];
  WAVE_STEP = WAVE_STEP_STEPS[detail];

  cssW = fxCanvas.clientWidth;
  cssH = fxCanvas.clientHeight;
  gradCanvas.width = Math.round(cssW * pxScale);
  gradCanvas.height = Math.round(cssH * pxScale);
  fxCanvas.width = Math.round(cssW * pxScale);
  fxCanvas.height = Math.round(cssH * pxScale);
  ctx.setTransform(pxScale, 0, 0, pxScale, 0, 0);
  ctx.imageSmoothingEnabled = true;

  if (useGL) {
    gl.viewport(0, 0, gradCanvas.width, gradCanvas.height);
    gl.uniform2f(glUniRes, gradCanvas.width, gradCanvas.height);
  } else {
    gradSrc1 = buildGradientSource(pxScale, GRAD_A, GRAD_B);
    gradSrc2 = buildGradientSource(pxScale, GRAD2_A, GRAD2_B);
  }
}

// Length (px) of the gradient axis: the CSS gradient line through the
// area's centre along GRAD_ANGLE - |w * sin a| + |h * cos a|.
function gradAxisLen() {
  var rad = GRAD_ANGLE * Math.PI / 180;
  return Math.abs(cssW * Math.sin(rad)) + Math.abs(cssH * Math.cos(rad));
}

// Wave amplitude (px): the wave's height is 30% of the area's height.
function distAmp() {
  return DIST_HEIGHT * cssH / 2;
}

// The gradient's length as a fraction of the area's gradient length:
// breathes GRAD_MIN -> GRAD_MAX -> GRAD_MIN once every BREATHE_LOOP s.
function breatheScale(tSec) {
  var mid = (GRAD_MAX + GRAD_MIN) / 2;
  var amp = (GRAD_MAX - GRAD_MIN) / 2;
  return mid - amp * Math.cos(2 * Math.PI * tSec / BREATHE_LOOP);
}

// How much of the second gradient is showing: 0 until the Wait node's 1s
// has passed, then a smooth 0 -> 1 -> 0 loop so the two colour schemes
// keep alternating.
function secondGradientMix(tSec) {
  var t2 = tSec - GRAD2_DELAY;
  if (t2 <= 0) return 0;
  return (1 - Math.cos(2 * Math.PI * t2 / GRAD_XFADE)) / 2;
}

// ---- 2D fallback for the gradient (only used when WebGL is missing) ----

// Pre-render the repeating gradient (one tile = one A -> B -> A cycle,
// P = the area's gradient length) into a texture in screen orientation.
function buildGradientSource(scale, colorA, colorB) {
  var aMax = 1 / GRAD_MIN;
  var A = distAmp();
  var texW = Math.ceil(aMax * cssW) + 2;
  var texH = Math.ceil(aMax * (cssH + 2 * A)) + 2;

  var src = document.createElement('canvas');
  src.width = Math.max(1, Math.round(texW * scale));
  src.height = Math.max(1, Math.round(texH * scale));
  var gctx = src.getContext('2d');
  gctx.setTransform(scale, 0, 0, scale, 0, 0);

  var P = Math.max(2, Math.round(gradAxisLen() * scale));
  var tile = document.createElement('canvas');
  tile.width = P;
  tile.height = 8;
  var tctx = tile.getContext('2d');
  var g = tctx.createLinearGradient(0, 0, P, 0);
  g.addColorStop(0, colorA);
  g.addColorStop(0.5, colorB);
  g.addColorStop(1, colorA);
  tctx.fillStyle = g;
  tctx.fillRect(0, 0, P, 8);

  var rad = GRAD_ANGLE * Math.PI / 180;
  var pattern = gctx.createPattern(tile, 'repeat');
  gctx.save();
  gctx.translate(texW / 2, texH / 2);
  gctx.rotate(Math.atan2(-Math.cos(rad), Math.sin(rad)));
  var R = Math.ceil(Math.sqrt(texW * texW + texH * texH) / 2) + 2;
  gctx.fillStyle = pattern;
  gctx.fillRect(-R, -R, 2 * R, 2 * R);
  gctx.restore();
  return src;
}

function drawBentGradient(src, tSec, alpha) {
  var A = distAmp();
  var lambda = cssW / DIST_WAVES;
  var phase = 2 * Math.PI * tSec / DIST_LOOP;
  var a = 1 / breatheScale(tSec);
  var texCx = src.width / (2 * pxScale);
  var texCy = src.height / (2 * pxScale);
  var cx = cssW / 2;
  var cy = cssH / 2;
  ctx.globalAlpha = alpha;
  for (var x = 0; x < cssW; x += DIST_STRIP) {
    var w = Math.min(DIST_STRIP, cssW - x);
    var dy = A * Math.sin(2 * Math.PI * (x + w / 2) / lambda - phase);
    ctx.drawImage(src,
      (texCx + a * (x - cx)) * pxScale,
      (texCy + a * (dy - cy)) * pxScale,
      a * w * pxScale, a * cssH * pxScale,
      x, 0, w, cssH);
  }
  ctx.globalAlpha = 1;
}

// ---- particle network ----

function spawnDots() {
  var count = DOT_COUNT;
  if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
    count = Math.ceil(DOT_COUNT / 2);   // half the dots on touch devices
  }
  dots = [];
  for (var i = 0; i < count; i++) {
    var ang = Math.random() * Math.PI * 2;
    var sp = DOT_SPEED * (0.5 + Math.random() * 0.5);
    dots.push({
      x: Math.random() * cssW,
      y: Math.random() * cssH,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp
    });
  }
}

function stepDots(dt) {
  for (var i = 0; i < dots.length; i++) {
    var d = dots[i];
    if (mouseX !== null) {
      var dx = mouseX - d.x;
      var dy = mouseY - d.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 1) {
        var reach = MOUSE_PULL * Math.min(1, 240 / dist);
        d.vx += (dx / dist) * reach * dt;
        d.vy += (dy / dist) * reach * dt;
      }
    }
    // keep drift slow
    var v = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
    var cap = DOT_SPEED * 2;
    if (v > cap) { d.vx = d.vx / v * cap; d.vy = d.vy / v * cap; }
    if (v < DOT_SPEED * 0.3 && v > 0.001) {
      d.vx = d.vx / v * DOT_SPEED * 0.5;
      d.vy = d.vy / v * DOT_SPEED * 0.5;
    }
    d.x += d.vx * dt;
    d.y += d.vy * dt;
    if (d.x < -10) d.x = cssW + 10; else if (d.x > cssW + 10) d.x = -10;
    if (d.y < -10) d.y = cssH + 10; else if (d.y > cssH + 10) d.y = -10;
  }
}

function drawDots() {
  for (var b = 0; b < lineSegs.length; b++) lineSegs[b].length = 0;
  var ld2 = LINK_DIST * LINK_DIST;
  for (var i = 0; i < dots.length; i++) {
    var a = dots[i];
    for (var j = i + 1; j < dots.length; j++) {
      var c = dots[j];
      var dx = a.x - c.x;
      var dy = a.y - c.y;
      var dd = dx * dx + dy * dy;
      if (dd < ld2) {
        var alpha = (1 - Math.sqrt(dd) / LINK_DIST) * 0.35;
        var bi = alpha <= LINE_ALPHA[0] ? 0 :
                 alpha <= LINE_ALPHA[1] ? 1 :
                 alpha <= LINE_ALPHA[2] ? 2 : 3;
        var seg = lineSegs[bi];
        seg.push(a.x, a.y, c.x, c.y);
      }
    }
  }
  // one path and one stroke() per opacity group
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (var g = 0; g < lineSegs.length; g++) {
    var segs = lineSegs[g];
    if (!segs.length) continue;
    ctx.globalAlpha = LINE_ALPHA[g];
    ctx.beginPath();
    for (var s = 0; s < segs.length; s += 4) {
      ctx.moveTo(segs[s], segs[s + 1]);
      ctx.lineTo(segs[s + 2], segs[s + 3]);
    }
    ctx.stroke();
  }
  // all dots in one path and one fill()
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  for (var k = 0; k < dots.length; k++) {
    ctx.moveTo(dots[k].x + 2, dots[k].y);
    ctx.arc(dots[k].x, dots[k].y, 2, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.globalAlpha = 1;
}

// 4 smooth layered sine waves, gently moving, in the bottom 100px.
function drawWaves(tSec) {
  var base = cssH - WAVE_BAND / 2;
  for (var li = 0; li < WAVE_LAYERS.length; li++) {
    var L = WAVE_LAYERS[li];
    ctx.globalAlpha = L.alpha;
    ctx.fillStyle = WAVE_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, cssH);
    for (var x = 0; x <= cssW; x += WAVE_STEP) {
      ctx.lineTo(x, base + L.yOff +
        L.amp * Math.sin(x * L.freq + tSec * L.speed + li * 1.7));
    }
    ctx.lineTo(cssW, cssH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawScene(tSec) {
  if (useGL) {
    gl.uniform1f(glUniTime, tSec);
    gl.uniform1f(glUniMix, secondGradientMix(tSec));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    ctx.clearRect(0, 0, cssW, cssH);
  } else {
    ctx.clearRect(0, 0, cssW, cssH);
    drawBentGradient(gradSrc1, tSec, 1);
    var mix = secondGradientMix(tSec);
    if (mix > 0) drawBentGradient(gradSrc2, tSec, mix);
  }
  drawWaves(tSec);
  drawDots();
}

// One still frame of everything, used for reduced motion and after resizes
// while the loop is paused.
function drawStill() {
  drawScene(0);
}

// The shared loop runs whenever the canvases could be visible: on screen,
// the tab not hidden and not covered by an open app window. Reduced
// motion only stops the canvas drawing, the clock text still updates.
function running() {
  return onScreen && !document.hidden && !bgCovered;
}

// Frame-time average over the last ~60 drawn frames: above 21 ms drops
// the canvas detail one step; it only steps back up after 30 s of easy
// frames, and if that step up is slow again it stays down for good.
function measureFrame(dt, t) {
  frameAcc += dt;
  frameCount++;
  if (frameCount < 60) return;
  var avg = frameAcc / frameCount;
  frameAcc = 0;
  frameCount = 0;
  if (avg > 21) {
    lastHeavy = t;
    if (testingStepUp) detailLocked = true;
    testingStepUp = false;
    if (detail < RES_STEPS.length - 1) {
      detail++;
      syncSize();
    }
  } else if (!detailLocked && detail > 0 && t - lastHeavy > 30000) {
    detail--;
    syncSize();
    lastHeavy = t;
    testingStepUp = true;
  }
}

function frame(t) {
  rafId = null;
  if (!running()) return;
  rafId = requestAnimationFrame(frame);

  if (t - lastClock >= 250) {      // header clock text (~4x a second)
    lastClock = t;
    tickClock();
  }

  if (calm) return;                // reduced motion: keep the still frame
  if (t - lastDraw < 16.67) return; // draw at 60 fps on faster screens
  var dt = lastDraw ? Math.min(t - lastDraw, 100) : 16.7;
  lastDraw = t;

  stepDots(dt / 1000);
  drawScene(t / 1000);
  measureFrame(dt, t);
}

function startLoop() {
  lastDraw = 0;
  lastClock = 0;
  frameAcc = 0;
  frameCount = 0;
  if (rafId === null && running()) rafId = requestAnimationFrame(frame);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

// Clock header: .Front_Page_Time shows "now" as 12:40:00 and
// .Front_Page_Date shows "now" as a long date (September 27, 2026),
// both in the visitor's language via Intl.
var TIME_FMT = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true
});
var DATE_FMT = new Intl.DateTimeFormat(undefined, { dateStyle: 'long' });

function tickClock() {
  var now = new Date();
  timeEl.textContent = TIME_FMT.format(now);
  dateEl.textContent = DATE_FMT.format(now);
}

// Flows 1-4 - hovering an app element changes the counter text in
// .App_Counter; leaving it restores "--".
//
// Flow 5 ("SunTzuAI_OpenApp", n30), Flow 6 ("BlendWeb_OpenApp", n55),
// Flow 10 ("BlendEDA_OpenApp", n67), Flow 12 ("BlendACS_OpenApp", n73)
// and Flow 13 ("KinFow_OpenApp", n79) are Click Steps: every click or
// tap on the trigger element goes on only while its gate is open -
// "Sun Tzu AI" for Sun Tzu (n31), "Blend Web" for Blend Web (n49),
// "Blend EDA" for Blend EDA (n60), "Blend ACS" for Blend ACS (n68) and
// "Kin Flow" for Kin Flow (n75); all start open. If it's open: close the
// app's own gate, then play the Blender "Open/Close Animation" timeline
// clip (frames 0-12, 0.5s, linear, stays on the last frame) on the app.
// Flow 5 goes on: Wait 1s (n90), set .Sun_Tzu_AI_Content's display to
// flex (n92), then fade it in to opacity 0.5 over 0.6s ease-out (n93).
// Flows 7, 8, 9, 11 and 14 are the Double Click (or double-tap) steps
// (n57, n58, n64, n71, n81): play the app's "Open/Close Animation"
// backwards (all its keys, 0.5s, linear, staying on the first frame),
// then re-open the app's gate.
// App Links (n85-n89) and Link Delay (n83): the site's address +
// #sun-tzu-ai, #blend-web, #blend-eda, #blend-acs or #kin-flow opens
// the matching app's click flow - on page load it waits until the page
// is ready plus 1 more second, while an app is open its hash shows in
// the address bar and the tab title is the app name, the Back button
// closes it, and an unknown hash just shows the normal page.
// Note: the "BlendWeb_OpenApp" trigger and Flow 2's hover reference
// class .Blen_Web; the Blend Web div carries it as a second class so
// those wired triggers resolve to the .Blend_Web element.
document.addEventListener('DOMContentLoaded', function () {
  // Gates (Flow > Branches / Open / Close Gate nodes).
  var gates = { 'Sun Tzu AI': true, 'Blend Web': true, 'Blend EDA': true, 'Blend ACS': true, 'Kin Flow': true };

  var apps = [
    {
      clickSelector: '.Sun_Tzu_AI',              // n30 Click Step "SunTzuAI_OpenApp"
      dblSelector: '.Sun_Tzu_AI',                // n57 Double Click
      targets: '.Sun_Tzu_AI',
      gateCheck: 'Sun Tzu AI',                   // n31: go on only if open
      gate: 'Sun Tzu AI',
      play: 'bw-play-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12',
      rev: 'bw-reverse-sun-tzu-ai-sun-tzu-ai-open-close-animation',
      openMoveKey: 'bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12-move',
      moveKey: 'bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move',
      openSeq: 0,
      // Flow 5 steps 1.3-1.5 (n53 -> n90 -> n92 -> n93): once the open
      // animation has run, wait 1s, set .Sun_Tzu_AI_Content's display to
      // flex, then fade it in to opacity 0.5 over 0.6s (ease-out).
      afterOpen: function () {
        var app = this;
        var seq = (app.openSeq = app.openSeq + 1);
        var el = document.querySelector(app.targets);
        if (!el) return;
        el.addEventListener('animationend', function shown(e) {
          if (e.animationName !== app.openMoveKey) return;
          el.removeEventListener('animationend', shown);
          setTimeout(function () {               // n90: wait 1 second
            if (app.openSeq !== seq || !app.isOpen) return;
            var content = document.querySelector('.Sun_Tzu_AI_Content');
            if (!content) return;
            content.style.display = 'flex';      // n92: display = flex
            content.style.transition = 'opacity 0.6s ease-out';
            content.style.opacity = '0';
            void content.offsetWidth;            // start the fade from 0
            content.style.opacity = '0.5';       // n93: fade in to 0.5
          }, 1000);
        });
      },
      // put the content back so the next open replays steps 1.3-1.5
      onClose: function () {
        this.openSeq++;
        var content = document.querySelector('.Sun_Tzu_AI_Content');
        if (!content) return;
        content.style.transition = '';
        content.style.opacity = '';
        content.style.display = '';
      }
    },
    {
      clickSelector: '.Blen_Web',                // n55 Click Step "BlendWeb_OpenApp"
      dblSelector: '.Blend_Web',                 // n58 Double Click
      targets: '.Blend_Web',
      gateCheck: 'Blend Web',                    // n49: go on only if open
      gate: 'Blend Web',
      play: 'bw-play-blend-web-blend-web-open-close-animation-0-12',
      rev: 'bw-reverse-blend-web-blend-web-open-close-animation',
      openMoveKey: 'bw-blend-web-blend-web-open-close-animation-0-12-move',
      moveKey: 'bw-blend-web-blend-web-open-close-animation-move'
    },
    {
      clickSelector: '.Blend_EDA',               // n67 Click Step "BlendEDA_OpenApp"
      dblSelector: '.Blend_EDA',                 // n64 Double Click
      targets: '.Blend_EDA',
      gateCheck: 'Blend EDA',                    // n60: go on only if open
      gate: 'Blend EDA',
      play: 'bw-play-blend-eda-blend-eda-open-close-animation-0-12',
      rev: 'bw-reverse-blend-eda-blend-eda-open-close-animation',
      openMoveKey: 'bw-blend-eda-blend-eda-open-close-animation-0-12-move',
      moveKey: 'bw-blend-eda-blend-eda-open-close-animation-move'
    },
    {
      clickSelector: '.Blend_ACS',               // n73 Click Step "BlendACS_OpenApp"
      dblSelector: '.Blend_ACS',                 // n71 Double Click
      targets: '.Blend_ACS',
      gateCheck: 'Blend ACS',                    // n68: go on only if open
      gate: 'Blend ACS',
      play: 'bw-play-blend-acs-blend-acs-open-close-animation-0-12',
      rev: 'bw-reverse-blend-acs-blend-acs-open-close-animation',
      openMoveKey: 'bw-blend-acs-blend-acs-open-close-animation-0-12-move',
      moveKey: 'bw-blend-acs-blend-acs-open-close-animation-move'
    },
    {
      clickSelector: '.Kin_Flow',                // n80 Click Step "KinFow_OpenApp"
      dblSelector: '.Kin_Flow',                  // n82 Double Click
      targets: '.Kin_Flow',
      gateCheck: 'Kin Flow',                     // n76: go on only if open
      gate: 'Kin Flow',
      play: 'bw-play-kin-flow-kin-flow-open-close-animation-0-12',
      rev: 'bw-reverse-kin-flow-kin-flow-open-close-animation',
      openMoveKey: 'bw-kin-flow-kin-flow-open-close-animation-0-12-move',
      moveKey: 'bw-kin-flow-kin-flow-open-close-animation-move'
    }
  ];

  // An app left fully open covers the whole page: pause the background
  // canvases until it starts closing.
  function refreshCovered() {
    var covered = false;
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].isOpen) { covered = true; break; }
    }
    if (covered === bgCovered) return;
    bgCovered = covered;
    if (running()) startLoop(); else stopLoop();
  }

  function replayAnimation(app, cls) {
    document.querySelectorAll(app.targets).forEach(function (el) {
      el.classList.remove(app.play, app.rev);
      void el.offsetWidth;                       // restart the animation
      el.classList.add(cls);
    });
  }

  // App links (n85-n89): each hash runs its element's click flow.
  var appLinks = [
    { hash: '#sun-tzu-ai', targets: '.Sun_Tzu_AI', title: 'Sun Tzu AI' },
    { hash: '#blend-web', targets: '.Blend_Web', title: 'Blend Web' },
    { hash: '#blend-eda', targets: '.Blend_EDA', title: 'Blend EDA' },
    { hash: '#blend-acs', targets: '.Blend_ACS', title: 'Blend ACS' },
    { hash: '#kin-flow', targets: '.Kin_Flow', title: 'Kin Flow' }
  ];
  var baseTitle = document.title;
  var openLink = null;                           // link whose app is open

  function findLink(hash) {
    for (var i = 0; i < appLinks.length; i++) {
      if (appLinks[i].hash === hash) return appLinks[i];
    }
    return null;
  }
  function linkFor(targets) {
    for (var i = 0; i < appLinks.length; i++) {
      if (appLinks[i].targets === targets) return appLinks[i];
    }
    return null;
  }
  function findAppByTarget(targets) {
    for (var i = 0; i < apps.length; i++) {
      if (apps[i].targets === targets) return apps[i];
    }
    return null;
  }
  function showHash(hash) {
    try { history.pushState(null, '', hash); }
    catch (e) { location.hash = hash; }
  }
  function clearHash() {
    try { history.pushState(null, '', location.pathname + location.search); }
    catch (e) {
      try { history.replaceState(null, '', location.pathname + location.search); }
      catch (e2) { /* keep the hash */ }
    }
  }

  apps.forEach(function (app) {
    // Runs the app's click flow once; viaLink = the app link that
    // triggered it (address already shows its hash, keeps its title).
    function openApp(viaLink) {
      if (!gates[app.gateCheck]) return;         // gate closed: stop here
      gates[app.gate] = false;                   // close the app's gate
      var el0 = document.querySelector(app.targets);
      replayAnimation(app, app.play);            // play frames 0-12
      if (el0) {
        el0.addEventListener('animationend', function covered(e) {
          if (e.animationName !== app.openMoveKey) return;
          el0.removeEventListener('animationend', covered);
          app.isOpen = true;                     // app window covers the page
          refreshCovered();
        });
      }
      var link = viaLink || linkFor(app.targets);
      if (link && openLink !== link) {
        openLink = link;
        document.title = link.title;
        if (!viaLink) showHash(link.hash);       // put the link in the address bar
      }
      if (app.afterOpen) app.afterOpen();        // rest of the click flow
    }
    // Runs the app's double-click flow; fromPop = the browser's Back
    // button already took the hash out of the address bar.
    function closeApp(fromPop) {
      app.isOpen = false;                        // uncover the background
      refreshCovered();
      if (app.onClose) app.onClose();            // reset what the open flow showed
      replayAnimation(app, app.rev);             // play it backwards
      var el = document.querySelector(app.targets);
      if (!el) { gates[app.gate] = true; return; }
      el.addEventListener('animationend', function reopen(e) {
        if (e.animationName !== app.moveKey) return;
        el.removeEventListener('animationend', reopen);
        gates[app.gate] = true;                  // open the app's gate
      });
      if (openLink && openLink.targets === app.targets) {
        openLink = null;
        document.title = baseTitle;
        if (!fromPop) clearHash();               // take the link out of the address bar
      }
    }
    app.open = openApp;
    app.close = closeApp;
    var lastTap = 0;
    document.querySelectorAll(app.clickSelector).forEach(function (el) {
      el.addEventListener('click', function () { openApp(); });
      el.addEventListener('touchend', function (e) {
        e.preventDefault();                      // don't double-fire via click
        var now = Date.now();
        if (now - lastTap < 350) {               // double-tap
          lastTap = 0;
          closeApp();
        } else {
          lastTap = now;
          openApp();
        }
      });
    });
    document.querySelectorAll(app.dblSelector).forEach(function (el) {
      el.addEventListener('dblclick', function () { closeApp(); });
    });
  });

  // Back / Forward: a matching hash opens its app, anything else closes
  // the open one instead of leaving the site.
  window.addEventListener('popstate', function () {
    var link = findLink(location.hash);
    var closedSameTarget = false;
    if (openLink && openLink !== link) {
      var app = findAppByTarget(openLink.targets);
      closedSameTarget = !!(link && app && link.targets === openLink.targets);
      openLink = null;
      document.title = baseTitle;
      if (app) app.close(true);
    }
    if (link && openLink !== link) {
      var opener = findAppByTarget(link.targets);
      if (!opener) return;
      if (closedSameTarget) {
        // the element just started closing; reopen once its gate reopens
        setTimeout(function () {
          if (findLink(location.hash) === link) opener.open(link);
        }, 600);
      } else {
        opener.open(link);
      }
    }
  });

  // Page loaded with an app link: wait until ready, then 1 more second
  // (Link Delay n83), then run that element's click flow once. An
  // unknown hash just shows the normal page.
  setTimeout(function () {
    var link = findLink(location.hash);
    if (link && !openLink) {
      var app = findAppByTarget(link.targets);
      if (app) app.open(link);
    }
  }, 1000);

  var appCounter = document.querySelector('.App_Counter');
  var flows = [
    ['.Sun_Tzu_AI', 'Sun Tzu AI'],
    ['.Blen_Web', 'Blend Web'],
    ['.Blend_EDA', 'Blend EDA'],
    ['.Blend_ACS', 'Owl']
  ];
  flows.forEach(function (f) {
    var show = function () { appCounter.textContent = f[1]; };
    var hide = function () { appCounter.textContent = '--'; };
    document.querySelectorAll(f[0]).forEach(function (el) {
      el.addEventListener('mouseenter', show);
      el.addEventListener('mouseleave', hide);
      el.addEventListener('touchstart', show, { passive: true });
      el.addEventListener('touchend', hide);
      el.addEventListener('touchcancel', hide);
    });
  });

  gradCanvas = document.querySelector('.Front_Page_Visual_Effects');
  fxCanvas = document.getElementById('bw-fx-overlay');
  ctx = fxCanvas.getContext('2d');
  useGL = initGL();
  // A lost WebGL context switches to the 2D fallback; a restored one
  // comes back up as WebGL.
  gradCanvas.addEventListener('webglcontextlost', function (e) {
    e.preventDefault();
    useGL = false;
    gl = null;
    syncSize();
  });
  gradCanvas.addEventListener('webglcontextrestored', function () {
    useGL = initGL();
    syncSize();
  });

  timeEl = document.querySelector('.Front_Page_Time');
  dateEl = document.querySelector('.Front_Page_Date');
  tickClock();                        // the shared loop keeps it ticking

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  calm = reduced.matches;
  if (reduced.addEventListener) {
    reduced.addEventListener('change', function () {
      calm = reduced.matches;
      if (calm) drawStill();
    });
  }

  syncSize();
  spawnDots();
  drawStill();

  window.addEventListener('resize', function () {
    syncSize();
    if (calm || !running()) drawStill();
  });
  // the canvases are fixed at 0,0 and cover the viewport: client
  // coordinates map straight onto them (no layout reads needed)
  function updatePointer(clientX, clientY) {
    mouseX = clientX;
    mouseY = clientY;
  }
  window.addEventListener('mousemove', function (e) {
    updatePointer(e.clientX, e.clientY);
  });
  window.addEventListener('touchmove', function (e) {
    if (e.touches.length > 0) {
      updatePointer(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
  function clearPointer() {
    mouseX = null;
    mouseY = null;
  }
  document.addEventListener('mouseleave', clearPointer);
  window.addEventListener('touchend', clearPointer);
  window.addEventListener('touchcancel', clearPointer);
  document.addEventListener('visibilitychange', function () {
    if (running()) { tickClock(); startLoop(); } else { stopLoop(); }
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (running()) startLoop(); else stopLoop();
    }).observe(fxCanvas);
  }

  startLoop();
});
