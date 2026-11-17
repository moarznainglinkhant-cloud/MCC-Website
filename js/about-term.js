// About page: animated "terminal" band behind a team member's photo on their profile card.
// Used when a person has bg: "terminal" in TEAM_EXTRAS (about.html). Oh My Zsh "robbyrussell"
// prompt colours on black, with a looping, made-up "hacking" session typed out line by line.
(function () {
  var C = { green: "#8AE234", red: "#EF2929", cyan: "#34E2E2", blue: "#729FCF", yellow: "#FCE94F", dim: "#7A7F87", text: "#D3D7CF" };
  var MAX_LINES = 9;

  function span(color, text, bold) {
    var s = document.createElement("span");
    s.style.color = color;
    if (bold) s.style.fontWeight = "700";
    s.textContent = text;
    return s;
  }
  // ➜  dir git:(main) ✗
  function prompt(dir, git, dirty) {
    var f = document.createDocumentFragment();
    f.appendChild(span(C.green, "➜  ", true));
    f.appendChild(span(C.cyan, dir, true));
    if (git) {
      f.appendChild(span(C.blue, " git:(", true));
      f.appendChild(span(C.red, "main"));
      f.appendChild(span(C.blue, ")", true));
      if (dirty) f.appendChild(span(C.yellow, " ✗"));
    }
    f.appendChild(document.createTextNode(" "));
    return f;
  }
  function hex(n) { var s = ""; for (var i = 0; i < n; i++) s += ("0" + Math.floor(Math.random() * 256).toString(16)).slice(-2) + (i % 2 ? " " : ""); return s.trim(); }
  function addr() { return "0x" + ("0000" + Math.floor(Math.random() * 0xffff).toString(16)).slice(-4) + ("0000" + Math.floor(Math.random() * 0xffff).toString(16)).slice(-4); }

  // The session. cmd = typed after a prompt; out = printed lines; hex = fast dump lines; bar = progress bar.
  var SCRIPT = [
    { dir: "~", cmd: "cd ~/mcc-website" },
    { dir: "mcc-website", git: true, dirty: true, cmd: "./breach --target uoftmcc.ca" },
    { out: [[C.dim, "[*] resolving uoftmcc.ca … 185.199.108.153"]] },
    { out: [[C.dim, "[*] bypassing firewall …"]] },
    { hex: 7 },
    { bar: "decrypting" },
    { out: [[C.green, "[+] ACCESS GRANTED", true]] },
    { dir: "mcc-website", git: true, dirty: true, cmd: "whoami" },
    { out: [[C.text, "moarz"]] },
    { dir: "mcc-website", git: true, dirty: true, cmd: "cat fun_fact.txt" },
    { out: [[C.text, "unhealthy amount of ASOIAF theory videos"]] },
    { dir: "mcc-website", git: true, dirty: true, cmd: "git commit -am \"ship it\" && git push" },
    { out: [[C.dim, "To github.com:moarznainglinkhant-cloud/MCC-Website"], [C.dim, "   main -> main"]] },
    { dir: "mcc-website", git: true, cmd: "" }
  ];

  var run = null; // { el, timers, alive }

  function stop() {
    if (!run) return;
    run.alive = false;
    run.timers.forEach(clearTimeout);
    run = null;
  }

  function start(el) {
    stop();
    var screen = el.querySelector(".term-screen");
    if (!screen) return;
    var r = { el: el, timers: [], alive: true };
    run = r;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function later(fn, ms) { r.timers.push(setTimeout(function () { if (r.alive) fn(); }, ms)); }
    function newLine() {
      var d = document.createElement("div");
      d.className = "term-line";
      screen.appendChild(d);
      while (screen.children.length > MAX_LINES) screen.removeChild(screen.firstChild);
      return d;
    }
    function cursor(line) {
      var old = screen.querySelector(".term-cursor");
      if (old) old.remove();
      var c = document.createElement("span");
      c.className = "term-cursor";
      line.appendChild(c);
    }

    function step(i, done) {
      if (i >= SCRIPT.length) return done();
      var s = SCRIPT[i], next = function (ms) { later(function () { step(i + 1, done); }, ms); };
      if (s.cmd !== undefined) {
        var line = newLine();
        line.appendChild(prompt(s.dir, s.git, s.dirty));
        var typed = document.createTextNode("");
        line.appendChild(typed);
        cursor(line);
        if (reduce) { typed.data = s.cmd; return next(0); }
        var k = 0;
        (function type() {
          if (k >= s.cmd.length) return next(s.cmd ? 380 : 0);
          typed.data += s.cmd.charAt(k++);
          later(type, 38 + Math.random() * 70);
        })();
      } else if (s.out) {
        s.out.forEach(function (o) { newLine().appendChild(span(o[0], o[1], o[2])); });
        next(reduce ? 0 : 420);
      } else if (s.hex) {
        var n = 0;
        (function burst() {
          if (n++ >= s.hex) return next(120);
          newLine().appendChild(span(C.dim, addr() + "  " + hex(8)));
          later(burst, reduce ? 0 : 55);
        })();
      } else if (s.bar) {
        var bl = newLine(), pct = 0, W = 18;
        (function grow() {
          var full = Math.round(pct / 100 * W);
          bl.textContent = "";
          bl.appendChild(span(C.yellow, "[" + "█".repeat(full) + "░".repeat(W - full) + "] " + pct + "% "));
          bl.appendChild(span(C.dim, s.bar + "…"));
          if (pct >= 100) return next(260);
          pct = reduce ? 100 : Math.min(100, pct + 4 + Math.floor(Math.random() * 9));
          later(grow, 70);
        })();
      }
    }

    function loop() {
      screen.textContent = "";
      step(0, function () {
        if (reduce) return; // static final screen
        later(loop, 5200);  // rest on the final prompt with a blinking cursor, then run again
      });
    }
    loop();
  }

  window.MCCTerm = { start: start, stop: stop };
})();
