// Public "Newsletter" page (newsletter.html).
// Reads published issues straight from Supabase (same project the exec area
// uses -- js/exec-config.js's URL/key are safe to be public, Row Level
// Security is what keeps drafts private). Each issue's actual text lives in
// a Google Doc; this page fetches that doc's "Publish to web" HTML and
// renders a stripped, re-styled copy of it on the site itself, so a visitor
// never sees Google Docs at all.
(function () {
  "use strict";

  function $(id) { return document.getElementById(id); }

  var cfg = window.MCC_EXEC_CONFIG || {};
  var configured = cfg.url && cfg.key && window.supabase;

  function formatDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    return d.toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" });
  }

  function showArticleView(show) {
    $("nl-list-wrap").closest("section").hidden = show;
    $("newsletter-article").hidden = !show;
  }

  // Google's published HTML wraps the real content in #contents .doc-content,
  // with an inline <style> above it that reuses generic classes (c0, c1, title,
  // subtitle, ...) for the doc's own formatting. We don't want that styling --
  // the site's own CSS should control how it looks -- so this keeps the tag
  // structure (headings, paragraphs, links, lists, images) and strips classes
  // and inline styles, after first promoting the doc's Title paragraph to a
  // real <h1> and tagging the Subtitle paragraph so CSS can still style it.
  function sanitizeDocContent(root) {
    root.querySelectorAll("p.subtitle").forEach(function (p) {
      p.setAttribute("data-nl", "subtitle");
    });
    root.querySelectorAll("p.title").forEach(function (p) {
      var h = root.ownerDocument.createElement("h1");
      h.innerHTML = p.innerHTML;
      p.replaceWith(h);
    });

    // Google rewrites links through a "www.google.com/url?q=..." redirect --
    // unwrap that back to the real target.
    root.querySelectorAll("a[href]").forEach(function (a) {
      try {
        var u = new URL(a.getAttribute("href"), location.href);
        if (u.hostname === "www.google.com" && u.pathname === "/url" && u.searchParams.get("q")) {
          a.setAttribute("href", u.searchParams.get("q"));
        }
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
      } catch (e) { /* leave it as-is */ }
    });

    root.querySelectorAll("*").forEach(function (el) {
      el.removeAttribute("style");
      if (el.tagName !== "A" && el.tagName !== "IMG") el.removeAttribute("class");
      el.removeAttribute("id");
    });
    root.removeAttribute("id");
    return root;
  }

  function renderList() {
    var stateEl = $("nl-pub-list-state"), emptyEl = $("nl-pub-empty"), listEl = $("nl-pub-list");
    window.MCC_SUPABASE.from("newsletters")
      .select("id, name, updated_at, publish_link")
      .order("updated_at", { ascending: false })
      .then(function (r) {
        if (r.error) { stateEl.textContent = "Couldn't load the newsletter list right now."; return; }
        var rows = (r.data || []).filter(function (n) { return n.publish_link; });
        stateEl.hidden = true;
        if (!rows.length) { emptyEl.hidden = false; return; }
        rows.forEach(function (n) {
          var li = document.createElement("li");
          li.className = "nl-pub-row";
          var a = document.createElement("a");
          a.className = "nl-pub-name";
          a.href = "newsletter.html?id=" + encodeURIComponent(n.id);
          a.textContent = n.name;
          var meta = document.createElement("span");
          meta.className = "nl-pub-meta";
          meta.textContent = "Updated " + formatDate(n.updated_at);
          li.appendChild(a);
          li.appendChild(meta);
          listEl.appendChild(li);
        });
        listEl.hidden = false;
      })
      .catch(function () { stateEl.textContent = "Couldn't reach the server."; });
  }

  function renderIssue(id) {
    showArticleView(true);
    var stateEl = $("nl-article-state"), bodyWrap = $("nl-article-body-wrap");
    window.MCC_SUPABASE.from("newsletters")
      .select("id, name, updated_at, publish_link")
      .eq("id", id)
      .maybeSingle()
      .then(function (r) {
        if (r.error || !r.data) { stateEl.textContent = "That newsletter isn't available."; return null; }
        var row = r.data;
        if (!row.publish_link) { stateEl.textContent = "This issue hasn't been published yet."; return null; }
        document.title = row.name + " — Newsletter — Myanmar Culture Club";
        $("nl-article-title").textContent = row.name;
        $("nl-article-meta").textContent = "Updated " + formatDate(row.updated_at);
        return fetch(row.publish_link).then(function (resp) {
          if (!resp.ok) throw new Error("fetch failed: " + resp.status);
          return resp.text();
        });
      })
      .then(function (html) {
        if (html == null) return;
        var parsed = new DOMParser().parseFromString(html, "text/html");
        var root = parsed.querySelector("#contents .doc-content") || parsed.querySelector("#contents");
        if (!root) throw new Error("couldn't find the document's content");
        sanitizeDocContent(root);
        bodyWrap.innerHTML = "";
        bodyWrap.appendChild(document.importNode(root, true));
        stateEl.hidden = true;
      })
      .catch(function () {
        stateEl.textContent = "Couldn't load this newsletter right now.";
      });
  }

  if (!configured) {
    $("nl-pub-list-state").textContent = "The newsletter isn't connected yet.";
    return;
  }
  window.MCC_SUPABASE = window.supabase.createClient(cfg.url, cfg.key);

  var params = new URLSearchParams(location.search);
  var id = params.get("id");
  if (id) renderIssue(id); else renderList();
})();
