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
if (typeof module !== "undefined") module.exports = MCC_TRANSLIT;
