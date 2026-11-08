/* MCC event registration: members and guests.
 *
 * Loaded on demand by js/site.js the first time someone taps a "Register" button on an event that
 * has "site" in the link column of the Events sheet. Talks to Supabase (see
 * supabase/members-2-registration.sql); the database decides what anyone is allowed to do.
 *
 *   Signed-in member  → one tap: "Register as <name>" → ticket
 *   Not signed in     → Guest (name + email) → ticket → "Become a member?" (can say no)
 *                     → or Member sign-in (email + password) → ticket
 *                     → or Create account (name, email, password, student number, year, program) → ticket
 *
 * The ticket has a QR code (the ticket's unique code) for check-in at the door.
 * Also handles the "reset your password" link from a forgotten-password email.
 */
(function () {
  "use strict";

  var cfg = window.MCC_EXEC_CONFIG || {};
  var sb = null;
  function client(fromRecoveryLink) {
    if (!sb) {
      sb = window.supabase.createClient(cfg.url, cfg.key, {
        auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: !!fromRecoveryLink }
      });
    }
    return sb;
  }

  // ---------- little helpers ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  // a field's value by name (form.name would give the form's own name, not the "name" field)
  function fv(form, name) { var el = form && form.querySelector('[name="' + name + '"]'); return el ? el.value : ""; }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function niceDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    if (!m) return iso || "";
    var d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], 12));
    var wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getUTCDay()];
    return wd + ", " + MONTHS[+m[2] - 1] + " " + (+m[3]) + ", " + m[1];
  }
  function friendlyError(err) {
    var msg = (err && (err.message || err.error_description)) || "";
    if (/invalid login credentials/i.test(msg)) return "That email and password didn't match.";
    if (/already registered|already been registered|user already exists/i.test(msg)) return "There's already an account with that email. Try signing in instead.";
    if (/password.*(at least|short|weak)/i.test(msg)) return "Please choose a longer password (at least 8 characters).";
    if (/rate limit|too many/i.test(msg)) return "Lots of people are registering right now. Please try again in a minute.";
    if (/email not confirmed/i.test(msg)) return "Please confirm your email first (check your inbox), then sign in.";
    if (/please enter|unknown event/i.test(msg)) return msg;
    if (/failed to fetch|network|load failed/i.test(msg)) return "Couldn't reach the server. Check your connection and try again.";
    return "Something went wrong. Please try again." + (msg ? " (" + msg + ")" : "");
  }

  // ---------- styles (kept here so no page needs extra CSS) ----------
  function injectStyles() {
    if (document.getElementById("reg-style")) return;
    var css = [
      ".reg-overlay{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:20px;",
      "background:rgba(18,22,42,0.48);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);opacity:0;transition:opacity .35s ease}",
      ".reg-overlay.open{opacity:1}",
      ".reg-sheet{position:relative;width:min(520px,100%);max-height:calc(100dvh - 40px);overflow:auto;background:var(--bg,#F6F1E4);",
      "border-radius:26px;padding:30px 28px 26px;box-shadow:0 30px 80px rgba(18,22,42,0.35);transform:translateY(24px) scale(.98);",
      "transition:transform .55s cubic-bezier(.22,1,.36,1);color:var(--ink,#1C2440);font-family:'Work Sans',system-ui,sans-serif}",
      ".reg-overlay.open .reg-sheet{transform:none}",
      "@media (max-width:560px){.reg-overlay{align-items:flex-end;padding:0}.reg-sheet{border-radius:26px 26px 0 0;max-height:92dvh;padding:26px 20px calc(22px + env(safe-area-inset-bottom))}}",
      ".reg-close{position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;border:1px solid var(--line,rgba(28,36,64,.16));",
      "background:transparent;color:inherit;font-size:20px;line-height:1;cursor:pointer}",
      ".reg-kicker{font-size:.68rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--red,#AE3628)}",
      ".reg-title{font-family:'Fraunces',Georgia,serif;font-weight:600;font-size:1.55rem;line-height:1.15;margin:6px 40px 4px 0}",
      ".reg-meta{font-size:.86rem;color:var(--ink-soft,#5F5A48);margin-bottom:20px}",
      ".reg-tabs{display:flex;gap:4px;padding:4px;border-radius:999px;background:var(--bg-sunk,#EEE6D3);margin-bottom:18px}",
      ".reg-tabs button{flex:1;padding:10px 12px;border-radius:999px;border:0;background:transparent;font:inherit;font-size:.86rem;font-weight:700;color:var(--ink-soft,#5F5A48);cursor:pointer;transition:background .25s,color .25s}",
      ".reg-tabs button[aria-selected=true]{background:var(--bg-raised,#FDFAF2);color:var(--ink,#1C2440);box-shadow:0 2px 8px rgba(28,36,64,.1)}",
      ".reg-form{display:grid;gap:12px}",
      ".reg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}",
      "@media (max-width:420px){.reg-row{grid-template-columns:1fr}}",
      ".reg-field{display:grid;gap:6px;font-size:.78rem;font-weight:700;letter-spacing:.02em;color:var(--ink-soft,#5F5A48)}",
      ".reg-field input,.reg-field select{font:inherit;font-size:1rem;font-weight:500;color:var(--ink,#1C2440);padding:12px 14px;border-radius:14px;",
      "border:1px solid var(--line,rgba(28,36,64,.16));background:var(--bg-raised,#FDFAF2);outline:none;transition:border-color .2s,box-shadow .2s;width:100%;box-sizing:border-box}",
      ".reg-field input:focus,.reg-field select:focus{border-color:var(--navy,#1C2440);box-shadow:0 0 0 3px rgba(28,36,64,.12)}",
      ".reg-hint{font-weight:500;letter-spacing:0;color:var(--ink-soft,#5F5A48);opacity:.8}",
      ".reg-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:15px 20px;border-radius:999px;border:0;cursor:pointer;",
      "background:var(--navy,#1C2440);color:var(--footer-ink,#F6F1E4);font:inherit;font-size:.86rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;transition:transform .2s,opacity .2s}",
      ".reg-btn:hover{transform:translateY(-1px)}.reg-btn[disabled]{opacity:.55;cursor:default;transform:none}",
      ".reg-btn.wallet{background:#000;color:#fff;margin:0 0 6px}.reg-wallet-note{text-align:left;margin:0 0 12px;color:#8C2A1F}",
      ".reg-btn.ghost{background:transparent;color:var(--ink,#1C2440);border:1px solid var(--line,rgba(28,36,64,.16))}",
      ".reg-link{background:none;border:0;padding:0;font:inherit;font-size:.84rem;font-weight:600;color:var(--ink,#1C2440);text-decoration:underline;text-underline-offset:3px;cursor:pointer}",
      ".reg-small{font-size:.84rem;color:var(--ink-soft,#5F5A48);text-align:center;margin-top:4px}",
      ".reg-demo{font-size:.86rem;line-height:1.45;padding:12px 14px;margin:-6px 0 18px;border-radius:14px;background:rgba(192,138,46,.14);border:1px solid rgba(192,138,46,.45);color:var(--ink,#1C2440)}",
      ".reg-demo a{color:inherit;font-weight:700;text-underline-offset:3px}",
      ".tk-demo{position:absolute;top:12px;right:-34px;transform:rotate(35deg);background:var(--gold,#C08A2E);color:var(--navy,#1C2440);font-size:.56rem;font-weight:800;letter-spacing:.16em;padding:4px 40px;z-index:3}",
      ".reg-msg{font-size:.86rem;border-radius:12px;padding:10px 12px;display:none}",
      ".reg-msg.show{display:block}.reg-msg.error{background:rgba(174,54,40,.1);color:#8C2A1F}.reg-msg.info{background:rgba(28,36,64,.07);color:var(--ink,#1C2440)}",
      ".reg-me{display:flex;align-items:center;gap:14px;padding:16px;border-radius:18px;background:var(--bg-raised,#FDFAF2);border:1px solid var(--line,rgba(28,36,64,.16));margin-bottom:16px}",
      ".reg-avatar{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:var(--red,#AE3628);color:#fff;font-weight:700;flex:none}",
      ".reg-spin{display:block;width:26px;height:26px;margin:30px auto;border-radius:50%;border:3px solid var(--line,rgba(28,36,64,.16));border-top-color:var(--navy,#1C2440);animation:reg-spin .8s linear infinite}",
      "@keyframes reg-spin{to{transform:rotate(360deg)}}",
      /* ticket */
      /* The ticket is a small 3D object: it tilts toward the cursor/finger, light and a gold foil glint slide
         across it, it has a paper edge, and it springs back flat (so the QR scans) when let go. */
      ".tk-stage{--stub:132px;position:relative;perspective:1000px;margin:6px 0 16px;touch-action:pan-y;-webkit-user-select:none;user-select:none;",
      "opacity:0;transform:translateY(26px) rotate(-1.5deg);animation:tk-in .9s .1s cubic-bezier(.22,1,.36,1) forwards}",
      "@keyframes tk-in{to{opacity:1;transform:none}}",
      ".tk-obj{position:relative;transform-style:preserve-3d;-webkit-transform-style:preserve-3d}",
      ".tk-edge{position:absolute;inset:0;border-radius:20px;background:linear-gradient(90deg,#141a31 calc(100% - var(--stub)),#d8ceb4 0);-webkit-mask:radial-gradient(circle 10px at calc(100% - var(--stub)) 0,#0000 97%,#000) top/100% 51% no-repeat,radial-gradient(circle 10px at calc(100% - var(--stub)) 100%,#0000 97%,#000) bottom/100% 50% no-repeat;mask:radial-gradient(circle 10px at calc(100% - var(--stub)) 0,#0000 97%,#000) top/100% 51% no-repeat,radial-gradient(circle 10px at calc(100% - var(--stub)) 100%,#0000 97%,#000) bottom/100% 50% no-repeat}",
      ".tk-shadow{position:absolute;left:7%;right:7%;bottom:-6px;height:28px;border-radius:50%;background:rgba(18,22,42,.34);filter:blur(14px);pointer-events:none}",
      ".tk-glare,.tk-foil{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:0}",
      ".tk-glare{mix-blend-mode:soft-light}",
      ".tk-foil{mix-blend-mode:color-dodge;background:linear-gradient(115deg,transparent 30%,rgba(255,214,140,.55) 45%,rgba(255,255,255,.4) 50%,rgba(192,138,46,.45) 55%,transparent 70%);background-size:250% 250%}",
      ".tk{position:relative;display:grid;grid-template-columns:1fr var(--stub);border-radius:20px;background:var(--navy,#1C2440);color:var(--footer-ink,#F6F1E4);",
      "overflow:hidden;transform:translateZ(1.6px);-webkit-mask:radial-gradient(circle 10px at calc(100% - var(--stub)) 0,#0000 97%,#000) top/100% 51% no-repeat,radial-gradient(circle 10px at calc(100% - var(--stub)) 100%,#0000 97%,#000) bottom/100% 50% no-repeat;mask:radial-gradient(circle 10px at calc(100% - var(--stub)) 0,#0000 97%,#000) top/100% 51% no-repeat,radial-gradient(circle 10px at calc(100% - var(--stub)) 100%,#0000 97%,#000) bottom/100% 50% no-repeat}",
      ".tk-main{padding:20px 18px 18px 22px;min-width:0}",
      ".tk-brand{font-size:.6rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--gold,#C08A2E)}",
      ".tk-event{font-family:'Fraunces',Georgia,serif;font-size:1.25rem;font-weight:600;line-height:1.15;margin:6px 0 14px}",
      ".tk-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px 14px}",
      ".tk-k{font-size:.56rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(246,241,228,.55)}",
      ".tk-v{font-size:.84rem;font-weight:600;margin-top:2px;overflow-wrap:anywhere}",
      ".tk-stub{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:16px 12px;background:var(--bg-raised,#FDFAF2);color:var(--ink,#1C2440)}",
      ".tk-stub::before{content:'';position:absolute;left:0;top:10px;bottom:10px;border-left:2px dashed rgba(28,36,64,.25)}",
      ".tk-qr{width:96px;height:96px}.tk-qr svg{width:100%;height:100%;display:block}",
      ".tk-code{font-family:ui-monospace,Menlo,monospace;font-size:.72rem;font-weight:700;letter-spacing:.12em}",
      ".tk-status{display:flex;align-items:center;gap:10px;font-size:.92rem;font-weight:600;margin-bottom:4px}",
      ".tk-status i{width:26px;height:26px;border-radius:50%;background:var(--green,#4B7A3C);display:grid;place-items:center;color:#fff;font-style:normal;font-size:.9rem;flex:none}",
      ".tk-cal{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin:2px 0 14px;font-size:.82rem;color:var(--ink-soft,#5F5A48)}",
      ".tk-cal a{padding:8px 14px;border-radius:999px;border:1px solid var(--line,rgba(28,36,64,.16));color:var(--ink,#1C2440);text-decoration:none;font-weight:700;font-size:.78rem}",
      ".reg-join{margin-top:6px;padding:18px;border-radius:18px;background:var(--bg-raised,#FDFAF2);border:1px solid var(--line,rgba(28,36,64,.16))}",
      ".reg-join h4{font-family:'Fraunces',Georgia,serif;font-size:1.15rem;font-weight:600;margin:0 0 14px}",
      ".reg-join p{font-size:.86rem;color:var(--ink-soft,#5F5A48);margin:0 0 14px}",
      ".reg-join .reg-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}",
      "@media (max-width:420px){.tk-stage{--stub:112px}.tk-qr{width:84px;height:84px}}",
      "@media (prefers-reduced-motion: reduce){.reg-overlay,.reg-sheet,.tk-stage{transition:none!important;animation:none!important;opacity:1!important;transform:none!important}}"
    ].join("");
    var st = document.createElement("style");
    st.id = "reg-style";
    st.textContent = css;
    document.head.appendChild(st);
  }

  // ---------- the window ----------
  var overlay = null, body = null, current = null, lastFocus = null;

  function openShell() {
    injectStyles();
    lastFocus = document.activeElement;
    overlay = document.createElement("div");
    overlay.className = "reg-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", "reg-title");
    overlay.innerHTML = '<div class="reg-sheet"><button type="button" class="reg-close" aria-label="Close">&times;</button><div class="reg-body"></div></div>';
    document.body.appendChild(overlay);
    body = $(".reg-body", overlay);
    document.documentElement.style.overflow = "hidden";
    requestAnimationFrame(function () { overlay.classList.add("open"); });
    $(".reg-close", overlay).addEventListener("click", close);
    overlay.addEventListener("mousedown", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", onKey);
  }
  function onKey(e) { if (e.key === "Escape") close(); }
  function close() {
    if (!overlay) return;
    var o = overlay;
    overlay = null;
    document.removeEventListener("keydown", onKey);
    o.classList.remove("open");
    document.documentElement.style.overflow = "";
    setTimeout(function () { o.remove(); }, 380);
    if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { /* ignore */ }
  }

  // While window.MCC_REG_DEMO is on (set in js/site.js), every step carries this notice.
  function demoNote() {
    if (!window.MCC_REG_DEMO) return "";
    return '<div class="reg-demo"><strong>Demo only — this doesn\'t count.</strong> To actually register, fill out the Google Form ' +
      'linked in <a href="https://www.instagram.com/mcc_uoft/" target="_blank" rel="noopener">@mcc_uoft\'s Instagram bio</a>.</div>';
  }
  function header(ev, kicker) {
    var when = [niceDate(ev.date), ev.time].filter(Boolean).join(" · ");
    var meta = [when, ev.location].filter(Boolean).join(" · ");
    return '<span class="reg-kicker">' + esc(kicker || "Register") + '</span>' +
      '<h2 class="reg-title" id="reg-title">' + esc(ev.name) + '</h2>' +
      (meta ? '<div class="reg-meta">' + esc(meta) + '</div>' : "") + demoNote();
  }
  function show(html, focusSel) {
    body.innerHTML = html;
    var f = focusSel ? $(focusSel, body) : $("input, button.reg-btn", body);
    if (f && window.matchMedia && window.matchMedia("(hover: hover)").matches) setTimeout(function () { f.focus(); }, 60);
  }
  function setMsg(text, kind) {
    var m = $(".reg-msg", body);
    if (!m) return;
    m.textContent = text || "";
    m.className = "reg-msg" + (text ? " show " + (kind || "error") : "");
  }
  function busy(btn, on, label) {
    if (!btn) return;
    if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || "One moment…"; btn.disabled = true; }
    else { btn.textContent = btn.dataset.label || btn.textContent; btn.disabled = false; }
  }

  function loading(ev) { show(header(ev) + '<span class="reg-spin" aria-label="Loading"></span>'); }

  // ---------- data ----------
  function getMember() {
    return client().auth.getSession().then(function (r) {
      var session = r.data && r.data.session;
      if (!session) return null;
      return client().from("members").select("id, full_name, email").eq("id", session.user.id).maybeSingle()
        .then(function (m) { return m.data ? m.data : { notMember: true, email: session.user.email }; });
    });
  }
  // Rejects if p hasn't settled in ms, so a stuck network call shows an error instead of spinning forever.
  function withTimeout(p, ms) {
    return new Promise(function (resolve, reject) {
      var timer = setTimeout(function () { reject(new Error("Network timeout")); }, ms);
      p.then(function (v) { clearTimeout(timer); resolve(v); }, function (e) { clearTimeout(timer); reject(e); });
    });
  }
  function register(ev, guest) {
    return withTimeout(client().rpc("register_for_event", {
      p_event_id: ev.id, p_event_name: ev.name || "", p_event_date: /^\d{4}-\d{2}-\d{2}$/.test(ev.date || "") ? ev.date : null,
      p_guest_name: guest ? guest.name : null, p_guest_email: guest ? guest.email : null
    }), 20000).then(function (r) {
      if (r.error) throw r.error;
      var row = Array.isArray(r.data) ? r.data[0] : r.data;
      if (!row || !row.ticket_code) throw new Error("No ticket came back");
      return row;
    });
  }

  // ---------- views ----------
  function viewMember(ev, me) {
    var initials = (me.full_name || "?").trim().split(/\s+/).map(function (w) { return w[0]; }).slice(0, 2).join("").toUpperCase();
    show(header(ev) +
      '<div class="reg-me"><span class="reg-avatar">' + esc(initials) + '</span><div><div style="font-weight:700">' + esc(me.full_name) +
      '</div><div class="reg-hint" style="font-size:.84rem">' + esc(me.email || "") + '</div></div></div>' +
      '<div class="reg-msg"></div>' +
      '<button type="button" class="reg-btn" data-go>Register</button>' +
      '<p class="reg-small"><button type="button" class="reg-link" data-out>Not you? Sign out</button></p>');
    $("[data-go]", body).addEventListener("click", function () {
      var b = this; busy(b, true, "Registering…"); setMsg("");
      register(ev, null).then(function (t) { viewTicket(ev, t, { member: true }); })
        .catch(function (e) { busy(b, false); setMsg(friendlyError(e)); });
    });
    $("[data-out]", body).addEventListener("click", function () {
      client().auth.signOut().then(function () { viewChoose(ev, "guest"); });
    });
  }

  function viewChoose(ev, tab, note) {
    tab = tab || "guest";
    var guest =
      '<form class="reg-form" data-form="guest" novalidate>' +
        '<label class="reg-field">Your name<input name="name" autocomplete="name" required maxlength="120"></label>' +
        '<label class="reg-field">Email<input name="email" type="email" autocomplete="email" required maxlength="254"></label>' +
        '<div class="reg-msg"></div>' +
        '<button class="reg-btn" type="submit">Register as a guest</button>' +
        '<p class="reg-small"><button type="button" class="reg-link" data-signup>Create an account</button></p>' +
      '</form>';
    var member =
      '<form class="reg-form" data-form="member" novalidate>' +
        '<label class="reg-field">Email<input name="email" type="email" autocomplete="email" required></label>' +
        '<label class="reg-field">Password<input name="password" type="password" autocomplete="current-password" required></label>' +
        '<div class="reg-msg"></div>' +
        '<button class="reg-btn" type="submit">Sign in &amp; register</button>' +
        '<p class="reg-small"><button type="button" class="reg-link" data-forgot>Forgot password?</button> · <button type="button" class="reg-link" data-signup>Create an account</button></p>' +
      '</form>';
    show(header(ev) +
      '<div class="reg-tabs" role="tablist">' +
        '<button type="button" role="tab" data-tab="guest" aria-selected="' + (tab === "guest") + '">Guest</button>' +
        '<button type="button" role="tab" data-tab="member" aria-selected="' + (tab === "member") + '">Member sign-in</button>' +
      '</div>' + (tab === "guest" ? guest : member));
    if (note) setMsg(note, "info");
    body.querySelectorAll("[data-tab]").forEach(function (b) {
      b.addEventListener("click", function () { if (b.dataset.tab !== tab) viewChoose(ev, b.dataset.tab); });
    });
    body.querySelectorAll("[data-signup]").forEach(function (b) {
      b.addEventListener("click", function () {
        var f = $("form", body);
        viewSignup(ev, { name: fv(f, "name"), email: fv(f, "email") }, true);
      });
    });
    var forgot = $("[data-forgot]", body);
    if (forgot) forgot.addEventListener("click", function () {
      var email = fv($("form", body), "email").trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { setMsg("Type your email above first, then tap Forgot password."); return; }
      client().auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname.replace(/[^/]*$/, "") + "index.html" })
        .then(function (r) {
          if (r.error) throw r.error;
          setMsg("If that email has an account, a link to reset your password is on its way.", "info");
        }).catch(function (e) { setMsg(friendlyError(e)); });
    });

    var form = $("form", body);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("button[type=submit]", form);
      setMsg("");
      if (tab === "guest") {
        var g = { name: fv(form, "name").trim(), email: fv(form, "email").trim() };
        if (!g.name) return setMsg("Please enter your name.");
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.email)) return setMsg("Please enter a valid email.");
        busy(btn, true, "Registering…");
        register(ev, g).then(function (t) { viewTicket(ev, t, { guest: g }); })
          .catch(function (err) { busy(btn, false); setMsg(friendlyError(err)); });
      } else {
        var email = fv(form, "email").trim(), password = fv(form, "password");
        if (!email || !password) return setMsg("Enter your email and password.");
        busy(btn, true, "Signing in…");
        client().auth.signInWithPassword({ email: email, password: password })
          .then(function (r) {
            if (r.error) throw r.error;
            return getMember();
          })
          .then(function (me) {
            if (!me || me.notMember) {
              busy(btn, false);
              return viewChoose(ev, "guest", "That account isn't a member account (exec accounts are separate). You can register as a guest instead.");
            }
            busy(btn, true, "Registering…");
            return register(ev, null).then(function (t) { viewTicket(ev, t, { member: true }); });
          })
          .catch(function (err) { busy(btn, false); setMsg(friendlyError(err)); });
      }
    });
  }

  // withEvent: also register for this event (the "create an account" path before registering).
  // Without it, they already have a guest ticket and are just turning it into an account.
  function viewSignup(ev, prefill, withEvent) {
    prefill = prefill || {};
    var years = ["1st year", "2nd year", "3rd year", "4th year", "5th year+", "Graduate", "Alumni", "Other"];
    show(header(ev, withEvent ? "Create your account" : "Become a member") +
      '<form class="reg-form" novalidate>' +
        '<label class="reg-field">Full name<input name="name" autocomplete="name" required maxlength="120" value="' + esc(prefill.name || "") + '"></label>' +
        '<label class="reg-field">Email<input name="email" type="email" autocomplete="email" required value="' + esc(prefill.email || "") + '"></label>' +
        '<label class="reg-field">Password<input name="password" type="password" autocomplete="new-password" required minlength="8" placeholder="8+ characters"></label>' +
        '<label class="reg-field">UofT student number<input name="student" inputmode="numeric" autocomplete="off" required pattern="[0-9]{9,10}"></label>' +
        '<div class="reg-row">' +
          '<label class="reg-field">Year<select name="year" required><option value="">Choose…</option>' +
            years.map(function (y) { return "<option>" + esc(y) + "</option>"; }).join("") + '</select></label>' +
          '<label class="reg-field">Program<input name="program" autocomplete="off" maxlength="120" placeholder="e.g. Computer Science"></label>' +
        '</div>' +
        '<div class="reg-msg"></div>' +
        '<button class="reg-btn" type="submit">' + (withEvent ? "Create account &amp; register" : "Create my account") + '</button>' +
        (withEvent ? '<p class="reg-small"><button type="button" class="reg-link" data-back>Back</button></p>' : "") +
      '</form>');
    var back = $("[data-back]", body);
    if (back) back.addEventListener("click", function () { viewChoose(ev, "guest"); });
    var form = $("form", body);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("button[type=submit]", form);
      var d = {
        name: fv(form, "name").trim(), email: fv(form, "email").trim(), password: fv(form, "password"),
        student: fv(form, "student").replace(/\D/g, ""), year: fv(form, "year"), program: fv(form, "program").trim()
      };
      setMsg("");
      if (!d.name) return setMsg("Please enter your name.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) return setMsg("Please enter a valid email.");
      if (d.password.length < 8) return setMsg("Please choose a password of at least 8 characters.");
      if (!/^\d{9,10}$/.test(d.student)) return setMsg("Your UofT student number should be 9 or 10 digits.");
      if (!d.year) return setMsg("Please choose your year.");
      busy(btn, true, "Creating your account…");

      // Register first (as a guest with this email), then create the account: the database moves
      // the registration into the new account, whether or not email confirmation is switched on.
      var first = withEvent ? register(ev, { name: d.name, email: d.email }) : Promise.resolve(null);
      first.then(function (ticket) {
        return client().auth.signUp({
          email: d.email, password: d.password,
          options: { data: { account: "member", full_name: d.name, student_number: d.student, year: d.year, program: d.program } }
        }).then(function (r) {
          if (r.error) {
            if (ticket) return viewTicket(ev, ticket, { note: friendlyError(r.error) + " You're registered for this event either way." });
            throw r.error;
          }
          var confirmed = !!(r.data && r.data.session);
          var note = confirmed ? "Welcome to MCC!" : "Welcome to MCC! Confirm your email to sign in.";
          if (ticket) return viewTicket(ev, ticket, { member: confirmed, note: note });
          viewWelcome(ev, note);
        });
      }).catch(function (err) { busy(btn, false); setMsg(friendlyError(err)); });
    });
  }

  function viewWelcome(ev, note) {
    show(header(ev, "You're a member") +
      '<div class="tk-status"><i>✓</i><span>' + esc(note) + '</span></div>' +
      '<button type="button" class="reg-btn" data-done style="margin-top:14px">Done</button>');
    $("[data-done]", body).addEventListener("click", close);
  }

  function qrSvg(code) {
    try {
      var qr = window.qrcode(0, "M");
      qr.addData("MCC:" + code);
      qr.make();
      return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (e) { return ""; }
  }

  // The ticket's paper edge: a few thin layers stacked between front and back.
  function edges() {
    var h = "";
    for (var i = 0; i < 6; i++) h += '<div class="tk-edge" style="transform:translateZ(' + (-1.4 + i * 0.5).toFixed(1) + 'px)"></div>';
    return h;
  }
  // Hold it to the light: tilts toward the cursor (or finger while pressed), lifts a little, light and foil
  // follow, and it springs back flat when let go. Sideways finger drags tilt it; up/down drags still scroll.
  function holdable(stage) {
    if (!stage) return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var obj = $(".tk-obj", stage), tk = $(".tk", stage), glare = $(".tk-glare", stage), foil = $(".tk-foil", stage), sh = $(".tk-shadow", stage);
    var rx = { x: 0, v: 0 }, ry = { x: 0, v: 0 }, lift = { x: 0, v: 0 }, tx = 0, ty = 0, tl = 0, active = false, t0 = performance.now();
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function spring(s, target, k, d) { s.v += (target - s.x) * k; s.v *= d; s.x += s.v; }
    function aim(e) {
      var r = tk.getBoundingClientRect();
      ty = clamp((e.clientX - r.left) / r.width - 0.5, -0.6, 0.6) * 26;
      tx = clamp(0.5 - (e.clientY - r.top) / r.height, -0.6, 0.6) * 26;
      tl = 1; active = true;
    }
    function rest() { tx = 0; ty = 0; tl = 0; active = false; }
    stage.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse" || e.buttons) aim(e); });
    stage.addEventListener("pointerdown", aim);
    stage.addEventListener("pointerleave", rest);
    stage.addEventListener("pointercancel", rest);
    stage.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") rest(); });
    (function frame(t) {
      if (!stage.isConnected) return; // window closed
      // A slow breath for the first few seconds so it reads as an object, then it settles dead flat
      // (crisp text, square QR for the door scanner).
      var amp = active ? 0 : Math.max(0, Math.min(1, 1 - (t - t0 - 3500) / 2500));
      spring(rx, tx + Math.cos((t - t0) / 1900) * 1.2 * amp, 0.06, 0.82);
      spring(ry, ty + Math.sin((t - t0) / 1400) * 2.2 * amp, 0.06, 0.82);
      spring(lift, tl, 0.08, 0.8);
      var still = !active && !amp && Math.abs(rx.x) + Math.abs(ry.x) + Math.abs(lift.x) + Math.abs(rx.v) + Math.abs(ry.v) < 0.02;
      if (still) { obj.style.transform = ""; glare.style.opacity = "0"; foil.style.opacity = "0"; sh.style.transform = ""; sh.style.opacity = "";
        t0 = -1e9; requestAnimationFrame(frame); return; }
      obj.style.transform = "translateZ(" + (lift.x * 18).toFixed(2) + "px) rotateX(" + rx.x.toFixed(2) + "deg) rotateY(" + ry.x.toFixed(2) + "deg)";
      sh.style.transform = "translate(" + (-ry.x * 1.2).toFixed(1) + "px," + (rx.x * 0.6 + lift.x * 8).toFixed(1) + "px) scale(" + (1 - lift.x * 0.06).toFixed(3) + ")";
      sh.style.opacity = (0.85 - lift.x * 0.3).toFixed(2);
      var mag = Math.min(1, Math.hypot(rx.x, ry.x) / 14);
      glare.style.background = "radial-gradient(circle at " + (50 - ry.x * 3.2).toFixed(1) + "% " + (30 + rx.x * 3.2).toFixed(1) + "%, rgba(255,255,255,.75), rgba(255,255,255,0) 55%)";
      glare.style.opacity = (0.15 + mag * 0.75).toFixed(3);
      foil.style.opacity = (mag * 0.55).toFixed(3);
      foil.style.backgroundPosition = (50 + ry.x * 4).toFixed(1) + "% " + (50 + rx.x * 4).toFixed(1) + "%";
      requestAnimationFrame(frame);
    })(t0);
  }

  function viewTicket(ev, t, opts) {
    opts = opts || {};
    var code = String(t.ticket_code || "");
    var short = code.replace(/-/g, "").slice(0, 8).toUpperCase();
    var cal = "";
    try {
      if (typeof window.calendarLinks === "function" && /^\d{4}-\d{2}-\d{2}$/.test(ev.date || "")) {
        var c = window.calendarLinks(ev);
        cal = '<div class="tk-cal">Add to calendar <a href="' + esc(c.google) + '" target="_blank" rel="noopener">Google</a>' +
              '<a href="' + esc(c.ics) + '" download="' + esc(c.file) + '">Apple / Outlook</a></div>';
      }
    } catch (e) { cal = ""; }
    var status = t.already ? "You're already registered." : "You're in!";
    var join = opts.guest
      ? '<div class="reg-join"><h4>Become an MCC member?</h4>' +
        '<div class="reg-actions"><button type="button" class="reg-btn" data-join>Join MCC</button><button type="button" class="reg-btn ghost" data-nojoin>No thanks</button></div></div>'
      : '<button type="button" class="reg-btn ghost" data-done>Done</button>';
    show(header(ev, "Your ticket") +
      '<div class="tk-status"><i>✓</i><span>' + esc(status) + '</span></div>' +
      (opts.note ? '<p class="reg-small" style="text-align:left;margin:0 0 6px">' + esc(opts.note) + '</p>' : "") +
      '<div class="tk-stage"><div class="tk-shadow"></div><div class="tk-obj">' + edges() +
      '<div class="tk" aria-label="Ticket for ' + esc(ev.name) + '">' +
        '<div class="tk-main">' +
          '<div class="tk-brand">Myanmar Culture Club · UofT</div>' +
          '<div class="tk-event">' + esc(ev.name) + '</div>' +
          '<div class="tk-grid">' +
            '<div><div class="tk-k">Date</div><div class="tk-v">' + esc(niceDate(ev.date)) + '</div></div>' +
            '<div><div class="tk-k">Time</div><div class="tk-v">' + esc(ev.time || "TBA") + '</div></div>' +
            '<div style="grid-column:1/-1"><div class="tk-k">Place</div><div class="tk-v">' + esc(ev.location || "TBA") + '</div></div>' +
            '<div style="grid-column:1/-1"><div class="tk-k">Name</div><div class="tk-v">' + esc(t.holder || (opts.guest && opts.guest.name) || "") + '</div></div>' +
          '</div>' +
        '</div>' +
        (window.MCC_REG_DEMO ? '<span class="tk-demo">DEMO</span>' : '') +
        '<div class="tk-stub"><div class="tk-qr" aria-label="Check-in QR code">' + qrSvg(code) + '</div><div class="tk-code">' + esc(short) + '</div></div>' +
        '<div class="tk-foil"></div><div class="tk-glare"></div>' +
      '</div></div></div>' +
      cal +
      '<button type="button" class="reg-btn wallet" data-wallet>Add to Apple Wallet</button><p class="reg-small reg-wallet-note" hidden></p>' +
      (window.MCC_REG_DEMO ? '' : '<p class="reg-small" style="text-align:left;margin:0 0 14px">Show this at the door.</p>') +
      join);
    holdable($(".tk-stage", body));
    var wb = $("[data-wallet]", body);
    if (wb) { try { prepareWallet(ev, t.holder || (opts.guest && opts.guest.name) || "Guest"); } catch (e) {} }
    if (wb) wb.addEventListener("click", function () {
      addToWallet(ev, t, t.holder || (opts.guest && opts.guest.name) || "Guest", wb, $(".reg-wallet-note", body));
    });
    var done = $("[data-done]", body);
    if (done) done.addEventListener("click", close);
    var nj = $("[data-nojoin]", body);
    if (nj) nj.addEventListener("click", close);
    var j = $("[data-join]", body);
    if (j) j.addEventListener("click", function () { viewSignup(ev, opts.guest, false); });
  }

  // ---------- Apple Wallet pass ----------
  // Draws the pass banner (event poster + guest name + event name) on a canvas, then asks the
  // wallet-pass Supabase function to make the pass. The function keeps the WalletWallet key secret.
  var WALLET_W = 1125, WALLET_H = 432;
  function loadImg(src) {
    return new Promise(function (resolve) {
      if (!src) return resolve(null);
      var im = new Image();
      im.decoding = "async";
      im.onload = function () { resolve(im); };
      im.onerror = function () { resolve(null); };
      im.src = src;
    });
  }
  function walletFonts() {
    var jobs = [];
    try {
      if (window.FontFace && document.fonts && !walletFonts.cp) {
        walletFonts.cp = new FontFace("Courier Prime", "url(fonts/CourierPrime-Bold.woff2)", { weight: "700" });
        jobs.push(walletFonts.cp.load().then(function (f) { document.fonts.add(f); }));
      }
      if (document.fonts) jobs.push(document.fonts.load('600 84px "Fraunces"'));
    } catch (e) { /* fonts are a nicety; fall back to system fonts */ }
    return Promise.all(jobs.map(function (j) { return j.catch(function () {}); }));
  }
  function wrapLines(ctx, text, maxW) {
    var words = String(text).split(/\s+/), lines = [], line = "";
    words.forEach(function (w) {
      var test = line ? line + " " + w : w;
      if (line && ctx.measureText(test).width > maxW) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }
  function drawBanner(img, name, title, scale) {
    var W = Math.round(WALLET_W * scale), H = Math.round(WALLET_H * scale);
    var c = document.createElement("canvas");
    c.width = W; c.height = H;
    var x = c.getContext("2d");
    x.scale(scale, scale);
    var w = WALLET_W, h = WALLET_H, L = 66;
    x.fillStyle = "#1C2440"; x.fillRect(0, 0, w, h);
    if (img) {
      var s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
      var iw = img.naturalWidth * s, ih = img.naturalHeight * s;
      x.drawImage(img, (w - iw) / 2, (h - ih) * 0.3, iw, ih);
    }
    var g = x.createLinearGradient(0, h, 0, 0);
    g.addColorStop(0, "rgba(20,26,49,.96)"); g.addColorStop(0.45, "rgba(20,26,49,.8)"); g.addColorStop(1, "rgba(20,26,49,.5)");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    // guest name, typewriter, gold
    var nameSize = 64;
    x.font = '700 ' + nameSize + 'px "Courier Prime", "Courier New", Courier, monospace';
    while (nameSize > 36 && x.measureText(name).width > w - 2 * L) {
      nameSize -= 4; x.font = '700 ' + nameSize + 'px "Courier Prime", "Courier New", Courier, monospace';
    }
    x.save();
    x.shadowColor = "rgba(10,14,30,.7)"; x.shadowBlur = 14; x.shadowOffsetY = 2;
    x.fillStyle = "#D9A441"; x.textBaseline = "alphabetic";
    x.fillText(name, L, 148);
    x.restore();
    // event name, Fraunces, cream, up to two lines
    var size = 84, lines;
    for (;;) {
      x.font = '600 ' + size + 'px "Fraunces", Georgia, serif';
      lines = wrapLines(x, title, w - 2 * L);
      if (lines.length <= 2 || size <= 56) break;
      size -= 6;
    }
    if (lines.length > 2) {
      lines = lines.slice(0, 2);
      while (lines[1].length > 1 && x.measureText(lines[1] + "\u2026").width > w - 2 * L) lines[1] = lines[1].slice(0, -1);
      lines[1] = lines[1].replace(/\s+$/, "") + "\u2026";
    }
    x.fillStyle = "#F6F1E4";
    var lh = size * 1.04, y = 200 + size * 0.86;
    lines.forEach(function (ln) { x.fillText(ln, L, y); y += lh; });
    return c.toDataURL("image/png");
  }
  function walletBanner(ev, name) {
    return Promise.all([loadImg(ev.photo), walletFonts()]).then(function (r) {
      var url;
      try { url = drawBanner(r[0], name, ev.name || "", 2 / 3); }
      catch (e) { url = drawBanner(null, name, ev.name || "", 2 / 3); } // poster from another site can't be drawn
      if (url.length > 1300000) url = drawBanner(r[0], name, ev.name || "", 0.5);
      return url;
    });
  }
  var walletPre = {};
  function prepareWallet(ev, name) {
    var k = (ev.id || ev.name) + "|" + name;
    if (!walletPre[k]) walletPre[k] = walletBanner(ev, name).catch(function () { delete walletPre[k]; throw new Error("banner"); });
    return walletPre[k];
  }
  function addToWallet(ev, t, name, btn, note) {
    busy(btn, true, "Making your pass…");
    note.hidden = true;
    // open the tab now, while we still have the tap (browsers block pop-ups opened later)
    var win = null;
    try { win = window.open("", "_blank"); if (win) win.document.write("<p style=\"font:16px system-ui;padding:24px\">Making your Wallet pass…</p>"); } catch (e) { win = null; }
    prepareWallet(ev, name || "Guest").then(function (banner) {
      return withTimeout(fetch(cfg.url.replace(/\/$/, "") + "/functions/v1/swift-task"  /* the wallet-pass function (Supabase gave it this address) */, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: cfg.key },
        body: JSON.stringify({ ticket: String(t.ticket_code || ""), banner: banner, time: ev.time || "", place: ev.location || "" })
      }), 30000);
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (j) {
        if (!res.ok || !j.url) throw new Error(j.error || "The Wallet pass couldn't be made right now. Your ticket above still works.");
        return j.url;
      });
    }).then(function (url) {
      busy(btn, false);
      if (win && !win.closed) win.location.href = url; else window.location.href = url;
    }).catch(function (err) {
      busy(btn, false);
      if (win && !win.closed) win.close();
      var msg = (err && err.message) || "";
      note.textContent = /failed to fetch|network|load failed|timeout/i.test(msg)
        ? "Couldn't reach the server. Check your connection and try again."
        : msg;
      note.hidden = false;
    });
  }

  // ---------- password reset (from the emailed link) ----------
  function recover() {
    openShell();
    var ev = { name: "Set a new password" };
    show('<span class="reg-kicker">Your MCC account</span><h2 class="reg-title" id="reg-title">Set a new password</h2>' +
      '<form class="reg-form" novalidate style="margin-top:14px">' +
        '<label class="reg-field">New password <span class="reg-hint">at least 8 characters</span><input name="password" type="password" autocomplete="new-password" required minlength="8"></label>' +
        '<div class="reg-msg"></div>' +
        '<button class="reg-btn" type="submit">Save password</button>' +
      '</form>');
    var form = $("form", body);
    client(true);
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("button[type=submit]", form), pw = fv(form, "password");
      if (pw.length < 8) return setMsg("Please choose a password of at least 8 characters.");
      busy(btn, true, "Saving…");
      client().auth.getSession().then(function (r) {
        if (!r.data || !r.data.session) throw new Error("This reset link has expired. Request a new one from the Register window.");
        return client().auth.updateUser({ password: pw });
      }).then(function (r) {
        if (r && r.error) throw r.error;
        if (history.replaceState) history.replaceState(null, "", location.pathname);
        show('<span class="reg-kicker">Your MCC account</span><h2 class="reg-title" id="reg-title">Password updated</h2>' +
          '<div class="tk-status" style="margin-top:12px"><i>✓</i><span>You\'re signed in. Registering for events is one tap now.</span></div>' +
          '<button type="button" class="reg-btn" data-done style="margin-top:16px">Done</button>');
        $("[data-done]", body).addEventListener("click", close);
      }).catch(function (err) { busy(btn, false); setMsg(/expired/.test(err.message || "") ? err.message : friendlyError(err)); });
    });
    void ev;
  }

  // ---------- entry point ----------
  function open(ev) {
    if (!cfg.url || !cfg.key || !window.supabase) { alertless(ev); return; }
    current = ev;
    openShell();
    loading(ev);
    withTimeout(getMember(), 6000).then(function (me) {
      if (!overlay || current !== ev) return;
      if (me && !me.notMember) {
        // Already registered? Go straight to the ticket.
        return client().from("event_registrations").select("ticket_code").eq("event_id", ev.id).eq("user_id", me.id).maybeSingle()
          .then(function (r) {
            if (r.data && r.data.ticket_code) viewTicket(ev, { ticket_code: r.data.ticket_code, already: true, holder: me.full_name }, { member: true });
            else viewMember(ev, me);
          });
      }
      viewChoose(ev, "guest");
    }).catch(function () { viewChoose(ev, "guest"); });
  }
  function alertless(ev) {
    openShell();
    show(header(ev) + '<div class="reg-msg show error">Registration isn\'t available right now. Please try again later.</div>');
  }

  window.MCCRegister = { open: open, recover: recover };
})();
