// Exec-only area: sign-in (login.html) and the dashboard (exec.html).
// Backend: Supabase (hosted Postgres + Auth). Needs js/supabase.js and js/exec-config.js first.
(function () {
  "use strict";

  var page = document.body.getAttribute("data-page");
  var cfg = window.MCC_EXEC_CONFIG || {};
  var configured = cfg.url && cfg.key && cfg.url.indexOf("PASTE_") !== 0 && cfg.key.indexOf("PASTE_") !== 0;

  function $(id) { return document.getElementById(id); }
  function setMsg(el, text, kind) {
    if (!el) return;
    el.textContent = text || "";            // textContent only: never inject text as HTML
    el.className = "msg" + (kind ? " " + kind : "");
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

  // ---------- not configured yet ----------
  if (!configured || !window.supabase) {
    var m = $("msg");
    if (m) setMsg(m, "The exec area isn't connected to its database yet.", "info");
    var f = $("login-form");
    if (f) f.querySelectorAll("input,button").forEach(function (x) { x.disabled = true; });
    var card = $("welcome-card");
    if (card) {
      card.hidden = false;
      $("welcome-name").textContent = "Not set up yet";
      $("welcome-sub").textContent = "Add the Supabase URL and key in js/exec-config.js.";
    }
    return;
  }

  var sb = window.supabase.createClient(cfg.url, cfg.key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });

  // ---------- login page ----------
  if (page === "login") {
    var form = $("login-form"), msg = $("msg"), btn = $("login-btn");

    sb.auth.getSession().then(function (r) {
      if (r.data && r.data.session) location.replace("exec.html");
    });

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
    var card2 = $("welcome-card");
    var me = null;           // { id, name, role }

    function goLogin() { location.replace("login.html"); }

    // Announcement banner (latest row; hidden if there is none or the table isn't set up yet)
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

    // Team roster
    function loadTeam() {
      return sb.from("profiles").select("display_name, role").order("created_at", { ascending: true })
        .then(function (r) {
          if (r.error || !r.data || !r.data.length) return;
          var ul = $("team-list");
          ul.textContent = "";
          r.data.forEach(function (p) {
            var li = el("li", "team-card");
            li.appendChild(el("strong", null, p.display_name));
            li.appendChild(el("span", null, p.role));
            ul.appendChild(li);
          });
          $("team-panel").hidden = false;
        });
    }

    // Shout-out wall
    function renderShouts(rows) {
      var ul = $("shout-list");
      ul.textContent = "";
      if (!rows.length) {
        ul.appendChild(el("li", "empty", "No shout-outs yet. Be the first!"));
        return;
      }
      rows.forEach(function (s) {
        var li = el("li", "shout");
        li.appendChild(el("p", "shout-text", s.body));
        var foot = el("div", "shout-foot");
        var by = el("span", "shout-by", (s.profiles && s.profiles.display_name) || "An exec");
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
        .select("id, author_id, body, created_at, profiles(display_name)")
        .order("created_at", { ascending: false }).limit(50)
        .then(function (r) {
          if (r.error) { $("shout-panel").hidden = true; return; }
          renderShouts(r.data || []);
          $("shout-panel").hidden = false;
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
          if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches && typeof confettiBurst === "function") {
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
            me = { id: user.id, name: name, role: role };

            $("welcome-name").textContent = "Welcome, " + name;
            $("welcome-sub").textContent = "You're signed in as " + (user.email || "");
            $("welcome-role").textContent = role;
            card2.hidden = false;

            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
                typeof confettiBurst === "function") {
              var rect = card2.getBoundingClientRect();
              confettiBurst(rect.left + rect.width / 2, rect.top + 60);
            }

            initShoutForm();
            return Promise.all([loadAnnouncement(), loadShouts(), loadTeam()]);
          });
      });
    }).catch(function () {
      $("welcome-name").textContent = "Something went wrong";
      $("welcome-sub").textContent = "Couldn't load your profile. Try signing in again.";
      card2.hidden = false;
    });

    $("signout-btn").addEventListener("click", function () {
      this.disabled = true;
      sb.auth.signOut().then(goLogin, goLogin);
    });
  }
})();
