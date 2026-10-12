// Exec-only area: sign-in (login.html) and the welcome page (exec.html).
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

  // ---------- not configured yet ----------
  if (!configured || !window.supabase) {
    var m = $("msg");
    if (m) setMsg(m, "The exec area isn't connected to its database yet.", "info");
    var f = $("login-form");
    if (f) f.querySelectorAll("input,button").forEach(function (el) { el.disabled = true; });
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

  // ---------- welcome page ----------
  if (page === "exec") {
    var card2 = $("welcome-card");

    function goLogin() { location.replace("login.html"); }

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

            $("welcome-name").textContent = "Welcome, " + name;
            $("welcome-sub").textContent = "You're signed in as " + (user.email || "");
            $("welcome-role").textContent = role;
            card2.hidden = false;

            if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
                typeof confettiBurst === "function") {
              var rect = card2.getBoundingClientRect();
              confettiBurst(rect.left + rect.width / 2, rect.top + 60);
            }
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
