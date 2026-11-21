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
  /* FINAL animations (js/learn-bands.js, made by hand in the MCC Stroke Trainer). For a glyph listed there, the demo
     fills the font's own outline band by band instead of using the brush. Do not replace these with generated strokes. */
  var BANDS = window.MCC_BANDS || {}, BAND_SPEED = 45, BAND_GAP = 420;   // units a second; ms between bands (as in the trainer)
  function bandsOf(g, dx, dy) {          // the final bands of one glyph, moved to (dx, dy); null when it has none yet
    var r = BANDS[g]; if (!r) return null;
    var pp = function (t) { return t.split(" ").map(function (q) { var v = q.split(","); return [+v[0] + dx, +v[1] + dy]; }); };
    return r.bands.map(function (bd) { return { a: pp(bd.a), b: pp(bd.b) }; });
  }
  var GOOD = "#4B7A3C", BAD = "#C2412F";
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
    var defs = el("defs", {}); svg.appendChild(defs);
    // Each stroke has its own brush mask and only shows its own part of the letter (MCCInkOwners in site.js),
    // so the wide brush can't uncover strokes that haven't been written yet where strokes touch or cross.
    var ghost = el("g", { "class": "lb-ghost" }), inkG = el("g", { "class": "lb-ink" }), demoG = el("g", { "class": "lb-ink" });
    shapes.forEach(function (sh) {
      var t = "translate(" + sh.x + " " + sh.y + ")";
      ghost.appendChild(el("path", { d: sh.d, transform: t })); inkG.appendChild(el("path", { d: sh.d, transform: t }));
    });
    svg.appendChild(ghost); svg.appendChild(inkG); svg.appendChild(demoG);
    var shapeBox = Array.prototype.map.call(ghost.childNodes, function (p, k) {
      try { var b = p.getBBox(); if (b.width > 0) return { x0: b.x + shapes[k].x, y0: b.y + shapes[k].y, x1: b.x + b.width + shapes[k].x, y1: b.y + b.height + shapes[k].y }; } catch (e) {}
      return null;
    });
    var holders = [];
    var area = { maskUnits: "userSpaceOnUse", x: view.x, y: view.y, width: view.w, height: view.h };
    function maskEl(id) { var m = el("mask", area); m.setAttribute("id", id); defs.appendChild(m); return m; }
    var inks = L.map(function (s, i) {
      var p = el("polyline", { points: "", fill: "none", stroke: "#fff", "stroke-width": MW, "stroke-linecap": "round", "stroke-linejoin": "round" });
      maskEl(mid + "b" + i).appendChild(p);
      var holder = el("g", {}), sb = bounds([s]); demoG.appendChild(holder); holders[i] = holder;
      var gi = el("g", { mask: "url(#" + mid + "b" + i + ")" }); holder.appendChild(gi);
      shapes.forEach(function (sh, k) {
        var bb = shapeBox[k], m = 12;
        if (bb && (bb.x1 < sb.x0 - m || bb.x0 > sb.x1 + m || bb.y1 < sb.y0 - m || bb.y0 > sb.y1 + m)) return;
        gi.appendChild(el("path", { d: sh.d, transform: "translate(" + sh.x + " " + sh.y + ")" }));
      });
      return p;
    });
    var mine = el("g", { "class": "lb-mine", "stroke-width": D.W * 0.55 }); svg.appendChild(mine);   // the visitor's own writing
    var pen = el("circle", { "class": "lb-pen", r: 1.7, opacity: 0 }); svg.appendChild(pen);
    // FINAL band animation: each band grows from its start along the font's two borders, front edge straight.
    var BD = o.bands || null, bandEls = [];
    if (BD) BD.forEach(function (bd) {
      var m = [0], k; for (k = 1; k < bd.a.length; k++) {
        var x0 = (bd.a[k - 1][0] + bd.b[k - 1][0]) / 2, y0 = (bd.a[k - 1][1] + bd.b[k - 1][1]) / 2, x1 = (bd.a[k][0] + bd.b[k][0]) / 2, y1 = (bd.a[k][1] + bd.b[k][1]) / 2;
        m.push(m[k - 1] + Math.hypot(x1 - x0, y1 - y0));
      }
      bd.m = m; var pe = el("path", { d: "" }); demoG.appendChild(pe); bandEls.push(pe);
    });
    function setBand(j, dist) {             // show band j up to distance dist along it; returns the pen point (middle of the front)
      var bd = BD[j], a = bd.a, b = bd.b, m = bd.m, n = a.length - 1, k = 0;
      while (k < n && m[k + 1] <= dist) k++;
      var f = k < n ? Math.max(0, Math.min(1, (dist - m[k]) / ((m[k + 1] - m[k]) || 1))) : 0;
      var lp = function (p, q) { return [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]; };
      var fa = k < n ? lp(a[k], a[k + 1]) : a[n], fb = k < n ? lp(b[k], b[k + 1]) : b[n];
      var side = a.slice(0, k + 1).concat([fa, fb]), back = b.slice(0, k + 1).reverse();
      bandEls[j].setAttribute("d", "M" + side.concat(back).map(function (p) { return p[0].toFixed(2) + " " + p[1].toFixed(2); }).join("L") + "Z");
      return [(fa[0] + fb[0]) / 2, (fa[1] + fb[1]) / 2];
    }

    function ownPart(i) {               // where strokes meet, this stroke shows only its own circle (set up the first time it's drawn)
      if (!window.MCCInkOwnMask || holders[i].hasAttribute("data-own")) return;
      holders[i].setAttribute("data-own", "");
      var m = el("mask", area); m.setAttribute("id", mid + "o" + i);
      if (window.MCCInkOwnMask(m, L, i, area, D.W)) { defs.appendChild(m); holders[i].setAttribute("mask", "url(#" + mid + "o" + i + ")"); }
    }
    function setInk(i, pr) {
      ownPart(i);
      var s = L[i], n = Math.floor(pr), f = pr - n, a = s.slice(0, n + 1);
      if (f > 0 && n < s.length - 1) { var p = s[n], q = s[n + 1]; a.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]); }
      if (a.length === 1) a.push(a[0]);
      inks[i].setAttribute("points", pr > 0 ? pts(a) : "");
      return a[a.length - 1];
    }
    function full(i) { ownPart(i); inks[i].setAttribute("points", pts(L[i].length > 1 ? L[i] : [L[i][0], L[i][0]])); }
    function clearDemo() { inks.forEach(function (p) { p.setAttribute("points", ""); }); bandEls.forEach(function (p) { p.setAttribute("d", ""); }); inkG.style.display = "none"; demoG.style.display = ""; }
    function whole() { inkG.style.display = ""; demoG.style.display = "none"; }
    clearDemo();
    function say(h) { if (o.status) o.status.innerHTML = h; }
    function stop() { cancelAnimationFrame(raf); clearTimeout(timer); pen.setAttribute("opacity", 0); }
    function follow(x) {
      if (!o.scroller) return;
      var left = (x - view.x) * (o.px || 1) - o.scroller.clientWidth * 0.35;
      try { o.scroller.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" }); } catch (e) { o.scroller.scrollLeft = Math.max(0, left); }
    }

    function watch() {
      stop(); clearDemo(); clearMine(); mode = "watch"; host.classList.remove("is-writing", "is-done"); if (o.onMode) o.onMode("watch");
      var i = 0, t0 = 0;
      if (BD) {                                   // FINAL hand-made animation
        say("Watch the pen. <b>" + BD.length + " stroke" + (BD.length > 1 ? "s" : "") + "</b>.");
        follow(BD[0].a[0][0]);
        var bstep = function (now) {
          if (dead) return;
          if (!t0) t0 = now;
          var bd = BD[i], tot = bd.m[bd.m.length - 1], dist = Math.min(tot, (now - t0) / 1000 * BAND_SPEED), tip = setBand(i, dist);
          pen.setAttribute("cx", tip[0]); pen.setAttribute("cy", tip[1]); pen.setAttribute("opacity", 1);
          if (dist >= tot) {
            i++; t0 = 0;
            if (i >= BD.length) { pen.setAttribute("opacity", 0); whole(); timer = setTimeout(write, 1100); return; }
            follow(BD[i].a[0][0]);
            timer = setTimeout(function () { raf = requestAnimationFrame(bstep); }, BAND_GAP); return;
          }
          raf = requestAnimationFrame(bstep);
        };
        timer = setTimeout(function () { raf = requestAnimationFrame(bstep); }, 350);
        return;
      }
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
      if (o.onScore) o.onScore(0);
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
      if (o.onScore) o.onScore(lenIn + lenOut ? s.inside : 0);
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
      mode = "write"; host.classList.add("is-writing"); if (o.onMode) o.onMode("write");
      say("");
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

  /* ---------- hear it (Azure's Burmese voice, Nilar) ----------
     Letters: audio/learn/<code point>.mp3, made once by tools/tts/letters.py (sound, then its name).
     Names: the site's Supabase function `speak` makes the clip once and stores it (supabase/speech.sql).
     A button only shows when its clip can play, so there's never a broken one. */
  var SPEAK = { url: "https://teipvhyqtjwhjnqvfngi.supabase.co/functions/v1/speak", key: "sb_publishable_UmbrrMl_z3mDlBXdYe9Exg_ExHWMAK9" };
  var SPEAKER = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>';
  var player = new Audio(), playingBtn = null, spoken = {};
  player.preload = "auto";
  function stopPlaying() { if (playingBtn) playingBtn.classList.remove("is-playing"); playingBtn = null; }
  player.addEventListener("ended", stopPlaying);
  player.addEventListener("pause", stopPlaying);
  function playUrl(url, btn) {
    player.pause(); player.src = url; player.currentTime = 0;
    var p = player.play();
    playingBtn = btn; btn.classList.add("is-playing");
    if (p && p.catch) p.catch(stopPlaying);
  }
  function speakUrl(text) {                  // -> Promise of a playable URL (cached for this visit)
    if (spoken[text]) return spoken[text];
    spoken[text] = fetch(SPEAK.url, { method: "POST", headers: { "Content-Type": "application/json", apikey: SPEAK.key }, body: JSON.stringify({ text: text }) })
      .then(function (r) {
        var type = r.headers.get("content-type") || "";
        if (r.ok && type.indexOf("audio") === 0) return r.blob().then(function (b) { return URL.createObjectURL(b); });
        return r.json().then(function (j) { if (!r.ok || !j.url) throw new Error(j.error || "no audio"); return j.url; });
      });
    spoken[text].catch(function () { delete spoken[text]; });
    return spoken[text];
  }
  function letterClip(ch) { return "audio/learn/" + ch.charCodeAt(0).toString(16).padStart(4, "0") + ".mp3"; }

  /* ---------- alphabet chart + letter pad ---------- */
  var learned = {};
  try { (JSON.parse(localStorage.getItem("mcc_learned") || "[]") || []).forEach(function (c) { learned[c] = 1; }); } catch (e) {}
  function saveLearned() { try { localStorage.setItem("mcc_learned", JSON.stringify(Object.keys(learned))); } catch (e) {} }

  /* The alphabet lesson: one letter at a time. Watch (the final bands play; the playback bar scrubs them) →
     Trace (one stroke at a time: the stroke's band is highlighted with a numbered start and a dashed path;
     covering it snaps it to the clean shape) → From memory (no guide). Done = the letter is learned. */
  var current = 0;
  var FL = { VH: 100, VBW: 146, SPEED: 45, GAP: 0.42, SNAP: 0.86, COVER: 0.9, INSIDE: 0.8, R2: 5.2 * 5.2 };
  var TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4L18 8" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z" fill="currentColor"/></svg>';
  var PAUSE = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5.5" y="4.5" width="4.5" height="15" rx="1.2" fill="currentColor"/><rect x="14" y="4.5" width="4.5" height="15" rx="1.2" fill="currentColor"/></svg>';
  /* A letter drawn at one shared scale, cropped to its own width and centred on its own middle. */
  function tileSvg(ch) {
    var g = D.K[ch]; if (g == null) return ch;
    var b = bounds(glyph(g)), w = b.x1 - b.x0 + D.W * 2 + 4, my = (b.y0 + b.y1) / 2;
    return '<svg viewBox="' + (b.x0 - D.W - 2).toFixed(1) + " " + (my - 50).toFixed(1) + " " + w.toFixed(1) + ' 100" aria-hidden="true"><path d="' + D.O[g] + '"/></svg>';
  }
  function tileLabel(l) { return l[1] + ", " + l[2] + (learned[l[0]] ? ", written" : ""); }
  function flArea(a, b) { var p = a.concat(b.slice().reverse()), s = 0; for (var i = 0; i < p.length; i++) { var q = p[(i + 1) % p.length]; s += p[i][0] * q[1] - q[0] * p[i][1]; } return s; }
  function flPoly(a, b, i0, i1) { var s = "M" + a[i0][0] + " " + a[i0][1], i; for (i = i0 + 1; i <= i1; i++) s += "L" + a[i][0] + " " + a[i][1]; for (i = i1; i >= i0; i--) s += "L" + b[i][0] + " " + b[i][1]; return s + "Z"; }
  function pct(v) { return (Math.round(v * 1000) / 10) + "%"; }
  var lessons = {};
  function lessonOf(i) {                  // one letter's bands (made consistent in direction), timings and framing
    if (lessons[i]) return lessons[i];
    var ch = LETTERS[i][0], g = D.K[ch], x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    var bands = (bandsOf(g, 0, 0) || []).map(function (bd) {
      var a = bd.a, b = bd.b, n = Math.min(a.length, b.length); a = a.slice(0, n); b = b.slice(0, n);
      if (flArea(a, b) < 0) { var t = a; a = b; b = t; }
      var len = 0, mid = a.map(function (p, k) { var q = b[k];
        [p, q].forEach(function (z) { if (z[0] < x0) x0 = z[0]; if (z[0] > x1) x1 = z[0]; if (z[1] < y0) y0 = z[1]; if (z[1] > y1) y1 = z[1]; });
        return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; });
      for (var k = 1; k < n; k++) len += Math.hypot(mid[k][0] - mid[k - 1][0], mid[k][1] - mid[k - 1][1]);
      return { a: a, b: b, n: n, mid: mid, len: len };
    });
    if (!bands.length) { var bb = bounds(glyph(g)); x0 = bb.x0; x1 = bb.x1; y0 = bb.y0; y1 = bb.y1; }
    var t = 0, sched = bands.map(function (b) { var o = { t0: t, t1: t + b.len / FL.SPEED }; t = o.t1 + FL.GAP; return o; });
    return (lessons[i] = { ch: ch, d: D.O[g] || "", bands: bands, sched: sched, T: Math.max(0.01, t - FL.GAP), cx: (x0 + x1) / 2,
      vy: (y1 > 20 ? 0 : -21.8) - FL.VH / 2, box: [x0, y0, x1, y1], full: bands.map(function (b) { return flPoly(b.a, b.b, 0, b.n - 1); }) });
  }

  var S = { mode: "watch", hide: false, t: 0, playing: false, speed: 1, done: false };
  var cov = [], bandDone = [], inks = [], stopAt = null, drawing = false, lastSnap = -1, raf = 0, seen = false;
  var fpad = $("fl-pad");
  function L() { return lessonOf(current); }
  function showScore(v) { var p = Math.round((v || 0) * 100); $("lb-inside").textContent = p + "%"; $("lb-inside-bar").style.width = p + "%"; }
  function resetInk() { var l = L(); cov = l.bands.map(function (b) { return new Uint8Array(b.n); }); bandDone = l.bands.map(function () { return false; }); inks = []; lastSnap = -1; showScore(0); }

  function drawCarousel() {
    var h = "";
    for (var k = -4; k <= 4; k++) { var i = (current + k + LETTERS.length) % LETTERS.length, l = LETTERS[i];
      h += '<button type="button" class="fl-ct c' + Math.min(3, Math.abs(k)) + (learned[l[0]] ? " is-learned" : "") + '" data-i="' + i + '" aria-label="' + tileLabel(l) + '"' + (k ? "" : ' aria-current="true"') + ">" + tileSvg(l[0]) + "</button>"; }
    $("fl-car").innerHTML = h;
    var grid = $("lb-all-grid"); grid.innerHTML = "";
    LETTERS.forEach(function (l, i) {
      var c = document.createElement("button");
      c.type = "button"; c.className = "lc-cell" + (learned[l[0]] ? " is-learned" : "");
      if (i === current) c.setAttribute("aria-current", "true");
      c.setAttribute("aria-label", tileLabel(l));
      c.innerHTML = tileSvg(l[0]) + "<small>" + l[1] + "</small>";
      c.addEventListener("click", function () { $("lb-all-dlg").close(); open(i); });
      grid.appendChild(c);
    });
  }
  function drawWho() {
    var l = LETTERS[current], ls = L(), bx = ls.box, gw = bx[2] - bx[0] + 2, gh = bx[3] - bx[1] + 2;
    $("lb-who").innerHTML = '<svg class="fl-g" lang="my" role="img" aria-label="' + l[0] + '" viewBox="' + (bx[0] - 1) + " " + (bx[1] - 1) + " " + gw + " " + gh +
      '" style="width:' + (gw * 1.15).toFixed(1) + "px;height:" + (gh * 1.15).toFixed(1) + 'px"><path d="' + ls.d + '"/></svg><div class="fl-nmt"><div class="fl-nmh"><h3>' + l[1] +
      '</h3></div><p>called “' + l[2] + '” · <span lang="my">' + l[3] + "</span></p></div>";
    var i = current, hear = document.createElement("button"), clip = letterClip(l[0]);
    var hasClip = false, say = l[3];   // just the letter's name, e.g. ကကြီး "ka gyi"
    hear.type = "button"; hear.className = "lb-hear"; hear.innerHTML = SPEAKER;
    hear.setAttribute("aria-label", "Hear " + l[1] + ", called " + l[2]);
    hear.addEventListener("click", function () {
      if (hasClip) { playUrl(clip, hear); return; }
      hear.classList.add("is-busy");
      speakUrl(say).then(function (u) { hear.classList.remove("is-busy"); if (current === i) playUrl(u, hear); }, function () { hear.classList.remove("is-busy"); });
    });
    $("lb-who").querySelector(".fl-nmh").appendChild(hear);
    var probe = new Audio(); probe.preload = "metadata";     // a recorded clip, when there is one, wins
    probe.addEventListener("loadedmetadata", function () { hasClip = true; }, { once: true });
    probe.src = clip;
  }
  function drawFrame() {
    var l = L(), vbx = l.cx - FL.VBW / 2;
    fpad.setAttribute("viewBox", vbx + " " + l.vy + " " + FL.VBW + " " + FL.VH);
    fpad.setAttribute("aria-label", "Writing pad for the letter " + LETTERS[current][1]);
    Array.prototype.forEach.call(fpad.querySelectorAll("line"), function (ln) { var y = ln.getAttribute("data-y");
      ln.setAttribute("x1", vbx - 5); ln.setAttribute("x2", vbx + FL.VBW + 5); ln.setAttribute("y1", y); ln.setAttribute("y2", y); });
    $("fl-outline").setAttribute("d", l.d);
    $("fl-segs").innerHTML = l.sched.map(function (sc, j) { return '<div class="fl-seg" style="left:' + pct(sc.t0 / l.T) + ";width:" + pct((sc.t1 - sc.t0) / l.T) + '"><i></i><span>' + (j + 1) + "</span></div>"; }).join("");
    $("lb-num").textContent = current + 1;
  }
  function drawSteps() {                 // Watch | Trace, plus the Hide toggle
    Array.prototype.forEach.call($("fl-steps").querySelectorAll("[data-mode]"), function (b) { b.setAttribute("aria-checked", b.getAttribute("data-mode") === S.mode ? "true" : "false"); });
    $("fl-steps").style.setProperty("--i", S.mode === "watch" ? 0 : 1);
    $("fl-hide").setAttribute("aria-pressed", S.hide ? "true" : "false");
    $("lb-next").classList.toggle("is-ready", S.done);
    $("fl-badge").classList.toggle("is-on", S.done);
    $("fl-outline").classList.toggle("is-hidden", S.hide && S.mode === "trace" && !S.done);
  }
  function drawBoard() {
    var l = L(), vbx = l.cx - FL.VBW / 2, watch = S.mode === "watch", trace = S.mode === "trace" && !S.hide && !S.done;
    var demo = "";
    if (watch) l.bands.forEach(function (b, j) { var sc = l.sched[j], k = S.t >= sc.t1 ? b.n : S.t <= sc.t0 ? 0 : Math.floor((S.t - sc.t0) / (sc.t1 - sc.t0) * b.n); if (k >= 2) demo += flPoly(b.a, b.b, 0, k - 1); });
    if (watch && !l.bands.length) demo = l.d;
    $("fl-demo").setAttribute("d", demo);
    var jc = trace ? bandDone.indexOf(false) : -1;
    $("fl-curb").setAttribute("d", jc >= 0 ? l.full[jc] : "");
    var gd = "";
    if (jc >= 0) {
      var md = l.bands[jc].mid, e = Math.max(2, md.length - 4); gd = "M" + md[0][0] + " " + md[0][1]; for (var g = 2; g < e; g += 2) gd += "L" + md[g][0] + " " + md[g][1]; gd += "L" + md[e][0] + " " + md[e][1];
    }
    $("fl-guide").setAttribute("d", gd);
    var gi = "", ri = "";
    if (!watch) inks.forEach(function (st) {
      var k = 0, n = st.pts.length;
      while (k < n) { var v = st.ins[k], q = k ? st.pts[k - 1] : st.pts[k], d = "M" + q[0] + " " + q[1];
        while (k < n && st.ins[k] === v) { d += "L" + st.pts[k][0] + " " + st.pts[k][1]; k++; }
        if (v) gi += d; else ri += d; }
    });
    $("fl-inkg").setAttribute("d", gi); $("fl-inkr").setAttribute("d", ri);
    var sh = "";
    if (jc >= 0) { var p0 = l.bands[jc].mid[0]; sh = '<div class="fl-start" style="left:' + pct((p0[0] - vbx) / FL.VBW) + ";top:" + pct((p0[1] - l.vy) / FL.VH) + '"><span>' + (jc + 1) + "</span></div>"; }
    if ($("fl-starts").innerHTML !== sh) $("fl-starts").innerHTML = sh;
  }
  function drawTransport() {
    var l = L(), t = S.mode === "watch" ? S.t : 0, segs = $("fl-segs").children;
    $("fl-play").innerHTML = S.playing ? PAUSE : PLAY; $("fl-play").setAttribute("aria-label", S.playing ? "Pause" : "Play");
    l.sched.forEach(function (sc, j) { if (segs[j]) segs[j].firstChild.style.width = pct(Math.max(0, Math.min(1, (t - sc.t0) / (sc.t1 - sc.t0)))); });
    $("fl-head").style.left = pct(t / l.T);
    $("fl-track").setAttribute("aria-valuenow", Math.round(t / l.T * 100));
    $("fl-time").textContent = t.toFixed(1) + "s / " + l.T.toFixed(1) + "s";
    $("fl-sp5").classList.toggle("is-on", S.speed === 0.5); $("fl-sp1").classList.toggle("is-on", S.speed === 1);
  }
  function loop(now) {
    raf = 0; if (!S.playing) return;
    var dt = Math.min(0.05, (now - (loop.last || now)) / 1000); loop.last = now;
    var stop = stopAt != null ? stopAt : L().T; S.t += dt * S.speed;
    if (S.t >= stop) { S.t = stop; S.playing = false; stopAt = null; }
    drawBoard(); drawTransport();
    if (S.playing) raf = requestAnimationFrame(loop);
  }
  function play() { S.playing = true; loop.last = 0; if (!raf) raf = requestAnimationFrame(loop); drawTransport(); }

  function open(i) {
    current = i; S.mode = "watch"; S.done = false; stopAt = null; resetInk();
    drawFrame(); drawWho(); drawCarousel(); drawSteps();
    if (reduced || !seen) { S.t = reduced ? L().T : 0; S.playing = false; drawBoard(); drawTransport(); } else { S.t = 0; play(); }
  }
  function setMode(m) {
    resetInk(); stopAt = null; S.done = false; S.mode = m; S.t = 0; S.playing = false;
    drawSteps(); drawBoard(); drawTransport();
    if (m === "watch") play();
  }
  function togglePlay() {
    if (S.playing) { S.playing = false; drawTransport(); return; }
    stopAt = null;
    if (S.mode !== "watch") { resetInk(); S.mode = "watch"; S.t = 0; S.done = false; drawSteps(); }
    if (S.t >= L().T - 0.01) S.t = 0;
    play();
  }
  function scrubTo(f) {
    stopAt = null; if (S.mode !== "watch") { resetInk(); S.mode = "watch"; S.done = false; drawSteps(); }
    S.playing = false; S.t = Math.max(0, Math.min(1, f)) * L().T; drawBoard(); drawTransport();
  }
  function score() { var c = 0, n = 0, a = 0, m = 0;
    cov.forEach(function (arr) { for (var i = 0; i < arr.length; i++) { n++; c += arr[i]; } });
    inks.forEach(function (s) { s.ins.forEach(function (v) { m++; if (v) a++; }); });
    return { cov: n ? c / n : 0, ins: m ? a / m : 0 }; }
  function addPt(e) {
    var m = fpad.getScreenCTM(); if (!m) return;
    var p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse()), s = inks[inks.length - 1], prev = s.pts[s.pts.length - 1];
    if (prev && Math.hypot(p.x - prev[0], p.y - prev[1]) < 0.5) return;
    var inside = true; try { inside = $("fl-outline").isPointInFill(new DOMPoint(p.x, p.y)); } catch (err) {}
    s.pts.push([p.x, p.y]); s.ins.push(inside);
    showScore(score().ins);
    var l = L(), from = prev || [p.x, p.y], n = Math.max(1, Math.ceil(Math.hypot(p.x - from[0], p.y - from[1]) / 1.5)), only = !S.hide ? bandDone.indexOf(false) : -1;
    for (var k = 0; k <= n; k++) { var x = from[0] + (p.x - from[0]) * k / n, y = from[1] + (p.y - from[1]) * k / n;
      for (var j = 0; j < l.bands.length; j++) { if (only >= 0 && j !== only) continue;
        var md = l.bands[j].mid, c = cov[j]; for (var q = 0; q < md.length; q++) { var dx = md[q][0] - x, dy = md[q][1] - y; if (dx * dx + dy * dy < FL.R2) c[q] = 1; } } }
    if (only >= 0) {                     // guided: the highlight moves on once this stroke is covered
      var cc = cov[only], got = 0; for (var z = 0; z < cc.length; z++) got += cc[z];
      if (got / cc.length >= FL.SNAP) bandDone[only] = true;
    }
    drawBoard();
  }
  function isComplete() { var sc = score(); return sc.ins >= FL.INSIDE && (S.hide ? sc.cov >= FL.COVER : bandDone.indexOf(false) < 0); }
  function finishStroke() {            // a letter counts as written only once the pen is lifted, never mid-stroke
    if (!drawing) return; drawing = false;
    if (!S.done && isComplete()) { S.done = true; learned[LETTERS[current][0]] = 1; saveLearned(); drawSteps(); drawCarousel(); drawBoard(); }
  }
  fpad.addEventListener("pointerdown", function (e) {
    if (S.done || !L().bands.length) return; e.preventDefault();
    try { fpad.setPointerCapture(e.pointerId); } catch (err) {}
    if (S.mode === "watch") { resetInk(); S.mode = "trace"; S.playing = false; stopAt = null; drawSteps(); drawTransport(); }
    drawing = true; inks.push({ pts: [], ins: [] }); addPt(e);
  });
  fpad.addEventListener("pointermove", function (e) { if (drawing) addPt(e); });
  ["pointerup", "pointercancel"].forEach(function (ev) { fpad.addEventListener(ev, finishStroke); });
  var scrubbing = false, track = $("fl-track");
  function trackF(e) { var r = track.getBoundingClientRect(); return (e.clientX - r.left) / r.width; }
  track.addEventListener("pointerdown", function (e) { scrubbing = true; try { track.setPointerCapture(e.pointerId); } catch (err) {} scrubTo(trackF(e)); });
  track.addEventListener("pointermove", function (e) { if (scrubbing) scrubTo(trackF(e)); });
  ["pointerup", "pointercancel"].forEach(function (ev) { track.addEventListener(ev, function () { scrubbing = false; }); });

  $("fl-play").addEventListener("click", togglePlay);
  $("fl-sp5").addEventListener("click", function () { S.speed = 0.5; drawTransport(); });
  $("fl-sp1").addEventListener("click", function () { S.speed = 1; drawTransport(); });
  $("fl-steps").addEventListener("click", function (e) { var b = e.target.closest("[data-mode]"); if (b) setMode(b.getAttribute("data-mode")); });
  $("fl-steps").addEventListener("keydown", function (e) {
    var d = e.key === "ArrowRight" || e.key === "ArrowLeft"; if (!d) return; e.preventDefault();
    setMode(S.mode === "watch" ? "trace" : "watch"); $("fl-steps").querySelector('[aria-checked="true"]').focus();
  });
  $("fl-hide").addEventListener("click", function () { S.hide = !S.hide; if (S.mode === "watch") setMode("trace"); else setMode("trace"); });
  $("fl-car").addEventListener("click", function (e) { var b = e.target.closest("[data-i]"); if (b) open(+b.getAttribute("data-i")); });
  function step(d) { open((current + d + LETTERS.length) % LETTERS.length); }
  (function () {                       // swipe, drag or scroll sideways across the letter strip to move through the letters
    var nav = $("fl-car").parentNode, x0 = null, acc = 0, moved = false, STEP = 46, wacc = 0, wt = 0;
    nav.addEventListener("pointerdown", function (e) { if (e.button) return; x0 = e.clientX; acc = 0; moved = false; });
    window.addEventListener("pointermove", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; if (Math.abs(dx) > 8) moved = true;
      var d = dx - acc; if (Math.abs(d) >= STEP) { var n = Math.floor(Math.abs(d) / STEP), s = d > 0 ? -1 : 1; step(s * n); acc += -s * n * STEP; }
    });
    ["pointerup", "pointercancel"].forEach(function (ev) { window.addEventListener(ev, function () { x0 = null; }); });
    nav.addEventListener("click", function (e) { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);
    nav.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;     // vertical scrolling still scrolls the page
      e.preventDefault(); var now = Date.now(); wacc += e.deltaX;
      if (now - wt < 150) { wacc = 0; return; }
      if (Math.abs(wacc) >= 40) { step(wacc > 0 ? 1 : -1); wacc = 0; wt = now; }
    }, { passive: false });
  })();
  $("fl-prev").addEventListener("click", function () { step(-1); });
  $("fl-nextc").addEventListener("click", function () { step(1); });
  $("fl-prevb").addEventListener("click", function () { step(-1); });
  $("lb-next").addEventListener("click", function () { step(1); });
  $("lb-clear").addEventListener("click", function () { setMode("trace"); });
  $("lb-all").addEventListener("click", function () {
    var d = $("lb-all-dlg"); if (d.showModal) d.showModal(); else d.setAttribute("open", "");
  });
  $("lb-all-close").addEventListener("click", function () { $("lb-all-dlg").close(); });
  $("lb-all-dlg").addEventListener("click", function (e) { if (e.target === this) this.close(); });
  // Deep link: learn.html#write-ka (Latin name) or #write-က opens that letter (Ask MCC links here).
  function fromHash() {
    var m = /^#write-(.+)$/.exec(location.hash || ""); if (!m) return -1;
    var key = decodeURIComponent(m[1]).toLowerCase();
    for (var i = 0; i < LETTERS.length; i++) if (LETTERS[i][0] === key || LETTERS[i][1] === key) return i;
    return -1;
  }
  var linked = fromHash();
  open(linked < 0 ? 0 : linked);
  // The first demo plays when the board comes into view.
  function firstPlay() { if (seen) return; seen = true; if (!reduced && S.mode === "watch" && !S.playing && S.t === 0) play(); }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { if (es.some(function (x) { return x.isIntersecting; })) { io.disconnect(); firstPlay(); } }, { threshold: 0.4 });
    io.observe($("lb-side"));
  } else firstPlay();
  if (linked >= 0) setTimeout(function () { $("lb-chart").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); }, 300);
  window.addEventListener("hashchange", function () { var i = fromHash(); if (i >= 0) { open(i); $("lb-chart").scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }); } });

  /* ---------- write your name ---------- */
  var namePad = null;
  function layout(words) {
    var x = 0, all = [], shapes = [], ok = true, bands = [], allBands = true;
    words.forEach(function (w, wi) {
      if (wi) x += 16;
      (w.match(CLUSTER) || []).forEach(function (c) {
        var e = D.C[c];
        while (!e && c.length > 1) { c = c.slice(0, -1); e = D.C[c]; ok = false; }     // unknown mark: drop it, keep the letter
        if (!e) { ok = false; return; }
        for (var i = 1; i < e.length; i += 3) { all = all.concat(placed(e[i], x + e[i + 1], e[i + 2])); shapes.push(shapeOf(e[i], x + e[i + 1], e[i + 2]));
          var bb = bandsOf(e[i], x + e[i + 1], e[i + 2]); if (bb) bands = bands.concat(bb); else allBands = false; }
        x += e[0];
      });
    });
    return { strokes: all, shapes: shapes, width: x, ok: ok, bands: allBands && bands.length ? bands : null };
  }
  function writeName(raw) {
    var words = MCC_TRANSLIT.name(raw), out = $("lb-name-out"), note = $("lb-name-note");
    if (namePad) { namePad.kill(); namePad = null; }
    if (!words.length) { out.hidden = true; note.textContent = raw.trim() ? "Use letters A to Z (or Burmese script) and try again." : ""; return; }
    var lay = layout(words);
    if (!lay.strokes.length) { out.hidden = true; note.textContent = "Sorry, we can't draw that one yet."; return; }
    out.hidden = false;
    $("lb-name-mm").textContent = words.join(" ");
    nameText = words.join(" ");
    var b = bounds(lay.strokes), view = { x: -12, y: Math.min(b.y0, D.TOP - 22) - 10, w: lay.width + 24, h: 0 };
    view.h = Math.max(b.y1 + 4, 14) + 10 - view.y;
    var scroller = $("lb-name-scroll"), px = Math.min(3.4, (scroller.clientWidth - 2) / view.w);
    setNameMode(0); nameScore(0);
    namePad = Pad($("lb-name-pad"), lay.strokes, view, {
      shapes: lay.shapes, bands: lay.bands, px: px, onMode: function (m) { if (m === "write" && nameMode === 0) setNameMode(1); }, onScore: nameScore, scroller: scroller, speed: 30, gap: 240, label: "Tracing pad for your name",
      doneText: "That's your name in Burmese."
    });
    note.textContent = lay.ok
      ? "Spelled by sound, so a Burmese speaker might spell it a little differently."
      : "Some marks in that spelling aren't in our stroke set yet, so they were left out.";
  }
  $("lb-name-form").addEventListener("submit", function (e) { e.preventDefault(); writeName($("lb-name-input").value); });
  var nameText = "";
  /* Watch · Trace · Hide letter for the name, same as the alphabet card. */
  var nameMode = 0;
  function setNameMode(m) {
    nameMode = m;
    var seg = $("lb-name-mode"); seg.style.setProperty("--i", m);
    Array.prototype.forEach.call(seg.querySelectorAll("button"), function (b) { b.setAttribute("aria-checked", +b.getAttribute("data-m") === m ? "true" : "false"); });
    $("lb-name-pad").classList.toggle("no-guide", m === 2);
  }
  function nameScore(v) { var p = Math.round((v || 0) * 100); $("lb-name-inside").textContent = p + "%"; $("lb-name-bar").style.width = p + "%"; }
  $("lb-name-mode").addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b || !namePad) return;
    var m = +b.getAttribute("data-m"); setNameMode(m);
    if (m === 0) namePad.watch(); else namePad.write();
  });
  $("lb-name-retry").addEventListener("click", function () { if (namePad) namePad.clear(); });
  var rt = 0;
  window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { if (namePad && !$("lb-name-out").hidden) writeName($("lb-name-input").value); }, 250); });
})();

/* "Say it out loud": the sentence box and chips ask Ask MCC's inline phrase card
   (<div data-ask-mcc="phrase">, mounted by js/ask-mcc.js). data-q is set too, so a phrase asked
   before the widget script has loaded is answered once it mounts. */
(function () {
  var form = document.getElementById("lb-say-form"), input = document.getElementById("lb-say-input");
  var desk = document.getElementById("lb-ask-desk"), chips = document.getElementById("lb-say-chips");
  if (!form || !desk) return;
  function ask(q) {
    q = (q || "").trim();
    if (!q) { input.focus(); return; }
    desk.dataset.q = q;
    desk.dispatchEvent(new CustomEvent("askmcc:ask", { detail: { q: q } }));
    // On phones the card sits under the box: bring it into view.
    if (window.matchMedia("(max-width:860px)").matches) desk.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
  form.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); input.blur(); });
  chips.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    input.value = b.textContent; ask(b.textContent);
  });
})();
