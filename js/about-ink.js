// About page: the team wheel's progress arc in the Events ink.
//  - The arc is an even, round-ended stroke in the Events red. While you scroll, the ink near the
//    pen (the focus point) glistens amber as if wet, and dries back to red within a second of
//    stopping. The pen stays put; the ink trails out behind it as the wheel turns.
//  - When the ink reaches a department's dot, it splashes in that department's colour: an uneven
//    splat joined to the dot with short pointed spikes and loose droplets, never the same twice (the line
//    and the dots stay clean and even; the splashes are where the hand shows). Splashes belong to
//    the stroke: scroll back past a dot and its splash goes; come forward and the same one returns.
// The wheel's own motion (about.html) is untouched; this only redraws the arc.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var NS = "http://www.w3.org/2000/svg";
  var W = 3;                        // stroke width (the old gold arc was 2.5)
  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function start() {
    var svg = document.getElementById("wheelProgress"), arc = document.getElementById("wheelProgressArc");
    var wheel = document.getElementById("wheel");
    if (!svg || !arc || !wheel) return;
    arc.style.stroke = "transparent";

    // ---------- the arc ----------
    var g = mk("g", { fill: "none", "stroke-linecap": "round", "stroke-width": W }, svg);
    var dry = mk("path", { stroke: "#AE3628" }, g);
    var wetG = mk("g", { opacity: 0 }, g), wets = [];
    for (var j = 0; j < 5; j++) wets.push(mk("path", { stroke: "#D9742A", "stroke-opacity": 0.22 }, wetG));
    var last = -1, lastR = -1;

    // Arc from the pen (θ = 0) round to θ = a (split in two so a full circle still draws).
    function arcPath(cx, cy, r, a) {
      if (a < 0.002) return "";
      a = Math.min(a, Math.PI * 2 - 0.001);
      var h = a / 2;
      return "M" + (cx + r).toFixed(2) + "," + cy.toFixed(2) +
        "A" + r + "," + r + " 0 0 1 " + (cx + r * Math.cos(h)).toFixed(2) + "," + (cy + r * Math.sin(h)).toFixed(2) +
        "A" + r + "," + r + " 0 0 1 " + (cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2);
    }
    function draw(cx, cy, r, frac) {
      var A = frac * Math.PI * 2;
      dry.setAttribute("d", arcPath(cx, cy, r, A));
      for (var k = 0; k < wets.length; k++) wets[k].setAttribute("d", arcPath(cx, cy, r, Math.min(A, 0.85 * (1 - k / wets.length))));
    }

    // ---------- splashes ----------
    var css = document.createElement("style");
    css.textContent = ".ink-splash{position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none}" +
      ".ink-splash>*{scale:0;transition:scale .25s ease-in}" +
      ".ink-splash.on>*{scale:1;transition:scale .45s cubic-bezier(.2,1.5,.4,1) var(--d)}";
    document.head.appendChild(css);
    // An ink splat thrown from the dot: an uneven blob joined to the dot's edge, a few short
    // pointed spikes (thick at the root), and loose droplets of different sizes beyond them.
    function splatPath(cx, cy, r0, spikes) {
      var pts = [], N = 84, ph = rand(0, 6.28);
      for (var i = 0; i < N; i++) {
        var a = (i / N) * Math.PI * 2, R = r0 * (1 + 0.1 * Math.sin(3 * a + ph) + 0.06 * Math.sin(5 * a + ph * 2));
        spikes.forEach(function (sp) {
          var d = Math.atan2(Math.sin(a - sp.a), Math.cos(a - sp.a));
          var t = Math.max(0, 1 - Math.abs(d) / sp.w);
          R += sp.len * Math.pow(t, 2.2);
        });
        pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
      }
      // smooth closed outline through the midpoints
      var mid = function (p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; };
      var m0 = mid(pts[N - 1], pts[0]), d = "M" + m0[0].toFixed(1) + "," + m0[1].toFixed(1);
      for (var k = 0; k < N; k++) {
        var p = pts[k], m = mid(p, pts[(k + 1) % N]);
        d += "Q" + p[0].toFixed(1) + "," + p[1].toFixed(1) + " " + m[0].toFixed(1) + "," + m[1].toFixed(1);
      }
      return d + "Z";
    }
    function makeSplash(dot) {
      var m = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(dot.style.transform || "");
      if (!m) return null;
      var x = Number(m[1]), y = Number(m[2]), col = dot.style.background || getComputedStyle(dot).backgroundColor;
      var box = mk("svg", { class: "ink-splash", "aria-hidden": "true" });
      wheel.appendChild(box);
      var origin = x.toFixed(1) + "px " + y.toFixed(1) + "px";
      function add(el, delay) { el.style.transformOrigin = origin; el.style.setProperty("--d", delay + "ms"); }
      // thrown outward from the wheel's centre, with a random lean
      var out = Math.atan2(y, x) + rand(-0.7, 0.7);
      var cx = x + Math.cos(out) * 6, cy = y + Math.sin(out) * 6, r0 = rand(3.8, 5.2);
      var spikes = [], n = 3 + Math.floor(Math.random() * 3);
      for (var k = 0; k < n; k++) spikes.push({ a: out + rand(-1.5, 1.5), len: rand(4, 13), w: rand(0.24, 0.44) });
      add(mk("path", { d: splatPath(cx, cy, r0, spikes), fill: col }, box), 0);
      // loose droplets past the longer spikes, all different
      var delay = 40;
      spikes.forEach(function (sp) {
        if (sp.len < 6 || Math.random() < 0.35) return;
        var dist = r0 + sp.len + rand(3, 9), rr = rand(0.9, 2.3);
        var px = cx + Math.cos(sp.a) * dist, py = cy + Math.sin(sp.a) * dist;
        // a droplet stretched along its flight: drawn with plain coordinates (no transform attribute)
        var st = rr * rand(1.2, 1.8), c = Math.cos(sp.a), sn = Math.sin(sp.a);
        add(mk("path", { d: "M" + (px - c * st).toFixed(1) + "," + (py - sn * st).toFixed(1) +
          "A" + st.toFixed(1) + "," + rr.toFixed(1) + " " + (sp.a * 57.3).toFixed(0) + " 1 1 " + (px + c * st).toFixed(1) + "," + (py + sn * st).toFixed(1) +
          "A" + st.toFixed(1) + "," + rr.toFixed(1) + " " + (sp.a * 57.3).toFixed(0) + " 1 1 " + (px - c * st).toFixed(1) + "," + (py - sn * st).toFixed(1) + "Z", fill: col }, box), delay);
        delay += Math.round(rand(25, 60));
      });
      if (Math.random() < 0.5) {           // the odd tiny speck further out
        var a2 = out + rand(-1, 1), d2 = rand(20, 30);
        add(mk("circle", { cx: (cx + Math.cos(a2) * d2).toFixed(1), cy: (cy + Math.sin(a2) * d2).toFixed(1), r: rand(0.7, 1.2).toFixed(1), fill: col }, box), delay);
      }
      void box.getBoundingClientRect();            // so the first showing animates in
      return box;
    }
    var splashes = [];

    // ---------- loop ----------
    var wet = 0, prevFrac = 0, prevT = 0;
    function frame(now) {
      var dt = prevT ? Math.min(0.05, (now - prevT) / 1000) : 1 / 60;
      prevT = now;
      var r = Number(arc.getAttribute("r")), cx = Number(arc.getAttribute("cx")), cy = Number(arc.getAttribute("cy"));
      var circ = 2 * Math.PI * r, off = parseFloat(arc.style.strokeDashoffset);
      var frac = isNaN(off) || !r ? 0 : Math.max(0, Math.min(1, 1 - off / circ));
      g.style.opacity = arc.style.opacity || "1";
      if (r && (Math.abs(frac - last) > 1e-4 || r !== lastR)) { last = frac; lastR = r; draw(cx, cy, r, frac); }

      // wet only while the ink is moving forward; dries within about a second of stopping
      var moving = frac - prevFrac > 0.00005 && frac < 0.999;
      prevFrac = frac;
      wet += ((moving ? 1 : 0) - wet) * (1 - Math.exp(-(moving ? 10 : 2.5) * dt));
      if (wet < 0.005) wet = 0;
      wetG.setAttribute("opacity", wet.toFixed(3));

      // splashes follow the stroke: dot j has one exactly while the ink has reached it
      var dots = wheel.querySelectorAll(".wheel-dot");
      if (dots.length && r) {
        var reach = frac * dots.length;
        for (var i = 0; i < dots.length; i++) {
          var on = i === 0 ? frac > 0.004 : reach >= i - 0.01;
          var sp = splashes[i];
          if (on && !sp) sp = splashes[i] = makeSplash(dots[i]);
          if (sp && sp._on !== on) { sp._on = on; sp.classList.toggle("on", on); }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 0); });
  else setTimeout(start, 0);
})();
