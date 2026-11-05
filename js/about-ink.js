// About page: the team wheel's progress arc in the Events ink.
//  - The arc is an even, round-ended stroke: red, amber while wet near the pen. The pen sits at
//    the focus point and the ink trails out behind it as the wheel turns.
//  - When a department's dot is reached, ink splashes near it in that department's colour: a few
//    irregular drops, never the same twice (the line and the dots stay clean and even; the
//    splashes are where the hand shows). They turn with the wheel, and they belong to the stroke:
//    scroll back past a dot and its splash goes with the ink; come forward again and it returns.
// The wheel's own motion (about.html) is untouched; this only redraws the arc.
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var NS = "http://www.w3.org/2000/svg";
  var W = 4.2;                      // stroke width
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
    var dry = mk("path", { stroke: "#AE3628" }, g), wets = [];
    for (var j = 0; j < 5; j++) wets.push(mk("path", { stroke: "#D9742A", "stroke-opacity": 0.2 }, g));
    var last = -1, lastR = -1;

    // Arc from the pen (θ = 0) round to θ = a, as a path (split in two so a full circle still draws).
    function arcPath(cx, cy, r, a) {
      if (a < 0.002) return "";
      a = Math.min(a, Math.PI * 2 - 0.001);
      var x0 = cx + r, y0 = cy, h = a / 2;
      var x1 = cx + r * Math.cos(h), y1 = cy + r * Math.sin(h);
      var x2 = cx + r * Math.cos(a), y2 = cy + r * Math.sin(a);
      return "M" + x0.toFixed(2) + "," + y0.toFixed(2) + "A" + r + "," + r + " 0 0 1 " + x1.toFixed(2) + "," + y1.toFixed(2) +
             "A" + r + "," + r + " 0 0 1 " + x2.toFixed(2) + "," + y2.toFixed(2);
    }
    function draw(cx, cy, r, frac) {
      var A = frac * Math.PI * 2;
      dry.setAttribute("d", arcPath(cx, cy, r, A));
      var drawing = frac > 0.002 && frac < 0.999;
      for (var k = 0; k < wets.length; k++) {
        wets[k].setAttribute("d", drawing ? arcPath(cx, cy, r, Math.min(A, 0.85 * (1 - k / wets.length))) : "");
      }
    }

    // ---------- splashes near each dot, in that department's colour ----------
    var css = document.createElement("style");
    css.textContent = ".ink-splash{position:absolute;left:0;top:0;width:0;height:0;pointer-events:none}" +
      ".ink-drop{position:absolute;scale:0;opacity:0;transition:scale .28s ease-in, opacity .28s ease-in}" +
      ".ink-splash.on .ink-drop{scale:1;opacity:var(--o);transition:scale .5s cubic-bezier(.2,1.6,.4,1) var(--d), opacity .15s ease var(--d)}";
    document.head.appendChild(css);
    function blobRadius() {           // an uneven, organic outline
      var v = []; for (var i = 0; i < 8; i++) v.push(Math.round(rand(35, 65)) + "%");
      return v.slice(0, 4).join(" ") + " / " + v.slice(4).join(" ");
    }
    function drop(box, x, y, w, h, rot, col, op, delay) {
      var d = document.createElement("i");
      d.className = "ink-drop";
      d.style.cssText = "left:" + (x - w / 2).toFixed(1) + "px;top:" + (y - h / 2).toFixed(1) + "px;width:" + w.toFixed(1) + "px;height:" + h.toFixed(1) +
        "px;background:" + col + ";--o:" + op.toFixed(2) + ";border-radius:" + blobRadius() + ";transform:rotate(" + rot.toFixed(0) + "deg);--d:" + delay + "ms";
      box.appendChild(d);
    }
    // Each dot's splash is made once (random shape), then shown or hidden with the stroke.
    function makeSplash(dot) {
      var m = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(dot.style.transform || "");
      if (!m) return null;
      var box = document.createElement("span");
      box.className = "ink-splash";
      wheel.appendChild(box);
      var x = Number(m[1]), y = Number(m[2]), col = dot.style.background || getComputedStyle(dot).backgroundColor;
      // fling mostly outward from the wheel's centre, with a random lean
      var out = Math.atan2(y, x) + rand(-0.9, 0.9), n = 3 + Math.floor(Math.random() * 5), t = 0;
      // one main drop, stretched in the direction it flew
      var dist = rand(14, 22), s = rand(4, 7.5);
      drop(box, x + Math.cos(out) * dist, y + Math.sin(out) * dist, s * rand(1.3, 1.9), s, out * 57.3, col, rand(0.75, 0.9), 0);
      // smaller satellites scattered around it, all different
      for (var k = 0; k < n; k++) {
        var a = out + rand(-1.3, 1.3), dd = rand(10, 34), sz = Math.random() < 0.25 ? rand(3, 4.5) : rand(1.2, 2.8);
        t += Math.round(rand(25, 70));
        drop(box, x + Math.cos(a) * dd, y + Math.sin(a) * dd, sz * rand(1, 1.5), sz, rand(0, 180), col, rand(0.55, 0.9), t);
      }
      void box.offsetWidth;          // so the first showing animates in
      return box;
    }
    var splashes = [];

    function frame() {
      var r = Number(arc.getAttribute("r")), cx = Number(arc.getAttribute("cx")), cy = Number(arc.getAttribute("cy"));
      var circ = 2 * Math.PI * r, off = parseFloat(arc.style.strokeDashoffset);
      var frac = isNaN(off) || !r ? 0 : Math.max(0, Math.min(1, 1 - off / circ));
      g.style.opacity = arc.style.opacity || "1";
      if (r && (Math.abs(frac - last) > 1e-4 || r !== lastR)) { last = frac; lastR = r; draw(cx, cy, r, frac); }
      // splashes follow the stroke: dot j has one exactly while the ink has reached it
      var dots = wheel.querySelectorAll(".wheel-dot");
      if (dots.length && r) {
        var reach = frac * dots.length;              // how many dot-gaps the ink has covered
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
