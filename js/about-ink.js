// About page: the team wheel's progress line — "ink in water".
//  - A calm, thin line in the site's ink red traces the ring as you scroll. The pen stays at the
//    focus point and the line trails out behind it as the wheel turns.
//  - As the line reaches each department's dot, the dot sends out three soft ripples in its own
//    colour, like a drop landing in still water, and keeps a faint halo. Scroll back past a dot and
//    its halo fades with the line; come forward again and it ripples again.
// The wheel's own motion (about.html) is untouched; this only redraws the progress arc. The closing
// ripples from the crest live in about.html (bloom()).
(function () {
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var NS = "http://www.w3.org/2000/svg";
  function mk(tag, attrs, parent) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  // Arc from the pen (θ = 0) round to θ = a (split in two so a full circle still draws).
  function arcPath(cx, cy, r, a) {
    if (a < 0.002) return "";
    a = Math.min(a, Math.PI * 2 - 0.001);
    var h = a / 2;
    return "M" + (cx + r).toFixed(2) + "," + cy.toFixed(2) +
      "A" + r + "," + r + " 0 0 1 " + (cx + r * Math.cos(h)).toFixed(2) + "," + (cy + r * Math.sin(h)).toFixed(2) +
      "A" + r + "," + r + " 0 0 1 " + (cx + r * Math.cos(a)).toFixed(2) + "," + (cy + r * Math.sin(a)).toFixed(2);
  }

  function start() {
    var svg = document.getElementById("wheelProgress"), arc = document.getElementById("wheelProgressArc");
    var wheel = document.getElementById("wheel");
    if (!svg || !arc || !wheel) return;
    arc.style.stroke = "transparent";

    var line = mk("path", { fill: "none", stroke: "#AE3628", "stroke-width": 2.4, "stroke-opacity": 0.85, "stroke-linecap": "round" }, svg);

    var css = document.createElement("style");
    css.textContent = ".dot-ripple{position:absolute;left:0;top:0;width:1px;height:1px;overflow:visible;pointer-events:none}" +
      ".dot-ripple circle{opacity:0}" +
      ".dot-ripple .h{scale:.4;transition:opacity .4s ease, scale .4s ease}" +
      ".dot-ripple.on .h{opacity:.2;scale:1;transition:opacity 1.2s ease .2s, scale 1.2s ease .2s}" +
      ".dot-ripple.on .w{animation:dot-wave 1.8s cubic-bezier(.2,.7,.3,1) both}" +
      ".dot-ripple.on .w2{animation-delay:.35s}.dot-ripple.on .w3{animation-delay:.7s}" +
      "@keyframes dot-wave{0%{opacity:.7;scale:.3}100%{opacity:0;scale:2.2}}";
    document.head.appendChild(css);

    function makeRipple(dot) {
      var m = /translate\((-?[\d.]+)px,\s*(-?[\d.]+)px\)/.exec(dot.style.transform || "");
      if (!m) return null;
      var x = Number(m[1]), y = Number(m[2]), col = dot.style.background || getComputedStyle(dot).backgroundColor;
      var box = mk("svg", { class: "dot-ripple", "aria-hidden": "true" });
      wheel.insertBefore(box, wheel.firstChild);                 // behind the dots
      var o = x + "px " + y + "px";
      var h = mk("circle", { class: "h", cx: x, cy: y, r: 13, fill: col }, box);
      h.style.transformOrigin = o;
      ["w", "w w2", "w w3"].forEach(function (c) {
        var w = mk("circle", { class: c, cx: x, cy: y, r: 11, fill: "none", stroke: col, "stroke-width": 1.2 }, box);
        w.style.transformOrigin = o;
      });
      void box.getBoundingClientRect();
      return box;
    }

    var ripples = [], last = -1, lastR = -1;
    function frame() {
      var r = Number(arc.getAttribute("r")), cx = Number(arc.getAttribute("cx")), cy = Number(arc.getAttribute("cy"));
      var circ = 2 * Math.PI * r, off = parseFloat(arc.style.strokeDashoffset);
      var frac = isNaN(off) || !r ? 0 : Math.max(0, Math.min(1, 1 - off / circ));
      line.style.opacity = arc.style.opacity || "1";
      if (r && (Math.abs(frac - last) > 1e-4 || r !== lastR)) { last = frac; lastR = r; line.setAttribute("d", arcPath(cx, cy, r, frac * Math.PI * 2)); }
      // dot j ripples exactly while the line has reached it
      var dots = wheel.querySelectorAll(".wheel-dot");
      if (dots.length && r) {
        var reach = frac * dots.length;
        for (var i = 0; i < dots.length; i++) {
          var on = i === 0 ? frac > 0.004 : reach >= i - 0.01;
          if (on && !ripples[i]) ripples[i] = makeRipple(dots[i]);
          var rp = ripples[i];
          if (rp && rp._on !== on) { rp._on = on; rp.classList.toggle("on", on); }
        }
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(start, 0); });
  else setTimeout(start, 0);
})();
