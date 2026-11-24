/* Join the Club form (join.html): one question at a time.
 *
 * Sends the answers through MCCSite.join (js/site.js) to the database function join_club()
 * (supabase/members-4-join.sql). The checks here are for the visitor's benefit; the function
 * repeats every one of them, and the database decides what is stored.
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
    name: $("j-name"), pref: $("j-pref"), email: $("j-email"),
    aff: $("j-aff"), utorid: $("j-utorid"), snum: $("j-snum"), year: $("j-year"), ideas: $("j-ideas"),
    nl: $("j-nl"), nlMore: $("j-nl-more"), nlTo: $("j-nl-to"), nlAddr: $("j-nl-addr"),
    nlSwitch: $("j-nl-switch"), nlAlt: $("j-nl-alt"), nlEmail: $("j-nl-email"),
    msg: $("j-msg"), next: $("j-next"), back: $("j-back"), privacy: $("j-privacy"),
    bar: $("j-bar"), count: $("j-count"),
  };

  const clean = s => String(s || "").trim().replace(/\s+/g, " ");
  // "moarz" -> "Moarz", "NAING LIN KHANT" -> "Naing Lin Khant". Only a name typed all in one case
  // is touched: "McKay" or "van der Berg" was typed that way on purpose.
  const nameCase = raw => {
    const s = clean(raw);
    if (s === s.toLowerCase() && s === s.toUpperCase()) return s;      // no cased letters (e.g. Burmese script)
    if (s !== s.toLowerCase() && s !== s.toUpperCase()) return s;      // mixed case: leave it
    return s.toLowerCase().replace(/(^|[\s\-'\u2019])(\p{L})/gu, (m, before, letter) => before + letter.toUpperCase());
  };
  const picked = name => { const r = form.querySelector('input[name="' + name + '"]:checked'); return r ? r.value : ""; };
  const isStudent = () => STUDENT.includes(picked("affiliation"));

  /* ---------- Rules: each returns an error message, or "" ---------- */
  const rules = {
    name: () => clean(el.name.value) ? "" : "Enter your name",
    email: () => {
      const v = el.email.value.trim();
      if (!v) return "Enter your email";
      return EMAIL.test(v) ? "" : "Enter an email like name@example.com";
    },
    aff: () => picked("affiliation") ? "" : "Choose one",
    utorid: () => {
      const v = el.utorid.value.trim();
      if (!v) return "Enter your UTORid";
      if (v.includes("@")) return "Your UTORid is the short login name, not an email";
      return /^[a-z0-9]{3,8}$/i.test(v) ? "" : "A UTORid is 3 to 8 letters and numbers";
    },
    snum: () => {
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

  // Text boxes carry aria-invalid themselves; the two groups of pills are marked on their row.
  function errNode(key) { return $(el[key].id + "-err"); }
  function setError(key, text) {
    const node = el[key], pills = node.querySelector(".pills");
    errNode(key).textContent = text;
    errNode(key).classList.remove("hint");
    if (pills) pills.classList.toggle("is-invalid", !!text);
    else if (text) { node.setAttribute("aria-invalid", "true"); node.setAttribute("aria-describedby", node.id + "-err"); }
    else { node.removeAttribute("aria-invalid"); node.removeAttribute("aria-describedby"); }
    return !text;
  }
  function check(key) { return setError(key, rules[key]()); }
  function focusField(key) {
    const node = el[key];
    (node.matches("input, textarea") ? node : node.querySelector("input:checked, input")).focus();
  }

  // A field is checked when you leave it, then on every keystroke until it's right.
  ["name", "email", "utorid", "snum", "nlEmail"].forEach(key => {
    const input = el[key];
    input.addEventListener("blur", () => { if (input.value.trim()) check(key); });
    input.addEventListener("input", () => { if (input.getAttribute("aria-invalid")) check(key); });
  });
  el.aff.addEventListener("change", () => { check("aff"); el.year.hidden = picked("affiliation") !== "undergrad"; progress(); });
  el.year.addEventListener("change", () => check("year"));

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

  // The ideas box grows a line at a time as it fills.
  const grow = () => { el.ideas.style.height = "auto"; el.ideas.style.height = el.ideas.scrollHeight + 2 + "px"; };
  el.ideas.addEventListener("input", grow);

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

  /* ---------- Steps ---------- */
  const STEPS = {
    name: ["name"],
    aff: ["aff"],
    student: ["utorid", "snum", "year"],       // only shown to current students
    contact: ["email", "nlEmail"],
    ideas: [],
  };
  const stepNode = name => form.querySelector('.step[data-step="' + name + '"]');
  // Until the connection question is answered, count the student step: the total can only shrink.
  const path = () => Object.keys(STEPS).filter(s => s !== "student" || isStudent() || !picked("affiliation"));
  let current = "name";

  function progress() {
    const steps = path(), i = steps.indexOf(current);
    el.bar.firstElementChild.style.width = ((i + 1) / steps.length * 100) + "%";
    el.bar.setAttribute("aria-valuenow", String(i + 1));
    el.bar.setAttribute("aria-valuemax", String(steps.length));
    el.count.textContent = (i + 1) + " of " + steps.length;
  }

  function show(name, dir) {
    const steps = path(), i = steps.indexOf(name), last = i === steps.length - 1;
    Object.keys(STEPS).forEach(s => { stepNode(s).hidden = s !== name; });
    const node = stepNode(name);
    if (dir) {
      node.classList.remove("is-fwd", "is-back");
      void node.offsetWidth;                    // restart the slide when the same step is shown again
      node.classList.add(dir > 0 ? "is-fwd" : "is-back");
    }
    current = name;
    el.msg.textContent = "";
    el.year.hidden = picked("affiliation") !== "undergrad";
    progress();
    el.next.textContent = last ? "Join the club" : "Continue";
    el.back.hidden = i === 0;
    el.privacy.hidden = !last;
    if (!dir) return;
    // Straight into the answer: the first box, or the chosen pill. The question is the group's name.
    const first = node.querySelector("input:checked, input:not([type=radio]):not([type=checkbox]), textarea, input");
    if (first) first.focus({ preventScroll: true });
    if (name === "ideas") grow();
    const top = $("join").getBoundingClientRect().top;
    if (top < 70) window.scrollTo({ top: window.scrollY + top - 96, behavior: "auto" });
  }

  function validStep(name) {
    const bad = STEPS[name].filter(key => !check(key));
    if (bad.length) focusField(bad[0]);
    return !bad.length;
  }

  el.back.addEventListener("click", () => {
    const steps = path(), i = steps.indexOf(current);
    if (i > 0) show(steps[i - 1], -1);
  });

  // The browser can restore answers after Back or a reload; make the page match them.
  el.nlMore.hidden = !el.nl.checked;
  syncNewsletterAddress();
  show("name", 0);

  /* ---------- Sending ---------- */
  // site.js owns the request (MCCSite.join), so this page and the Ask MCC join card send the same way.
  function send(data) {
    if (!window.MCCSite || !window.MCCSite.join) return Promise.reject(new Error(""));
    return window.MCCSite.join(data).then(r => { if (!r.ok) throw new Error(r.message || ""); });
  }

  function subscribe(email) {
    if (!window.MCCSite || !window.MCCSite.newsletter) return Promise.resolve({ ok: false });
    return window.MCCSite.newsletter(email).catch(() => ({ ok: false }));
  }

  function busy(on) {
    el.next.disabled = on;
    el.back.disabled = on;
    el.next.setAttribute("aria-busy", String(on));
    el.next.textContent = on ? "Joining…" : "Join the club";
  }

  function showDone(name, newsletter) {
    const panel = form.parentNode;
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
    panel.appendChild(done);
    done.focus({ preventScroll: true });
    const settle = () => {
      const top = panel.getBoundingClientRect().top;
      if (top < 70 || top > window.innerHeight - 200) window.scrollTo({ top: Math.max(0, window.scrollY + top - 96), behavior: "auto" });
    };
    requestAnimationFrame(() => requestAnimationFrame(settle));
    setTimeout(settle, 500);     // again, in case a scroll was already under way
  }

  // Enter in any box and the Continue button both land here.
  form.addEventListener("submit", e => {
    e.preventDefault();
    if (el.next.disabled) return;
    el.msg.textContent = "";
    if (!validStep(current)) return;

    const steps = path(), i = steps.indexOf(current);
    if (i < steps.length - 1) { show(steps[i + 1], 1); return; }

    // Last step. Everything was checked on the way here; check again in case an earlier answer changed.
    const broken = steps.find(s => STEPS[s].some(key => rules[key]()));
    if (broken) { show(broken, -1); validStep(broken); return; }

    const name = nameCase(el.pref.value) || nameCase(el.name.value);
    const email = el.email.value.trim();
    const wantsNews = el.nl.checked;
    const newsEmail = (!el.nlAlt.hidden && el.nlEmail.value.trim()) || email;
    const aff = picked("affiliation");

    busy(true);
    // bots fill in the hidden box: they get the same ending and nothing is sent
    const joined = form.website.value ? Promise.resolve() : send({
      p_full_name: nameCase(el.name.value),
      p_preferred_name: nameCase(el.pref.value) || null,
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
        el.msg.textContent = (err && err.message)
          ? err.message
          : (navigator.onLine === false
              ? "You're offline. Your answers are still here; try again once you're connected."
              : "That didn't send. Your answers are still here; try again in a moment.");
      });
  });
})();
