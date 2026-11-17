// About page: animated terminal that fills a team member's profile card behind everything.
// Used when a person has bg: "terminal" in TEAM_EXTRAS (about.html). Oh My Zsh "robbyrussell"
// prompt colours on black. Each run opens with `cd ~/mcc-website`, then plays the other bits
// in a shuffled order, clears, and starts again.
(function () {
  var C = { green: "#8AE234", red: "#EF2929", cyan: "#34E2E2", blue: "#729FCF", yellow: "#FCE94F",
            magenta: "#AD7FA8", dim: "#7A7F87", text: "#D3D7CF" };
  var MAX_LINES = 70;

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
  function addr() { return "0x" + ("0000000" + Math.floor(Math.random() * 0xffffffff).toString(16)).slice(-8); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  // Step types: cmd (typed after a prompt), out (printed lines: [colour, text, bold]),
  // hex (fast dump lines), bar (progress bar), wait (ms pause).
  var P = { dir: "mcc-website", git: true, dirty: true };
  function cmd(c, extra) { var o = { dir: P.dir, git: P.git, dirty: P.dirty, cmd: c }; for (var k in extra) o[k] = extra[k]; return o; }

  var OPENING = [
    { dir: "~", cmd: "cd ~/mcc-website" }
  ];

  var BITS = [
    [ cmd("whoami"), { out: [[C.text, "moarz"]] } ],
    [ cmd("cat fun_fact.txt"), { out: [[C.text, "unhealthy amount of ASOIAF theory videos"]] } ],
    [ cmd("neofetch"), { out: [
        [C.cyan, "moarz", true], [C.dim, "-----"],
        [C.text, "Name:     Naing Lin Khant"],
        [C.text, "Role:     Website Coordinator, MCC"],
        [C.text, "Program:  Computer Science, 2nd year"],
        [C.text, "Uni:      University of Toronto"],
        [C.text, "Site:     uoftmcc.ca"]
      ] } ],
    [ cmd("ls"), { out: [[C.blue, "about.html  events.html  gallery.html  index.html  learn.html", true], [C.blue, "newsletter.html  fonts/  images/  js/", true]] } ],
    [ cmd("git log --oneline -3"), { out: [
        [C.yellow, "fa18c01 ", false], [C.text, "        Fix newsletter sign-up"],
        [C.yellow, "2d3adc7 ", false], [C.text, "        Show team photos on the homepage"],
        [C.yellow, "1c0f4f9 ", false], [C.text, "        Learn page: add MCC reel"]
      ], gitlog: true } ],
    [ cmd("grep -ri \"jon snow\" ~/notes"), { out: [[C.magenta, "~/notes/theories.md", false], [C.text, "  R + L = J"]] } ],
    [ cmd("ssh moarz@winterfell"), { out: [[C.red, "ssh: connect to host winterfell: winter is coming"]] } ],
    [ cmd("echo \"Mingalabar\" | translate --to my"), { out: [[C.text, "မင်္ဂလာပါ"]] } ],
    [ cmd("ping -c 2 uoftmcc.ca"), { out: [
        [C.text, "64 bytes from uoftmcc.ca: icmp_seq=0 ttl=57 time=11.8 ms"],
        [C.text, "64 bytes from uoftmcc.ca: icmp_seq=1 ttl=57 time=12.1 ms"]
      ], slow: true } ],
    [ cmd("sudo make coffee"), { out: [[C.text, "[sudo] password for moarz: ********"]] }, { wait: 500 }, { out: [[C.green, "coffee: brewed. productivity +12%"]] } ],
    [ cmd("python3 -c \"print('hello, MCC')\""), { out: [[C.text, "hello, MCC"]] } ],
    [ cmd("./crack --hash 5f4dcc3b5aa765d61d8327deb882cf99"), { hex: 6 }, { bar: "bruteforcing" }, { out: [[C.green, "[+] found: password", true], [C.dim, "(please don't use this one)"]] } ],
    [ cmd("git commit -am \"ship it\" && git push"), { out: [[C.dim, "To github.com:moarznainglinkhant-cloud/MCC-Website"], [C.dim, "   main -> main"]] } ]
  ];

  var run = null;

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
    var r = { timers: [], alive: true };
    run = r;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function later(fn, ms) { r.timers.push(setTimeout(function () { if (r.alive) fn(); }, ms)); }
    function newLine() {
      var d = document.createElement("div");
      d.className = "term-line";
      screen.appendChild(d);
      // Fill from the top; once the window is full, scroll by dropping the oldest line.
      while (screen.firstChild !== d && (screen.scrollHeight > screen.clientHeight || screen.children.length > MAX_LINES)) screen.removeChild(screen.firstChild);
      return d;
    }
    function cursor(line) {
      var old = screen.querySelector(".term-cursor");
      if (old) old.remove();
      var c = document.createElement("span");
      c.className = "term-cursor";
      line.appendChild(c);
    }

    function play(steps, i, done) {
      if (i >= steps.length) return done();
      var s = steps[i], next = function (ms) { later(function () { play(steps, i + 1, done); }, reduce ? 0 : ms); };
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
          later(type, 35 + Math.random() * 65);
        })();
      } else if (s.out) {
        if (s.gitlog) { // hash + message on one line
          for (var g = 0; g < s.out.length; g += 2) {
            var gl = newLine();
            gl.appendChild(span(s.out[g][0], s.out[g][1]));
            gl.appendChild(span(s.out[g + 1][0], s.out[g + 1][1].trim()));
          }
          return next(420);
        }
        var n = 0;
        (function print() {
          if (n >= s.out.length) return next(420);
          var o = s.out[n++];
          newLine().appendChild(span(o[0], o[1], o[2]));
          if (s.slow && !reduce) later(print, 650); else print();
        })();
      } else if (s.hex) {
        var h = 0;
        (function burst() {
          if (h++ >= s.hex) return next(120);
          newLine().appendChild(span(C.dim, addr() + "  " + hex(8)));
          if (reduce) burst(); else later(burst, 50);
        })();
      } else if (s.bar) {
        var bl = newLine(), pct = 0, W = 20;
        (function grow() {
          var full = Math.round(pct / 100 * W);
          bl.textContent = "";
          bl.appendChild(span(C.yellow, "[" + "█".repeat(full) + "░".repeat(W - full) + "] " + pct + "% "));
          bl.appendChild(span(C.dim, s.bar + "…"));
          if (pct >= 100) return next(260);
          pct = reduce ? 100 : Math.min(100, pct + 3 + Math.floor(Math.random() * 9));
          later(grow, 70);
        })();
      } else if (s.wait) {
        next(s.wait);
      } else {
        next(0);
      }
    }

    function loop() {
      screen.textContent = "";
      var steps = OPENING.concat.apply(OPENING, shuffle(BITS));
      steps.push({ dir: P.dir, git: true, cmd: "" }); // final prompt, blinking cursor
      play(steps, 0, function () {
        if (reduce) return;        // static screen
        later(loop, 6000);         // rest, then clear and run again in a new order
      });
    }
    loop();
  }

  window.MCCTerm = { start: start, stop: stop };
})();
