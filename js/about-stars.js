// About page: faint "constellation" behind the team wheel.
//  - Points drift slowly and join with hairlines when they pass near each other; a few are small four-point stars.
//  - With a mouse, points near the cursor brighten and link to it. Touch screens get the ambient version only.
//  - One canvas inside #wheelSticky (under the wheel and cards), redrawn only while the section is on screen.
//  - Reduced motion: one still frame, no loop.
(function () {
  var host = document.getElementById("wheelSticky");
  if (!host) return;
  var cv = document.createElement("canvas");
  cv.className = "wheel-stars";
  cv.setAttribute("aria-hidden", "true");
  host.insertBefore(cv, host.firstChild);
  var ctx = cv.getContext("2d");
  if (!ctx) return;

  var INTENSITY = 0.3;                       // well below the "Subtle" preview (0.6)
  var GOLD = "192,138,46", AMB = "217,164,65", DEEP = "150,104,30";
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var W = 0, H = 0, pts = [], mouse = { x: -999, y: -999, on: false };
  var running = false, visible = true, last = 0;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function build() {
    var n = Math.round(W * H / 11000 * (0.7 + INTENSITY * 0.6));
    pts = [];
    for (var i = 0; i < n; i++) {
      var a = rnd(0, 6.283), v = rnd(4, 10);
      pts.push({ x: rnd(0, W), y: rnd(0, H), vx: Math.cos(a) * v, vy: Math.sin(a) * v, star: i % 7 === 0 });
    }
  }
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = host.clientWidth, h = host.clientHeight;
    if (!w || !h || (w === W && h === H)) return;
    W = w; H = h;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
    if (!running) draw(0);
  }

  function orb(x, y, r, a, col) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, "rgba(" + col + "," + a + ")");
    g.addColorStop(0.35, "rgba(" + col + "," + (a * 0.35) + ")");
    g.addColorStop(1, "rgba(" + col + ",0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
  }
  function spark(x, y, r, a, col) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r * 1.7);
    g.addColorStop(0, "rgba(" + col + "," + (a * 0.5) + ")");
    g.addColorStop(1, "rgba(" + col + ",0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * 1.7, 0, 6.283); ctx.fill();
    var k = r * 0.14;
    ctx.save(); ctx.translate(x, y);
    ctx.fillStyle = "rgba(" + col + "," + a + ")"; ctx.beginPath();
    ctx.moveTo(0, -r); ctx.quadraticCurveTo(k, -k, r, 0); ctx.quadraticCurveTo(k, k, 0, r);
    ctx.quadraticCurveTo(-k, k, -r, 0); ctx.quadraticCurveTo(-k, -k, 0, -r); ctx.fill();
    ctx.restore();
  }

  function draw(dt) {
    ctx.clearRect(0, 0, W, H);
    var L = 130 + 30 * INTENSITY, i, j, p;
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
    }
    ctx.lineWidth = 1;
    for (i = 0; i < pts.length; i++) {
      for (j = i + 1; j < pts.length; j++) {
        var dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        if (dx > L || dx < -L || dy > L || dy < -L) continue;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < L) {
          ctx.strokeStyle = "rgba(" + DEEP + "," + ((1 - d / L) * 0.3 * INTENSITY) + ")";
          ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
        }
      }
    }
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      var near = 0;
      if (mouse.on) {
        var mx = p.x - mouse.x, my = p.y - mouse.y, md = Math.sqrt(mx * mx + my * my);
        if (md < 170) {
          near = 1 - md / 170;
          ctx.strokeStyle = "rgba(" + GOLD + "," + (near * 0.5) + ")";
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      if (p.star) spark(p.x, p.y, 4.5 + near * 4, 0.38 + near * 0.4, AMB);
      else orb(p.x, p.y, 3.6 + near * 6, 0.38 + near * 0.4, GOLD);
    }
  }

  function frame(now) {
    if (!running) return;
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016); last = now;
    draw(dt);
    requestAnimationFrame(frame);
  }
  function play() {
    if (reduce || running || !visible || document.hidden) return;
    running = true; last = performance.now(); requestAnimationFrame(frame);
  }
  function pause() { running = false; }

  window.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") { mouse.on = false; return; }
    var r = cv.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    mouse.on = mouse.x >= 0 && mouse.y >= 0 && mouse.x <= r.width && mouse.y <= r.height;
  }, { passive: true });
  document.addEventListener("mouseleave", function () { mouse.on = false; });
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () { if (document.hidden) pause(); else play(); });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) play(); else pause();
    }, { threshold: 0 }).observe(document.getElementById("team") || host);
  }
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(host);

  resize();
  if (reduce) draw(0); else play();
})();
