// Components (Blend Web node logic):
// - .Front_Page_Visual_Effects (n44, n49): a full-screen <canvas> in the
//   page background - above #bw-Rectangle-007, below every content
//   element. It draws two animated gradients with identical motion
//   (135deg, colors repeating so the first color comes again at the end,
//   2-3 bands visible, breathing from 60% to 200% of the area's gradient
//   length and back every 12s, bent into a sine wave 30% of the area's
//   height, ~1.5 waves across the width, travelling sideways a full wave
//   every 4s). n44 runs linear-gradient(135deg, #d5cbd3, #848ab1) from
//   page load; after the Wait node (n45, 1s) n49 runs
//   linear-gradient(135deg, #d5988b, #55aeb1): it fades in and the two
//   schemes keep slowly alternating. Then on top of them:
// - Waves (n38): 4 smooth, layered sine waves gently moving inside a
//   100px-high band at the bottom of the page, filled in #ffffff.
// - Particle network (n43): 80 slowly drifting dots joined by faint lines
//   when close, drawn in #ffffff, gently reaching toward the mouse.
// The canvas is sharp on retina (backing store scaled by devicePixelRatio),
// resizes with the window, pauses while off screen or the tab is hidden,
// and stays calm when the user prefers reduced motion.

var WAVE_COLOR = '#ffffff';
var WAVE_BAND = 100;     // px-high band at the bottom of the page

var DOT_COUNT = 80;
var LINK_DIST = 120;     // px; dots closer than this get a faint line
var DOT_SPEED = 12;      // px/s drift
var MOUSE_PULL = 18;     // px/s reach toward the mouse

// Bent breathing gradients on .Front_Page_Visual_Effects (n48, n49):
// linear-gradient(135deg, #d5cbd3, #848ab1) from page load, then after the
// 1s Wait (n45) linear-gradient(135deg, #d5988b, #55aeb1) joins in and the
// two schemes keep alternating. Colors repeat so the first color comes
// again at the end of each cycle (2-3 bands visible). The gradient's
// length breathes from 60% to 200% of the area's gradient length and back
// once every 12s, and the color bands are bent into waves 30% of the
// area's height, ~1.5 waves across the width, travelling sideways one
// full wave every 4s.
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
var DIST_STRIP = 4;      // px: column width used to draw the bent gradient
var GRAD2_DELAY = 1;     // s: Wait node before the second gradient starts
var GRAD_XFADE = 24;     // s for a full there-and-back crossfade

// Back-to-front wave layers inside the 100px band (base = band centre).
var WAVE_LAYERS = [
  { alpha: 0.30, amp: 13, freq: 0.012, speed: 0.45,  yOff: -21 },
  { alpha: 0.45, amp: 11, freq: 0.008, speed: -0.32, yOff: -7 },
  { alpha: 0.65, amp: 8,  freq: 0.016, speed: 0.24,  yOff:  7 },
  { alpha: 0.85, amp: 6,  freq: 0.006, speed: -0.18, yOff:  21 }
];

var canvas = null;       // .Front_Page_Visual_Effects
var ctx = null;
var cssW = 0;
var cssH = 0;
var gradSrc1 = null;     // offscreen canvas holding the first flat gradient
var gradSrc2 = null;     // offscreen canvas holding the second flat gradient

var rafId = null;
var lastFrame = 0;
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

  gradSrc1 = buildGradientSource(dpr, GRAD_A, GRAD_B);
  gradSrc2 = buildGradientSource(dpr, GRAD2_A, GRAD2_B);
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

// Pre-render the repeating gradient (one tile = one A -> B -> A cycle,
// P = the area's gradient length) into a texture in screen orientation.
// It is big enough for the tightest breathe (sample factor 1/GRAD_MIN)
// plus the wave's vertical shift at top and bottom.
function buildGradientSource(dpr, colorA, colorB) {
  var aMax = 1 / GRAD_MIN;
  var A = distAmp();
  var texW = Math.ceil(aMax * cssW) + 2;
  var texH = Math.ceil(aMax * (cssH + 2 * A)) + 2;

  var src = document.createElement('canvas');
  src.width = Math.max(1, Math.round(texW * dpr));
  src.height = Math.max(1, Math.round(texH * dpr));
  var gctx = src.getContext('2d');
  gctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  var P = Math.max(2, Math.round(gradAxisLen() * dpr));
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

  // Rotate the user space so the pattern's x-axis follows the gradient
  // axis, then fill the texture's bounding box: the cycle repeats
  // endlessly along the axis.
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

// How much of the second gradient is showing: 0 until the Wait node's 1s
// has passed, then a smooth 0 -> 1 -> 0 loop so the two color schemes
// keep alternating.
function secondGradientMix(tSec) {
  var t2 = tSec - GRAD2_DELAY;
  if (t2 <= 0) return 0;
  return (1 - Math.cos(2 * Math.PI * t2 / GRAD_XFADE)) / 2;
}

// The node's gradient drawn in thin columns. Screen point q = (x, y + dy)
// (each column shifted by the sine wave) is sampled from the texture at
// centre + a * (q - centre), where a = 1/breatheScale: zooming the sample
// window makes the gradient's length grow / shrink. The wave bends the
// colour bands by 30% of the area's height, ~1.5 waves across, moving a
// full wave every DIST_LOOP seconds.
function drawBentGradient(src, tSec, alpha) {
  var dpr = window.devicePixelRatio || 1;
  var A = distAmp();
  var lambda = cssW / DIST_WAVES;
  var phase = 2 * Math.PI * tSec / DIST_LOOP;
  var a = 1 / breatheScale(tSec);
  var texCx = src.width / (2 * dpr);
  var texCy = src.height / (2 * dpr);
  var cx = cssW / 2;
  var cy = cssH / 2;
  ctx.globalAlpha = alpha;
  for (var x = 0; x < cssW; x += DIST_STRIP) {
    var w = Math.min(DIST_STRIP, cssW - x);
    var dy = A * Math.sin(2 * Math.PI * (x + w / 2) / lambda - phase);
    ctx.drawImage(src,
      (texCx + a * (x - cx)) * dpr,
      (texCy + a * (dy - cy)) * dpr,
      a * w * dpr, a * cssH * dpr,
      x, 0, w, cssH);
  }
  ctx.globalAlpha = 1;
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
function drawWaves(tSec) {
  var base = cssH - WAVE_BAND / 2;
  for (var li = 0; li < WAVE_LAYERS.length; li++) {
    var L = WAVE_LAYERS[li];
    ctx.globalAlpha = L.alpha;
    ctx.fillStyle = WAVE_COLOR;
    ctx.beginPath();
    ctx.moveTo(0, cssH);
    for (var x = 0; x <= cssW; x += 3) {
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
  ctx.clearRect(0, 0, cssW, cssH);
  drawBentGradient(gradSrc1, tSec, 1);
  var mix = secondGradientMix(tSec);
  if (mix > 0) drawBentGradient(gradSrc2, tSec, mix);
  drawWaves(tSec);
  drawDots();
}

// One still frame of everything, used for reduced motion and after resizes
// while the loop is paused.
function drawStill() {
  drawScene(0);
}

function running() {
  return onScreen && !document.hidden && !calm;
}

function frame(t) {
  rafId = null;
  if (!running()) return;
  rafId = requestAnimationFrame(frame);
  var tSec = t / 1000;
  var dt = lastFrame ? Math.min(t - lastFrame, 100) : 16;
  lastFrame = t;

  stepDots(dt / 1000);
  drawScene(tSec);
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
// and Flow 13 ("KinFow_OpenApp", n80) are Click Steps: every click or
// tap on the trigger element goes on only while its gate is open -
// "Sun Tzu AI" for Sun Tzu (n31), "Blend Web" for Blend Web (n49),
// "Blend EDA" for Blend EDA (n60), "Blend ACS" for Blend ACS (n68) and
// "Kin Flow" for Kin Flow (n76); all start open. If it's open: close the
// app's own gate, then play the Blender "Open/Close Animation" timeline
// clip (frames 0-12, 0.5s, linear, stays on the last frame) on the app.
// Flows 7, 8, 9, 11 and 14 are the Double Click (or double-tap) steps
// (n57, n58, n64, n71, n82): play the app's "Open/Close Animation"
// backwards (all its keys, 0.5s, linear, staying on the first frame),
// then re-open the app's gate.
// App Links (n83-n87, n90) and Link Delay (n88): the site's address +
// #sun-tzu-ai, #blend-web, #blend-eda, #blend-acs, #kin-flow or
// #https-sozin-x-com-suntzuai opens the matching app's click flow -
// on page load it waits until the page is ready plus 1 more second,
// while an app is open its hash shows in the address bar and the tab
// title is the app name, the Back button closes it, and an unknown
// hash just shows the normal page.
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
      moveKey: 'bw-sun-tzu-ai-sun-tzu-ai-open-close-animation-move'
    },
    {
      clickSelector: '.Blen_Web',                // n55 Click Step "BlendWeb_OpenApp"
      dblSelector: '.Blend_Web',                 // n58 Double Click
      targets: '.Blend_Web',
      gateCheck: 'Blend Web',                    // n49: go on only if open
      gate: 'Blend Web',
      play: 'bw-play-blend-web-blend-web-open-close-animation-0-12',
      rev: 'bw-reverse-blend-web-blend-web-open-close-animation',
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
      moveKey: 'bw-kin-flow-kin-flow-open-close-animation-move'
    }
  ];

  function replayAnimation(app, cls) {
    document.querySelectorAll(app.targets).forEach(function (el) {
      el.classList.remove(app.play, app.rev);
      void el.offsetWidth;                       // restart the animation
      el.classList.add(cls);
    });
  }

  // App links (n83-n87, n90): each hash runs its element's click flow.
  // The first link listed for an element is the one a click shows in
  // the address bar; #https-sozin-x-com-suntzuai (n90) is an extra
  // address that opens .Blend_ACS but titles the tab "Sun Tzu AI".
  var appLinks = [
    { hash: '#sun-tzu-ai', targets: '.Sun_Tzu_AI', title: 'Sun Tzu AI' },
    { hash: '#blend-web', targets: '.Blend_Web', title: 'Blend Web' },
    { hash: '#blend-eda', targets: '.Blend_EDA', title: 'Blend EDA' },
    { hash: '#blend-acs', targets: '.Blend_ACS', title: 'Blend ACS' },
    { hash: '#kin-flow', targets: '.Kin_Flow', title: 'Kin Flow' },
    { hash: '#https-sozin-x-com-suntzuai', targets: '.Blend_ACS', title: 'Sun Tzu AI' }
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
      replayAnimation(app, app.play);            // play frames 0-12
      var link = viaLink || linkFor(app.targets);
      if (link && openLink !== link) {
        openLink = link;
        document.title = link.title;
        if (!viaLink) showHash(link.hash);       // put the link in the address bar
      }
    }
    // Runs the app's double-click flow; fromPop = the browser's Back
    // button already took the hash out of the address bar.
    function closeApp(fromPop) {
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
  // (Link Delay n88), then run that element's click flow once. An
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
      if (calm) { stopLoop(); drawStill(); } else { startLoop(); }
    });
  }

  syncSize();
  spawnDots();
  drawStill();

  window.addEventListener('resize', function () {
    syncSize();
    if (!running()) drawStill();
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
  document.addEventListener('mouseleave', clearPointer);
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
