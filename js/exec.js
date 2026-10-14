// Exec-only area: sign-in (login.html) and the dashboard (exec.html).
// Backend: Supabase (hosted Postgres + Auth). Needs js/supabase.js and js/exec-config.js first.
(function () {
  "use strict";

  var page = document.body.getAttribute("data-page");
  var cfg = window.MCC_EXEC_CONFIG || {};
  var configured = cfg.url && cfg.key && cfg.url.indexOf("PASTE_") !== 0 && cfg.key.indexOf("PASTE_") !== 0;

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
  function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
  function localToday() {
    var d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function dueLabel(ymd) {
    var d = new Date(ymd + "T00:00:00");
    return isNaN(d) ? ymd : d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  // ---------- not configured yet ----------
  if (!configured || !window.supabase) {
    var m = $("msg");
    if (m) setMsg(m, "The exec area isn't connected to its database yet.", "info");
    var f = $("login-form");
    if (f) f.querySelectorAll("input,button").forEach(function (x) { x.disabled = true; });
    var bt = $("boot-text");
    if (bt) bt.textContent = "The exec area isn't connected to its database yet. Add the Supabase URL and key in js/exec-config.js.";
    return;
  }

  // A password-recovery link arrives as exec.html#access_token=...&type=recovery. Only then
  // do we let the client read the session out of the URL (it stays off everywhere else).
  var isRecovery = page === "exec" && /[#&]type=recovery(&|$)/.test(location.hash);

  var sb = window.supabase.createClient(cfg.url, cfg.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: isRecovery }
  });

  // ---------- login page ----------
  if (page === "login") {
    var form = $("login-form"), msg = $("msg"), btn = $("login-btn");

    if (/error_code=|error=access_denied/.test(location.hash)) {
      setMsg(msg, "That reset link has expired or was already used. Ask the Website Coordinator for a fresh one.", "error");
      if (window.history && history.replaceState) history.replaceState(null, "", location.pathname);
    } else {
      sb.auth.getSession().then(function (r) {
        if (r.data && r.data.session) location.replace("exec.html");
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = $("email").value.trim();
      var password = $("password").value;
      if (!email || !password) { setMsg(msg, "Enter your email and password.", "error"); return; }
      btn.disabled = true;
      setMsg(msg, "Signing in…", "info");
      sb.auth.signInWithPassword({ email: email, password: password }).then(function (r) {
        if (r.error) {
          btn.disabled = false;
          // One generic message for every failure, so the form never reveals which emails exist.
          setMsg(msg, "That email and password didn't match. Try again.", "error");
          $("password").value = "";
          return;
        }
        location.href = "exec.html";
      }).catch(function () {
        btn.disabled = false;
        setMsg(msg, "Couldn't reach the server. Check your connection and try again.", "error");
      });
    });
  }

  // ---------- exec dashboard ----------
  if (page === "exec") {
    var me = null;            // { id, name, role, email }
    var team = [];            // [{ id, display_name, role }]
    var names = {};           // id -> display_name
    var todos = [];
    var todoFilter = "open";

    function goLogin() { location.replace("login.html"); }
    function nameOf(id) { return names[id] || "An exec"; }

    // ----- Announcement banner (latest row; hidden if none or table not set up yet) -----
    function loadAnnouncement() {
      return sb.from("announcements").select("body, created_at").order("created_at", { ascending: false }).limit(1)
        .then(function (r) {
          var row = r.data && r.data[0];
          if (r.error || !row) return;
          $("announce-body").textContent = row.body;
          $("announce-meta").textContent = "Posted " + when(row.created_at);
          $("announce").hidden = false;
        });
    }

    // Set to true to show the "The team" panel again. The roster still loads either way,
    // because names and the to-do assignee list depend on it.
    var SHOW_TEAM_PANEL = false;

    // ----- Team roster (also feeds the name lookup + assignee dropdown) -----
    function loadTeam() {
      return sb.from("profiles").select("id, display_name, role").order("created_at", { ascending: true })
        .then(function (r) {
          if (r.error || !r.data || !r.data.length) return;
          team = r.data;
          names = {};
          team.forEach(function (p) { names[p.id] = p.display_name; });
          var ul = $("team-list");
          ul.textContent = "";
          team.forEach(function (p) {
            var li = el("li", "team-card");
            li.appendChild(el("strong", null, p.display_name));
            li.appendChild(el("span", null, p.role));
            ul.appendChild(li);
          });
          $("team-panel").hidden = !SHOW_TEAM_PANEL;
        });
    }

    // ----- Reactions on shout-outs -----
    var EMOJIS = ["🎉", "👏", "🔥", "💛"];

    // One reaction per exec per shout-out: click yours again to remove it, click another to switch.
    function toggleReaction(shoutId, emoji, current, b) {
      b.disabled = true;
      var t = sb.from("shoutout_reactions");
      var q = current === emoji
        ? t.delete().eq("shoutout_id", shoutId).eq("user_id", me.id)
        : current
          ? t.update({ emoji: emoji }).eq("shoutout_id", shoutId).eq("user_id", me.id)
          : t.insert({ shoutout_id: shoutId, emoji: emoji });
      q.then(function (r) {
        if (r.error) { b.disabled = false; setMsg($("shout-msg"), "Couldn't save that reaction.", "error"); }
        else loadShouts();
      });
    }

    function reactionBar(s) {
      var bar = el("div", "reacts");
      var rs = s.shoutout_reactions || [];
      var mineRow = rs.filter(function (x) { return me && x.user_id === me.id; })[0];
      var current = mineRow ? mineRow.emoji : null;
      EMOJIS.forEach(function (emoji) {
        var who = rs.filter(function (x) { return x.emoji === emoji; });
        var mine = current === emoji;
        var b = el("button", "react" + (mine ? " on" : ""));
        b.type = "button";
        b.setAttribute("aria-pressed", String(mine));
        b.appendChild(el("span", null, emoji));
        if (who.length) b.appendChild(el("span", "n", String(who.length)));
        b.title = who.length ? who.map(function (x) { return nameOf(x.user_id); }).join(", ") : "React with " + emoji;
        b.addEventListener("click", function () { toggleReaction(s.id, emoji, current, b); });
        bar.appendChild(b);
      });
      return bar;
    }

    // ----- Shout-out wall -----
    function renderShouts(rows) {
      var ul = $("shout-list");
      ul.textContent = "";
      if (!rows.length) {
        ul.appendChild(el("li", "empty", "Nothing here yet. Say hi!"));
        return;
      }
      rows.forEach(function (s) {
        var li = el("li", "shout");
        li.appendChild(el("p", "shout-text", s.body));
        if (s.shoutout_reactions) li.appendChild(reactionBar(s));   // only once the reactions table exists
        var foot = el("div", "shout-foot");
        var by = el("span", "shout-by", nameOf(s.author_id));
        by.appendChild(el("small", null, when(s.created_at)));
        foot.appendChild(by);
        if (me && s.author_id === me.id) {
          var del = el("button", "link-btn", "Delete");
          del.type = "button";
          del.addEventListener("click", function () {
            del.disabled = true;
            sb.from("shoutouts").delete().eq("id", s.id).then(function (r) {
              if (r.error) { del.disabled = false; setMsg($("shout-msg"), "Couldn't delete that one.", "error"); }
              else loadShouts();
            });
          });
          foot.appendChild(del);
        }
        li.appendChild(foot);
        ul.appendChild(li);
      });
    }

    function loadShouts() {
      return sb.from("shoutouts")
        .select("id, author_id, body, created_at, shoutout_reactions(emoji, user_id)")
        .order("created_at", { ascending: false }).limit(50)
        .then(function (r) {
          if (r.error) {
            // Reactions table may not exist yet: fall back to plain shout-outs.
            return sb.from("shoutouts").select("id, author_id, body, created_at")
              .order("created_at", { ascending: false }).limit(50).then(function (r2) {
                if (r2.error) { $("shout-panel").hidden = true; return; }
                renderShouts(r2.data || []);
                $("shout-panel").hidden = false;
              });
          }
          renderShouts(r.data || []);
          $("shout-panel").hidden = false;
          stamp("home");
        });
    }

    function initShoutForm() {
      var ta = $("shout-body"), count = $("shout-count"), sbtn = $("shout-btn"), smsg = $("shout-msg");
      ta.addEventListener("input", function () { count.textContent = ta.value.length + " / 280"; });
      $("shout-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var body = ta.value.trim();
        if (!body) { setMsg(smsg, "Write something first.", "error"); return; }
        sbtn.disabled = true;
        setMsg(smsg, "Posting…", "info");
        sb.from("shoutouts").insert({ body: body }).then(function (r) {
          sbtn.disabled = false;
          if (r.error) { setMsg(smsg, "Couldn't post that. Try again.", "error"); return; }
          ta.value = ""; count.textContent = "0 / 280";
          setMsg(smsg, "", "");
          if (!reducedMotion() && typeof confettiBurst === "function") {
            var rect = sbtn.getBoundingClientRect();
            confettiBurst(rect.left + rect.width / 2, rect.top);
          }
          loadShouts();
        }).catch(function () {
          sbtn.disabled = false;
          setMsg(smsg, "Couldn't reach the server.", "error");
        });
      });
    }

    // ----- Exec to-do board -----
    var PRIORITIES = [["high", "High"], ["medium", "Medium"], ["low", "Low"]];
    var PRANK = { high: 0, medium: 1, low: 2 };
    var BASE_COLS = "id, title, assignee_id, status, due_date, created_by, created_at, completed_at";
    var hasExtras = true;       // false until the priority / event columns exist in the database
    var groupByEvent = true;
    var eventNames = [];        // event names from the public events Sheet
    var eventDates = {};        // name -> YYYY-MM-DD
    var eventInfo = {};         // name -> { date, time, location }
    var hasOffset = false;      // true once the to-do upgrade SQL has run (In progress status + relative due dates)
    var tview = "list";         // list | board | cal | event | person
    var onlyMine = false;       // "Only my tasks" for the board / calendar / event / person views
    var calMonth = null;        // first day of the month shown in the calendar
    var calSel = "";            // YYYY-MM-DD selected in the calendar
    try {
      var savedView = localStorage.getItem("mcc_tview");
      if (/^(list|board|cal|event|person)$/.test(savedView || "")) tview = savedView;
    } catch (e) { /* ignore */ }

    function toYMD(d) {
      return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
    }
    function parseYMD(x) { return new Date(x + "T00:00:00"); }
    function shiftYMD(x, days) { var d = parseYMD(x); d.setDate(d.getDate() + days); return toYMD(d); }
    function daysFrom(x) { return Math.round((parseYMD(x) - parseYMD(localToday())) / 86400000); }
    function countdownText(x) {
      var n = daysFrom(x);
      if (n === 0) return "Today";
      if (n === 1) return "Tomorrow";
      if (n === -1) return "Yesterday";
      var a = Math.abs(n), txt = a <= 45 ? a + " days" : Math.round(a / 7) + " weeks";
      return n > 0 ? "in " + txt : txt + " ago";
    }
    function countdownClass(x) { var n = daysFrom(x); return n < 0 ? "past" : n <= 7 ? "soon" : "later"; }
    function longDay(x) {
      var d = parseYMD(x);
      return isNaN(d) ? x : d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
    }
    // A task's real due date: relative ("3 days before the picnic") follows the event's date in the Sheet.
    function dueOf(t) {
      if (hasOffset && t.due_offset != null && t.event_name && eventInfo[t.event_name] && eventInfo[t.event_name].date) {
        return shiftYMD(eventInfo[t.event_name].date, -t.due_offset);
      }
      return t.due_date || "";
    }
    function pool() { return onlyMine && me ? todos.filter(function (t) { return t.assignee_id === me.id; }) : todos; }

    function fillAssignee(select, selectedId) {
      select.textContent = "";
      var none = el("option", null, "Unassigned");
      none.value = "";
      select.appendChild(none);
      team.forEach(function (p) {
        var o = el("option", null, p.display_name + (me && p.id === me.id ? " (me)" : ""));
        o.value = p.id;
        select.appendChild(o);
      });
      select.value = selectedId || "";
    }

    function fillPriority(select, value) {
      select.textContent = "";
      PRIORITIES.forEach(function (p) {
        var o = el("option", null, p[1]);
        o.value = p[0];
        select.appendChild(o);
      });
      select.value = PRANK.hasOwnProperty(value) ? value : "medium";
    }

    // Event names we can suggest: the Sheet's events plus any already used on a task.
    function knownEvents() {
      var seen = {}, out = [];
      function add(n) { n = (n || "").trim(); if (n && !seen[n]) { seen[n] = 1; out.push(n); } }
      eventNames.forEach(add);
      todos.forEach(function (t) { add(t.event_name); });
      return out;
    }

    function refreshEventList() {
      var dl = $("todo-events");
      if (!dl) return;
      dl.textContent = "";
      knownEvents().forEach(function (n) {
        var o = document.createElement("option");
        o.value = n;
        dl.appendChild(o);
      });
    }

    function loadSheetEvents() {
      if (typeof loadCSV !== "function" || typeof EVENTS_CSV_URL === "undefined") return Promise.resolve();
      var fallback = typeof FALLBACK_EVENTS_CSV !== "undefined" ? FALLBACK_EVENTS_CSV : "";
      return loadCSV(EVENTS_CSV_URL, fallback).then(function (rows) {
        var sp = splitEvents(rows);
        eventNames = []; eventDates = {}; eventInfo = {};
        sp.upcoming.concat(sp.past.slice(0, 12)).forEach(function (e) {
          var n = (e.name || "").trim();
          if (n) {
            eventNames.push(n); eventDates[n] = e.date || "";
            eventInfo[n] = { date: e.date || "", time: (e.time || "").trim(), location: (e.location || "").trim() };
          }
        });
      }).catch(function () { /* suggestions are optional */ });
    }

    function patchTodo(id, fields, ctrl) {
      if (ctrl) ctrl.disabled = true;
      sb.from("todos").update(fields).eq("id", id).then(function (r) {
        if (r.error) {
          if (ctrl) ctrl.disabled = false;
          setMsg($("todo-msg"), fields.status === "doing"
            ? "Couldn't move that task. 'In progress' needs the to-do upgrade SQL to be run in Supabase first."
            : "Couldn't update that task.", "error");
        } else {
          setMsg($("todo-msg"), "", "");
          loadTodos();
        }
      });
    }

    // Open tasks: highest priority first, then soonest due date, then newest. Done: most recent first.
    function sortTodos(list) {
      return list.slice().sort(function (a, b) {
        if (a.status === "done" || b.status === "done") {
          return String(b.completed_at || "").localeCompare(String(a.completed_at || ""));
        }
        var pa = PRANK.hasOwnProperty(a.priority) ? PRANK[a.priority] : 1;
        var pb = PRANK.hasOwnProperty(b.priority) ? PRANK[b.priority] : 1;
        if (pa !== pb) return pa - pb;
        var da = dueOf(a) || "9999-12-31", db2 = dueOf(b) || "9999-12-31";
        if (da !== db2) return da < db2 ? -1 : 1;
        return String(b.created_at).localeCompare(String(a.created_at));
      });
    }

    // Events with a known date first (soonest first), then other events A-Z, "No event" last.
    function groupTodos(list) {
      var map = {}, order = [];
      list.forEach(function (t) {
        var k = (hasExtras && t.event_name) || "";
        if (!map[k]) { map[k] = []; order.push(k); }
        map[k].push(t);
      });
      order.sort(function (a, b) {
        if (a === "" || b === "") return a === "" ? 1 : -1;
        var da = eventDates[a] || "9999-99-99", db2 = eventDates[b] || "9999-99-99";
        if (da !== db2) return da < db2 ? -1 : 1;
        return a.localeCompare(b);
      });
      return order.map(function (k) { return { name: k, items: map[k] }; });
    }

    function todoItem(t, today) {
      var isDone = t.status === "done";
      var due = dueOf(t);
      var overdue = !isDone && due && due < today;
      var li = el("li", "todo" + (isDone ? " done" : "") + (overdue ? " overdue" : ""));

      var top = el("div", "todo-top");
      var cb = el("input");
      cb.type = "checkbox";
      cb.checked = isDone;
      cb.setAttribute("aria-label", (isDone ? "Reopen: " : "Mark done: ") + t.title);
      cb.addEventListener("change", function () {
        patchTodo(t.id, cb.checked
          ? { status: "done", completed_at: new Date().toISOString() }
          : { status: "open", completed_at: null }, cb);
        if (cb.checked && !reducedMotion() && typeof confettiBurst === "function") {
          var rect = cb.getBoundingClientRect();
          confettiBurst(rect.left + rect.width / 2, rect.top);
        }
      });
      top.appendChild(cb);
      top.appendChild(el("span", "todo-text", t.title));
      if (t.status === "doing") top.appendChild(el("span", "pill-doing", "In progress"));
      li.appendChild(top);

      var meta = el("div", "todo-meta");

      if (hasExtras) {
        var pr = el("select", "todo-assign prio prio-" + (PRANK.hasOwnProperty(t.priority) ? t.priority : "medium"));
        pr.setAttribute("aria-label", "Priority");
        fillPriority(pr, t.priority);
        pr.addEventListener("change", function () { patchTodo(t.id, { priority: pr.value }, pr); });
        meta.appendChild(pr);
      }

      var sel = el("select", "todo-assign");
      sel.setAttribute("aria-label", "Assigned to");
      fillAssignee(sel, t.assignee_id);
      sel.addEventListener("change", function () { patchTodo(t.id, { assignee_id: sel.value || null }, sel); });
      meta.appendChild(sel);

      if (hasExtras) {
        var ev = el("select", "todo-assign");
        ev.setAttribute("aria-label", "Event");
        var none = el("option", null, "No event");
        none.value = "";
        ev.appendChild(none);
        knownEvents().forEach(function (n) {
          var o = el("option", null, n);
          o.value = n;
          ev.appendChild(o);
        });
        ev.value = t.event_name || "";
        ev.addEventListener("change", function () { patchTodo(t.id, { event_name: ev.value || null }, ev); });
        meta.appendChild(ev);
      }

      if (due) {
        var rel = hasOffset && t.due_offset != null ? (t.due_offset === 0 ? " · event day" : " · " + t.due_offset + " d before event") : "";
        meta.appendChild(el("span", "due", (overdue ? "Overdue · " : "Due ") + dueLabel(due) + rel));
      }
      if (isDone && t.completed_at) meta.appendChild(el("span", null, "Done " + when(t.completed_at)));
      else if (t.created_by) meta.appendChild(el("span", null, "Added by " + nameOf(t.created_by)));

      if (hasOffset && !isDone) {
        var go = el("button", "link-btn", t.status === "doing" ? "Pause" : "Start");
        go.type = "button";
        go.addEventListener("click", function () { patchTodo(t.id, { status: t.status === "doing" ? "open" : "doing", completed_at: null }, go); });
        meta.appendChild(go);
      }
      if (!isDone && me && t.assignee_id !== me.id) {
        var take = el("button", "link-btn", t.assignee_id ? "Take it" : "I'll do it");
        take.type = "button";
        take.addEventListener("click", function () { patchTodo(t.id, { assignee_id: me.id }, take); });
        meta.appendChild(take);
      }
      if (me && t.created_by === me.id) {
        var del = el("button", "link-btn", "Delete");
        del.type = "button";
        del.addEventListener("click", function () {
          del.disabled = true;
          sb.from("todos").delete().eq("id", t.id).then(function (r) {
            if (r.error) { del.disabled = false; setMsg($("todo-msg"), "Couldn't delete that task.", "error"); }
            else loadTodos();
          });
        });
        meta.appendChild(del);
      }
      li.appendChild(meta);
      return li;
    }

    function renderList() {
      var today = localToday();
      var open = todos.filter(function (t) { return t.status !== "done"; });
      var mine = open.filter(function (t) { return me && t.assignee_id === me.id; });
      var done = todos.filter(function (t) { return t.status === "done"; });
      $("n-open").textContent = open.length;
      $("n-mine").textContent = mine.length;
      $("n-done").textContent = done.length;
      $("home-tasks-n").textContent = mine.length;
      $("home-tasks-sub").textContent = mine.length ? "Assigned to you. Tap to open." : "Nothing assigned to you right now";

      document.querySelectorAll("#todo-panel .chip").forEach(function (c) {
        c.classList.toggle("on", c.getAttribute("data-filter") === todoFilter);
      });

      var shown = todoFilter === "mine" ? mine : todoFilter === "done" ? done.slice(0, 30) : open;
      shown = sortTodos(shown);

      var ul = $("todo-list");
      ul.textContent = "";
      if (!shown.length) {
        ul.appendChild(el("li", "empty",
          todoFilter === "done" ? "Nothing ticked off yet." :
          todoFilter === "mine" ? "Nothing assigned to you. Nice." : "No open tasks. Add one above."));
        return;
      }

      if (hasExtras && groupByEvent) {
        groupTodos(shown).forEach(function (g) {
          var head = el("li", "group-head");
          head.appendChild(el("h3", null, g.name || "No event"));
          var sub = [];
          if (g.name && eventDates[g.name]) sub.push(dueLabel(eventDates[g.name]) + " (" + countdownText(eventDates[g.name]).toLowerCase() + ")");
          sub.push(g.items.length + (g.items.length === 1 ? " task" : " tasks"));
          head.appendChild(el("span", null, sub.join(" · ")));
          ul.appendChild(head);
          g.items.forEach(function (t) { ul.appendChild(todoItem(t, today)); });
        });
      } else {
        shown.forEach(function (t) { ul.appendChild(todoItem(t, today)); });
      }
    }

    function loadTodos() {
      function finish(data) {
        todos = data || [];
        $("todo-panel").classList.toggle("no-extras", !hasExtras);
        $("todo-panel").classList.toggle("no-offset", !hasOffset);
        refreshEventList();
        renderTodos();
        $("todo-panel").hidden = false;
        $("todo-missing").hidden = true;
        stamp("todo");
      }
      function q(cols) { return sb.from("todos").select(cols).order("created_at", { ascending: false }).limit(300); }
      // Newest schema first, then fall back so an older database keeps working.
      return q(BASE_COLS + ", priority, event_name, due_offset").then(function (r) {
        if (!r.error) { hasExtras = true; hasOffset = true; return finish(r.data); }
        return q(BASE_COLS + ", priority, event_name").then(function (r2) {
          if (!r2.error) { hasExtras = true; hasOffset = false; return finish(r2.data); }
          return q(BASE_COLS).then(function (r3) {
            if (r3.error) { $("todo-panel").hidden = true; $("todo-missing").hidden = false; return; }
            hasExtras = false; hasOffset = false;
            finish(r3.data);
          });
        });
      });
    }

    // =====================================================================
    //  To-do views: board, calendar, by event, by person
    // =====================================================================
    function renderTodos() {
      renderList();           // also keeps the counts and the Home task number up to date
      syncViewTabs();
      if (tview === "board") renderBoard();
      else if (tview === "cal") renderCal();
      else if (tview === "event") renderByEvent();
      else if (tview === "person") renderByPerson();
    }

    function syncViewTabs() {
      document.querySelectorAll(".vtab").forEach(function (b) {
        var on = b.getAttribute("data-tv") === tview;
        b.classList.toggle("on", on);
        b.setAttribute("aria-pressed", String(on));
      });
      ["list", "board", "cal", "event", "person"].forEach(function (v) { $("tv-" + v).hidden = v !== tview; });
      $("only-mine-wrap").hidden = tview === "list";
    }

    function titleCase(w) { return w.charAt(0).toUpperCase() + w.slice(1); }
    function pad(n) { return String(n).padStart(2, "0"); }
    function setFormOpen(open) {
      $("todo-form").classList.toggle("open", open);
      var b = $("todo-more");
      b.setAttribute("aria-expanded", String(open));
      b.textContent = open ? "Fewer options" : "More options";
    }
    function focusAddForm(eventName) {
      var evIn = $("todo-event");
      if (eventName != null && evIn) { evIn.value = eventName; setFormOpen(true); }
      $("todo-form").scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "center" });
      $("todo-title-input").focus({ preventScroll: true });
    }

    // ----- Board (kanban) -----
    var BOARD_COLS = [["open", "To do"], ["doing", "In progress"], ["done", "Done"]];
    function statusOf(t) { return t.status === "doing" || t.status === "done" ? t.status : "open"; }

    function moveTodo(t, to) {
      if (statusOf(t) === to) return;
      if (to === "doing" && !hasOffset) {
        setMsg($("todo-msg"), "'In progress' needs the one-time to-do upgrade SQL in Supabase first.", "error");
        renderTodos();
        return;
      }
      patchTodo(t.id, { status: to, completed_at: to === "done" ? new Date().toISOString() : null });
    }

    function boardCard(t, today) {
      var due = dueOf(t), isDone = t.status === "done", overdue = !isDone && due && due < today;
      var c = el("div", "bcard" + (overdue ? " overdue" : "") + (isDone ? " done" : ""));
      c.draggable = true;
      c.appendChild(el("div", "bc-title", t.title));
      var m = el("div", "bc-meta");
      if (hasExtras) {
        var p = PRANK.hasOwnProperty(t.priority) ? t.priority : "medium";
        m.appendChild(el("span", "bchip prio prio-" + p, titleCase(p)));
        if (t.event_name) m.appendChild(el("span", "bchip ev", t.event_name));
      }
      if (due) m.appendChild(el("span", "bchip due" + (overdue ? " late" : ""), (overdue ? "Overdue · " : "") + dueLabel(due)));
      c.appendChild(m);
      var foot = el("div", "bc-foot");
      foot.appendChild(el("span", "bc-who", t.assignee_id ? nameOf(t.assignee_id) : "Unassigned"));
      var st = el("select", "todo-assign");
      st.setAttribute("aria-label", "Status of: " + t.title);
      BOARD_COLS.forEach(function (cn) {
        var o = el("option", null, cn[1]);
        o.value = cn[0];
        if (cn[0] === "doing" && !hasOffset) o.disabled = true;
        st.appendChild(o);
      });
      st.value = statusOf(t);
      st.addEventListener("change", function () { moveTodo(t, st.value); });
      foot.appendChild(st);
      c.appendChild(foot);
      c.addEventListener("dragstart", function (e) {
        e.dataTransfer.setData("text/plain", String(t.id));
        e.dataTransfer.effectAllowed = "move";
        c.classList.add("dragging");
      });
      c.addEventListener("dragend", function () { c.classList.remove("dragging"); });
      return c;
    }

    function renderBoard() {
      var host = $("tv-board");
      host.textContent = "";
      if (!hasOffset) {
        host.appendChild(el("p", "meta v-note", "'In progress' needs a one-time database upgrade. Until then you can still move tasks between To do and Done."));
      }
      var today = localToday(), list = pool();
      var wrap = el("div", "board");
      BOARD_COLS.forEach(function (cn) {
        var items = sortTodos(list.filter(function (t) { return statusOf(t) === cn[0]; }));
        var shown = cn[0] === "done" ? items.slice(0, 25) : items;
        var col = el("section", "bcol");
        col.setAttribute("data-status", cn[0]);
        var head = el("div", "bcol-head");
        head.appendChild(el("h3", null, cn[1]));
        head.appendChild(el("span", "bcount", String(items.length)));
        col.appendChild(head);
        var body = el("div", "bcol-body");
        if (!shown.length) body.appendChild(el("p", "empty", cn[0] === "done" ? "Nothing finished yet." : "Nothing here."));
        shown.forEach(function (t) { body.appendChild(boardCard(t, today)); });
        if (items.length > shown.length) body.appendChild(el("p", "meta", "+ " + (items.length - shown.length) + " older done tasks"));
        body.addEventListener("dragover", function (e) { e.preventDefault(); col.classList.add("over"); });
        body.addEventListener("dragleave", function () { col.classList.remove("over"); });
        body.addEventListener("drop", function (e) {
          e.preventDefault();
          col.classList.remove("over");
          var id = e.dataTransfer.getData("text/plain");
          var t = todos.filter(function (x) { return String(x.id) === id; })[0];
          if (t) moveTodo(t, cn[0]);
        });
        col.appendChild(body);
        wrap.appendChild(col);
      });
      host.appendChild(wrap);
    }

    // ----- By event -----
    function taskList(tasks, today) {
      var ul = el("ul", "todo-list");
      sortTodos(tasks).forEach(function (t) { ul.appendChild(todoItem(t, today)); });
      return ul;
    }

    function eventCard(name, e, today) {
      var card = el("section", "ecard");
      var head = el("div", "ec-head");
      var tl = el("div");
      tl.appendChild(el("h3", null, name || "No event"));
      if (e && e.date) {
        var bits = [longDay(e.date)];
        if (e.info.time) bits.push(e.info.time);
        if (e.info.location) bits.push(e.info.location);
        tl.appendChild(el("p", "meta", bits.join(" · ")));
      }
      head.appendChild(tl);
      if (e && e.date) head.appendChild(el("span", "cd " + countdownClass(e.date), countdownText(e.date)));
      card.appendChild(head);

      var all = e ? e.tasks : [];
      var doneAll = all.filter(function (t) { return t.status === "done"; });
      if (all.length) {
        var pct = Math.round(100 * doneAll.length / all.length);
        var prog = el("div", "prog");
        prog.setAttribute("role", "progressbar");
        prog.setAttribute("aria-valuemin", "0"); prog.setAttribute("aria-valuemax", "100"); prog.setAttribute("aria-valuenow", String(pct));
        prog.setAttribute("aria-label", doneAll.length + " of " + all.length + " tasks done");
        var bar = el("i");
        bar.style.width = pct + "%";
        prog.appendChild(bar);
        card.appendChild(prog);
        card.appendChild(el("p", "meta prog-text", doneAll.length + " of " + all.length + " done"));
      }
      var open = all.filter(function (t) { return t.status !== "done" && (!onlyMine || (me && t.assignee_id === me.id)); });
      if (open.length) card.appendChild(taskList(open, today));
      else if (!all.length) {
        card.appendChild(el("p", "empty", "No tasks yet."));
      } else if (all.every(function (t) { return t.status === "done"; })) {
        card.appendChild(el("p", "empty", "Everything is done."));
      } else {
        card.appendChild(el("p", "empty", "Nothing open for you here."));
      }
      if (name) {
        var add = el("button", "link-btn ec-add", "Add a task for this event");
        add.type = "button";
        add.addEventListener("click", function () { focusAddForm(name); });
        card.appendChild(add);
      }
      if (doneAll.length) {
        var det = el("details", "ec-done");
        det.appendChild(el("summary", null, doneAll.length + " done"));
        det.appendChild(taskList(doneAll, today));
        card.appendChild(det);
      }
      return card;
    }

    function renderByEvent() {
      var host = $("tv-event");
      host.textContent = "";
      if (!hasExtras) {
        host.appendChild(el("p", "meta v-note", "Linking tasks to events needs the priority and event upgrade SQL. Run it in Supabase, then refresh."));
        return;
      }
      var today = localToday();
      var byEvent = {};
      todos.forEach(function (t) { var k = (t.event_name || "").trim(); (byEvent[k] = byEvent[k] || []).push(t); });
      var names = {};
      Object.keys(byEvent).forEach(function (k) { if (k) names[k] = 1; });
      Object.keys(eventInfo).forEach(function (n) { var d = eventInfo[n].date; if (d && d >= today) names[n] = 1; });
      var list = Object.keys(names).map(function (n) {
        var i = eventInfo[n] || {};
        return { name: n, date: i.date || "", info: i, tasks: byEvent[n] || [] };
      });
      function openN(e) { return e.tasks.filter(function (t) { return t.status !== "done"; }).length; }
      function byDate(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : a.name.localeCompare(b.name); }
      var upcoming = list.filter(function (e) { return e.date && e.date >= today; }).sort(byDate);
      var undated = list.filter(function (e) { return !e.date; }).sort(function (a, b) { return a.name.localeCompare(b.name); });
      var past = list.filter(function (e) { return e.date && e.date < today && openN(e) > 0; }).sort(function (a, b) { return byDate(b, a); });

      function section(title, items) {
        if (!items.length) return;
        host.appendChild(el("h2", "h-sub", title));
        var grid = el("div", "egrid");
        items.forEach(function (e) { grid.appendChild(eventCard(e.name, e, today)); });
        host.appendChild(grid);
      }
      section("Upcoming events", upcoming);
      section("Not on the calendar", undated);
      section("Past events with open tasks", past);
      var loose = byEvent[""] || [];
      if (loose.length) {
        host.appendChild(el("h2", "h-sub", "No event"));
        var g2 = el("div", "egrid");
        g2.appendChild(eventCard("", { date: "", info: {}, tasks: loose }, today));
        host.appendChild(g2);
      }
      if (!host.firstChild) host.appendChild(el("p", "empty", "No events or tasks yet."));
    }

    // ----- By person -----
    function renderByPerson() {
      var host = $("tv-person");
      host.textContent = "";
      var today = localToday();
      var people = team.slice().sort(function (a, b) {
        if (me && a.id === me.id) return -1;
        if (me && b.id === me.id) return 1;
        return a.display_name.localeCompare(b.display_name);
      }).map(function (p) {
        return { id: p.id, name: p.display_name + (me && p.id === me.id ? " (me)" : ""), role: p.role, tasks: todos.filter(function (t) { return t.assignee_id === p.id; }) };
      });
      var nobody = todos.filter(function (t) { return !t.assignee_id; });
      if (nobody.length) people.push({ id: "", name: "Unassigned", role: "", tasks: nobody });
      if (onlyMine && me) people = people.filter(function (g) { return g.id === me.id; });
      function openOf(g) { return g.tasks.filter(function (t) { return t.status !== "done"; }); }
      var most = Math.max(1, Math.max.apply(null, people.map(function (g) { return openOf(g).length; }).concat([1])));

      var grid = el("div", "pgrid");
      people.forEach(function (g) {
        var open = openOf(g), done = g.tasks.length - open.length;
        var late = open.filter(function (t) { var d = dueOf(t); return d && d < today; }).length;
        var card = el("section", "pcard");
        var head = el("div", "pc-head");
        var left = el("div");
        left.appendChild(el("h3", null, g.name));
        if (g.role) left.appendChild(el("span", "pc-role", g.role));
        head.appendChild(left);
        var counts = el("div", "pc-counts");
        counts.appendChild(el("b", null, String(open.length)));
        counts.appendChild(document.createTextNode(" open"));
        if (late) counts.appendChild(el("span", "late-badge", late + " overdue"));
        head.appendChild(counts);
        card.appendChild(head);
        var load = el("div", "prog load");
        var bar = el("i");
        bar.style.width = Math.round(100 * open.length / most) + "%";
        load.appendChild(bar);
        card.appendChild(load);
        if (!open.length) {
          card.appendChild(el("p", "empty", g.tasks.length ? "All caught up." : "Nothing assigned."));
        } else {
          card.appendChild(taskList(sortTodos(open).slice(0, 5), today));
          if (open.length > 5) {
            var det = el("details", "ec-done");
            det.appendChild(el("summary", null, (open.length - 5) + " more open"));
            det.appendChild(taskList(sortTodos(open).slice(5), today));
            card.appendChild(det);
          }
        }
        if (done) card.appendChild(el("p", "meta", done + " done"));
        grid.appendChild(card);
      });
      host.appendChild(grid);
      if (!people.length) host.appendChild(el("p", "empty", "Nothing to show."));
    }

    // ----- Calendar -----
    var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    function renderCal() {
      var host = $("tv-cal");
      host.textContent = "";
      var today = localToday();
      if (!calMonth) { var n = new Date(); calMonth = new Date(n.getFullYear(), n.getMonth(), 1); }
      if (!calSel) calSel = today;
      var y = calMonth.getFullYear(), m = calMonth.getMonth();

      var head = el("div", "cal-head");
      function nav(label, text, fn) {
        var b = el("button", "cal-nav", text);
        b.type = "button";
        b.setAttribute("aria-label", label);
        b.addEventListener("click", fn);
        return b;
      }
      head.appendChild(nav("Previous month", "\u2039", function () { calMonth = new Date(y, m - 1, 1); renderCal(); }));
      head.appendChild(el("h3", "cal-title", MONTHS[m] + " " + y));
      head.appendChild(nav("Next month", "\u203A", function () { calMonth = new Date(y, m + 1, 1); renderCal(); }));
      var tb = el("button", "chip cal-today", "Today");
      tb.type = "button";
      tb.addEventListener("click", function () { var d = new Date(); calMonth = new Date(d.getFullYear(), d.getMonth(), 1); calSel = localToday(); renderCal(); });
      head.appendChild(tb);
      host.appendChild(head);

      var items = {};
      function slot(d) { return items[d] || (items[d] = { tasks: [], events: [] }); }
      pool().forEach(function (t) { var d = dueOf(t); if (d) slot(d).tasks.push(t); });
      Object.keys(eventInfo).forEach(function (nm) { var d = eventInfo[nm].date; if (d) slot(d).events.push(nm); });

      var grid = el("div", "cal-grid");
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(function (d) { grid.appendChild(el("div", "cal-dow", d)); });
      var offset = (new Date(y, m, 1).getDay() + 6) % 7;
      var weeks = Math.ceil((offset + new Date(y, m + 1, 0).getDate()) / 7);
      for (var i = 0; i < weeks * 7; i++) {
        var d = new Date(y, m, 1 - offset + i), key = toYMD(d);
        var info = items[key] || { tasks: [], events: [] };
        var open = info.tasks.filter(function (t) { return t.status !== "done"; });
        var cell = el("button", "cal-day" + (d.getMonth() !== m ? " out" : "") + (key === today ? " today" : "") + (key === calSel ? " sel" : ""));
        cell.type = "button";
        cell.setAttribute("data-day", key);
        cell.setAttribute("aria-label", longDay(key) + ": " + info.events.length + " events, " + open.length + " open tasks");
        cell.setAttribute("aria-pressed", String(key === calSel));
        cell.appendChild(el("span", "cal-num", String(d.getDate())));
        var list = el("span", "cal-items");
        var chips = [];
        info.events.forEach(function (nm) { chips.push(el("span", "cal-ev", nm)); });
        open.forEach(function (t) {
          var p = PRANK.hasOwnProperty(t.priority) ? t.priority : "medium";
          chips.push(el("span", "cal-task prio-" + p, t.title));
        });
        chips.slice(0, 3).forEach(function (c) { list.appendChild(c); });
        if (chips.length > 3) list.appendChild(el("span", "cal-more", "+" + (chips.length - 3)));
        cell.appendChild(list);
        cell.addEventListener("click", function () {
          calSel = this.getAttribute("data-day");
          renderCal();
          var again = $("tv-cal").querySelector(".cal-day.sel");
          if (again) again.focus({ preventScroll: true });
        });
        grid.appendChild(cell);
      }
      host.appendChild(grid);
      var legend = el("p", "meta cal-legend");
      legend.appendChild(el("span", "cal-ev lg", "Event"));
      legend.appendChild(document.createTextNode(" "));
      legend.appendChild(el("span", "cal-task prio-medium lg", "Task due"));
      host.appendChild(legend);

      // Selected day
      var sel = items[calSel] || { tasks: [], events: [] };
      var detail = el("section", "cal-detail");
      var dh = el("div", "ec-head");
      var dl = el("div");
      dl.appendChild(el("h3", null, longDay(calSel)));
      dh.appendChild(dl);
      dh.appendChild(el("span", "cd " + countdownClass(calSel), countdownText(calSel)));
      detail.appendChild(dh);
      sel.events.forEach(function (nm) {
        var i = eventInfo[nm] || {};
        var row = el("div", "cal-evrow");
        row.appendChild(el("strong", null, nm));
        var bits = [];
        if (i.time) bits.push(i.time);
        if (i.location) bits.push(i.location);
        if (bits.length) row.appendChild(el("span", "meta", bits.join(" · ")));
        detail.appendChild(row);
      });
      if (sel.tasks.length) detail.appendChild(taskList(sel.tasks, today));
      if (!sel.tasks.length && !sel.events.length) detail.appendChild(el("p", "empty", "Nothing scheduled this day."));
      host.appendChild(detail);

      var loose = pool().filter(function (t) { return t.status !== "done" && !dueOf(t); });
      if (loose.length) {
        var det = el("details", "ec-done cal-loose");
        det.appendChild(el("summary", null, loose.length + (loose.length === 1 ? " task" : " tasks") + " without a due date"));
        det.appendChild(taskList(loose, today));
        host.appendChild(det);
      }
    }

    function initTodoForm() {
      var titleIn = $("todo-title-input"), assignee = $("todo-assignee"), due = $("todo-due"),
          prio = $("todo-priority"), evIn = $("todo-event"), grp = $("todo-group"),
          add = $("todo-add"), tmsg = $("todo-msg");
      fillAssignee(assignee, "");
      fillPriority(prio, "medium");

      // "Due" can be a fixed date, or a number of days before the event (follows the event's date in the Sheet).
      var relSel = $("todo-rel");
      [["", "Due on a date"], ["0", "Due on event day"], ["1", "Due 1 day before"], ["2", "Due 2 days before"],
       ["3", "Due 3 days before"], ["7", "Due 1 week before"], ["14", "Due 2 weeks before"]].forEach(function (x) {
        var o = el("option", null, x[1]);
        o.value = x[0];
        relSel.appendChild(o);
      });
      relSel.addEventListener("change", function () {
        due.hidden = relSel.value !== "";
        if (relSel.value !== "") due.value = "";
      });

      $("todo-more").addEventListener("click", function () { setFormOpen(!$("todo-form").classList.contains("open")); });
      document.querySelectorAll(".vtab").forEach(function (b) {
        b.addEventListener("click", function () {
          tview = b.getAttribute("data-tv");
          try { localStorage.setItem("mcc_tview", tview); } catch (e) { /* ignore */ }
          renderTodos();
        });
      });
      $("only-mine").addEventListener("change", function () { onlyMine = this.checked; renderTodos(); });

      grp.checked = groupByEvent;
      grp.addEventListener("change", function () { groupByEvent = grp.checked; renderTodos(); });

      document.querySelectorAll("#todo-panel .chip").forEach(function (c) {
        c.addEventListener("click", function () {
          todoFilter = c.getAttribute("data-filter");
          renderTodos();
        });
      });

      $("todo-form").addEventListener("submit", function (e) {
        e.preventDefault();
        var title = titleIn.value.trim();
        if (!title) { setMsg(tmsg, "Describe the task first.", "error"); return; }
        var row = { title: title, assignee_id: assignee.value || null, due_date: due.value || null };
        if (hasExtras) {
          row.priority = prio.value;
          row.event_name = evIn.value.trim().slice(0, 80) || null;
        }
        if (hasOffset && relSel.value !== "") {
          var ev = row.event_name && eventInfo[row.event_name];
          if (!ev || !ev.date) { setMsg(tmsg, "Pick an event that has a date on the events Sheet to set a due date relative to it.", "error"); return; }
          row.due_offset = +relSel.value;
          row.due_date = shiftYMD(ev.date, -row.due_offset);
        }
        add.disabled = true;
        setMsg(tmsg, "Adding…", "info");
        sb.from("todos").insert(row).then(function (r) {
          add.disabled = false;
          if (r.error) { setMsg(tmsg, "Couldn't add that task. Try again.", "error"); return; }
          // Keep the event filled in (handy when adding several tasks for one event).
          titleIn.value = ""; due.value = ""; assignee.value = ""; prio.value = "medium";
          relSel.value = ""; due.hidden = false;
          setMsg(tmsg, "", "");
          todoFilter = "open";
          loadTodos();
        }).catch(function () {
          add.disabled = false;
          setMsg(tmsg, "Couldn't reach the server.", "error");
        });
      });
    }

    // ----- App shell: views, routing, lazy loading -----
    var VIEWS = ["home", "todo", "meet", "account"];
    var TITLES = { home: "Home", todo: "To-do board", meet: "Meeting finder", account: "Account" };
    var locked = false;       // true until a new exec has chosen their own password
    var appStarted = false, viewNow = null, welcomed = false;
    var loadedAt = {};        // view key -> ms timestamp of last data load
    function stamp(k) { loadedAt[k] = Date.now(); }
    function fresh(k, secs) { return loadedAt[k] && Date.now() - loadedAt[k] < secs * 1000; }

    function viewFromHash() {
      var h = (location.hash || "").replace(/^#/, "").split("?")[0];
      return VIEWS.indexOf(h) > -1 ? h : "home";
    }
    function navigate(name) {
      if (location.hash === "#" + name) showView(name, true); else location.hash = "#" + name;
    }
    function setLocked(v) {
      locked = v;
      document.querySelectorAll(".nav-item").forEach(function (a) {
        var lock = v && a.getAttribute("data-view") !== "account";
        a.classList.toggle("locked", lock);
        if (lock) a.setAttribute("aria-disabled", "true"); else a.removeAttribute("aria-disabled");
      });
    }

    function startApp() {
      if (appStarted) return Promise.resolve();
      appStarted = true;
      initShoutForm();
      // Team first: its names + ids feed the lounge reactions and the to-do board.
      return loadTeam().then(function () {
        initTodoForm();
        return Promise.all([loadAnnouncement(), loadShouts(), loadSheetEvents().then(loadTodos)]);
      }).then(function () { enterView(viewNow); });
    }

    function maybeWelcome() {
      if (welcomed) return;
      welcomed = true;
      var seen = false;
      try { seen = !!sessionStorage.getItem("mcc_welcomed"); sessionStorage.setItem("mcc_welcomed", "1"); } catch (e) { /* ignore */ }
      if (seen || reducedMotion() || typeof confettiBurst !== "function") return;
      var rect = $("welcome-card").getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top + 60);
    }

    // Runs whenever a view is shown (and once data is ready). Data is refreshed if it's gone stale.
    function enterView(name) {
      if (!appStarted || !name) return;
      if (name === "home") {
        maybeWelcome();
        if (!fresh("home", 20)) { loadAnnouncement(); loadShouts(); }
      } else if (name === "todo") {
        if (!fresh("todo", 15)) loadTodos();
      } else if (name === "meet") {
        if (window.MCCMeet) window.MCCMeet.init(sb, me.id);     // starts once; retries if a load failed
      }
    }

    function showView(name, focusHeading) {
      if (locked) name = "account";
      VIEWS.forEach(function (v) { $("view-" + v).hidden = v !== name; });
      document.querySelectorAll(".nav-item").forEach(function (a) {
        if (a.getAttribute("data-view") === name) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
      });
      $("top-title").textContent = TITLES[name];
      document.title = TITLES[name] + " \u2014 Myanmar Culture Club";
      var changed = viewNow !== name;
      viewNow = name;
      if (changed) {
        window.scrollTo({ top: 0, behavior: "instant" });
        if (focusHeading) {
          var h = $("view-" + name).querySelector("h1");
          if (h) h.focus({ preventScroll: true });
        }
      }
      enterView(name);
    }

    // ----- Choose / change password -----
    var MIN_PASSWORD = 10;
    function pwError(err) {
      var code = (err && (err.code || err.error_code)) || "", text = (err && err.message) || "";
      if (code === "same_password" || /different from the old/i.test(text)) return "That's the same as your current password. Pick a new one.";
      if (code === "weak_password" || /weak|at least one character/i.test(text)) return "That password is too easy to guess. Try a few random words, or add numbers and capital letters.";
      if (code === "reauthentication_needed" || /reauthenticat/i.test(text)) return "For security, please sign out, sign back in, and try again.";
      if (/rate limit|too many/i.test(text)) return "Too many tries. Wait a minute and try again.";
      if (err && (err.status === 401 || err.status === 403)) return "Your session has expired. Sign in again, then try again.";
      return "Couldn't change your password. Please try again.";
    }
    function initPasswordForm(passwordSet, onFirstSet) {
      var panel = $("pw-panel"), form = $("pw-form"), pmsg = $("pw-msg"), btn = $("pw-btn");
      var pwNew = $("pw-new"), pwConfirm = $("pw-confirm");
      var forced = !passwordSet;

      function applyMode() {
        $("pw-title").textContent = forced ? (isRecovery ? "Choose a new password" : "Set your own password") : "Change your password";
        $("pw-sub").textContent = forced
          ? (isRecovery
              ? "Pick a new password to finish resetting. Only you will know it."
              : "You're signed in with a temporary password. Choose your own now. Only you will know it, and you'll use it from here on.")
          : "Pick something you don't use anywhere else.";
        panel.classList.toggle("forced", forced);
      }
      applyMode();
      panel.hidden = false;

      $("pw-show").addEventListener("change", function () {
        var t = this.checked ? "text" : "password";
        pwNew.type = t; pwConfirm.type = t;
      });

      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var a = pwNew.value, b = pwConfirm.value;
        if (a.length < MIN_PASSWORD) { setMsg(pmsg, "Use at least " + MIN_PASSWORD + " characters.", "error"); return; }
        if (a !== b) { setMsg(pmsg, "The two passwords don't match.", "error"); return; }
        btn.disabled = true;
        setMsg(pmsg, "Saving…", "info");
        sb.auth.updateUser({ password: a, data: { password_set: true } }).then(function (r) {
          btn.disabled = false;
          if (r.error) {
            setMsg(pmsg, pwError(r.error), "error");
            return;
          }
          pwNew.value = ""; pwConfirm.value = "";
          if (forced) {
            forced = false;
            if (isRecovery && window.history && history.replaceState) history.replaceState(null, "", location.pathname);
            applyMode();
            setMsg(pmsg, "Password saved. It's only known to you now.", "info");
            onFirstSet();
          } else {
            setMsg(pmsg, "Password changed.", "info");
          }
        }).catch(function () {
          btn.disabled = false;
          setMsg(pmsg, "Couldn't reach the server.", "error");
        });
      });
    }

    // ----- boot -----
    function bootFail(text) {
      var bt = $("boot-text");
      bt.textContent = text + " ";
      var a = el("a", null, "Back to sign in");
      a.href = "login.html";
      bt.appendChild(a);
      $("boot").classList.add("failed");
    }

    window.addEventListener("hashchange", function () { if (appStarted || viewNow) showView(viewFromHash(), true); });

    // Phones: hide the bottom tab bar while the on-screen keyboard is up.
    function isField(t) { return t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && !/^(checkbox|radio|button|submit)$/.test(t.type || ""); }
    document.addEventListener("focusin", function (e) { if (isField(e.target)) document.body.classList.add("typing"); });
    document.addEventListener("focusout", function () {
      setTimeout(function () { if (!isField(document.activeElement)) document.body.classList.remove("typing"); }, 60);
    });

    document.querySelector(".side-nav").addEventListener("click", function (e) {
      var a = e.target.closest(".nav-item");
      if (a && locked && a.getAttribute("data-view") !== "account") e.preventDefault();
    });

    document.querySelectorAll('[data-action="signout"]').forEach(function (b) {
      b.addEventListener("click", function () {
        b.disabled = true;
        try { sessionStorage.removeItem("mcc_welcomed"); } catch (e) { /* ignore */ }
        sb.auth.signOut().then(goLogin, goLogin);
      });
    });

    sb.auth.getSession().then(function (r) {
      var session = r.data && r.data.session;
      if (!session) return goLogin();

      // Ask the server (not just the local token) who this is.
      return sb.auth.getUser().then(function (u) {
        if (u.error || !u.data || !u.data.user) { return sb.auth.signOut().then(goLogin); }
        var user = u.data.user;

        return sb.from("profiles").select("display_name, role").eq("id", user.id).maybeSingle()
          .then(function (p) {
            var prof = p.data;
            var name = (prof && prof.display_name) || (user.email || "").split("@")[0] || "friend";
            var role = (prof && prof.role) || "exec";
            me = { id: user.id, name: name, role: role, email: user.email || "" };

            $("welcome-name").textContent = "Welcome, " + name;
            $("welcome-sub").textContent = "You're signed in as " + me.email;
            $("welcome-role").textContent = role;
            $("side-name").textContent = name;
            $("side-role").textContent = role;
            $("account-sub").textContent = name + " · " + role + " · " + me.email;
            $("boot").hidden = true;
            $("app-shell").hidden = false;

            // First sign-in: the exec must replace the temporary password you gave them
            // before they see anything else. (This is a courtesy gate, not a security
            // boundary: it keeps passwords known only to their owners.)
            var passwordSet = !isRecovery && !!(user.user_metadata && user.user_metadata.password_set);
            initPasswordForm(passwordSet, function () {
              setLocked(false);
              startApp();
              navigate("home");
            });
            if (!passwordSet) {
              setLocked(true);
              if (window.history && history.replaceState) history.replaceState(null, "", location.pathname + "#account");
              showView("account");
              return;
            }
            showView(viewFromHash());
            return startApp();
          });
      });
    }).catch(function () {
      bootFail("Couldn't load your profile.");
    });
  }
})();
