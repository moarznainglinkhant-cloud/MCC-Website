/* Learn Burmese page (learn.html). Needs js/learn-data.js loaded first.
   Part 1: MCC_TRANSLIT turns a name typed in English letters into a Burmese spelling.
   Part 2: the alphabet chart, the tracing pad and the "write your name" line.
   If you add spellings to DICT that use a new letter+mark combination, the stroke data must be regenerated. */
/* Roman letters -> Burmese spelling, by sound. Approximate on purpose: a dictionary of common
   Burmese and English names first, then spelling rules. Returns a Burmese string per word. */
var MCC_TRANSLIT = (function () {
  var DICT = {
    // Burmese names typed in English letters
    aung:"အောင်", kyaw:"ကျော်", min:"မင်း", thu:"သူ", zaw:"ဇော်", htet:"ထက်", hla:"လှ", myo:"မျိုး", naing:"နိုင်",
    lin:"လင်း", lynn:"လင်း", khant:"ခန့်", win:"ဝင်း", soe:"စိုး", moe:"မိုး", nyein:"ငြိမ်း", thiri:"သီရိ", su:"စု", mya:"မြ",
    khin:"ခင်", zin:"ဇင်", phyo:"ဖြိုး", ko:"ကို", tun:"ထွန်း", htun:"ထွန်း", kyi:"ကြည်", san:"စန်း", thida:"သီတာ", ei:"အိ",
    hnin:"နှင်း", wai:"ဝေ", yan:"ရန်", paing:"ပိုင်", htoo:"ထူး", thant:"သန့်", may:"မေ", pyae:"ပြည့်", phyu:"ဖြူ", oo:"ဦး",
    maung:"မောင်", myat:"မြတ်", thet:"သက်", hein:"ဟိန်း", kaung:"ကောင်း", shwe:"ရွှေ", yee:"ရီ", nwe:"နွယ်", thin:"သင်း",
    aye:"အေး", mon:"မွန်", swe:"ဆွေ", nay:"နေ", lwin:"လွင်", tin:"တင်", than:"သန်း", myint:"မြင့်", sein:"စိန်", thein:"သိန်း",
    ohn:"အုန်း", yu:"ယု", chit:"ချစ်", ngwe:"ငွေ", nu:"နု", thaw:"သော်", zar:"ဇာ", ni:"နီ", lay:"လေး", gyi:"ကြီး", cho:"ချို",
    pwint:"ပွင့်", yi:"ရည်", mu:"မူ", nilar:"နီလာ", thuzar:"သူဇာ", zeyar:"ဇေယျာ", yadanar:"ရတနာ", moarz:"မိုးဇ်", ma:"မ", daw:"ဒေါ်",
    thandar:"သန်တာ", wint:"ဝင့်", thwe:"သွေး", htay:"ဌေး", tint:"တင့်", nyo:"ညို", nyi:"ညီ", toe:"တိုး", hlaing:"လှိုင်",
    khaing:"ခိုင်", pyone:"ပြုံး", phone:"ဘုန်း", pyay:"ပြည့်", sandi:"စန်ဒီ", hsu:"ဆု", shein:"ရှိန်း", shin:"ရှင်", thura:"သူရ",
    zayar:"ဇေယျာ", wunna:"ဝဏ်ဏ", myanmar:"မြန်မာ", mingalabar:"မင်ဂလာပါ",
    // common English names
    sarah:"ဆာရာ", sara:"ဆာရာ", john:"ဂျွန်", michael:"မိုက်ကယ်", david:"ဒေးဗစ်", james:"ဂျိမ်းစ်", mary:"မေရီ", peter:"ပီတာ",
    paul:"ပေါလ်", george:"ဂျော့ချ်", tom:"တွမ်", brian:"ဘရိုင်ယန်", bryan:"ဘရိုင်ယန်", kevin:"ကီဗင်", daniel:"ဒန်နီယယ်",
    jennifer:"ဂျနီဖာ", emma:"အမ်မာ", anna:"အန်နာ", alice:"အဲလစ်", chris:"ခရစ်", mike:"မိုက်", jack:"ဂျက်", ben:"ဘန်", sam:"ဆမ်",
    alex:"အဲလက်စ်", lisa:"လီဆာ", linda:"လင်ဒါ", maria:"မာရီယာ", robert:"ရောဘတ်", william:"ဝီလျံ", henry:"ဟင်နရီ",
    thomas:"သောမတ်စ်", susan:"ဆူဇန်", jessica:"ဂျက်ဆီကာ", emily:"အမ်မလီ", andrew:"အင်ဒရူး", ryan:"ရိုင်ယန်", jason:"ဂျေဆန်",
    steve:"စတိဗ်", joe:"ဂျိုး", kate:"ကိတ်", jane:"ဂျိန်း", amy:"အေမီ", eric:"အဲရစ်", mark:"မတ်ခ်", matt:"မက်", nick:"နစ်", toronto:"တိုရွန်တို"
  };
  var ONSET = { tch:"ချ", ch:"ချ", sh:"ရှ", th:"သ", ph:"ဖ", kh:"ခ", gh:"ဂ", wh:"ဝ", zh:"ဇ", ng:"င", ny:"ည", ck:"က", qu:"ကွ",
    b:"ဘ", c:"က", d:"ဒ", f:"ဖ", g:"ဂ", h:"ဟ", j:"ဂျ", k:"က", l:"လ", m:"မ", n:"န", p:"ပ", q:"က", r:"ရ", s:"ဆ", t:"တ",
    v:"ဗ", w:"ဝ", x:"ဇ", y:"ယ", z:"ဇ" };
  var CODA = { n:"N", m:"M", ng:"NG", k:"K", ck:"K", c:"K", q:"K", x:"K", t:"T", p:"P", l:"L" };
  var CODA_LETTER = { N:"န", M:"မ", NG:"င", K:"က", T:"တ", P:"ပ", L:"လ", d:"ဒ", b:"ဘ", g:"ဂ", f:"ဖ", ph:"ဖ", v:"ဗ", s:"စ", z:"ဇ",
    th:"သ", sh:"ရှ", ch:"ချ", tch:"ချ", j:"ဂျ", gh:"ဖ", zh:"ဇ", kh:"ခ", ny:"ည" };
  var SHORT = { open:"ာ", N:"န်", M:"မ်", NG:"န်", K:"က်", T:"က်", P:"ပ်", L:"ယ်", fb:"က်" };
  var RIME = {
    A: SHORT, E: { open:"ီ", N:"န်", M:"မ်", NG:"န်", K:"က်", T:"က်", P:"ပ်", L:"ယ်", fb:"က်" },
    AA: { open:"ာ", fb:"ာ" },
    I: { open:"ီ", N:"င်", M:"ိမ်", NG:"င်", K:"စ်", T:"စ်", L:"ီလ်", fb:"စ်" },
    EE: { open:"ီ", N:"င်း", M:"ိမ်း", fb:"ီ" },
    OO: { open:"ူ", N:"ွန်း", M:"ွမ်း", fb:"ု" },
    AY: { open:"ေ", N:"ိန်း", M:"ိမ်း", K:"ိတ်", T:"ိတ်", P:"ိပ်", L:"ေးလ်", fb:"ေ" },
    AI: { open:"ိုင်", N:"ိုင်", M:"ိုင်မ်", K:"ိုက်", T:"ိုက်", L:"ိုင်လ်", fb:"ိုက်" },
    O: { open:"ို", N:"ွန်", M:"ွမ်", NG:"ောင်", K:"ောက်", L:"ောလ်", fb:"ော့" },
    OH: { open:"ို", N:"ုန်း", M:"ုမ်း", L:"ိုးလ်", fb:"ို" },
    AW: { open:"ော", fb:"ော" },
    OW: { open:"ောင်", N:"ောင်း", fb:"ောင်" },
    OI: { open:"ွိုင်", fb:"ွိုင်" }
  };
  var VG = ["eigh","augh","ough","igh","aye","eau","ai","ay","au","aw","ar","ah","ea","ee","ei","ey","er","eu","ew","ie","ir",
    "oa","oe","oh","oi","oo","or","ou","ow","oy","ue","ui","ur","uy","a","e","i","o","u","y"];
  var VCLASS = { eigh:"AY", augh:"AW", ough:"AW", igh:"AI", aye:"AY", eau:"OH", ai:"AY", ay:"AY", au:"AW", aw:"AW", ar:"AA", ah:"AA",
    ea:"EE", ee:"EE", ei:"AY", ey:"AY", er:"AA", eu:"OO", ew:"OO", ie:"EE", ir:"AA", oa:"OH", oe:"OH", oh:"OH", oi:"OI", oo:"OO",
    or:"AW", ou:"OO", ow:"OW", oy:"OI", ue:"OO", ui:"OO", ur:"AA", uy:"AI" };
  var CG = ["tch","ch","sh","th","ph","kh","gh","wh","zh","ng","ny","ck","qu"];
  var TALL = "ခဂငဒပဝ";
  function isV(c) { return c !== undefined && "aeiou".indexOf(c) >= 0; }

  function tokens(w) {
    var magic = null, m = /^(.*[^aeiouy])?([aeiouy])(tch|ch|sh|th|ck|ph|[^aeiouy])e(s?)$/.exec(w);
    if (m && w.length > 3) { magic = (m[1] || "").length; w = (m[1] || "") + m[2] + m[3] + m[4]; }
    else if (/[^aeiouy]e$/.test(w) && /[aeiouy]/.test(w.slice(0, -2))) w = w.slice(0, -1);   // silent final e
    w = w.replace(/([^aeiouy])\1+$/, "$1");                                                    // doubled last letter
    var out = [], i = 0, k, g;
    while (i < w.length) {
      var c = w[i], nx = w[i + 1], vowelY = c === "y" && !(isV(nx) && (i === 0 || isV(w[i - 1])));
      if (isV(c) || vowelY) {
        g = null;
        for (k = 0; k < VG.length; k++) {
          var v = VG[k];
          if (w.substr(i, v.length) !== v) continue;
          var last = v[v.length - 1], after = w[i + v.length];
          if (v.length > 1 && "rhwy".indexOf(last) >= 0 && isV(after)) continue;   // that letter starts the next syllable
          if (magic === i && v.length > 1) continue;
          g = v; break;
        }
        out.push({ v: g, at: i, magic: magic === i }); i += g.length;
      } else {
        g = c;
        for (k = 0; k < CG.length; k++) if (w.substr(i, CG[k].length) === CG[k]) { g = CG[k]; break; }
        if (g === "ny" && !isV(w[i + 2])) g = "n";
        if (g === "ng" && isV(w[i + 2]) && i > 0) g = "n";
        out.push({ c: g, soft: (c === "c" && g === "c" && "eiy".indexOf(nx) >= 0) }); i += g.length;
      }
    }
    return out;
  }
  function vclass(t, closed, final) {
    var v = t.v;
    if (t.magic) return { a:"AY", i:"AI", y:"AI", o:"OH", u:"OO", e:"EE" }[v];
    if (VCLASS[v]) { if (v === "ey" && final) return "EE"; if (v === "ow" && final) return "OH"; return VCLASS[v]; }
    if (v === "a") return closed ? "A" : "AA";
    if (v === "e") return closed ? "E" : "EE";
    if (v === "i") return closed ? "I" : "EE";
    if (v === "o") return closed ? "O" : "OH";
    if (v === "u") return closed ? "A" : "OO";
    return final ? "EE" : closed ? "I" : "AI";   // y
  }
  function onsetOf(t) { return t.soft ? "ဆ" : ONSET[t.c] || ""; }
  function tall(s) {
    var base = s[0], second = s[1];
    if (TALL.indexOf(base) >= 0 && (second === "ာ" || (second === "ေ" && s[2] === "ာ"))) return s.replace("ာ", "ါ");
    return s;
  }
  function join(on, r) {            // keep medials in a valid order when the rime brings its own "wa"
    if (r[0] === "ွ") { if (on.indexOf("ွ") >= 0) r = r.slice(1); else if (on.slice(-1) === "ှ") { on = on.slice(0, -1); r = "ွှ" + r.slice(1); } }
    return on + r;
  }
  function rules(w) {
    var T = tokens(w), out = "", i = 0, pendingOnset = null, n = T.length;
    function bare(list) { for (var k = 0; k < list.length; k++) { if (list[k].c === "h" && k > 0) continue; out += list[k].c === "s" ? "စ" : onsetOf(list[k]); } }
    function cluster(list) {       // consonants before a vowel -> bare syllables + the onset string
      if (!list.length) return null;
      list = list.filter(function (t, k) { return !(t.c === "h" && k > 0); });
      var last = list[list.length - 1], prev = list[list.length - 2];
      if (last.c === "w" && prev && onsetOf(prev).length === 1) { bare(list.slice(0, -2)); return onsetOf(prev) + "ွ"; }
      bare(list.slice(0, -1)); return onsetOf(last);
    }
    while (i < n) {
      var cons = []; while (i < n && T[i].c) cons.push(T[i++]);
      if (i >= n) { bare(cons); break; }                    // no vowel left
      var on = cluster(cons) || pendingOnset || "အ"; pendingOnset = null;
      var V = T[i++], R = []; while (i < n && T[i].c) R.push(T[i++]);
      var end = i >= n, coda = null, rest = [];
      R = R.filter(function (t) { return !(t.c === "h" && (end || R.length > 1)); });
      if (end) { coda = R[0] || null; rest = R.slice(1); }
      else if (R.length === 1) { if (R[0].c === "x" || R[0].c === "ck") { coda = R[0]; } else { i -= 1; } }
      else if (R.length >= 2) {
        var liquid = "rlw".indexOf(R[1].c) >= 0 && !CODA[R[0].c] && R[0].c !== "s" && R[0].c !== R[1].c;
        if (liquid) i -= R.length; else { coda = R[0]; i -= R.length - 1; }
      }
      if (coda && "wy".indexOf(coda.c) >= 0) coda = null;
      if (coda && coda.c === "r") coda = null;
      if (coda && !CODA[coda.c] && !CODA_LETTER[coda.c]) coda = null;
      var cls = vclass(V, !!coda, end && !coda), tbl = RIME[cls], syl;
      if (!coda) syl = join(on, tbl.open);
      else {
        var k = CODA[coda.c];
        if (k && tbl[k] !== undefined) syl = join(on, tbl[k]);
        else syl = join(on, tbl.fb) + (tbl.fb.slice(-1) === "်" && k ? "" : (CODA_LETTER[k || coda.c] || "") + "်");
        if (coda.c === "x") syl += "စ်";
        if (!k && tbl.fb === "က်" && "sz".indexOf(coda.c) < 0 && "dbg".indexOf(coda.c) >= 0) syl = on + (CODA_LETTER[coda.c]) + "်";
      }
      out += tall(syl);
      if (coda && !end && (coda.c === "x" || coda.c === "ck")) { /* next onset */ pendingOnset = coda.c === "x" ? "ဆ" : "က"; }
      for (var q = 0; q < rest.length; q++) { var L = CODA_LETTER[CODA[rest[q].c] || rest[q].c]; if (L) out += L + "်"; }
      if (!end && i < n && T[i].v && !pendingOnset) pendingOnset = /^(EE|I|AY|AI|OI|E)$/.test(cls) ? "ယ" : /^(OO|OH|OW|AW|O)$/.test(cls) ? "ဝ" : "အ";
    }
    return out;
  }
  function word(w) { w = w.toLowerCase().replace(/[^a-z]/g, ""); if (!w) return ""; return DICT[w] || rules(w); }
  function name(s) {
    if (/[က-႟]/.test(s)) return s.replace(/[^က-႟\s]/g, "").trim().split(/\s+/).filter(Boolean);
    return s.trim().split(/[\s\-_.]+/).map(word).filter(Boolean);
  }
  return { join: join, tall: tall, name: name, word: word, rules: rules, DICT: DICT, ONSET: ONSET, RIME: RIME, CODA_LETTER: CODA_LETTER };
})();

/* ---------- Learn Burmese page: alphabet chart, tracing pad, "write your name" ---------- */
(function () {
  "use strict";
  var D = window.MCC_STROKES;
  if (!D || !document.getElementById("lb-chart")) return;

  // letter, sound, traditional name (romanised), traditional name (Burmese)
  var LETTERS = [
    ["က","ka","ka gyi","ကကြီး"],["ခ","kha","kha gway","ခခွေး"],["ဂ","ga","ga nge","ဂငယ်"],["ဃ","gha","ga gyi","ဃကြီး"],["င","nga","nga","င"],
    ["စ","sa","sa lone","စလုံး"],["ဆ","hsa","hsa lein","ဆလိမ်"],["ဇ","za","za gwe","ဇကွဲ"],["ဈ","zha","za myin zwe","ဈမျဉ်းဆွဲ"],["ည","nya","nya","ည"],
    ["ဋ","ta","ta talin gyeik","ဋသန်လျင်းချိတ်"],["ဌ","hta","hta wun be","ဌဝမ်းဘဲ"],["ဍ","da","da yin gauk","ဍရင်ကောက်"],["ဎ","dha","da yay hmoke","ဎရေမှုတ်"],["ဏ","na","na gyi","ဏကြီး"],
    ["တ","ta","ta wun bu","တဝမ်းပူ"],["ထ","hta","hta hsin htu","ထဆင်ထူး"],["ဒ","da","da dway","ဒထွေး"],["ဓ","dha","da auk chaik","ဓအောက်ခြိုက်"],["န","na","na nge","နငယ်"],
    ["ပ","pa","pa zauk","ပစောက်"],["ဖ","pha","pha oo htoke","ဖဦးထုပ်"],["ဗ","ba","ba htet chaik","ဗထက်ခြိုက်"],["ဘ","bha","ba gone","ဘကုန်း"],["မ","ma","ma","မ"],
    ["ယ","ya","ya pet let","ယပက်လက်"],["ရ","ya","ya gauk","ရကောက်"],["လ","la","la","လ"],["ဝ","wa","wa","ဝ"],["သ","tha","tha","သ"],
    ["ဟ","ha","ha","ဟ"],["ဠ","la","la gyi","ဠကြီး"],["အ","a","a","အ"]
  ];
  var NS = "http://www.w3.org/2000/svg", MW = D.W * 1.5, TOL = 9, padN = 0;
  var CLUSTER = /[က-အဣ-ဪဿ][ါ-ှ]*/g;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  function el(n, a) { var e = document.createElementNS(NS, n); for (var k in a) e.setAttribute(k, a[k]); return e; }

  var cache = {};
  function glyph(g) { return cache[g] || (cache[g] = (D.G[g] || []).map(function (s) { return s.split(" ").map(function (p) { p = p.split(","); return [+p[0], +p[1]]; }); })); }
  function placed(g, dx, dy) { return glyph(g).map(function (s) { return s.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }); }
  function shapeOf(g, dx, dy) { return { d: D.O[g] || "", x: dx, y: dy }; }
  function letterSvg(ch) {               // the letter as its outline, so the chart matches the pad (no web font needed)
    var g = D.K[ch]; if (g == null) return ch;
    var b = bounds(glyph(g)), x = b.x0 - 9, w = b.x1 - b.x0 + 18;
    return '<svg class="lb-gsvg" viewBox="' + x + ' -58 ' + w + ' 104" style="aspect-ratio:' + (w / 104).toFixed(3) + '" aria-hidden="true"><path d="' + D.O[g] + '"/></svg>';
  }
  function bounds(strokes) {
    var b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 };
    strokes.forEach(function (s) { s.forEach(function (p) { if (p[0] < b.x0) b.x0 = p[0]; if (p[0] > b.x1) b.x1 = p[0]; if (p[1] < b.y0) b.y0 = p[1]; if (p[1] > b.y1) b.y1 = p[1]; }); });
    return b;
  }

  /* One writing pad. strokes: hidden centre-lines [[ [x,y], … ], …] in writing order (drive the "watch" demo).
     view: {x,y,w,h}. o.shapes: the letter outlines [{d,x,y}].
     "Your turn" is free writing: the visitor's own line is drawn as they write, green where it is inside the
     letter, red where it strays outside, checked live against the letter shape. Done = most of the letter
     covered and most of the line inside it. */
  var GOOD = "#2F8F5B", BAD = "#C2412F";
  var NEED_COVER = 0.82, NEED_INSIDE = 0.8;
  function Pad(host, strokes, view, o) {
    o = o || {};
    var L = strokes, mode = "idle", raf = 0, timer = 0, dead = false;
    var speed = o.speed || 20, gap = o.gap || 420;
    host.innerHTML = "";
    var seal = document.createElement("div"); seal.className = "lb-seal"; seal.textContent = "✓"; host.appendChild(seal);
    var svg = el("svg", { viewBox: [view.x, view.y, view.w, view.h].join(" "), role: "img", "aria-label": o.label || "Writing pad" });
    if (o.px) { svg.style.width = view.w * o.px + "px"; svg.style.height = view.h * o.px + "px"; }
    host.appendChild(svg);
    [D.BOT || 0, D.TOP].forEach(function (y) { svg.appendChild(el("line", { "class": "lb-rule", x1: view.x + 5, x2: view.x + view.w - 5, y1: y, y2: y })); });
    var pts = function (s) { return s.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" "); };
    // The demo: the real letter (Padauk Book outline) under a mask that the hidden strokes paint, so it fills in writing order.
    var shapes = o.shapes || [], mid = "lbm" + (++padN);
    var mask = el("mask", { id: mid, maskUnits: "userSpaceOnUse", x: view.x, y: view.y, width: view.w, height: view.h });
    var defs = el("defs", {}); defs.appendChild(mask); svg.appendChild(defs);
    var ghost = el("g", { "class": "lb-ghost" }), inkG = el("g", { "class": "lb-ink", mask: "url(#" + mid + ")" });
    shapes.forEach(function (sh) {
      var t = "translate(" + sh.x + " " + sh.y + ")";
      ghost.appendChild(el("path", { d: sh.d, transform: t })); inkG.appendChild(el("path", { d: sh.d, transform: t }));
    });
    svg.appendChild(ghost); svg.appendChild(inkG);
    var inks = L.map(function () { var p = el("polyline", { points: "", fill: "none", stroke: "#fff", "stroke-width": MW, "stroke-linecap": "round", "stroke-linejoin": "round" }); mask.appendChild(p); return p; });
    var mine = el("g", { "class": "lb-mine", "stroke-width": D.W * 0.55 }); svg.appendChild(mine);   // the visitor's own writing
    var pen = el("circle", { "class": "lb-pen", r: 1.7, opacity: 0 }); svg.appendChild(pen);

    function setInk(i, pr) {
      var s = L[i], n = Math.floor(pr), f = pr - n, a = s.slice(0, n + 1);
      if (f > 0 && n < s.length - 1) { var p = s[n], q = s[n + 1]; a.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]); }
      if (a.length === 1) a.push(a[0]);
      inks[i].setAttribute("points", pr > 0 ? pts(a) : "");
      return a[a.length - 1];
    }
    function full(i) { inks[i].setAttribute("points", pts(L[i].length > 1 ? L[i] : [L[i][0], L[i][0]])); }
    function clearDemo() { inks.forEach(function (p) { p.setAttribute("points", ""); }); inkG.setAttribute("mask", "url(#" + mid + ")"); }
    function whole() { inkG.removeAttribute("mask"); }
    function say(h) { if (o.status) o.status.innerHTML = h; }
    function stop() { cancelAnimationFrame(raf); clearTimeout(timer); pen.setAttribute("opacity", 0); }
    function follow(x) {
      if (!o.scroller) return;
      var left = (x - view.x) * (o.px || 1) - o.scroller.clientWidth * 0.35;
      try { o.scroller.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" }); } catch (e) { o.scroller.scrollLeft = Math.max(0, left); }
    }

    function watch() {
      stop(); clearDemo(); clearMine(); mode = "watch"; host.classList.remove("is-writing", "is-done");
      var i = 0, t0 = 0;
      say("Watch the pen. <b>" + L.length + " stroke" + (L.length > 1 ? "s" : "") + "</b>.");
      follow(L[0][0][0]);
      function step(now) {
        if (dead) return;
        if (!t0) t0 = now;
        var s = L[i], pr = Math.min(s.length - 1, (now - t0) / 1000 * speed), tip = setInk(i, pr);
        pen.setAttribute("cx", tip[0]); pen.setAttribute("cy", tip[1]); pen.setAttribute("opacity", 1);
        if (pr >= s.length - 1) {
          full(i); i++; t0 = 0;
          if (i >= L.length) { pen.setAttribute("opacity", 0); whole(); timer = setTimeout(write, 1100); return; }
          follow(L[i][0][0]);
          timer = setTimeout(function () { raf = requestAnimationFrame(step); }, gap); return;
        }
        raf = requestAnimationFrame(step);
      }
      timer = setTimeout(function () { raf = requestAnimationFrame(step); }, 350);
    }

    /* ---- free writing, checked against the letter shape ---- */
    var K = 4, cw = Math.ceil(view.w * K), ch = Math.ceil(view.h * K);
    var hit = null, letterIdx = null, cov = null, covCtx = null;
    function canvas() { var c = document.createElement("canvas"); c.width = cw; c.height = ch; return c; }
    function buildHit() {                       // pixel maps of the letter: "inside" (with a little give) and the letter itself
      var c = canvas(), x = c.getContext("2d");
      x.setTransform(K, 0, 0, K, -view.x * K, -view.y * K);
      x.lineWidth = 2.4; x.lineJoin = "round"; x.fillStyle = x.strokeStyle = "#000";
      shapes.forEach(function (sh) { var p = new Path2D(sh.d); x.save(); x.translate(sh.x, sh.y); x.fill(p); x.stroke(p); x.restore(); });
      hit = x.getImageData(0, 0, cw, ch).data;
      x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, cw, ch); x.setTransform(K, 0, 0, K, -view.x * K, -view.y * K);
      shapes.forEach(function (sh) { x.save(); x.translate(sh.x, sh.y); x.fill(new Path2D(sh.d)); x.restore(); });
      var d = x.getImageData(0, 0, cw, ch).data, idx = [];
      for (var yy = 0; yy < ch; yy += 2) for (var xx = 0; xx < cw; xx += 2) if (d[(yy * cw + xx) * 4 + 3] > 128) idx.push(yy * cw + xx);
      letterIdx = idx;
      cov = canvas(); covCtx = cov.getContext("2d");
      covCtx.setTransform(K, 0, 0, K, -view.x * K, -view.y * K);
      covCtx.lineWidth = D.W * 1.7; covCtx.lineCap = covCtx.lineJoin = "round"; covCtx.strokeStyle = "#000";
    }
    function inside(p) {
      var xx = Math.round((p[0] - view.x) * K), yy = Math.round((p[1] - view.y) * K);
      if (xx < 0 || yy < 0 || xx >= cw || yy >= ch) return false;
      return hit[(yy * cw + xx) * 4 + 3] > 128;
    }
    var lenIn = 0, lenOut = 0, cur = null, last = null, lastIn = true, run = null, dirty = 0;
    function clearMine() {
      mine.innerHTML = ""; lenIn = lenOut = 0; cur = null;
      if (covCtx) { covCtx.save(); covCtx.setTransform(1, 0, 0, 1, 0, 0); covCtx.clearRect(0, 0, cw, ch); covCtx.restore(); }
      host.classList.remove("is-done");
    }
    function covered() {
      var d = covCtx.getImageData(0, 0, cw, ch).data, n = 0;
      for (var i = 0; i < letterIdx.length; i++) if (d[letterIdx[i] * 4 + 3] > 128) n++;
      return letterIdx.length ? n / letterIdx.length : 0;
    }
    function score() {
      var c = covered(), tot = lenIn + lenOut, ins = tot ? lenIn / tot : 1;
      return { cover: c, inside: ins };
    }
    function pct(v) { return Math.round(v * 100) + "%"; }
    function report(final) {
      var s = score();
      if (s.cover >= NEED_COVER && s.inside >= NEED_INSIDE) {
        mode = "done"; host.classList.remove("is-writing"); host.classList.add("is-done");
        say((o.doneText || "Done. You wrote it.") + " <b>" + pct(s.inside) + "</b> of your line was inside the letter.");
        if (o.onDone) o.onDone();
        return;
      }
      var h = "Inside the letter <b>" + pct(s.inside) + "</b> · Letter covered <b>" + pct(s.cover) + "</b>";
      if (final && s.cover >= NEED_COVER) h += ". Too much went outside: clear and try again.";
      say(h);
    }
    function write() {
      stop(); clearDemo(); if (!hit) buildHit(); clearMine();
      mode = "write"; host.classList.add("is-writing");
      say("Your turn. Write it yourself: <b style=\"color:" + GOOD + "\">green</b> is inside the letter, <b style=\"color:" + BAD + "\">red</b> is outside.");
      follow(L[0][0][0]);
    }
    function local(e) { var m = svg.getScreenCTM().inverse(); return [m.a * e.clientX + m.c * e.clientY + m.e, m.b * e.clientX + m.d * e.clientY + m.f]; }
    function newRun(p, good) {
      run = { el: el("polyline", { fill: "none", stroke: good ? GOOD : BAD, "stroke-linecap": "round", "stroke-linejoin": "round" }), pts: [p] };
      mine.appendChild(run.el);
    }
    function addPoint(p) {
      var good = inside(p);
      if (!last) { newRun(p, good); run.el.setAttribute("points", pts([p, p])); last = p; lastIn = good; covCtx.beginPath(); covCtx.moveTo(p[0], p[1]); covCtx.lineTo(p[0] + 0.01, p[1]); covCtx.stroke(); return; }
      var dl = Math.hypot(p[0] - last[0], p[1] - last[1]);
      if (dl < 0.35) return;
      if (good) lenIn += dl; else lenOut += dl;
      if (good !== lastIn) newRun(last, good);
      run.pts.push(p); run.el.setAttribute("points", pts(run.pts));
      covCtx.beginPath(); covCtx.moveTo(last[0], last[1]); covCtx.lineTo(p[0], p[1]); covCtx.stroke();
      last = p; lastIn = good;
      if (o.scroller) {                        // long names: keep the pen in view
        var sx = (p[0] - view.x) * (o.px || 1) - o.scroller.scrollLeft;
        if (sx > o.scroller.clientWidth * 0.85) o.scroller.scrollLeft += o.scroller.clientWidth * 0.3;
      }
      if (!dirty) dirty = setTimeout(function () { dirty = 0; if (mode === "write") report(false); }, 180);
    }
    var drawing = false;
    svg.addEventListener("pointerdown", function (e) {
      if (mode === "watch") { stop(); write(); }
      if (mode !== "write") return;
      drawing = true; last = null; try { svg.setPointerCapture(e.pointerId); } catch (x) {}
      addPoint(local(e)); e.preventDefault();
    });
    svg.addEventListener("pointermove", function (e) {
      if (!drawing) return;
      var list = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      (list.length ? list : [e]).forEach(function (ev) { addPoint(local(ev)); });
    });
    ["pointerup", "pointercancel"].forEach(function (n) { svg.addEventListener(n, function () {
      if (!drawing) return; drawing = false; last = null;
      clearTimeout(dirty); dirty = 0; if (mode === "write") report(true);
    }); });
    if (reduced) write(); else watch();
    return { watch: watch, write: write, clear: function () { if (mode === "watch") stop(); write(); }, kill: function () { dead = true; stop(); clearTimeout(dirty); } };
  }

  /* ---------- alphabet chart + letter pad ---------- */
  var learned = {};
  try { (JSON.parse(localStorage.getItem("mcc_learned") || "[]") || []).forEach(function (c) { learned[c] = 1; }); } catch (e) {}
  function saveLearned() { try { localStorage.setItem("mcc_learned", JSON.stringify(Object.keys(learned))); } catch (e) {} }

  var current = 0, pad = null;
  function drawChart() {
    var host = $("lb-chart"); host.innerHTML = "";
    LETTERS.forEach(function (l, i) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "lb-cell" + (learned[l[0]] ? " is-learned" : "");
      if (i === current) b.setAttribute("aria-current", "true");
      b.setAttribute("aria-label", l[1] + ", " + l[2] + (learned[l[0]] ? ", done" : ""));
      b.innerHTML = '<span class="lb-g" lang="my">' + letterSvg(l[0]) + "</span><small>" + (learned[l[0]] ? "✓ " : "") + l[1] + "</small>";
      b.addEventListener("click", function () { open(i, true); });
      host.appendChild(b);
    });
    var n = Object.keys(learned).length;
    $("lb-progress").textContent = n ? n + " of 33 written" : "33 letters";
  }
  function open(i, scroll) {
    current = i; var l = LETTERS[i];
    if (pad) pad.kill();
    $("lb-who").innerHTML = '<div class="lb-g" lang="my" role="img" aria-label="' + l[0] + '">' + letterSvg(l[0]) + '</div><div><h3>' + l[1] + '</h3><small>called “' + l[2] + '” · <span lang="my">' + l[3] + "</span></small></div>";
    var strokes = placed(D.K[l[0]], 0, 0), b = bounds(strokes), side = Math.max(86, Math.max(b.x1 - b.x0, b.y1 - b.y0) + 32);
    var view = { x: (b.x0 + b.x1) / 2 - side / 2, y: (Math.min(b.y0, D.TOP) + Math.max(b.y1, D.BOT || 0)) / 2 - side / 2, w: side, h: side };
    pad = Pad($("lb-pad"), strokes, view, {
      shapes: [shapeOf(D.K[l[0]], 0, 0)],
      status: $("lb-status"), label: "Tracing pad for the letter " + l[1],
      doneText: 'You wrote <b lang="my">' + l[0] + "</b>.",
      onDone: function () { learned[l[0]] = 1; saveLearned(); drawChart(); $("lb-next").classList.add("is-ready"); }
    });
    $("lb-next").classList.remove("is-ready");
    drawChart();
    if (scroll && window.matchMedia("(max-width: 860px)").matches) $("lb-side").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
  $("lb-watch").addEventListener("click", function () { if (pad) pad.watch(); });
  $("lb-clear").addEventListener("click", function () { if (pad) pad.clear(); });
  /* "Hide the letter": write from memory; the letter shows again once you've written it. Remembered. */
  var noGuide = false; try { noGuide = localStorage.getItem("mcc_noguide") === "1"; } catch (e) {}
  function guide() {
    ["lb-pad", "lb-name-pad"].forEach(function (id) { $(id).classList.toggle("no-guide", noGuide); });
    ["lb-guide", "lb-name-guide"].forEach(function (id) { var b = $(id); b.textContent = noGuide ? "Show the letter" : "Hide the letter"; b.setAttribute("aria-pressed", noGuide ? "true" : "false"); });
  }
  ["lb-guide", "lb-name-guide"].forEach(function (id) { $(id).addEventListener("click", function () {
    noGuide = !noGuide; try { localStorage.setItem("mcc_noguide", noGuide ? "1" : "0"); } catch (e) {} guide();
  }); });
  guide();
  $("lb-next").addEventListener("click", function () { open((current + 1) % LETTERS.length, false); });
  open(0, false);

  /* ---------- write your name ---------- */
  var namePad = null;
  function layout(words) {
    var x = 0, all = [], shapes = [], ok = true;
    words.forEach(function (w, wi) {
      if (wi) x += 16;
      (w.match(CLUSTER) || []).forEach(function (c) {
        var e = D.C[c];
        while (!e && c.length > 1) { c = c.slice(0, -1); e = D.C[c]; ok = false; }     // unknown mark: drop it, keep the letter
        if (!e) { ok = false; return; }
        for (var i = 1; i < e.length; i += 3) { all = all.concat(placed(e[i], x + e[i + 1], e[i + 2])); shapes.push(shapeOf(e[i], x + e[i + 1], e[i + 2])); }
        x += e[0];
      });
    });
    return { strokes: all, shapes: shapes, width: x, ok: ok };
  }
  function writeName(raw) {
    var words = MCC_TRANSLIT.name(raw), out = $("lb-name-out"), note = $("lb-name-note");
    if (namePad) { namePad.kill(); namePad = null; }
    if (!words.length) { out.hidden = true; note.textContent = raw.trim() ? "Use letters A to Z (or Burmese script) and try again." : ""; return; }
    var lay = layout(words);
    if (!lay.strokes.length) { out.hidden = true; note.textContent = "Sorry, we can't draw that one yet."; return; }
    out.hidden = false;
    $("lb-name-mm").textContent = words.join(" ");
    var b = bounds(lay.strokes), view = { x: -12, y: Math.min(b.y0, D.TOP - 22) - 10, w: lay.width + 24, h: 0 };
    view.h = Math.max(b.y1 + 4, 14) + 10 - view.y;
    var scroller = $("lb-name-scroll"), px = Math.min(3.4, (scroller.clientWidth - 2) / view.w);
    if (px < 2.3) px = 2.3;
    namePad = Pad($("lb-name-pad"), lay.strokes, view, {
      shapes: lay.shapes, status: $("lb-name-status"), px: px, scroller: scroller, speed: 30, gap: 240, label: "Tracing pad for your name",
      doneText: "That's your name in Burmese."
    });
    note.textContent = lay.ok
      ? "Spelled by sound, so a Burmese speaker might spell it a little differently."
      : "Some marks in that spelling aren't in our stroke set yet, so they were left out.";
  }
  $("lb-name-form").addEventListener("submit", function (e) { e.preventDefault(); writeName($("lb-name-input").value); });
  $("lb-name-watch").addEventListener("click", function () { if (namePad) namePad.watch(); });
  $("lb-name-retry").addEventListener("click", function () { if (namePad) namePad.clear(); });
  var rt = 0;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (namePad && !$("lb-name-out").hidden) writeName($("lb-name-input").value); }, 250); });
})();
