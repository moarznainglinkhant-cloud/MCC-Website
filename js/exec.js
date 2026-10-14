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
        eventNames = []; eventDates = {};
        sp.upcoming.concat(sp.past.slice(0, 12)).forEach(function (e) {
          var n = (e.name || "").trim();
          if (n) { eventNames.push(n); eventDates[n] = e.date || ""; }
        });
      }).catch(function () { /* suggestions are optional */ });
    }

    function patchTodo(id, fields, ctrl) {
      if (ctrl) ctrl.disabled = true;
      sb.from("todos").update(fields).eq("id", id).then(function (r) {
        if (r.error) {
          if (ctrl) ctrl.disabled = false;
          setMsg($("todo-msg"), "Couldn't update that task.", "error");
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
        var da = a.due_date || "9999-12-31", db2 = b.due_date || "9999-12-31";
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
      var overdue = !isDone && t.due_date && t.due_date < today;
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

      if (t.due_date) meta.appendChild(el("span", "due", (overdue ? "Overdue · " : "Due ") + dueLabel(t.due_date)));
      if (isDone && t.completed_at) meta.appendChild(el("span", null, "Done " + when(t.completed_at)));
      else if (t.created_by) meta.appendChild(el("span", null, "Added by " + nameOf(t.created_by)));

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

    function renderTodos() {
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
          if (g.name && eventDates[g.name]) sub.push(dueLabel(eventDates[g.name]));
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
        refreshEventList();
        renderTodos();
        $("todo-panel").hidden = false;
        $("todo-missing").hidden = true;
        stamp("todo");
      }
      return sb.from("todos").select(BASE_COLS + ", priority, event_name")
        .order("created_at", { ascending: false }).limit(300)
        .then(function (r) {
          if (!r.error) { hasExtras = true; return finish(r.data); }
          // Priority / event columns not added yet: fall back to the basic board.
          return sb.from("todos").select(BASE_COLS)
            .order("created_at", { ascending: false }).limit(300)
            .then(function (r2) {
              if (r2.error) { $("todo-panel").hidden = true; $("todo-missing").hidden = false; return; }
              hasExtras = false;
              finish(r2.data);
            });
        });
    }

    function initTodoForm() {
      var titleIn = $("todo-title-input"), assignee = $("todo-assignee"), due = $("todo-due"),
          prio = $("todo-priority"), evIn = $("todo-event"), grp = $("todo-group"),
          add = $("todo-add"), tmsg = $("todo-msg");
      fillAssignee(assignee, "");
      fillPriority(prio, "medium");

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
        add.disabled = true;
        setMsg(tmsg, "Adding…", "info");
        sb.from("todos").insert(row).then(function (r) {
          add.disabled = false;
          if (r.error) { setMsg(tmsg, "Couldn't add that task. Try again.", "error"); return; }
          // Keep the event filled in (handy when adding several tasks for one event).
          titleIn.value = ""; due.value = ""; assignee.value = ""; prio.value = "medium";
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
