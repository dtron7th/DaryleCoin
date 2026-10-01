// Components (Blend Web node logic):
// - Canvas: .Front_Page_Visual_Effects is a <canvas> that covers the whole
//   screen, drawn sharp on retina screens (backing store scaled by
//   devicePixelRatio) and resized with the window. The painted background is
//   linear-gradient(135deg, #d9d9d9, #757575); the canvas steps below draw
//   on it.
// - Waves: 4 smooth, layered sine waves gently moving inside a 100px-high
//   band at the bottom of the page, filled in #c2c2c2. The canvas sits in
//   the page background behind everything. Rendering pauses while it is off
//   screen or the tab is hidden, and stays calm when the user prefers
//   reduced motion. Animation rate: 24 fps.
// - Particle network: 80 slowly drifting dots joined by faint lines when
//   close, drawn in #ffffff. The dots gently reach toward the mouse. Same
//   canvas, same pause/calm rules as the waves.

var BG_GRAD_FROM = '#d9d9d9';
var BG_GRAD_TO = '#757575';
var WAVE_COLOR = '#c2c2c2';
var WAVE_BAND = 100;     // px-high band at the bottom of the page
var FRAME_MS = 1000 / 24;

var DOT_COUNT = 80;
var LINK_DIST = 120;     // px; dots closer than this get a faint line
var DOT_SPEED = 12;      // px/s drift
var MOUSE_PULL = 18;     // px/s reach toward the mouse

// Back-to-front wave layers inside the 100px band (base = band centre).
var WAVE_LAYERS = [
  { alpha: 0.30, amp: 13, freq: 0.012, speed: 0.45,  yOff: -21 },
  { alpha: 0.45, amp: 11, freq: 0.008, speed: -0.32, yOff: -7 },
  { alpha: 0.65, amp: 8,  freq: 0.016, speed: 0.24,  yOff:  7 },
  { alpha: 0.85, amp: 6,  freq: 0.006, speed: -0.18, yOff:  21 }
];

var canvas = null;
var ctx = null;
var cssW = 0;
var cssH = 0;

var rafId = null;
var lastFrame = 0;
var wavePhase = 0;        // seconds of elapsed wave motion
var onScreen = true;
var calm = false;

var dots = [];
var mouseX = null;
var mouseY = null;

var timeEl = null;
var dateEl = null;

function syncSize() {
  var dpr = window.devicePixelRatio || 1;
  cssW = canvas.clientWidth;
  cssH = canvas.clientHeight;

  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.imageSmoothingEnabled = true;
}

function spawnDots() {
  dots = [];
  for (var i = 0; i < DOT_COUNT; i++) {
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
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 1;
  for (var i = 0; i < dots.length; i++) {
    var a = dots[i];
    for (var j = i + 1; j < dots.length; j++) {
      var b = dots[j];
      var dx = a.x - b.x;
      var dy = a.y - b.y;
      var dd = dx * dx + dy * dy;
      if (dd < LINK_DIST * LINK_DIST) {
        ctx.globalAlpha = (1 - Math.sqrt(dd) / LINK_DIST) * 0.35;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 0.9;
  for (var k = 0; k < dots.length; k++) {
    ctx.beginPath();
    ctx.arc(dots[k].x, dots[k].y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

// 4 smooth layered sine waves, gently moving, in the bottom 100px.
function drawWaves() {
  var base = cssH - WAVE_BAND / 2;
  for (var li = 0; li < WAVE_LAYERS.length; li++) {
    var L = WAVE_LAYERS[li];
    ctx.globalAlpha = L.alpha;
    ctx.fillStyle = WAVE_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, cssH);
    for (var x = 0; x <= cssW; x += 3) {
      ctx.lineTo(x, base + L.yOff +
        L.amp * Math.sin(x * L.freq + wavePhase * L.speed + li * 1.7));
    }
    ctx.lineTo(cssW, cssH);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawScene() {
  var gradientRadius = (cssW + cssH) / (2 * Math.SQRT2);
  var grad = ctx.createLinearGradient(
    cssW / 2 - gradientRadius, cssH / 2 - gradientRadius,
    cssW / 2 + gradientRadius, cssH / 2 + gradientRadius
  );
  grad.addColorStop(0, BG_GRAD_FROM);
  grad.addColorStop(1, BG_GRAD_TO);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cssW, cssH);
  drawWaves();
  drawDots();
}

function running() {
  return onScreen && !document.hidden && !calm;
}

function frame(t) {
  rafId = null;
  if (!running()) return;
  rafId = requestAnimationFrame(frame);
  if (t - lastFrame < FRAME_MS - 1) return; // cap at 24 fps
  var dt = lastFrame ? Math.min(t - lastFrame, 100) : FRAME_MS;
  lastFrame = t;

  wavePhase += dt / 1000;
  stepDots(dt / 1000);
  drawScene();
}

function startLoop() {
  lastFrame = 0;
  if (rafId === null && running()) rafId = requestAnimationFrame(frame);
}

function stopLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

// Clock header: .Front_Page_Time shows the live time as h:mm:ss am/pm
// and .Front_Page_Date shows the date as "Month Dth, YYYY".
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

function ordinal(n) {
  var s = ['th', 'st', 'nd', 'rd'], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function pad(n, w) {
  var s = String(n);
  while (s.length < w) s = '0' + s;
  return s;
}

function tickClock() {
  var now = new Date();
  var h = now.getHours();
  var ampm = h < 12 ? 'am' : 'pm';
  h = h % 12 || 12;
  timeEl.textContent = h + ':' + pad(now.getMinutes(), 2) + ':' +
    pad(now.getSeconds(), 2) + ' ' + ampm;
  dateEl.textContent = MONTHS[now.getMonth()] + ' ' +
    ordinal(now.getDate()) + ', ' + now.getFullYear();
}

// Flows 1-4 - hovering an app tile shows its name in .App_Counter;
// leaving it restores "--".
document.addEventListener('DOMContentLoaded', function () {
  var appCounter = document.querySelector('.App_Counter');
  var flows = [
    ['.App_1', 'Sun Tzu AI'],
    ['.App_2', 'Blend Web'],
    ['.App_3', 'B-SMC'],
    ['.App_4', 'Owl']
  ];
  flows.forEach(function (f) {
    var el = document.querySelector(f[0]);
    var show = function () { appCounter.textContent = f[1]; };
    var hide = function () { appCounter.textContent = '--'; };
    el.addEventListener('mouseenter', show);
    el.addEventListener('mouseleave', hide);
    el.addEventListener('touchstart', show, { passive: true });
    el.addEventListener('touchend', hide);
    el.addEventListener('touchcancel', hide);
  });

  canvas = document.querySelector('.Front_Page_Visual_Effects');
  ctx = canvas.getContext('2d');

  timeEl = document.querySelector('.Front_Page_Time');
  dateEl = document.querySelector('.Front_Page_Date');
  tickClock();
  setInterval(tickClock, 50);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  calm = reduced.matches;
  if (reduced.addEventListener) {
    reduced.addEventListener('change', function () {
      calm = reduced.matches;
      if (calm) stopLoop(); else startLoop();
      drawScene();
    });
  }

  syncSize();
  spawnDots();
  drawScene();

  window.addEventListener('resize', function () {
    syncSize();
    drawScene();
  });
  function updatePointer(clientX, clientY) {
    var r = canvas.getBoundingClientRect();
    mouseX = clientX - r.left;
    mouseY = clientY - r.top;
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
  window.addEventListener('mouseout', clearPointer);
  window.addEventListener('touchend', clearPointer);
  window.addEventListener('touchcancel', clearPointer);
  document.addEventListener('visibilitychange', function () {
    if (running()) startLoop(); else stopLoop();
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (running()) startLoop(); else stopLoop();
    }).observe(canvas);
  }

  startLoop();
});
