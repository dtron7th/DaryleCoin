// Components (Blend Web node logic):
// - .Front_Page_Visual_Effects (n40, n45): a full-screen <canvas> in the
//   page background - above #bw-Rectangle-007, below every content
//   element - carrying the two animated gradients on the GPU: a WebGL
//   fragment shader on one full-screen triangle computes the colour per
//   pixel (135deg, each colour scheme repeating so the first colour
//   comes again at the end, 2-3 bands visible, the gradient's length
//   breathing from 60% to 200% of the area's gradient length and back
//   every 12s, the bands bent into a wave 30% of the area's height,
//   ~1.5 waves across the width, travelling sideways one full wave
//   every 4s). n40 runs linear-gradient(135deg, #d5cbd3, #848ab1) from
//   page load; after the Wait node (n41, 1s) n45's
//   linear-gradient(135deg, #d5988b, #55aeb1) cross-fades in inside the
//   same shader and the two schemes keep slowly alternating. When WebGL
//   is not available the same bending is drawn in column strips on the
//   overlay's 2D canvas as a fallback.
// - #bw-fx-overlay: a second, transparent 2D canvas above the gradient:
//   - Waves (n34): 4 smooth, layered sine waves gently moving inside a
//     100px-high band at the bottom of the page, filled in #ffffff.
//   - Particle network (n39): 80 slowly drifting dots joined by faint
//     lines when close (lines batched into 4 opacity groups - one path
//     and one stroke() per group - and all dots in one path and one
//     fill()), drawn in #ffffff, gently reaching toward the mouse; a
//     touch (pointer: coarse) device gets half the dots.
// Everything (shader + canvas drawing + the header clock) runs from ONE
// shared requestAnimationFrame loop: drawing is capped at 60 fps even on
// faster screens, motion uses real elapsed time clamped at 100 ms, the
// gradient's backing store is capped at 1.5x devicePixelRatio (the overlay
// with the waves and dots always uses the screen's own, up to 2x) and steps down
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

// Bent breathing gradients on .Front_Page_Visual_Effects (n40, n45):
// linear-gradient(135deg, #d5cbd3, #848ab1) from page load, then after the
// 1s Wait (n41) linear-gradient(135deg, #d5988b, #55aeb1) joins in and the
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
var pxScale = 1;                       // CSS px -> backing store px (gradient)
var fxScale = 1;                       // CSS px -> backing store px (overlay)

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
  // the overlay (waves, dots and their lines) is sharp line work: it is
  // always drawn at the screen's own resolution - a stretched low-res
  // canvas makes it blurry - and only the soft gradient canvas is scaled
  // down. (Without WebGL the gradient is drawn on the overlay too, so it
  // then follows the gradient's scale.)
  fxScale = useGL ? Math.min(window.devicePixelRatio || 1, 2) : pxScale;
  fxCanvas.width = Math.round(cssW * fxScale);
  fxCanvas.height = Math.round(cssH * fxScale);
  ctx.setTransform(fxScale, 0, 0, fxScale, 0, 0);
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
  // draw at ~60 fps on faster screens. (13 ms, not 16.67: on a 60 Hz
  // screen the frames come 16.6-16.7 ms apart, and a tighter test skipped
  // every other one - 30 fps, which also read as "slow" and dropped the
  // canvas detail for no reason.)
  if (t - lastDraw < 13) return;
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

// ---- node flows ----
//
// Flows 1, 2, 3, 14 and 15 - hovering an app tile changes the counter
// text in .App_Counter (the Change Text nodes' un-chosen element);
// leaving it restores "--".
//
// Flow 4 ("SunTzuAI_OpenApp") is the only Click Step with steps wired:
// every click or tap on .Sun_Tzu_AI goes on only while the "Sun Tzu AI"
// gate is open (it starts open). If it's open: close the gate, play the
// Blender "Sun Tzu AI-Open/Close Animation" (frames 0-12, 0.5s, linear -
// the action has no keys, so nothing moves; its z-index key lifts the
// tile above the others), Wait 0.5s, set .Sun_Tzu_AI_Content's display
// to flex, then fade it in to opacity 1 over 0.5s (ease-out).
// Flows 5, 9, 11 and 12 ("BlendWeb_OpenApp" on .Blen_Web,
// "BlendEDA_OpenApp", "BlendACS_OpenApp", "KinFow_OpenApp") have nothing
// connected: a click on those tiles does nothing yet.
//
// Flow 6 is the Double Click (or double-tap) step on .Sun_Tzu_AI: play
// the animation backwards (staying on the first frame) and open the
// gate again - the app window hides so the next click can reopen it.
// Flows 7, 8, 10 and 13 are the other tiles' double-click steps, also
// with nothing connected.
//
// App Links (n60-n64): the site's address + #sun-tzu-ai, #blend-web,
// #blend-eda, #blend-acs or #kin-flow runs that tile's click flow once -
// on page load it waits until the page is ready plus 1 more second.
// While an app is open its hash shows in the address bar and the tab
// title is the app name; the Back button closes it; an unknown hash
// just shows the normal page. Only Sun Tzu AI's click flow is wired, so
// the other four links simply run an empty flow - the normal page.
document.addEventListener('DOMContentLoaded', function () {
  var gateSunTzuAI = true;             // "Sun Tzu AI" gate, starts open
  var sunTile = document.querySelector('.Sun_Tzu_AI');
  var sunContent = document.querySelector('.Sun_Tzu_AI_Content');
  var sunOpen = false;                 // the app window is showing
  var sunSeq = 0;                      // cancels stale open steps

  var PLAY_CLS = 'bw-play-sun-tzu-ai-sun-tzu-ai-open-close-animation-0-12';
  var REV_CLS = 'bw-reverse-sun-tzu-ai-sun-tzu-ai-open-close-animation';

  var baseTitle = document.title;

  // App links (n60-n64): each hash runs its element's click flow.
  var appLinks = {
    '#sun-tzu-ai': { title: 'Sun Tzu AI' },
    '#blend-web': { title: 'Blend Web' },
    '#blend-eda': { title: 'Blend EDA' },
    '#blend-acs': { title: 'Blend ACS' },
    '#kin-flow': { title: 'Kin Flow' }
  };
  var openHash = null;                 // hash of the currently open app

  // The open app window covers the whole page: pause the background
  // canvases while it's up.
  function setCovered(covered) {
    if (covered === bgCovered) return;
    bgCovered = covered;
    if (running()) startLoop(); else stopLoop();
  }

  function replayAnim(cls) {
    sunTile.classList.remove(PLAY_CLS, REV_CLS);
    void sunTile.offsetWidth;          // restart the animation
    sunTile.classList.add(cls);
  }

  function showHash(hash) {
    try { history.pushState(null, '', hash); }
    catch (e) { location.hash = hash; }
  }
  function clearHash() {
    // take the hash out without adding a history entry, so Back
    // afterwards doesn't land on the open app's link and reopen it
    try { history.replaceState(null, '', location.pathname + location.search); }
    catch (e) { /* keep the hash */ }
  }

  // Flow 4 "SunTzuAI_OpenApp"; viaLink = the app link that triggered it
  // (the address already shows its hash, keeps its title).
  function openSunTzuAI(viaLink) {
    if (!gateSunTzuAI) return;                    // step 1: gate closed, stop
    gateSunTzuAI = false;                         // step 1.1: close the gate
    var seq = ++sunSeq;
    replayAnim(PLAY_CLS);                         // step 1.2: play frames 0-12
    setTimeout(function () {                      // step 1.3: wait 0.5s
      if (seq !== sunSeq) return;
      sunContent.style.display = 'flex';          // step 1.4: display = flex
      sunContent.style.transition = 'opacity 0.5s ease-out';
      sunContent.style.opacity = '0';
      void sunContent.offsetWidth;                // start the fade from 0
      sunContent.style.opacity = '1';             // step 1.5: fade in
      sunOpen = true;
      setCovered(true);                           // window covers the page
    }, 500);
    if (!viaLink) {
      openHash = '#sun-tzu-ai';
      document.title = 'Sun Tzu AI';              // app name in the tab title
      showHash('#sun-tzu-ai');                    // link in the address bar
    } else {
      openHash = viaLink;
      document.title = 'Sun Tzu AI';
    }
  }

  // Flow 6 (double click / double tap): play the animation backwards,
  // then open the gate. fromPop = the browser's Back button already took
  // the hash out of the address bar.
  function closeSunTzuAI(fromPop) {
    sunSeq++;                                     // cancel pending open steps
    sunOpen = false;
    replayAnim(REV_CLS);                          // step 1: play it backwards
    sunContent.style.transition = '';
    sunContent.style.opacity = '';
    sunContent.style.display = 'none';            // hide the app window again
    setCovered(false);
    setTimeout(function () {
      gateSunTzuAI = true;                        // step 2: open the gate
    }, 500);
    if (openHash === '#sun-tzu-ai') {
      openHash = null;
      document.title = baseTitle;
      if (!fromPop) clearHash();                  // take the link out
    }
  }

  var lastTap = 0;
  sunTile.addEventListener('click', function () { openSunTzuAI(); });
  sunTile.addEventListener('dblclick', function () { closeSunTzuAI(); });
  sunTile.addEventListener('touchend', function (e) {
    e.preventDefault();                           // don't double-fire via click
    var now = Date.now();
    if (now - lastTap < 350) {                    // double-tap
      lastTap = 0;
      closeSunTzuAI();
    } else {
      lastTap = now;
      openSunTzuAI();
    }
  });

  // Back / Forward: a matching hash opens its app, anything else closes
  // the open one instead of leaving the site. Only #sun-tzu-ai has a
  // wired click flow - the other app links run an empty flow, so they
  // just show the normal page.
  window.addEventListener('popstate', function () {
    if (location.hash === '#sun-tzu-ai') {
      if (!sunOpen && gateSunTzuAI) openSunTzuAI('#sun-tzu-ai');
    } else if (sunOpen) {
      closeSunTzuAI(true);
    } else if (openHash) {
      openHash = null;
      document.title = baseTitle;
    }
  });

  // Page loaded with an app link: wait until ready, then 1 more second
  // (the App Link nodes' "Wait before opening"), then run that element's
  // click flow once. An unknown link just shows the normal page.
  setTimeout(function () {
    if (location.hash === '#sun-tzu-ai' && !sunOpen) {
      openSunTzuAI('#sun-tzu-ai');
    }
    // #blend-web / #blend-eda / #blend-acs / #kin-flow run their tiles'
    // click flows, which have nothing connected yet - nothing happens
  }, 1000);

  var appCounter = document.querySelector('.App_Counter');
  var hoverFlows = [
    ['.Sun_Tzu_AI', 'Sun Tzu AI'],
    ['.Blen_Web', 'Blend Web'],
    ['.Blend_EDA', 'Blend EDA'],
    ['.Blend_ACS', 'Blend ACS'],
    ['.Kin_Flow', 'Kinflow']
  ];
  hoverFlows.forEach(function (f) {
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

  // mark the platform the page is using on <html data-platform=...>
  // (Phone <= 605px, Tablet 606-1093px, Desktop >= 1094px); kept in
  // step with the media queries in style.css as the window resizes
  function setPlatform() {
    var w = window.innerWidth;
    document.documentElement.dataset.platform =
      w <= 605 ? 'phone' : w <= 1093 ? 'tablet' : 'desktop';
  }
  setPlatform();

  syncSize();
  spawnDots();
  drawStill();

  window.addEventListener('resize', function () {
    setPlatform();
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
