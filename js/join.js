/* Join the Club form (join.html).
 *
 * Sends the form to the database function join_club() (supabase/members-4-join.sql). The checks
 * here are for the visitor's benefit; the function repeats every one of them, and the database
 * decides what is stored. The key in js/exec-config.js is the public one.
 */
(function () {
  "use strict";

  const form = document.getElementById("join-form");
  if (!form) return;

  const $ = id => document.getElementById(id);
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const STUDENT = ["undergrad", "grad"];
  // Common slips, mapped to what was almost certainly meant.
  const DOMAIN_FIXES = {
    "gmial.com": "gmail.com", "gmai.com": "gmail.com", "gmail.co": "gmail.com", "gmail.con": "gmail.com",
    "gnail.com": "gmail.com", "hotmial.com": "hotmail.com", "hotmail.con": "hotmail.com",
    "outlok.com": "outlook.com", "outlook.con": "outlook.com", "icloud.con": "icloud.com",
    "yaho.com": "yahoo.com", "yahoo.con": "yahoo.com",
    "mail.utoronto.com": "mail.utoronto.ca", "utoronto.com": "utoronto.ca", "mail.utornto.ca": "mail.utoronto.ca",
    "mail.utoronot.ca": "mail.utoronto.ca", "mail.uoft.ca": "mail.utoronto.ca",
  };

  const el = {
    first: $("j-first"), last: $("j-last"), pref: $("j-pref"), email: $("j-email"),
    aff: $("j-aff"), studentFold: $("j-student"), utorid: $("j-utorid"), snum: $("j-snum"),
    yearFold: $("j-year-fold"), year: $("j-year"), ideas: $("j-ideas"),
    nl: $("j-nl"), nlMore: $("j-nl-more"), nlTo: $("j-nl-to"), nlAddr: $("j-nl-addr"),
    nlSwitch: $("j-nl-switch"), nlAlt: $("j-nl-alt"), nlEmail: $("j-nl-email"),
    msg: $("j-msg"), submit: $("j-submit"),
  };

  const clean = s => String(s || "").trim().replace(/\s+/g, " ");
  const picked = name => { const r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ""; };
  const isStudent = () => STUDENT.includes(picked("affiliation"));

  /* ---------- Rules: each returns an error message, or "" ---------- */
  const rules = {
    first: () => clean(el.first.value) ? "" : "Enter your first name",
    last: () => clean(el.last.value) ? "" : "Enter your last name",
    email: () => {
      const v = el.email.value.trim();
      if (!v) return "Enter your email";
      return EMAIL.test(v) ? "" : "Enter an email like name@example.com";
    },
    aff: () => picked("affiliation") ? "" : "Choose one",
    utorid: () => {
      if (!isStudent()) return "";
      const v = el.utorid.value.trim();
      if (!v) return "Enter your UTORid";
      if (v.includes("@")) return "Your UTORid is the short login name, not an email";
      return /^[a-z0-9]{3,8}$/i.test(v) ? "" : "A UTORid is 3 to 8 letters and numbers";
    },
    snum: () => {
      if (!isStudent()) return "";
      const v = el.snum.value.replace(/[\s-]/g, "");
      if (!v) return "Enter your student number";
      return /^\d{9,10}$/.test(v) ? "" : "A student number is 9 or 10 digits";
    },
    year: () => picked("affiliation") !== "undergrad" || picked("year_of_study") ? "" : "Choose your year",
    nlEmail: () => {
      const v = el.nlEmail.value.trim();
      if (!el.nl.checked || el.nlAlt.hidden || !v) return "";
      return EMAIL.test(v) ? "" : "Enter an email like name@example.com";
    },
  };
  const ORDER = ["first", "last", "email", "aff", "utorid", "snum", "year", "nlEmail"];

  // Text boxes carry aria-invalid themselves; the two radio groups are fieldsets, marked on their box.
  function errNode(key) { return $((el[key].id) + "-err"); }
  function setError(key, text) {
    const node = el[key], box = node.querySelector(".choices, .seg");
    errNode(key).textContent = text;
    errNode(key).classList.remove("hint");
    if (box) box.classList.toggle("is-invalid", !!text);
    else if (text) { node.setAttribute("aria-invalid", "true"); node.setAttribute("aria-describedby", node.id + "-err"); }
    else { node.removeAttribute("aria-invalid"); node.removeAttribute("aria-describedby"); }
    return !text;
  }
  function check(key) { return setError(key, rules[key]()); }
  function focusField(key) {
    const node = el[key];
    (node.matches("fieldset") ? node.querySelector("input:checked, input") : node).focus();
  }

  // A field is checked when you leave it, then on every keystroke until it's right.
  ["first", "last", "email", "utorid", "snum", "nlEmail"].forEach(key => {
    const input = el[key];
    input.addEventListener("blur", () => { if (input.value.trim()) check(key); });
    input.addEventListener("input", () => { if (input.getAttribute("aria-invalid")) check(key); });
  });

  /* ---------- Email: offer a fix for an obvious typo ---------- */
  function suggestEmail() {
    const v = el.email.value.trim(), at = v.lastIndexOf("@");
    if (at < 1 || rules.email()) return;
    const fix = DOMAIN_FIXES[v.slice(at + 1).toLowerCase()];
    if (!fix) return;
    const better = v.slice(0, at + 1) + fix;
    const note = errNode("email"), btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = better;
    btn.addEventListener("click", () => { el.email.value = better; setError("email", ""); syncNewsletterAddress(); el.email.focus(); });
    note.classList.add("hint");
    note.textContent = "Did you mean ";
    note.appendChild(btn);
    note.appendChild(document.createTextNode("?"));
  }
  el.email.addEventListener("blur", suggestEmail);

  /* ---------- Student-only questions ---------- */
  function setFold(fold, open) {
    fold.classList.toggle("open", open);
    fold.inert = !open;
    // Closed questions are switched off as well as hidden, so they can't be tabbed to or sent.
    fold.querySelectorAll(":scope > .fold-in > .f-row input, :scope > .fold-in > .f input").forEach(i => { i.disabled = !open; });
  }
  function syncAffiliation() {
    const a = picked("affiliation");
    setFold(el.studentFold, STUDENT.includes(a));
    setFold(el.yearFold, a === "undergrad");
    if (!STUDENT.includes(a)) { setError("utorid", ""); setError("snum", ""); }
    if (a !== "undergrad") setError("year", "");
  }
  el.aff.addEventListener("change", () => { syncAffiliation(); check("aff"); });
  el.year.addEventListener("change", () => check("year"));

  /* ---------- Newsletter ---------- */
  function syncNewsletterAddress() {
    const v = el.email.value.trim();
    el.nlAddr.textContent = EMAIL.test(v) ? v : "the email above";
  }
  el.email.addEventListener("input", syncNewsletterAddress);
  el.nl.addEventListener("change", () => { el.nlMore.hidden = !el.nl.checked; syncNewsletterAddress(); });
  el.nlSwitch.addEventListener("click", () => {
    el.nlTo.hidden = true;
    el.nlAlt.hidden = false;
    el.nlEmail.focus();
  });

  // The browser can restore answers after Back or a reload; make the page match them.
  syncAffiliation();
  el.nlMore.hidden = !el.nl.checked;
  syncNewsletterAddress();

  /* ---------- Sending ---------- */
  function withTimeout(promise, ms) {
    return new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error("timeout")), ms);
      promise.then(v => { clearTimeout(t); resolve(v); }, e => { clearTimeout(t); reject(e); });
    });
  }

  function send(data) {
    const cfg = window.MCC_EXEC_CONFIG || {};
    if (!cfg.url || !cfg.key) return Promise.reject(new Error("not configured"));
    return withTimeout(fetch(cfg.url.replace(/\/$/, "") + "/rest/v1/rpc/join_club", {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": cfg.key },
      body: JSON.stringify(data),
    }), 20000).then(r => {
      if (r.ok) return;
      return r.json().catch(() => ({})).then(j => {
        const m = String((j && j.message) || "");
        // the function's own messages are written for visitors; anything else stays out of sight
        throw new Error(/^(Please|Too many)/.test(m) ? m + "." : "");
      });
    });
  }

  function subscribe(email) {
    if (!window.MCCSite || !window.MCCSite.newsletter) return Promise.resolve({ ok: false });
    return window.MCCSite.newsletter(email).catch(() => ({ ok: false }));
  }

  function busy(on) {
    el.submit.disabled = on;
    el.submit.setAttribute("aria-busy", String(on));
    el.submit.textContent = on ? "Joining…" : "Join the club";
  }

  function showDone(name, newsletter) {
    const card = form.parentNode;
    const done = document.createElement("div");
    done.className = "join-done";
    done.tabIndex = -1;
    done.setAttribute("role", "status");
    done.innerHTML =
      '<svg class="seal" viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="34"/><path d="M24 39.5 34 49l19-21"/></svg>' +
      '<h2></h2><p></p>' +
      '<div class="actions"><a class="btn" href="events.html">See what\'s on</a>' +
      '<a class="btn ghost" href="https://www.instagram.com/mcc_uoft/" target="_blank" rel="noopener">Follow @mcc_uoft</a></div>';
    done.querySelector("h2").textContent = "Welcome to MCC, " + name + ".";
    const p = done.querySelector("p");
    if (!newsletter) {
      p.textContent = "You're on the member list.";
    } else if (newsletter.ok) {
      p.append("You're on the member list. To get the newsletter, confirm from the email we just sent to ");
      const b = document.createElement("b"); b.textContent = newsletter.email; p.append(b, ".");
    } else {
      p.textContent = "You're on the member list. The newsletter sign-up didn't go through; you can try it again at the bottom of this page.";
    }
    form.remove();
    card.appendChild(done);
    done.focus({ preventScroll: true });
    // The page just got much shorter. Once it has settled, bring the card back under the nav.
    const settle = () => {
      const top = card.getBoundingClientRect().top;
      if (top < 80 || top > window.innerHeight - 200) window.scrollTo({ top: Math.max(0, window.scrollY + top - 96), behavior: "auto" });
    };
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 500);     // again, in case a scroll was already under way
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (el.submit.disabled) return;
    el.msg.textContent = "";

    const bad = ORDER.filter(key => !check(key));
    if (bad.length) { focusField(bad[0]); return; }

    const name = clean(el.pref.value) || clean(el.first.value);
    const email = el.email.value.trim();
    const wantsNews = el.nl.checked;
    const newsEmail = (!el.nlAlt.hidden && el.nlEmail.value.trim()) || email;
    const aff = picked("affiliation");

    busy(true);
    // bots fill in the hidden box: they get the same ending and nothing is sent
    const joined = form.website.value ? Promise.resolve() : send({
      p_first_name: clean(el.first.value),
      p_last_name: clean(el.last.value),
      p_preferred_name: clean(el.pref.value) || null,
      p_email: email,
      p_affiliation: aff,
      p_utorid: isStudent() ? el.utorid.value.trim().toLowerCase() : null,
      p_student_number: isStudent() ? el.snum.value.replace(/[\s-]/g, "") : null,
      p_year_of_study: aff === "undergrad" ? picked("year_of_study") : null,
      p_ideas: el.ideas.value.trim() || null,
      p_newsletter: wantsNews,
    });

    joined
      .then(() => (wantsNews && !form.website.value)
        ? subscribe(newsEmail).then(res => ({ ok: !!res.ok, email: newsEmail }))
        : null)
      .then(newsletter => showDone(name, newsletter))
      .catch(err => {
        busy(false);
        el.msg.textContent = (err && err.message && err.message !== "timeout" && err.message !== "not configured" && !/fetch|network|load failed/i.test(err.message))
          ? err.message
          : (navigator.onLine === false
              ? "You're offline. Your answers are still here; try again once you're connected."
              : "That didn't send. Your answers are still here; try again in a moment.");
      });
  });
})();
