// Exec-only meeting finder: each exec paints a standing weekly availability grid and lists
// one-off days they can't make it; anyone can then find the best meeting times for the people
// who have to be there. Backend: Supabase. Needs js/supabase.js and js/exec-config.js first.
(function () {
  "use strict";

  var cfg = window.MCC_EXEC_CONFIG || {};
  var configured = cfg.url && cfg.key && cfg.url.indexOf("PASTE_") !== 0 && cfg.key.indexOf("PASTE_") !== 0;

  var DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  var DAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  var N = 30;              // 30-minute blocks per day: 8:00 am to 11:00 pm
  var START = 480;         // minutes after midnight of the first block
  var TOTAL = N * 7;       // cells in the weekly grid
  var STALE_DAYS = 90;

  function $(id) { return document.getElementById(id); }
  function setMsg(node, text, kind) {
    if (!node) return;
    node.textContent = text || "";            // textContent only: never inject text as HTML
    node.className = "msg" + (kind ? " " + kind : "");
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function when(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var s = (Date.now() - d.getTime()) / 1000;
    if (s < 60) return "just now";
    if (s < 3600) return Math.floor(s / 60) + " min ago";
    if (s < 86400) return Math.floor(s / 3600) + " h ago";
    if (s < 86400 * 7) return Math.floor(s / 86400) + " d ago";
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }
  function slotLabel(s) {
    var m = START + s * 30, h = Math.floor(m / 60), mm = m % 60;
    return (h % 12 || 12) + ":" + (mm ? "30" : "00") + " " + (h >= 12 ? "pm" : "am");
  }
  function hourLabel(s) { return slotLabel(s).replace(":00", ""); }
  function fmtYMD(d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function localToday() { return fmtYMD(new Date()); }
  function nextDay(ymd) { var d = new Date(ymd + "T00:00:00"); d.setDate(d.getDate() + 1); return fmtYMD(d); }
  function weekdayOf(ymd) { var d = new Date(ymd + "T00:00:00"); return (d.getDay() + 6) % 7; }   // Mon = 0
  function shortDate(ymd) {
    var d = new Date(ymd + "T00:00:00");
    return isNaN(d) ? ymd : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }
  function blankCells() { return new Array(TOTAL + 1).join("0"); }

  var msgEl = $("meet-msg");

  // ---------- not configured ----------
  if (!configured || !window.supabase) {
    setMsg(msgEl, "The exec area isn't connected to its database yet.", "info");
    return;
  }

  var sb = window.supabase.createClient(cfg.url, cfg.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  var me = null;
  var team = [];          // [{ id, display_name, role }]
  var byId = {};
  var coreIds = {};       // id -> true
  var hasCore = false;
  var avail = {};         // user id -> { cells, updated_at }
  var blocks = {};        // user id -> { "YYYY-MM-DD": true }   (upcoming days only)
  var myCells = [];       // my grid as an array of "0" | "1" | "2"
  var dirty = false;

  function goLogin() { location.replace("login.html"); }
  function label(id) {
    var p = byId[id];
    if (!p) return "An exec";
    return p.display_name + (p.role && p.role !== "exec" ? " (" + p.role + ")" : "");
  }

  // =====================================================================
  //  Loading
  // =====================================================================
  function loadAll() {
    var today = localToday();
    return Promise.all([
      sb.from("profiles").select("id, display_name, role").order("created_at", { ascending: true }),
      sb.from("profiles").select("id, is_core"),
      sb.from("availability").select("user_id, cells, updated_at"),
      sb.from("unavailable_dates").select("user_id, day").gte("day", today).limit(2000)
    ]).then(function (r) {
      var pr = r[0], core = r[1], av = r[2], bl = r[3];
      if (pr.error || !pr.data) throw new Error("profiles");
      team = pr.data;
      byId = {};
      team.forEach(function (p) { byId[p.id] = p; });

      hasCore = !core.error && !!core.data;
      coreIds = {};
      if (hasCore) core.data.forEach(function (p) { if (p.is_core) coreIds[p.id] = true; });

      if (av.error || bl.error) { var e = new Error("setup"); e.setup = true; throw e; }
      avail = {};
      av.data.forEach(function (a) { avail[a.user_id] = a; });
      blocks = {};
      bl.data.forEach(function (b) { (blocks[b.user_id] = blocks[b.user_id] || {})[b.day] = true; });
    });
  }

  // =====================================================================
  //  Grid builder (used for the editor and the read-only heat map)
  // =====================================================================
  function buildGrid(host, headerButtons) {
    host.textContent = "";
    var grid = el("div", "agrid");
    grid.appendChild(el("div", "corner"));
    var heads = [];
    for (var d = 0; d < 7; d++) {
      var h = headerButtons ? el("button", "dh", DAYS[d]) : el("div", "dh", DAYS[d]);
      if (headerButtons) h.type = "button";
      h.setAttribute("data-d", d);
      grid.appendChild(h);
      heads.push(h);
    }
    var cells = new Array(TOTAL);
    for (var s = 0; s < N; s++) {
      grid.appendChild(el("div", "tl", s % 2 === 0 ? hourLabel(s) : ""));
      for (d = 0; d < 7; d++) {
        var c = el("div", "cell");
        c.setAttribute("data-i", d * N + s);
        c.title = DAYS[d] + " " + slotLabel(s);
        grid.appendChild(c);
        cells[d * N + s] = c;
      }
    }
    host.appendChild(grid);
    return { grid: grid, cells: cells, heads: heads };
  }

  // =====================================================================
  //  My availability
  // =====================================================================
  var editor = null;
  var brush = "1";

  function paintCell(i) {
    editor.cells[i].className = "cell" + (myCells[i] !== "0" ? " s" + myCells[i] : "");
  }
  function refreshEditor() { for (var i = 0; i < TOTAL; i++) paintCell(i); }
  function setDirty(v) {
    dirty = v;
    $("m-status").textContent = v ? "Unsaved changes" : (avail[me.id] ? "Saved · updated " + when(avail[me.id].updated_at) : "Not saved yet");
  }

  function initEditor() {
    var cur = avail[me.id] ? avail[me.id].cells : blankCells();
    myCells = cur.split("");
    editor = buildGrid($("m-grid"), true);
    refreshEditor();
    setDirty(false);

    var painting = false;
    function paintFrom(target) {
      var c = target && target.closest ? target.closest(".cell") : null;
      if (!c || !editor.grid.contains(c)) return;
      var i = +c.getAttribute("data-i");
      if (myCells[i] !== brush) { myCells[i] = brush; paintCell(i); setDirty(true); }
    }
    var lastX = 0, lastY = 0;
    editor.grid.addEventListener("pointerdown", function (e) {
      if (!e.target.closest(".cell")) return;
      e.preventDefault();
      painting = true;
      lastX = e.clientX; lastY = e.clientY;
      try { editor.grid.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ }
      paintFrom(e.target);
    });
    editor.grid.addEventListener("pointermove", function (e) {
      if (!painting) return;
      // A fast drag reports few positions, so walk the straight line from the last
      // position to this one and paint every block along the way.
      var dx = e.clientX - lastX, dy = e.clientY - lastY;
      var steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 6));
      for (var k = 1; k <= steps; k++) {
        paintFrom(document.elementFromPoint(lastX + dx * k / steps, lastY + dy * k / steps));
      }
      lastX = e.clientX; lastY = e.clientY;
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (ev) {
      editor.grid.addEventListener(ev, function () { painting = false; });
    });

    editor.heads.forEach(function (h) {
      h.addEventListener("click", function () {
        var d = +h.getAttribute("data-d");
        for (var s = 0; s < N; s++) { myCells[d * N + s] = brush; paintCell(d * N + s); }
        setDirty(true);
      });
    });

    document.querySelectorAll(".brush").forEach(function (b) {
      b.addEventListener("click", function () {
        brush = b.getAttribute("data-b");
        document.querySelectorAll(".brush").forEach(function (x) { x.classList.toggle("on", x === b); });
      });
    });
    $("m-clear").addEventListener("click", function () {
      myCells = blankCells().split("");
      refreshEditor();
      setDirty(true);
    });

    $("m-save").addEventListener("click", function () {
      var btn = this;
      btn.disabled = true;
      setMsg(msgEl, "Saving…", "info");
      var row = { user_id: me.id, cells: myCells.join(""), updated_at: new Date().toISOString() };
      sb.from("availability").upsert(row).then(function (r) {
        btn.disabled = false;
        if (r.error) { setMsg(msgEl, "Couldn't save your availability. Try again.", "error"); return; }
        avail[me.id] = { user_id: me.id, cells: row.cells, updated_at: row.updated_at };
        setDirty(false);
        setMsg(msgEl, "Saved.", "info");
        recompute();
      }).catch(function () {
        btn.disabled = false;
        setMsg(msgEl, "Couldn't reach the server.", "error");
      });
    });
  }

  // ----- days I can't make it -----
  function groupRanges(days) {
    var out = [];
    days.forEach(function (d) {
      var last = out[out.length - 1];
      if (last && nextDay(last.b) === d) last.b = d; else out.push({ a: d, b: d });
    });
    return out;
  }

  function renderBlocks() {
    var ul = $("blk-list");
    ul.textContent = "";
    var days = Object.keys(blocks[me.id] || {}).sort();
    if (!days.length) { ul.appendChild(el("li", "empty", "No days blocked.")); return; }
    groupRanges(days).forEach(function (g) {
      var li = el("li", "blk");
      li.appendChild(el("span", null, g.a === g.b ? shortDate(g.a) : shortDate(g.a) + " – " + shortDate(g.b)));
      var del = el("button", "link-btn", "Remove");
      del.type = "button";
      del.addEventListener("click", function () {
        del.disabled = true;
        sb.from("unavailable_dates").delete().eq("user_id", me.id).gte("day", g.a).lte("day", g.b).then(function (r) {
          if (r.error) { del.disabled = false; setMsg($("blk-msg"), "Couldn't remove that.", "error"); return; }
          var mine = blocks[me.id] || {};
          Object.keys(mine).forEach(function (d) { if (d >= g.a && d <= g.b) delete mine[d]; });
          setMsg($("blk-msg"), "", "");
          renderBlocks();
          recompute();
        });
      });
      li.appendChild(del);
      ul.appendChild(li);
    });
  }

  function initBlocks() {
    var from = $("blk-from"), to = $("blk-to"), bmsg = $("blk-msg");
    from.min = to.min = localToday();
    renderBlocks();
    $("blk-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var a = from.value, b = to.value || a;
      if (!a) { setMsg(bmsg, "Pick a date first.", "error"); return; }
      if (a < localToday()) { setMsg(bmsg, "That date has already passed.", "error"); return; }
      if (b < a) { setMsg(bmsg, "The end date is before the start date.", "error"); return; }
      var rows = [], d = a;
      while (d <= b && rows.length <= 90) { rows.push({ user_id: me.id, day: d }); d = nextDay(d); }
      if (rows.length > 90) { setMsg(bmsg, "That range is too long (90 days at most).", "error"); return; }
      setMsg(bmsg, "Adding…", "info");
      sb.from("unavailable_dates").upsert(rows, { onConflict: "user_id,day", ignoreDuplicates: true }).then(function (r) {
        if (r.error) { setMsg(bmsg, "Couldn't add that. Try again.", "error"); return; }
        blocks[me.id] = blocks[me.id] || {};
        rows.forEach(function (x) { blocks[me.id][x.day] = true; });
        from.value = ""; to.value = "";
        setMsg(bmsg, "", "");
        renderBlocks();
        recompute();
      }).catch(function () { setMsg(bmsg, "Couldn't reach the server.", "error"); });
    });
  }

  // =====================================================================
  //  Find a time
  // =====================================================================
  var required = {};      // id -> true
  var heat = null;

  // "0" busy, "1" free, "2" if needed, null = this exec hasn't set availability.
  function stateAt(uid, d, s, dateStr, dateDay) {
    var a = avail[uid];
    if (!a) return null;
    if (dateStr && d === dateDay && blocks[uid] && blocks[uid][dateStr]) return "0";
    return a.cells.charAt(d * N + s) || "0";
  }

  function settings() {
    var date = $("f-date").value || "";
    var dateDay = date ? weekdayOf(date) : null;
    var dayVal = $("f-day").value;
    return {
      date: date,
      dateDay: dateDay,
      days: date ? [dateDay] : (dayVal === "any" ? [0, 1, 2, 3, 4, 5, 6] : [+dayVal]),
      dur: +$("f-dur").value,
      from: +$("f-from").value,
      until: +$("f-until").value,
      strict: $("f-strict").checked
    };
  }

  // Who is free / if-needed / busy / unknown over blocks [start, start + dur) on day d.
  function evalWindow(d, start, dur, st) {
    var w = { d: d, start: start, dur: dur, free: [], maybe: [], busy: [], unknown: [], reqBlocked: [] };
    team.forEach(function (p) {
      var any0 = false, any2 = false, unknown = false;
      for (var s = start; s < start + dur; s++) {
        var v = stateAt(p.id, d, s, st.date, st.dateDay);
        if (v === null) { unknown = true; break; }
        if (v === "0") any0 = true; else if (v === "2") any2 = true;
      }
      if (unknown) w.unknown.push(p.id);
      else if (any0) { w.busy.push(p.id); if (required[p.id]) w.reqBlocked.push(p.id); }
      else if (any2) w.maybe.push(p.id);
      else w.free.push(p.id);
    });
    return w;
  }

  function rank(a, b) {
    if (a.reqBlocked.length !== b.reqBlocked.length) return a.reqBlocked.length - b.reqBlocked.length;
    var aa = a.free.length + a.maybe.length, bb = b.free.length + b.maybe.length;
    if (aa !== bb) return bb - aa;
    if (a.free.length !== b.free.length) return b.free.length - a.free.length;
    if (a.d !== b.d) return a.d - b.d;
    return a.start - b.start;
  }

  // Best non-overlapping windows (greedy), at most `max`.
  function pickBest(list, max) {
    var chosen = [];
    list.slice().sort(rank).forEach(function (w) {
      if (chosen.length >= max) return;
      var clash = chosen.some(function (c) { return c.d === w.d && w.start < c.start + c.dur && c.start < w.start + w.dur; });
      if (!clash) chosen.push(w);
    });
    return chosen;
  }

  function nameList(ids) {
    return ids.map(function (id) { return label(id) + (required[id] ? " ★" : ""); }).join(", ");
  }

  function resultCard(w) {
    var li = el("li", "result");
    var head = el("div", "result-head");
    head.appendChild(el("strong", null, DAYS_LONG[w.d] + " · " + slotLabel(w.start) + " – " + slotLabel(w.start + w.dur)));
    var n = w.free.length + w.maybe.length;
    head.appendChild(el("span", "badge" + (w.reqBlocked.length ? " bad" : ""), n + " of " + team.length + " available"));
    li.appendChild(head);
    if (w.reqBlocked.length) li.appendChild(el("p", "r-line bad", "Required but busy: " + nameList(w.reqBlocked)));
    if (w.maybe.length) li.appendChild(el("p", "r-line", "If needed: " + nameList(w.maybe)));
    var others = w.busy.filter(function (id) { return !required[id]; });
    if (others.length) li.appendChild(el("p", "r-line", "Can't make it: " + nameList(others)));
    if (w.unknown.length) li.appendChild(el("p", "r-line dim", "No availability set: " + nameList(w.unknown)));
    if (!w.busy.length && !w.maybe.length && !w.unknown.length) li.appendChild(el("p", "r-line good", "Everyone is free."));
    return li;
  }

  function renderStatus() {
    var set = team.filter(function (p) { return avail[p.id]; });
    var unset = team.filter(function (p) { return !avail[p.id]; });
    var stale = set.filter(function (p) { return Date.now() - new Date(avail[p.id].updated_at).getTime() > STALE_DAYS * 86400000; });
    var txt = set.length + " of " + team.length + " execs have set their availability.";
    if (unset.length) txt += " Not set: " + unset.map(function (p) { return p.display_name; }).join(", ") + ".";
    if (stale.length) txt += " Possibly out of date (over " + STALE_DAYS + " days): " + stale.map(function (p) { return p.display_name; }).join(", ") + ".";
    $("f-status").textContent = txt;
  }

  function recompute() {
    if (!team.length) return;
    var st = settings();
    renderStatus();

    $("f-date-hint").textContent = st.date
      ? "Using " + DAYS_LONG[st.dateDay] + " " + shortDate(st.date) + ", including anyone's blocked days."
      : "Pick a date to take everyone's \"can't make it\" days into account.";

    var results = $("f-results");
    results.textContent = "";
    var hint = $("f-hint");
    hint.textContent = "";

    if (st.until - st.from < st.dur) {
      hint.textContent = "The time range is shorter than the meeting length. Widen it.";
    } else if (!Object.keys(avail).length) {
      hint.textContent = "Nobody has set their availability yet. Use the My availability tab to start.";
    } else {
      var all = [];
      st.days.forEach(function (d) {
        for (var s = st.from; s + st.dur <= st.until; s++) all.push(evalWindow(d, s, st.dur, st));
      });
      var anyRequired = Object.keys(required).length > 0;
      var ok = all.filter(function (w) { return !w.reqBlocked.length; });
      var shown, closest = false;
      if (st.strict && anyRequired) {
        shown = pickBest(ok, 8);
        if (!shown.length) { shown = pickBest(all, 6); closest = true; }
      } else {
        shown = pickBest(all, 8);
      }
      if (closest) hint.textContent = "No time works for every required exec. Here are the closest options:";
      else if (anyRequired && st.strict) hint.textContent = "Times when every required exec is available (★ = required), best first:";
      else hint.textContent = "Best first. Tick who has to be there to filter these.";
      if (!shown.length) hint.textContent = "No times fit those settings.";
      shown.forEach(function (w) { results.appendChild(resultCard(w)); });
    }

    renderHeat(st);
  }

  function slotInfo(d, s, st) {
    var w = evalWindow(d, s, 1, st);
    var box = $("f-info");
    box.textContent = "";
    box.appendChild(el("strong", null, DAYS_LONG[d] + " · " + slotLabel(s)));
    function line(title, ids, cls) {
      if (!ids.length) return;
      var p = el("p", "r-line " + (cls || ""));
      p.appendChild(el("b", null, title + ": "));
      p.appendChild(document.createTextNode(nameList(ids)));
      box.appendChild(p);
    }
    line("Free", w.free, "good");
    line("If needed", w.maybe);
    line("Can't make it", w.busy, w.reqBlocked.length ? "bad" : "");
    line("No availability set", w.unknown, "dim");
  }

  function renderHeat(st) {
    var first = !heat;
    if (first) {
      heat = buildGrid($("f-heat"), false);
      heat.grid.addEventListener("click", function (e) {
        var c = e.target.closest(".cell");
        if (!c) return;
        var i = +c.getAttribute("data-i");
        slotInfo(Math.floor(i / N), i % N, settings());
      });
    }
    var total = team.length || 1;
    var anyRequired = Object.keys(required).length > 0;
    for (var d = 0; d < 7; d++) {
      for (var s = 0; s < N; s++) {
        var cell = heat.cells[d * N + s];
        var n = 0, reqBad = false;
        team.forEach(function (p) {
          var v = stateAt(p.id, d, s, st.date, st.dateDay);
          if (v === "1" || v === "2") n++;
          else if (v === "0" && required[p.id]) reqBad = true;
        });
        var offDay = st.days.indexOf(d) === -1;
        var offTime = s < st.from || s >= st.until;
        cell.className = "cell heat" + ((offDay || offTime || (st.strict && anyRequired && reqBad)) ? " off" : "");
        cell.style.background = n ? "rgba(75,122,60," + (0.12 + 0.8 * n / total).toFixed(2) + ")" : "";
      }
    }
  }

  function renderPeople() {
    var box = $("f-people");
    box.textContent = "";
    team.forEach(function (p) {
      var lab = el("label", "who-item");
      var cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = !!required[p.id];
      cb.addEventListener("change", function () {
        if (cb.checked) required[p.id] = true; else delete required[p.id];
        recompute();
      });
      lab.appendChild(cb);
      lab.appendChild(el("span", null, label(p.id) + (p.id === me.id ? " (me)" : "")));
      box.appendChild(lab);
    });
  }

  function setRequired(ids) {
    required = {};
    ids.forEach(function (id) { required[id] = true; });
    renderPeople();
    recompute();
  }

  function initFinder() {
    // day
    var day = $("f-day");
    var any = el("option", null, "Any day"); any.value = "any"; day.appendChild(any);
    DAYS_LONG.forEach(function (n, i) { var o = el("option", null, n); o.value = i; day.appendChild(o); });
    // length
    var dur = $("f-dur");
    [[1, "30 minutes"], [2, "1 hour"], [3, "1.5 hours"], [4, "2 hours"], [6, "3 hours"]].forEach(function (x) {
      var o = el("option", null, x[1]); o.value = x[0]; dur.appendChild(o);
    });
    dur.value = "2";
    // time range
    var from = $("f-from"), until = $("f-until");
    for (var s = 0; s < N; s++) { var o1 = el("option", null, slotLabel(s)); o1.value = s; from.appendChild(o1); }
    for (var e = 1; e <= N; e++) { var o2 = el("option", null, slotLabel(e)); o2.value = e; until.appendChild(o2); }
    from.value = "2";      // 9:00 am
    until.value = "28";    // 10:00 pm
    var dateIn = $("f-date");
    dateIn.min = localToday();

    renderPeople();

    ["f-day", "f-dur", "f-from", "f-until", "f-strict"].forEach(function (id) {
      $(id).addEventListener("change", recompute);
    });
    dateIn.addEventListener("change", function () {
      if (dateIn.value) { day.value = String(weekdayOf(dateIn.value)); day.disabled = true; }
      else day.disabled = false;
      recompute();
    });
    $("f-all").addEventListener("click", function () { setRequired(team.map(function (p) { return p.id; })); });
    $("f-none").addEventListener("click", function () { setRequired([]); });
    if (hasCore) {
      $("f-core").hidden = false;
      $("f-core").addEventListener("click", function () { setRequired(Object.keys(coreIds)); });
    }
    recompute();
  }

  // =====================================================================
  //  Tabs + boot
  // =====================================================================
  function showTab(name) {
    ["find", "mine"].forEach(function (t) {
      var on = t === name;
      $("pane-" + t).hidden = !on;
      var tab = $("tab-" + t);
      tab.classList.toggle("on", on);
      tab.setAttribute("aria-selected", String(on));
    });
  }

  function init() {
    initEditor();
    initBlocks();
    initFinder();
    document.querySelectorAll(".tab").forEach(function (t) {
      t.addEventListener("click", function () { showTab(t.getAttribute("data-tab")); });
    });
    var mine = !avail[me.id];
    showTab(mine ? "mine" : "find");
    if (mine) setMsg(msgEl, "Start by painting when you're usually free, then press Save.", "info");
  }

  sb.auth.getSession().then(function (r) {
    if (!r.data || !r.data.session) return goLogin();
    return sb.auth.getUser().then(function (u) {
      if (u.error || !u.data || !u.data.user) return sb.auth.signOut().then(goLogin);
      var meta = u.data.user.user_metadata || {};
      if (!meta.password_set) { location.replace("exec.html"); return; }   // choose your own password first
      me = { id: u.data.user.id };
      return loadAll().then(init);
    });
  }).catch(function (err) {
    if (err && err.setup) {
      setMsg(msgEl, "The meeting finder isn't set up in the database yet. Run the setup SQL in Supabase, then refresh.", "error");
    } else {
      setMsg(msgEl, "Couldn't load the meeting finder. Try signing in again.", "error");
    }
  });
})();
