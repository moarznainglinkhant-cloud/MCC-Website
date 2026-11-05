// About page: the team wheel's strokes in wet ink (same drawing language as the Events line).
//  - The progress arc is a brush stroke in the Events ink: red, amber while wet near the pen, with an
//    even width. The pen sits at the focus point and the ink trails out behind it as the wheel turns.
//  - When a department's dot is reached, a few drops land near it in that department's colour
//    (the dots keep their own colours; only the line is one ink). The drops turn with the wheel.
//  - The big outer ring is a faint dry-brush circle, painted once as the wheel comes into view.
// The wheel's own motion (about.html) is untouched; this only redraws its strokes.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var NS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function start() {
    var svg = document.getElementById("wheelProgress"), arc = document.getElementById("wheelProgressArc");
    var wheel = document.getElementById("wheel");
    if (!svg || !arc || !wheel) return;
    arc.style.stroke = "transparent";

    // ---------- progress arc as wet ink ----------
    var g = mk("g", {}, svg);
    var dry = mk("path", { fill: "#AE3628" }, g), wets = [];
    for (var j = 0; j < 5; j++) wets.push(mk("path", { fill: "#D9742A", opacity: 0.2 }, g));
    var tip = mk("ellipse", { rx: 5.5, ry: 3.4, fill: "#D9742A" }, g);
    var last = -1, lastR = -1;

    // Brush outline between angles t0..t1 (θ measured from the pen, at the focus point).
    // Width is tied to the ink itself (φ = distance from where the stroke began), so its texture
    // turns with the wheel instead of sliding.
    function ribbon(cx, cy, r, t0, t1, A) {
      if (t1 - t0 < 0.003) return "";
      var step = 0.02, out = "", back = "";
      for (var t = t0; ; t += step) {
        if (t > t1) t = t1;
        var phi = A - t, deg = phi * 57.2958;
        var w = 4.2 * (1 + 0.06 * Math.sin(deg * 0.21) * Math.sin(deg * 0.047 + 1.3));   // even, with just a hint of hand
        w *= 0.3 + 0.7 * Math.min(1, phi / 0.2);                // brush lands softly where it began
        w *= 0.35 + 0.65 * Math.min(1, t / 0.1);                 // and tapers at the pen
        var c = Math.cos(t), s = Math.sin(t), ro = r + w / 2, ri = r - w / 2;
        out += (out ? "L" : "M") + (cx + c * ro).toFixed(1) + "," + (cy + s * ro).toFixed(1);
        back = "L" + (cx + c * ri).toFixed(1) + "," + (cy + s * ri).toFixed(1) + back;
        if (t >= t1) break;
      }
      return out + back + "Z";
    }
    function draw(cx, cy, r, frac) {
      var A = frac * Math.PI * 2;
      dry.setAttribute("d", ribbon(cx, cy, r, 0, A, A));
      var drawing = frac > 0.002 && frac < 0.999;
      for (var k = 0; k < wets.length; k++) {
        var to = Math.min(A, 0.85 * (1 - k / wets.length));
        wets[k].setAttribute("d", drawing ? ribbon(cx, cy, r, 0, to, A) : "");
      }
      tip.setAttribute("transform", "translate(" + (cx + r).toFixed(1) + " " + cy.toFixed(1) + ") rotate(90)");
      tip.style.opacity = drawing ? "1" : "0";
    }

    // ---------- drops near each dot, in that department's colour ----------
    var active = -1, started = false;
    function dotScale(d) { var m = /scale\(([\d.]+)\)/.exec(d.style.transform || ""); return m ? Number(m[1]) : 1; }
    function drops(dot) {
      var m = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(dot.style.transform || "");
      if (!m || dot._inked) return;
      dot._inked = true;
      var x = Number(m[1]), y = Number(m[2]), col = dot.style.background || getComputedStyle(dot).backgroundColor;
      for (var k = 0; k < 6; k++) {
        var d = document.createElement("i");
        var rr = 1.4 + Math.random() * 2.8, ang = Math.random() * 6.283, dist = 13 + Math.random() * 18;
        d.className = "ink-drop";
        d.style.cssText = "width:" + (rr * 2).toFixed(1) + "px;height:" + (rr * 2).toFixed(1) + "px;left:" + (x + Math.cos(ang) * dist - rr).toFixed(1) +
          "px;top:" + (y + Math.sin(ang) * dist - rr).toFixed(1) + "px;background:" + col + ";animation-delay:" + (k * 45) + "ms";
        wheel.appendChild(d);
      }
    }
    var css = document.createElement("style");
    css.textContent = ".ink-drop{position:absolute;border-radius:50%;pointer-events:none;opacity:.85;animation:ink-drop .55s cubic-bezier(.2,1.6,.4,1) both}" +
      "@keyframes ink-drop{from{transform:scale(0);opacity:0}to{transform:scale(1);opacity:.85}}";
    document.head.appendChild(css);

    // ---------- dry-brush outer ring ----------
    var ring = null, ringSvg = null, ringSize = 0, ringMask = null, painted = false;
    function buildRing() {
      var size = ring.offsetWidth;
      if (!size || size === ringSize) return;
      ringSize = size;
      ring.style.borderColor = "transparent";
      if (ringSvg) ringSvg.remove();
      var R = size / 2, C = 2 * Math.PI * R;
      ringSvg = mk("svg", { width: size + 16, height: size + 16, viewBox: "-8 -8 " + (size + 16) + " " + (size + 16), "aria-hidden": "true" });
      ringSvg.style.cssText = "position:absolute;left:-8px;top:-8px;overflow:visible;pointer-events:none";
      var id = "ink-ring-mask";
      var m = mk("mask", { id: id, maskUnits: "userSpaceOnUse", x: -20, y: -20, width: size + 40, height: size + 40 }, ringSvg);
      // painted once with a small gap where the brush lifted
      ringMask = mk("circle", { cx: R, cy: R, r: R, fill: "none", stroke: "#fff", "stroke-width": 16, "stroke-dasharray": C + " " + C,
        "stroke-dashoffset": painted ? C * 0.03 : C, transform: "rotate(-80 " + R + " " + R + ")" }, m);
      var gg = mk("g", { mask: "url(#" + id + ")", fill: "none", "stroke-linecap": "round" }, ringSvg);
      // three uneven strands = the streaky edge of a dry brush
      [[-1.4, 1.1, 0.13, "140 4 70 2 210 6 40 3"], [0, 2.2, 0.2, "260 3 90 5 160 2"], [1.6, 1, 0.11, "60 6 180 3 120 8 30 4"]].forEach(function (st) {
        mk("circle", { cx: R, cy: R, r: R + st[0], stroke: "#1C2440", "stroke-opacity": st[2], "stroke-width": st[1], "stroke-dasharray": st[3] }, gg);
      });
      ring.appendChild(ringSvg);
      ringSvg._C = C;
    }
    function paintRing() {
      if (!ringMask || painted) return;
      painted = true;
      var C = ringSvg._C;
      ringMask.animate([{ strokeDashoffset: C }, { strokeDashoffset: C * 0.03 }], { duration: 1800, easing: "cubic-bezier(.5,0,.2,1)", fill: "forwards" });
    }
    function setupRing() {
      ring = document.querySelector(".wheel-ring.outer");
      if (!ring) return;
      buildRing();
      if (window.ResizeObserver) new ResizeObserver(buildRing).observe(ring);
      var team = document.getElementById("team");
      if (team && window.IntersectionObserver) new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) paintRing(); });
      }, { threshold: 0, rootMargin: "0px 0px -30% 0px" }).observe(team);
      else paintRing();
    }

    function frame() {
      if (!ring) setupRing();
      var r = Number(arc.getAttribute("r")), cx = Number(arc.getAttribute("cx")), cy = Number(arc.getAttribute("cy"));
      var circ = 2 * Math.PI * r, off = parseFloat(arc.style.strokeDashoffset);
      var frac = isNaN(off) || !r ? 0 : Math.max(0, Math.min(1, 1 - off / circ));
      g.style.opacity = arc.style.opacity || "1";
      if (r && (Math.abs(frac - last) > 1e-4 || r !== lastR)) { last = frac; lastR = r; draw(cx, cy, r, frac); }
      // drops: the first dot once the ink starts, then each dot as it comes into focus
      var dots = wheel.querySelectorAll(".wheel-dot");
      if (dots.length) {
        if (!started && frac > 0.004) { started = true; drops(dots[0]); }
        var best = -1, bs = 1.4;
        for (var i = 0; i < dots.length; i++) { var sc = dotScale(dots[i]); if (sc > bs) { bs = sc; best = i; } }
        if (best !== -1 && best !== active) { if (started) drops(dots[best]); active = best; }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 0); });
  else setTimeout(start, 0);
})();
