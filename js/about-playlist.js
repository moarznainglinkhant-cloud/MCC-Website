// About page: "songs i played in my head during surgery" — LuLu's profile band.
// Used when a person has bg: "playlist" and a `playlist` entry in TEAM_EXTRAS (about.html).
//
// The band is her view from the operating table during eye surgery: looking up into the
// surgical lamp on theatre teal. Her playlist's songs come into focus one at a time, in order,
// the way eyes refocus, while the lamp sharpens with them; then everything softens and the
// next song comes in. Links to the real playlist. CSS transitions only (opacity + a short blur
// on one line of text); no canvas, nothing runs between songs. Reduced motion: plain fades.
(function () {
  var run = null;
  var HOLD = 4200, IN = 900, OUT = 700;

  function lampSVG(id) {
    var b = "";
    for (var i = 0; i < 6; i++) {
      var a = i / 6 * Math.PI * 2 - Math.PI / 2;
      b += '<circle cx="' + (75 + Math.cos(a) * 36).toFixed(1) + '" cy="' + (75 + Math.sin(a) * 36).toFixed(1) + '" r="14"/>';
    }
    return '<svg viewBox="0 0 150 150" aria-hidden="true"><defs>' +
      '<radialGradient id="plb' + id + '"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".55" stop-color="#F3FFFA"/>' +
      '<stop offset=".85" stop-color="#CDEDE2" stop-opacity=".9"/><stop offset="1" stop-color="#9FD3C3" stop-opacity=".55"/></radialGradient>' +
      '<radialGradient id="plh' + id + '"><stop offset="0" stop-color="#EFFFF8" stop-opacity=".55"/><stop offset="1" stop-color="#EFFFF8" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="75" cy="75" r="74" fill="url(#plh' + id + ')"/>' +
      '<circle cx="75" cy="75" r="64" fill="rgba(10,40,38,.35)" stroke="rgba(235,250,244,.25)" stroke-width="2"/>' +
      '<circle cx="75" cy="75" r="56" fill="none" stroke="rgba(235,250,244,.10)" stroke-width="1"/>' +
      '<g fill="url(#plb' + id + ')">' + b + '<circle cx="75" cy="75" r="15"/></g></svg>';
  }

  function stop() {
    if (!run) return;
    run.alive = false;
    run.timers.forEach(clearTimeout);
    run = null;
  }

  function start(band, pl) {
    stop();
    if (!pl || !pl.tracks || !pl.tracks.length) return false;
    var r = { alive: true, timers: [] };
    run = r;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var n = pl.tracks.length, pad = function (x) { return (x < 10 ? "0" : "") + x; };

    band.insertAdjacentHTML("beforeend",
      '<div class="pl-lamp" aria-hidden="true"><div class="pl-soft">' + lampSVG("s") + '</div><div class="pl-sharp">' + lampSVG("f") + '</div></div>' +
      '<div class="pl-now">' +
        '<span class="pl-k">' + (pl.label || "playing in my head") + '</span>' +
        '<div class="pl-song" aria-live="off"><b class="pl-t"></b><span class="pl-a"></span></div>' +
        '<div class="pl-bar" aria-hidden="true"><i></i></div>' +
        '<span class="pl-foot"><span class="pl-n"></span> &middot; <a class="pl-link" target="_blank" rel="noopener"></a></span>' +
      '</div>');
    var q = function (s) { return band.querySelector(s); };
    var lamp = q(".pl-lamp"), song = q(".pl-song"), bar = q(".pl-bar i");
    var link = q(".pl-link");
    link.href = pl.url;
    link.textContent = "listen ↗";
    link.setAttribute("aria-label", "Listen to “" + pl.title + "” on Spotify");
    band.classList.toggle("pl-reduce", !!reduce);

    function later(fn, ms) { r.timers.push(setTimeout(function () { if (r.alive) fn(); }, ms)); }

    function show(i) {
      var t = pl.tracks[i];
      q(".pl-t").textContent = t[0];
      q(".pl-a").textContent = t[1];
      q(".pl-n").textContent = pad(i + 1) + " / " + pad(n);
      bar.style.transition = "none"; bar.style.width = "0%";
      void bar.offsetWidth;                       // restart the bar
      song.classList.add("in"); lamp.classList.add("focus");
      bar.style.transition = "width " + (IN + HOLD) + "ms linear"; bar.style.width = "100%";
      later(function () {
        song.classList.remove("in"); lamp.classList.remove("focus");
        later(function () { show((i + 1) % n); }, OUT);
      }, IN + HOLD);
    }
    later(function () { show(0); }, 250);
    return true;
  }

  window.MCCPlaylist = { start: start, stop: stop };
})();
