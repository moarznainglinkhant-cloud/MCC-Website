// About page: a human brain behind a team member's profile card (bg: "brain" in TEAM_EXTRAS).
//
// What's drawn (all real data, packed into data/brain-fibres.bin by tools/brain-fibres.py; sources
// and licences in data/README-brain.md):
//  - Fibres: ~3,000 white-matter streamlines from the HCP1065 tractography atlas (Yeh 2022).
//  - Cortex: the ICBM152 brain surface as a faint "glass" shell, brightest at its outline, so it reads
//    as a brain. One hemisphere is stored; the other is its mirror image.
//  - Neurons: four mouse cortical neurons reconstructed by the Allen Institute, repeated in the dark
//    space on both sides, each firing now and then (a signal runs out from the cell body).
//
// Motion: seen from above, the fibres grow out from the sagittal midline (the line under the
// sagittal suture), the glass surface fades in as the brain tips to a side view, then it sways
// gently while waves of activity sweep front to back. Raw WebGL1, no libraries, ~12 draw calls.
// Paused while the tab is hidden; stop() frees the GPU context. Reduced motion: one still frame.
(function () {
  var DATA_URL = "data/brain-fibres.bin";
  var dataPromise = null, run = null;

  function load() {
    if (!dataPromise) {
      dataPromise = fetch(DATA_URL).then(function (r) {
        if (!r.ok) throw new Error("brain data " + r.status);
        return r.arrayBuffer();
      }).then(parse);
      dataPromise.catch(function () { dataPromise = null; });
    }
    return dataPromise;
  }

  function parse(buf) {
    var dv = new DataView(buf), o = 0;
    function u32() { var v = dv.getUint32(o, true); o += 4; return v; }
    function take(Type, count) { var a = new Type(buf.slice(o, o + count * Type.BYTES_PER_ELEMENT)); o += count * Type.BYTES_PER_ELEMENT; return a; }
    if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== "MCCB") throw new Error("brain data: bad file");
    o = 4;
    var version = u32(), n = u32(), k = u32(), scale = dv.getFloat32(o, true); o += 4;
    var nv = n * k;
    var pos = take(Int16Array, nv * 3), col = take(Uint8Array, n * 3), phase = take(Uint8Array, n), mid = take(Uint8Array, n);
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
    var d = { n: n, k: k, scale: scale, pos: pos, vcol: vcol, misc: misc, lines: lines, ends: ends, cortex: null, neurons: [] };
    if (version >= 2) {
      var nc = u32();
      d.cortex = { n: nc, pos: take(Int16Array, nc * 3), nrm: take(Int8Array, nc * 3) };
      var nn = u32();
      for (var q = 0; q < nn; q++) {
        var cnt = u32(), xy = take(Int16Array, cnt * 2), dist = take(Uint8Array, cnt);
        var minY = 0, maxY = 0, minX = 0, maxX = 0;
        for (var t = 0; t < cnt; t++) {
          if (xy[t * 2 + 1] < minY) minY = xy[t * 2 + 1]; if (xy[t * 2 + 1] > maxY) maxY = xy[t * 2 + 1];
          if (xy[t * 2] < minX) minX = xy[t * 2]; if (xy[t * 2] > maxX) maxX = xy[t * 2];
        }
        d.neurons.push({ n: cnt, xy: xy, dist: dist, up: maxY, down: -minY, wide: Math.max(maxX, -minX) });
      }
    }
    return d;
  }

  // Shared 3D transform: RAS mm -> rotated view -> clip space.
  var VIEW = [
    "uniform float uScale, uYaw, uPitch, uPpmX, uPpmY, uCx, uCy;",
    "vec3 rot(vec3 p){",
    "  float cy = cos(uYaw), sy = sin(uYaw), cp = cos(uPitch), sp = sin(uPitch);",
    "  p = vec3(cy*p.x + sy*p.z, p.y, -sy*p.x + cy*p.z);",
    "  return vec3(p.x, cp*p.y - sp*p.z, sp*p.y + cp*p.z);",
    "}",
    "vec4 clip(vec3 p){ float w = 1.0 - p.z / 420.0; return vec4(p.x * uPpmX + uCx * w, p.y * uPpmY + uCy * w, 0.0, w); }",
    "float wave(float ant, float wpos){ float x = ant / 95.0 - wpos; return exp(-x * x / 0.03); }" // front-to-back sweep
  ].join("\n");

  var FIBRE_VS = [
    "attribute vec3 aPos; attribute vec3 aCol; attribute vec4 aMisc;",
    "uniform float uTime, uGrow, uPoint, uDpr, uWave;",
    VIEW,
    "varying vec3 vCol; varying float vA; varying float vPt;",
    "void main(){",
    "  vec3 m = vec3(aPos.x, aPos.z, -aPos.y) * uScale;",
    "  gl_Position = clip(rot(m));",
    "  float t = aMisc.x, ph = aMisc.y, mid = aMisc.z;",
    "  float g = clamp((uGrow - (1.0 - mid) * 0.75) / 0.25, 0.0, 1.0);",
    "  float shown = step(t, g + 0.001);",
    "  float s = fract(ph * 7.0 + uTime * 0.16 - t * 0.9);",
    "  float pulse = step(ph, 0.33) * smoothstep(0.0, 0.05, s) * (1.0 - smoothstep(0.05, 0.14, s));",
    "  float wv = wave(aPos.y * uScale, uWave);",
    "  vCol = aCol; vPt = uPoint;",
    "  vA = shown * mix(0.065 + 0.4 * pulse + 0.12 * wv, 0.16 + 0.12 * wv, uPoint) * smoothstep(0.0, 0.15, g);",
    "  gl_PointSize = 2.0 * uDpr;",
    "}"
  ].join("\n");

  var CORTEX_VS = [
    "attribute vec3 aPos; attribute vec3 aNrm;",
    "uniform float uMirror, uShow, uDpr, uWave;",
    VIEW,
    "varying vec3 vCol; varying float vA; varying float vPt;",
    "void main(){",
    "  vec3 m = vec3(aPos.x * uMirror, aPos.z, -aPos.y) * uScale;",
    "  vec3 n = rot(vec3(aNrm.x * uMirror, aNrm.z, -aNrm.y));",
    "  gl_Position = clip(rot(m));",
    "  float rim = 1.0 - abs(normalize(n).z);",                       // brightest where the surface turns away: the outline
    "  float wv = wave(aPos.y * uScale, uWave);",
    "  vCol = mix(vec3(0.62, 0.74, 1.0), vec3(0.85, 0.95, 1.0), wv); vPt = 1.0;",
    "  vA = uShow * (0.03 + 0.75 * rim * rim * rim + 0.08 * wv);",
    "  gl_PointSize = 1.9 * uDpr;",
    "}"
  ].join("\n");

  var NEURON_VS = [
    "attribute vec2 aXY; attribute float aD;",
    "uniform vec2 uRes, uOff; uniform float uRot, uPx, uFlip, uFront, uBase;",
    "varying vec3 vCol; varying float vA; varying float vPt; uniform vec3 uCol;",
    "void main(){",
    "  vec2 p = vec2(aXY.x * uFlip, aXY.y) * uPx;",
    "  float c = cos(uRot), s = sin(uRot);",
    "  p = vec2(c*p.x - s*p.y, s*p.x + c*p.y) + uOff;",                // px, y up from the band's bottom
    "  gl_Position = vec4(p.x / uRes.x * 2.0 - 1.0, p.y / uRes.y * 2.0 - 1.0, 0.0, 1.0);",
    "  float x = (aD - uFront) / 0.07;",
    "  vCol = uCol; vPt = 0.0;",
    "  vA = uBase + 1.1 * exp(-x * x) * step(-0.5, uFront);",
    "}"
  ].join("\n");

  var FS = [
    "precision mediump float; varying vec3 vCol; varying float vA; varying float vPt;",
    "void main(){",
    "  float a = vA;",
    "  if (vPt > 0.5) { vec2 d = gl_PointCoord - 0.5; a *= smoothstep(0.5, 0.15, length(d)); }",
    "  gl_FragColor = vec4(vCol * a, 1.0);",
    "}"
  ].join("\n");

  // Neuron colours: dim versions of the fibre palette.
  var NEURON_COLS = [[0.45, 0.85, 1.0], [0.72, 0.55, 1.0], [0.55, 1.0, 0.6], [1.0, 0.5, 0.9], [0.95, 0.95, 0.5]];

  function stop() {
    if (!run) return;
    run.alive = false;
    cancelAnimationFrame(run.raf);
    document.removeEventListener("visibilitychange", run.onVis);
    window.removeEventListener("resize", run.onResize);
    if (run.ro) run.ro.disconnect();
    var lose = run.gl && run.gl.getExtension("WEBGL_lose_context");
    if (lose) lose.loseContext();
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
      function program(vs) {
        function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; }
        var p = gl.createProgram();
        gl.attachShader(p, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(p, sh(gl.FRAGMENT_SHADER, FS));
        gl.linkProgram(p);
        if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { if (window.console) console.warn("about-brain:", gl.getProgramInfoLog(p)); return null; }
        p.u = {};
        var nu = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < nu; i++) { var nm = gl.getActiveUniform(p, i).name; p.u[nm] = gl.getUniformLocation(p, nm); }
        return p;
      }
      function buffer(data) { var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW); return b; }
      function bind(p, name, buf, size, type, norm) {
        var loc = gl.getAttribLocation(p, name); if (loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, size, type, norm, 0, 0);
      }
      function unbindAll() { for (var i = 0; i < 4; i++) gl.disableVertexAttribArray(i); }

      var PF = program(FIBRE_VS), PC = d.cortex ? program(CORTEX_VS) : null, PN = d.neurons.length ? program(NEURON_VS) : null;
      if (!PF) return;
      var B = { fPos: buffer(d.pos), fCol: buffer(d.vcol), fMisc: buffer(d.misc) };
      var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
      var both = new Uint16Array(d.lines.length + d.ends.length); both.set(d.lines); both.set(d.ends, d.lines.length);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, both, gl.STATIC_DRAW);
      if (PC) { B.cPos = buffer(d.cortex.pos); B.cNrm = buffer(d.cortex.nrm); }
      var NB = d.neurons.map(function (nu) { return { xy: buffer(nu.xy), dist: buffer(nu.dist), n: nu.n }; });

      gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);

      var W = 0, H = 0, dpr = 1, last = performance.now(), paused = false, clock = 0;
      var view = { ppm: 1, cx: 0, cy: 0 }, cells = [];

      // Neurons fill the dark space either side of the brain: cell bodies low, dendrites reaching up.
      function layout(brainHalfW, brainX) {
        cells = [];
        if (!d.neurons.length) return;
        var seed = 11;
        function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
        [-1, 1].forEach(function (side) {
          var sideW = side < 0 ? brainX - brainHalfW - 6 : W - brainX - brainHalfW - 6;
          var count = Math.max(1, Math.min(4, Math.round(sideW / 62)));
          for (var i = 0; i < count; i++) {
            var nu = d.neurons[(i * 2 + (side > 0 ? 1 : 0)) % d.neurons.length];
            var frac = (i + 0.5) / count;
            var x = side < 0 ? sideW * frac - 4 : W - sideW * frac + 4;
            var reach = H * (0.62 + 0.3 * rnd());                       // how tall the cell stands, in px
            var px = reach / (nu.up + nu.down * 0.35);
            cells.push({
              nb: NB[d.neurons.indexOf(nu)], x: x + (rnd() - 0.5) * 14, y: H * (0.06 + 0.22 * rnd()) + nu.down * px * 0.35,
              px: px, flip: rnd() < 0.5 ? -1 : 1, rot: (rnd() - 0.5) * 0.3,
              col: NEURON_COLS[Math.floor(rnd() * NEURON_COLS.length)], base: 0.2 + 0.12 * rnd(),
              period: 4.5 + rnd() * 5, offset: rnd() * 9, sway: rnd() * 6.28
            });
          }
        });
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = band.clientWidth; H = band.clientHeight;
        cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
        gl.viewport(0, 0, cv.width, cv.height);
        // Fit the whole brain in the space above the profile photo, which overlaps the band's bottom.
        var photo = band.parentNode && band.parentNode.querySelector(".pp-photo");
        var photoTop = photo && photo.offsetParent === band.offsetParent ? photo.offsetTop - band.offsetTop : H * 0.6;
        if (!(photoTop > 40 && photoTop <= H)) photoTop = H * 0.6;
        var avail = photoTop - 22;
        view.ppm = Math.min(avail / 140, W * 0.8 / 190);
        view.cy = 1 - 2 * (10 + avail / 2) / H;
        // Sit the brain a little left of centre (a dead-centre brain over the photo looks staged),
        // never closer than 12px to the band's left edge. The neurons fill the wider right side.
        var half = view.ppm * 92, brainX = Math.max(half + 12, W / 2 - W * 0.12);
        view.cx = 2 * brainX / W - 1;
        layout(half, brainX);
        if (reduce || paused) frame(last);
      }
      r.onResize = resize;
      window.addEventListener("resize", resize);
      if (window.ResizeObserver) { r.ro = new ResizeObserver(resize); r.ro.observe(band); }

      function setView(p, yaw, pitch) {
        gl.uniform1f(p.u.uScale, d.scale); gl.uniform1f(p.u.uYaw, yaw); gl.uniform1f(p.u.uPitch, pitch);
        gl.uniform1f(p.u.uPpmX, view.ppm * 2 / W); gl.uniform1f(p.u.uPpmY, view.ppm * 2 / H); gl.uniform1f(p.u.uCx, view.cx); gl.uniform1f(p.u.uCy, view.cy);
      }

      function frame(now) {
        if (!paused) clock += Math.min(now - last, 100) / 1000;
        last = now;
        var t = reduce ? 30 : clock;
        var grow = reduce ? 1 : Math.min(1, t / 3.0);
        var tip = reduce ? 1 : Math.min(1, Math.max(0, (t - 1.5) / 2.3));
        tip = tip * tip * (3 - 2 * tip);
        var after = Math.max(0, t - 3.8);
        var sway = (1 - Math.cos(Math.min(after, 3) / 3 * Math.PI)) / 2;     // ease the sway in
        var yaw = 1.5708 + sway * 0.38 * Math.sin(after * 0.32);
        var pitch = (1 - tip) * 1.5708 + tip * (0.16 + sway * 0.06 * Math.sin(after * 0.23));
        var cortexShow = reduce ? 1 : Math.min(1, Math.max(0, (t - 2.2) / 1.6));
        var wcyc = (t * 0.17) % 1.6;                                     // a sweep every ~9 s, with a rest
        var wpos = reduce ? -9 : 1.25 - wcyc * 2.5 / 1.2;                // front (+) to back (-)

        gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);

        if (PN) {                                                        // background neurons
          gl.useProgram(PN); unbindAll();
          gl.uniform2f(PN.u.uRes, W, H);
          for (var i = 0; i < cells.length; i++) {
            var c = cells[i];
            var since = (t + c.offset) % c.period, front = reduce ? -1 : (since < 1.6 ? since / 1.4 : -1);
            gl.uniform2f(PN.u.uOff, c.x, c.y + (reduce ? 0 : Math.sin(t * 0.35 + c.sway) * 2.5));
            gl.uniform1f(PN.u.uRot, c.rot + (reduce ? 0 : Math.sin(t * 0.21 + c.sway) * 0.025));
            gl.uniform1f(PN.u.uPx, c.px); gl.uniform1f(PN.u.uFlip, c.flip);
            gl.uniform1f(PN.u.uFront, front); gl.uniform1f(PN.u.uBase, c.base);
            gl.uniform3f(PN.u.uCol, c.col[0], c.col[1], c.col[2]);
            bind(PN, "aXY", c.nb.xy, 2, gl.SHORT, false);
            bind(PN, "aD", c.nb.dist, 1, gl.UNSIGNED_BYTE, true);
            gl.drawArrays(gl.LINES, 0, c.nb.n);
          }
        }
        if (PC && cortexShow > 0) {                                      // glass cortex, both hemispheres
          gl.useProgram(PC); unbindAll(); setView(PC, yaw, pitch);
          gl.uniform1f(PC.u.uShow, cortexShow); gl.uniform1f(PC.u.uDpr, dpr); gl.uniform1f(PC.u.uWave, wpos);
          bind(PC, "aPos", B.cPos, 3, gl.SHORT, false);
          bind(PC, "aNrm", B.cNrm, 3, gl.BYTE, true);
          gl.uniform1f(PC.u.uMirror, 1); gl.drawArrays(gl.POINTS, 0, d.cortex.n);
          gl.uniform1f(PC.u.uMirror, -1); gl.drawArrays(gl.POINTS, 0, d.cortex.n);
        }
        gl.useProgram(PF); unbindAll(); setView(PF, yaw, pitch);         // fibres
        bind(PF, "aPos", B.fPos, 3, gl.SHORT, false);
        bind(PF, "aCol", B.fCol, 3, gl.UNSIGNED_BYTE, true);
        bind(PF, "aMisc", B.fMisc, 4, gl.UNSIGNED_BYTE, true);
        gl.uniform1f(PF.u.uTime, t); gl.uniform1f(PF.u.uGrow, grow * 1.05); gl.uniform1f(PF.u.uDpr, dpr); gl.uniform1f(PF.u.uWave, wpos);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib);
        gl.uniform1f(PF.u.uPoint, 0); gl.drawElements(gl.LINES, d.lines.length, gl.UNSIGNED_SHORT, 0);
        gl.uniform1f(PF.u.uPoint, 1); gl.drawElements(gl.POINTS, d.ends.length, gl.UNSIGNED_SHORT, d.lines.length * 2);
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
