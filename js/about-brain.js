// About page: a slowly turning human brain, drawn as real white-matter fibres, behind a team
// member's profile card. Used when a person has bg: "brain" in TEAM_EXTRAS (about.html).
//
// The fibres are ~3,000 streamlines sampled from the HCP1065 population-averaged tractography
// atlas (Yeh, 2022, CC BY-SA 4.0; data from the Human Connectome Project), packed into
// data/brain-fibres.bin by tools/brain-fibres.py (see data/README-brain.md). Colour runs from yellow-green on the left
// hemisphere to blue-magenta on the right, meeting at the midline.
//
// Opening: seen from above, the fibres grow out from the sagittal midline (the line between the
// hemispheres, under the sagittal suture), then the brain tips down to a side view and turns.
// Faint pulses travel along some fibres. One WebGL canvas, two draw calls per frame, no libraries.
// Paused while the tab is hidden; stopped when the card closes. Reduced motion: one still frame.
(function () {
  var DATA_URL = "data/brain-fibres.bin";
  var dataPromise = null, run = null;

  function load() {
    if (!dataPromise) {
      dataPromise = fetch(DATA_URL).then(function (r) {
        if (!r.ok) throw new Error("brain data " + r.status);
        return r.arrayBuffer();
      }).then(parse);
      dataPromise.catch(function () { dataPromise = null; }); // allow a retry next open
    }
    return dataPromise;
  }

  function parse(buf) {
    var dv = new DataView(buf);
    if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== "MCCB") throw new Error("brain data: bad file");
    var n = dv.getUint32(8, true), k = dv.getUint32(12, true), scale = dv.getFloat32(16, true);
    var o = 20, nv = n * k;
    var pos = new Int16Array(buf.slice(o, o + nv * 6)); o += nv * 6;
    var col = new Uint8Array(buf, o, n * 3); o += n * 3;
    var phase = new Uint8Array(buf, o, n); o += n;
    var mid = new Uint8Array(buf, o, n);
    // Per-vertex extras: colour (rgb) + [t along fibre, phase, midline closeness, unused].
    var vcol = new Uint8Array(nv * 3), misc = new Uint8Array(nv * 4);
    var lines = new Uint16Array(n * (k - 1) * 2), ends = new Uint16Array(n * 2), li = 0;
    for (var s = 0; s < n; s++) {
      for (var j = 0; j < k; j++) {
        var v = s * k + j;
        vcol[v * 3] = col[s * 3]; vcol[v * 3 + 1] = col[s * 3 + 1]; vcol[v * 3 + 2] = col[s * 3 + 2];
        misc[v * 4] = Math.round(255 * j / (k - 1)); misc[v * 4 + 1] = phase[s]; misc[v * 4 + 2] = mid[s];
        if (j < k - 1) { lines[li++] = v; lines[li++] = v + 1; }
      }
      ends[s * 2] = s * k; ends[s * 2 + 1] = s * k + k - 1;
    }
    return { n: n, k: k, scale: scale, pos: pos, vcol: vcol, misc: misc, lines: lines, ends: ends };
  }

  var VS = [
    "attribute vec3 aPos; attribute vec3 aCol; attribute vec4 aMisc;",
    "uniform float uScale, uYaw, uPitch, uPpmX, uPpmY, uCy, uTime, uGrow, uPoint, uDpr;",
    "varying vec3 vCol; varying float vA; varying float vPt;",
    "void main(){",
    "  vec3 p = vec3(aPos.x, aPos.z, -aPos.y) * uScale;",             // RAS mm -> x right, y up, z toward viewer
    "  float cy = cos(uYaw), sy = sin(uYaw), cp = cos(uPitch), sp = sin(uPitch);",
    "  p = vec3(cy*p.x + sy*p.z, p.y, -sy*p.x + cy*p.z);",
    "  p = vec3(p.x, cp*p.y - sp*p.z, sp*p.y + cp*p.z);",
    "  float w = 1.0 - p.z / 420.0;",                                  // mild perspective
    "  gl_Position = vec4(p.x * uPpmX, p.y * uPpmY + uCy, 0.0, w);",
    "  float t = aMisc.x, ph = aMisc.y, mid = aMisc.z;",
    "  float start = (1.0 - mid) * 0.75;",                             // fibres near the midline grow first
    "  float g = clamp((uGrow - start) / 0.25, 0.0, 1.0);",
    "  float shown = step(t, g + 0.001);",                             // each fibre draws in from one end
    "  float s = fract(ph * 7.0 + uTime * 0.16 - t * 0.9);",          // travelling pulse
    "  float pulse = step(ph, 0.33) * smoothstep(0.0, 0.05, s) * (1.0 - smoothstep(0.05, 0.14, s));",
    "  vCol = aCol; vPt = uPoint;",
    "  vA = shown * mix(0.13 + 0.6 * pulse, 0.3, uPoint) * smoothstep(0.0, 0.15, g);",
    "  gl_PointSize = 2.0 * uDpr;",
    "}"
  ].join("\n");
  var FS = [
    "precision mediump float; varying vec3 vCol; varying float vA; varying float vPt;",
    "void main(){",
    "  float a = vA;",
    "  if (vPt > 0.5) { vec2 d = gl_PointCoord - 0.5; a *= smoothstep(0.5, 0.15, length(d)); }",
    "  gl_FragColor = vec4(vCol * a, 1.0);",                          // additive: overlaps glow
    "}"
  ].join("\n");

  function stop() {
    if (!run) return;
    run.alive = false;
    cancelAnimationFrame(run.raf);
    document.removeEventListener("visibilitychange", run.onVis);
    window.removeEventListener("resize", run.onResize);
    if (run.ro) run.ro.disconnect();
    var lose = run.gl && run.gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext(); // free the GPU context right away
    run = null;
  }

  // Returns false if WebGL isn't available, so the caller can fall back to the plain band.
  function start(band) {
    stop();
    var cv = document.createElement("canvas");
    cv.className = "brain-canvas";
    cv.setAttribute("aria-hidden", "true");
    var gl = cv.getContext("webgl", { antialias: true, alpha: false, premultipliedAlpha: false, powerPreference: "low-power" });
    if (!gl) return false;
    band.appendChild(cv);
    var r = { alive: true, gl: gl, raf: 0 };
    run = r;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    load().then(function (d) {
      if (!r.alive) return;
      function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
      var pr = gl.createProgram();
      gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
      gl.linkProgram(pr);
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { if (window.console) console.warn("about-brain:", gl.getProgramInfoLog(pr)); return; }
      gl.useProgram(pr);
      function attr(name, data, size, type, norm) {
        var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        var loc = gl.getAttribLocation(pr, name); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, type, norm, 0, 0);
      }
      attr("aPos", d.pos, 3, gl.SHORT, false);
      attr("aCol", d.vcol, 3, gl.UNSIGNED_BYTE, true);
      attr("aMisc", d.misc, 4, gl.UNSIGNED_BYTE, true);
      var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      var both = new Uint16Array(d.lines.length + d.ends.length); both.set(d.lines); both.set(d.ends, d.lines.length);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, both, gl.STATIC_DRAW);
      var U = {}; ["uScale", "uYaw", "uPitch", "uPpmX", "uPpmY", "uCy", "uTime", "uGrow", "uPoint", "uDpr"].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
      gl.uniform1f(U.uScale, d.scale);
      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);

      var W = 0, H = 0, dpr = 1, last = performance.now(), paused = false, clock = 0;
      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = band.clientWidth; H = band.clientHeight;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        gl.viewport(0, 0, cv.width, cv.height);
        var ppm = H / 120;                      // brain a little taller than the band; the photo covers the bottom
        gl.uniform1f(U.uPpmX, ppm * 2 / W); gl.uniform1f(U.uPpmY, ppm * 2 / H);
        gl.uniform1f(U.uCy, -0.16);             // brain centre ~58% down, so its top just clears the band's top
        gl.uniform1f(U.uDpr, dpr);
        if (reduce || paused) frame(last);
      }
      r.onResize = resize;
      window.addEventListener("resize", resize);
      if (window.ResizeObserver) { r.ro = new ResizeObserver(resize); r.ro.observe(band); }

      function frame(now) {
        if (!paused) clock += Math.min(now - last, 100) / 1000; // no jump after a pause
        last = now;
        var t = reduce ? 30 : clock;
        var grow = reduce ? 1 : Math.min(1, t / 3.2);
        var tip = reduce ? 1 : Math.min(1, Math.max(0, (t - 1.6) / 2.4)); // top view -> side view
        tip = tip * tip * (3 - 2 * tip);
        var pitch = (1 - tip) * 1.5708 + tip * (0.2 + 0.05 * Math.sin(t * 0.21));
        var yaw = 1.5708 + Math.max(0, t - 2.4) * 0.14;
        gl.uniform1f(U.uTime, t); gl.uniform1f(U.uGrow, grow * 1.05);
        gl.uniform1f(U.uYaw, yaw); gl.uniform1f(U.uPitch, pitch);
        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.uPoint, 0); gl.drawElements(gl.LINES, d.lines.length, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(U.uPoint, 1); gl.drawElements(gl.POINTS, d.ends.length, gl.UNSIGNED_SHORT, d.lines.length * 2);
      }
      function loop(now) {
        if (!r.alive) return;
        frame(now);
        if (!reduce && !paused) r.raf = requestAnimationFrame(loop);
      }
      r.onVis = function () {
        paused = document.hidden;
        if (!paused && r.alive && !reduce) { last = performance.now(); r.raf = requestAnimationFrame(loop); }
      };
      document.addEventListener("visibilitychange", r.onVis);
      resize();
      cv.classList.add("on");
      r.raf = requestAnimationFrame(loop);
    }).catch(function () { /* leave the black band; nothing else breaks */ });
    return true;
  }

  window.MCCBrain = { start: start, stop: stop };
})();
