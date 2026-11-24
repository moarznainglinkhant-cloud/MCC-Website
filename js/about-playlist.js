// About page: LuLu's profile band, her real playlist "songs i played in my head during surgery",
// drawn like a Spotify playlist. Used when a person has bg: "playlist" and a `playlist` entry in
// TEAM_EXTRAS (about.html).
//
// Header: cover (plain music-note tile), title, owner and song count, and a
// green play button that opens the playlist on Spotify. Below: three track rows. The playing
// song is green with an equalizer, and the list moves down the playlist one song at a time,
// keeping the playing row in view, then starts over. CSS transitions and one small keyframe
// animation; stops when the card closes. Reduced motion: no scrolling or bouncing, songs still change.
(function () {
  var run = null;
  var STEP = 3400; // ms per song
  var VISIBLE = 3;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // Cover: the plain music-note tile a playlist shows when it has no picture.
  var NOTE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18.5a2.5 2.5 0 1 1-2-2.45V5.5l11-2v11.5a2.5 2.5 0 1 1-2-2.45V7.1l-7 1.3z"/></svg>';

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
    var n = pl.tracks.length;

    var rows = pl.tracks.map(function (t, i) {
      return '<li class="pl-row"><span class="pl-num"><i>' + (i + 1) + '</i><span class="pl-eq" aria-hidden="true"><b></b><b></b><b></b></span></span>' +
        '<span class="pl-txt"><span class="pl-t">' + esc(t[0]) + '</span><span class="pl-a">' + esc(t[1]) + '</span></span></li>';
    }).join("");
    band.insertAdjacentHTML("beforeend",
      '<div class="pl-wrap"><div class="pl-head">' +
        '<div class="pl-cover">' + NOTE + '</div>' +
        '<div class="pl-meta"><b class="pl-title">' + esc(pl.title) + '</b>' +
          '<span class="pl-by"><b>' + esc(pl.owner || "") + '</b>' + (pl.owner ? " &middot; " : "") + n + ' songs</span></div>' +
        '<a class="pl-play" href="' + esc(pl.url) + '" target="_blank" rel="noopener" aria-label="Play “' + esc(pl.title) + '” on Spotify">' +
          '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10.5-6.5z"/></svg></a>' +
      '</div>' +
      '<div class="pl-list" aria-hidden="true"><ol class="pl-rows">' + rows + '</ol></div></div>');
    band.classList.toggle("pl-reduce", !!reduce);

    var list = band.querySelector(".pl-rows"), items = list.children;
    function later(fn, ms) { r.timers.push(setTimeout(function () { if (r.alive) fn(); }, ms)); }

    function play(i) {
      for (var k = 0; k < n; k++) items[k].classList.toggle("on", k === i);
      var h = items[0].offsetHeight || 32;
      var top = Math.max(0, Math.min(i - 1, n - VISIBLE)); // keep the playing row in the middle when possible
      list.style.transform = "translateY(" + (-top * h) + "px)";
      later(function () { play((i + 1) % n); }, STEP);
    }
    play(0);
    return true;
  }

  window.MCCPlaylist = { start: start, stop: stop };
})();
