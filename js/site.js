/* Renders content.js into the page, switches between pages, handles day and
   night mode, draws the map and runs the countdown leader on the home page. */
(function () {
  "use strict";

  // ---------- small helpers ----------
  var SVG = "http://www.w3.org/2000/svg";
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(tag, attrs) {
    var n = document.createElementNS(SVG, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }
  function byId(id) { return document.getElementById(id); }
  function setText(id, t) { var n = byId(id); if (n) n.textContent = t || ""; }
  function fill(id, nodes, emptyText) {
    var host = byId(id);
    if (!host) return;
    host.textContent = "";
    if (!nodes.length && emptyText) { host.appendChild(el("li", "empty", emptyText)); return; }
    nodes.forEach(function (n) { host.appendChild(n); });
  }
  function link(label, url) {
    var a = el("a", "", label);
    a.href = url;
    if (/^https?:/.test(url)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }

  // ---------- line icons ----------
  var ICONS = {
    climb: '<path d="M9 3h5a5 5 0 0 1 5 5v6a7 7 0 0 1-7 7 5 5 0 0 1-5-5V5a2 2 0 0 1 2-2z"/><path d="M11 7v9"/><path d="M11 7l4 2"/>',
    run: '<circle cx="12" cy="13.5" r="7"/><path d="M12 13.5V9.5"/><path d="M12 13.5l2.6 1.6"/><path d="M10 3h4"/><path d="M12 3v3.5"/><path d="M17.5 7.500l1.300-1.300"/>',
    dive: '<path d="M4 8.5h11a2.5 2.5 0 0 1 2.5 2.5v2a2.5 2.5 0 0 1-2.5 2.5h-2.6l-1.900-2-1.900 2H6.500A2.500 2.500 0 0 1 4 13z"/><path d="M20 4v11a4 4 0 0 1-4 4h-3"/>',
    film: '<rect x="3.5" y="10" width="17" height="10" rx="1.5"/><path d="M3.5 10l15.500-4.200-.900-3.200L2.700 6.800z"/><path d="M7.400 5.500l2 3.400"/><path d="M12 4.300l2 3.400"/>',
    sport: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17"/><path d="M3.5 12h17"/><path d="M6 6c2.200 1.800 2.200 10.200 0 12"/><path d="M18 6c-2.200 1.800-2.200 10.200 0 12"/>',
    french: '<path d="M4 5.5h16v11h-8.500L7 20v-3.500H4z"/><path d="M9 12.500c0-2.800 4.500-2.800 4.500-.300H9c0 2.300 3 2.700 4.300 1.300"/><path d="M11 7.800l1.800-1.100"/>',
    book: '<path d="M5 4.5h11a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z"/><path d="M5 17a3 3 0 0 1 3-3h11"/>',
    tv: '<rect x="3" y="7.500" width="18" height="12" rx="2"/><path d="M8.500 3.500l3.500 4 3.500-4"/>',
    article: '<path d="M6 3.5h9l3.500 3.500v13.500H6z"/><path d="M9 11.500h6M9 15h6M9 8h3"/>',
    work: '<rect x="3.5" y="7.500" width="17" height="12" rx="2"/><path d="M9 7.500v-2A1.500 1.500 0 0 1 10.500 4h3A1.500 1.500 0 0 1 15 5.500v2"/><path d="M3.500 13h17"/>',
    cube: '<path d="M12 3l8 4.500v9L12 21l-8-4.500v-9z"/><path d="M4 7.500l8 4.500 8-4.500M12 12v9"/>',
    pen: '<path d="M4 20l1-4.500L16.500 4a2.100 2.100 0 0 1 3 3L8 18.500z"/><path d="M14.500 6l3 3"/>',
    heart: '<path d="M12 20s-7.500-4.600-7.500-10A4.300 4.300 0 0 1 12 7.300 4.300 4.300 0 0 1 19.500 10c0 5.400-7.500 10-7.500 10z"/>',
    compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.500 8.500l-2 5-5 2 2-5z"/>',
    person: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/>',
    pin: '<path d="M12 21s-6.500-6-6.500-11a6.500 6.500 0 0 1 13 0c0 5-6.500 11-6.500 11z"/><circle cx="12" cy="10" r="2.300"/>',
    home: '<path d="M4 11l8-7 8 7"/><path d="M6.500 9.500V20h11V9.500"/>',
    cap: '<path d="M2.500 9.500L12 5l9.500 4.500L12 14z"/><path d="M6.500 11.800V16c1.500 1.600 9.500 1.600 11 0v-4.200"/>',
    group: '<circle cx="9" cy="9" r="3"/><circle cx="16.500" cy="10" r="2.300"/><path d="M3.500 19a5.500 5.500 0 0 1 11 0M15 15.200a4.500 4.500 0 0 1 5.500 3.800"/>',
    mail: '<rect x="3.500" y="5.500" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
    globe: '<circle cx="12" cy="12" r="8.500"/><path d="M3.500 12h17M12 3.500c3 3 3 14 0 17M12 3.500c-3 3-3 14 0 17"/>'
  };
  function iconSvg(key) {
    return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' + (ICONS[key] || '<circle cx="12" cy="12" r="8.5"/>') + '</svg>';
  }
  // ---------- stickers and doodles ----------
  var F = "font-family=\"'Courier Prime','Courier New',monospace\" font-weight=\"700\"";
  var STICKERS = {
    stamp: '<svg viewBox="0 0 130 130"><defs><path id="st-ring" d="M65 65 m-45 0 a45 45 0 1 1 90 0 a45 45 0 1 1 -90 0"/></defs><g fill="none" stroke="#b3261e"><circle cx="65" cy="65" r="60" stroke-width="3.500"/><circle cx="65" cy="65" r="56" stroke-width="1"/><circle cx="65" cy="65" r="34" stroke-width="1.500"/></g><text fill="#b3261e" ' + F + ' font-size="10.500" letter-spacing="1.300"><textPath href="#st-ring">THE BEAUTIFUL GAME OF LIFE ★ FIRST DRAFT ★</textPath></text><text x="65" y="63" text-anchor="middle" fill="#b3261e" ' + F + ' font-size="17">DRAFT</text><text x="65" y="80" text-anchor="middle" fill="#b3261e" ' + F + ' font-size="12">No. 1</text></svg>',
    cards: '<svg viewBox="0 0 110 100"><g transform="rotate(-12 40 55)"><rect x="12" y="14" width="50" height="72" rx="6" fill="#fff" stroke="#171717" stroke-width="2"/><text x="19" y="33" fill="#171717" ' + F + ' font-size="16">A</text><path transform="translate(37 54) scale(1.500)" fill="#171717" d="M0 -8 C6 -2 9 1 9 4.500 A4.500 4.500 0 0 1 1 6.500 L3 11 H-3 L-1 6.500 A4.500 4.500 0 0 1 -9 4.500 C-9 1 -6 -2 0 -8 Z"/></g><g transform="rotate(10 70 55)"><rect x="48" y="16" width="50" height="72" rx="6" fill="#fff" stroke="#171717" stroke-width="2"/><text x="55" y="35" fill="#b3261e" ' + F + ' font-size="16">K</text><path transform="translate(73 58) scale(1.500)" fill="#b3261e" d="M0 9 C-9 2 -9 -5 -4.500 -6 C-2 -6.500 0 -4.500 0 -3 C0 -4.500 2 -6.500 4.500 -6 C9 -5 9 2 0 9 Z"/></g></svg>',
    boulder: '<svg viewBox="0 0 110 100"><path d="M12 88 L24 34 L56 12 L92 30 L100 88 Z" fill="#d3cfc4" stroke="#171717" stroke-width="2.500" stroke-linejoin="round"/><path d="M56 12 L50 52 L24 34 M50 52 L100 88 M50 52 L40 88" fill="none" stroke="#171717" stroke-width="1.300" opacity=".5"/><g stroke="#171717" stroke-width="1.800"><ellipse cx="38" cy="44" rx="7" ry="5" fill="#b3261e" transform="rotate(-20 38 44)"/><ellipse cx="68" cy="34" rx="6" ry="4.500" fill="#fdb515"/><ellipse cx="62" cy="58" rx="7" ry="5" fill="#2a4fa3" transform="rotate(15 62 58)"/><ellipse cx="82" cy="66" rx="6" ry="4.500" fill="#2f6b3a"/><ellipse cx="30" cy="70" rx="6.500" ry="4.500" fill="#ff8a3d" transform="rotate(-10 30 70)"/></g><g fill="#fff" stroke="#171717" stroke-width="1"><circle cx="52" cy="26" r="2.500"/><circle cx="46" cy="22" r="1.600"/></g></svg>',
    arrow: '<svg viewBox="0 0 40 44"><path d="M30 42 C10 38 6 22 16 6" fill="none" stroke="#b3261e" stroke-width="2.200" stroke-linecap="round"/><path d="M8 13 L16 5 L22 15" fill="none" stroke="#b3261e" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    coffee: '<svg viewBox="0 0 140 140"><g fill="none" stroke="#7a4a1e" stroke-linecap="round"><path d="M70 14 a56 56 0 1 1 -40 17" stroke-width="6" opacity=".16"/><path d="M70 22 a48 48 0 1 0 34 14" stroke-width="2" opacity=".14"/></g><circle cx="126" cy="24" r="3" fill="#7a4a1e" opacity=".16"/><circle cx="118" cy="12" r="1.600" fill="#7a4a1e" opacity=".16"/></svg>',
    ticket: '<svg viewBox="0 0 150 70"><path d="M8 6 H142 V24 a11 11 0 0 0 0 22 V64 H8 V46 a11 11 0 0 0 0 -22 Z" fill="#fdb515" stroke="#171717" stroke-width="2" stroke-linejoin="round"/><path d="M106 10 V60" stroke="#171717" stroke-width="1.500" stroke-dasharray="4 4"/><text x="60" y="33" text-anchor="middle" fill="#171717" ' + F + ' font-size="14">ADMIT</text><text x="60" y="50" text-anchor="middle" fill="#171717" ' + F + ' font-size="14">ONE</text><text x="124" y="40" text-anchor="middle" fill="#171717" ' + F + ' font-size="11" transform="rotate(90 124 36)">No. 451</text></svg>',
    popcorn: '<svg viewBox="0 0 90 110"><g stroke="#171717" stroke-width="2" stroke-linejoin="round"><g fill="#fff6c9"><circle cx="24" cy="34" r="11"/><circle cx="44" cy="24" r="13"/><circle cx="64" cy="34" r="11"/><circle cx="34" cy="42" r="10"/><circle cx="56" cy="44" r="10"/><circle cx="45" cy="38" r="9"/></g><path d="M16 46 H74 L66 104 H24 Z" fill="#fff"/><path d="M27.500 46 L33 104 M45 46 V104 M62.500 46 L57 104" fill="none"/><path d="M16 46 H27.500 L33 104 H24 Z M45 46 H62.500 L57 104 H45 Z" fill="#b3261e"/></g></svg>',
    clip: '<svg viewBox="0 0 44 96"><path d="M12 30 V72 a10 10 0 0 0 20 0 V18 a7 7 0 0 0 -14 0 V68 a3.500 3.500 0 0 0 7 0 V28" fill="none" stroke="#8a8f98" stroke-width="3" stroke-linecap="round"/></svg>',
    stampsg: '<svg viewBox="0 0 130 130"><defs><path id="sg-ring" d="M65 65 m-44 0 a44 44 0 1 1 88 0"/></defs><g transform="rotate(-9 65 65)"><g fill="none" stroke="#b3261e"><circle cx="65" cy="65" r="58" stroke-width="3"/><circle cx="65" cy="65" r="52" stroke-width="1"/></g><text fill="#b3261e" ' + F + ' font-size="15" letter-spacing="2"><textPath href="#sg-ring" startOffset="50%" text-anchor="middle">SINGAPORE</textPath></text><text x="65" y="74" text-anchor="middle" fill="#b3261e" ' + F + ' font-size="20">HOME</text><path d="M35 86 H95" stroke="#b3261e" stroke-width="1.500"/><text x="65" y="102" text-anchor="middle" fill="#b3261e" ' + F + ' font-size="10">1.35° N</text></g></svg>',
    stampuk: '<svg viewBox="0 0 170 110"><g transform="rotate(5 85 55)"><g fill="none" stroke="#2a4fa3"><rect x="10" y="14" width="150" height="82" rx="6" stroke-width="3"/><rect x="16" y="20" width="138" height="70" rx="3" stroke-width="1"/></g><text x="85" y="46" text-anchor="middle" fill="#2a4fa3" ' + F + ' font-size="15" letter-spacing="1">UNITED KINGDOM</text><path d="M30 54 H140" stroke="#2a4fa3" stroke-width="1.500"/><text x="85" y="74" text-anchor="middle" fill="#2a4fa3" ' + F + ' font-size="12">BOARDING SCHOOL</text></g></svg>',
    stampus: '<svg viewBox="0 0 170 120"><g transform="rotate(-6 85 60)"><g fill="none" stroke="#2f6b3a"><ellipse cx="85" cy="60" rx="76" ry="48" stroke-width="3"/><ellipse cx="85" cy="60" rx="69" ry="41" stroke-width="1"/></g><text x="85" y="52" text-anchor="middle" fill="#2f6b3a" ' + F + ' font-size="15" letter-spacing="1">BERKELEY, CA</text><text x="85" y="72" text-anchor="middle" fill="#2f6b3a" ' + F + ' font-size="12">ARRIVED 2026</text><text x="85" y="89" text-anchor="middle" fill="#2f6b3a" ' + F + ' font-size="10">37.87° N</text></g></svg>'
  };
  // small drawings for the media list
  var MEDIA_ART = {
    axe: '<path d="M14 41 L29 12" stroke="#8a5a2b" stroke-width="4.500"/><path d="M25 9 L38 11 C40 17 38 23 33 27 L22 18 Z" fill="#c9ced6"/>',
    jelly: '<path d="M9 24 a15 15 0 0 1 30 0 z" fill="#7fd0e8"/><path d="M15 24 q-3 5 0 9 q3 4 0 8 M21 24 q-3 5 0 9 q3 4 0 8 M27 24 q3 5 0 9 q-3 4 0 8 M33 24 q3 5 0 9 q-3 4 0 8" fill="none"/>',
    moth: '<path d="M24 16 C14 4 4 10 7 20 C9 26 18 26 24 22 C30 26 39 26 41 20 C44 10 34 4 24 16 Z" fill="#9db7e8"/><path d="M24 24 C17 26 12 32 15 38 C19 41 23 34 24 28 C25 34 29 41 33 38 C36 32 31 26 24 24 Z" fill="#c9d8f3"/><path d="M24 14 V34" stroke-width="3.500"/><path d="M24 14 q-4 -6 -8 -6 M24 14 q4 -6 8 -6" fill="none" stroke-width="1.500"/>',
    eye: '<path d="M4 24 Q24 6 44 24 Q24 42 4 24 Z" fill="#fff"/><circle cx="24" cy="24" r="8.500" fill="#4f86d9"/><circle cx="24" cy="24" r="3.600" fill="#171717" stroke="none"/><circle cx="27" cy="21" r="1.500" fill="#fff" stroke="none"/>',
    dunes: '<circle cx="34" cy="13" r="6.500" fill="#fdb515"/><path d="M3 40 Q14 20 26 31 Q34 22 45 33 V42 H3 Z" fill="#e3b56b"/><path d="M26 31 Q21 36 19 42" fill="none" stroke-width="1.500"/>',
    sunrise: '<path d="M11 32 a13 13 0 0 1 26 0 z" fill="#ff9a4a"/><path d="M4 32 H44" /><path d="M24 8 V13 M9 15 L12.500 18.500 M39 15 L35.500 18.500" fill="none"/><path d="M12 38 H36 M17 43 H31" fill="none" stroke-width="1.500"/>',
    fox: '<path d="M7 9 L18 17 H30 L41 9 L39 28 L24 42 L9 28 Z" fill="#e8792b"/><path d="M9 28 L24 42 L39 28 L30 29 L24 35 L18 29 Z" fill="#fff"/><circle cx="18" cy="24" r="1.800" fill="#171717" stroke="none"/><circle cx="30" cy="24" r="1.800" fill="#171717" stroke="none"/><circle cx="24" cy="40" r="2.200" fill="#171717" stroke="none"/>',
    quill: '<path d="M40 5 C22 7 11 20 11 34 C25 34 40 24 40 5 Z" fill="#efe9d6"/><path d="M40 5 L7 43" /><path d="M22 20 L15 27 M29 15 L20 24" fill="none" stroke-width="1.300"/>',
    camera: '<rect x="14" y="9" width="11" height="8" rx="2" fill="#6a6a6a"/><rect x="5" y="15" width="38" height="25" rx="4" fill="#4a4a4a"/><circle cx="24" cy="27.500" r="8.500" fill="#9cc3e6"/><circle cx="24" cy="27.500" r="3.500" fill="#171717" stroke="none"/><circle cx="37" cy="21" r="1.800" fill="#fdb515" stroke="none"/>',
    atom: '<g fill="none" stroke="#2a4fa3"><ellipse cx="24" cy="24" rx="19" ry="7.500"/><ellipse cx="24" cy="24" rx="19" ry="7.500" transform="rotate(60 24 24)"/><ellipse cx="24" cy="24" rx="19" ry="7.500" transform="rotate(120 24 24)"/></g><circle cx="24" cy="24" r="4.200" fill="#b3261e"/>',
    thread: '<path d="M10 35 C16 8 22 46 27 24 S33 4 38 13" fill="none" stroke="#b3261e" stroke-width="2.600"/><circle cx="10" cy="35" r="4.500" fill="#fdb515"/><circle cx="38" cy="13" r="4.500" fill="#4f86d9"/>',
    palette: '<path d="M24 6 C11 6 4 15 4 24 C4 35 13 42 22 42 C26 42 26.500 38 24.500 36 C22 33 25 30 29 30 H36 C41 30 44 26 44 22 C44 12 35 6 24 6 Z" fill="#e8cfa0"/><g stroke-width="1.300"><circle cx="13" cy="21" r="3.300" fill="#b3261e"/><circle cx="21" cy="13.500" r="3.300" fill="#2a4fa3"/><circle cx="31" cy="13.500" r="3.300" fill="#fdb515"/><circle cx="37.500" cy="21" r="3.300" fill="#ff8a3d"/></g>',
    chicken: '<path d="M10 22 L4 16 L8 28" fill="#fff"/><ellipse cx="21" cy="28" rx="13" ry="10.500" fill="#fff"/><circle cx="33" cy="15" r="6.500" fill="#fff"/><path d="M30 9 q1.500 -4 3.500 0 q1.500 -4 3.500 0" fill="#b3261e"/><path d="M39 14 L45 16 L39 18.500 Z" fill="#fdb515"/><circle cx="34.500" cy="14" r="1.300" fill="#171717" stroke="none"/><path d="M18 38 V44 M25 38 V44" stroke="#c98a12"/>',
    planet: '<circle cx="24" cy="24" r="11" fill="#d98b4a"/><path d="M15 20 q9 4 18 0" fill="none" stroke-width="1.300"/><ellipse cx="24" cy="24" rx="21" ry="6" transform="rotate(-20 24 24)" fill="none"/><g fill="#171717" stroke="none"><circle cx="7" cy="9" r="1.400"/><circle cx="41" cy="38" r="1.400"/><circle cx="39" cy="8" r="1"/></g>'
  };
  function mediaArt(key) {
    return '<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="#171717" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + MEDIA_ART[key] + '</svg>';
  }

  document.querySelectorAll("[data-sticker]").forEach(function (n) { n.innerHTML = STICKERS[n.getAttribute("data-sticker")] || ""; });

  function ico(key) { var n = el("span", "ico"); n.innerHTML = iconSvg(key); return n; }
  document.querySelectorAll("[data-icon]").forEach(function (n) { n.innerHTML = iconSvg(n.getAttribute("data-icon")); });

  // motion is off if the visitor's device asks for less motion, or they pressed the pause button
  var mqCalm = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  function motionOff() { return document.documentElement.getAttribute("data-motion") === "off" || !!(mqCalm && mqCalm.matches); }
  function copyButton(text) {
    var b = el("button", "copy", "Copy");
    b.type = "button";
    b.setAttribute("aria-label", "Copy " + text);
    b.addEventListener("click", function () {
      function done(ok) { b.textContent = ok ? "Copied" : "Press Ctrl+C"; window.setTimeout(function () { b.textContent = "Copy"; }, 1600); }
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); }); return; }
      } catch (e) {}
      done(false);
    });
    return b;
  }

  var S = window.SITE || {};
  var adv = S.adventures || {};

  // ---------- home ----------
  setText("where", S.location);
  setText("tagline", S.tagline);
  var hl = byId("hero-links");
  if (hl) {
    (S.links || []).forEach(function (l) { hl.appendChild(link(l.label, l.url)); });
    if (S.email) { var em = el("span", "email", S.email); em.appendChild(copyButton(S.email)); hl.appendChild(em); }
  }
  var qb = byId("quote");
  if (qb && S.quote && S.quote.text) {
    qb.appendChild(el("p", "", "\u201c" + S.quote.text + "\u201d"));
    if (S.quote.by) qb.appendChild(el("cite", "", S.quote.by));
    qb.hidden = false;
  }
  fill("now-list", (S.now || []).map(function (t) {
    if (typeof t === "string") return el("li", "", t);
    var li = el("li", "", t.text);
    if (t.sticker) {
      var st = el("span", "sticker now-sticker");
      st.setAttribute("data-sticker", t.sticker);
      st.setAttribute("aria-hidden", "true");
      li.appendChild(st);
    }
    return li;
  }));
  setText("path", (adv.places || []).map(function (p) { return p.name; }).join(" → "));

  // ---------- about ----------
  fill("about-prose", (S.about || []).map(function (t) { return el("p", "", t); }));
  var facts = [];
  (S.facts || []).forEach(function (f) {
    var row = el("div");
    var dt = el("dt", "", f.label);
    if (f.icon) dt.insertBefore(ico(f.icon), dt.firstChild);
    row.appendChild(dt);
    row.appendChild(el("dd", "", f.value));
    facts.push(row);
  });
  fill("about-facts", facts);
  var factsBox = byId("about-facts");
  if (factsBox && !facts.length) factsBox.hidden = true;

  // ---------- work ----------
  var xp = S.experience || [], projects = S.projects || [];
  if (xp.length && byId("xp-list")) {
    fill("xp-list", xp.map(function (j) {
      var li = el("li", "xp-item");
      li.appendChild(el("p", "xp-when", j.when || ""));
      var body = el("div");
      body.appendChild(el("p", "xp-role", j.role));
      body.appendChild(el("p", "xp-org", [j.org, j.where].filter(Boolean).join(", ")));
      if (j.points && j.points.length) {
        var ul = el("ul", "xp-points");
        j.points.forEach(function (pt) { ul.appendChild(el("li", "", pt)); });
        body.appendChild(ul);
      }
      if (j.link) { var more = el("p", "xp-link"); more.appendChild(link("More about this", j.link)); body.appendChild(more); }
      li.appendChild(body);
      return li;
    }));
    byId("xp-list").hidden = false; byId("xp-empty").hidden = true;
  }
  if (projects.length && byId("proj-list")) {
    fill("proj-list", projects.map(function (pr) {
      var li = el("li", "proj");
      var head = el("div", "proj-head");
      if (pr.sticker && (MEDIA_ART[pr.sticker] || STICKERS[pr.sticker])) {
        var art = el("span", "msticker");
        art.innerHTML = MEDIA_ART[pr.sticker] ? mediaArt(pr.sticker) : STICKERS[pr.sticker];
        head.appendChild(art);
      }
      var names = el("div");
      names.appendChild(el("p", "proj-name", pr.name));
      if (pr.when) names.appendChild(el("p", "proj-when", pr.when));
      head.appendChild(names);
      li.appendChild(head);
      if (pr.blurb) li.appendChild(el("p", "proj-blurb", pr.blurb));
      if (pr.tags && pr.tags.length) {
        var tags = el("ul", "proj-tags");
        pr.tags.forEach(function (t) { tags.appendChild(el("li", "", t)); });
        li.appendChild(tags);
      }
      if (pr.link) { var go = el("p", "proj-link"); go.appendChild(link("See the project", pr.link)); li.appendChild(go); }
      return li;
    }));
    byId("proj-list").hidden = false; byId("proj-empty").hidden = true;
    var note = document.querySelector(".sticky"); if (note && xp.length) note.hidden = true;
  }

  // ---------- media diet ----------
  var TYPES = [
    { key: "all", label: "All" }, { key: "book", label: "Books" }, { key: "film", label: "Films" },
    { key: "tv", label: "TV" }, { key: "article", label: "Articles" }
  ];
  var mediaFilter = "all";
  function mediaRow(m) {
    var li = el("li", "media-row");
    var art = el("span", "msticker");
    if (m.sticker && MEDIA_ART[m.sticker]) {
      art.innerHTML = mediaArt(m.sticker);
      // tilt each one a little differently, like stickers put on by hand
      var tilt = ((m.title.length * 7) % 13) - 6;
      art.style.transform = "rotate(" + tilt + "deg)";
      art.className = "msticker ms-" + m.sticker;
      art.style.setProperty("--d", ((m.title.length * 37) % 23) / 10 + "s");   // so they don't all move in step
    } else art.className = "msticker empty";
    li.appendChild(art);
    var body = el("div");
    var title = el("p", "book-title");
    if (m.url) title.appendChild(link(m.title, m.url)); else title.textContent = m.title;
    if (m.status === "now") title.appendChild(el("span", "media-status", "in progress"));
    body.appendChild(title);
    if (m.by) body.appendChild(el("p", "book-author", m.by));
    if (m.note) body.appendChild(el("p", "book-note", m.note));
    li.appendChild(body);
    li.appendChild(el("p", "media-when", m.when || ""));
    return li;
  }
  function renderMedia() {
    var all = S.media || [];
    var rows = [];
    // one heading per kind, so the kind is not repeated on every row
    TYPES.slice(1).forEach(function (t) {
      if (mediaFilter !== "all" && mediaFilter !== t.key) return;
      var items = all.filter(function (m) { return m.type === t.key; });
      if (!items.length) return;
      items.sort(function (a, b) { return (a.status === "now" ? 0 : 1) - (b.status === "now" ? 0 : 1); });
      var head = el("li", "media-group");
      head.appendChild(ico(t.key));
      head.appendChild(el("span", "", t.label));
      rows.push(head);
      items.forEach(function (m) { rows.push(mediaRow(m)); });
    });
    fill("media-list", rows, "Nothing listed here yet.");
    var host = byId("media-filters");
    if (!host) return;
    host.textContent = "";
    TYPES.forEach(function (t) {
      var n = t.key === "all" ? all.length : all.filter(function (m) { return m.type === t.key; }).length;
      var b = el("button", "", t.label + " " + n);
      b.type = "button";
      b.setAttribute("aria-pressed", String(mediaFilter === t.key));
      b.addEventListener("click", function () { mediaFilter = t.key; renderMedia(); });
      host.appendChild(b);
    });
  }
  renderMedia();

  // ---------- writing ----------
  var posts = {};
  fill("writing-list", (S.writing || []).map(function (p) {
    var li = el("li");
    li.appendChild(el("p", "post-when", p.when || ""));
    var body = el("div");
    var title = el("p", "post-title");
    if (p.slug && p.body && p.body.length) {
      posts[p.slug] = p;
      title.appendChild(link(p.title, "#post-" + p.slug));
    } else if (p.url) title.appendChild(link(p.title, p.url));
    else title.textContent = p.title;
    body.appendChild(title);
    if (p.blurb) body.appendChild(el("p", "post-blurb", p.blurb));
    li.appendChild(body);
    return li;
  }), "No posts yet.");

  function renderPost(p) {
    setText("post-when", p.when);
    setText("post-title", p.title);
    var host = byId("post-body");
    host.textContent = "";
    (p.body || []).forEach(function (line) {
      if (line.indexOf("## ") === 0) host.appendChild(el("h2", "", line.slice(3)));
      else if (line.indexOf("> ") === 0) host.appendChild(el("blockquote", "", line.slice(2)));
      else host.appendChild(el("p", "", line));
    });
  }

  // ---------- interests ----------
  fill("interests-list", (S.interests || []).map(function (i) {
    var li = el("li", "interest");
    var mark = el("div", "interest-mark");
    if (i.image) {
      var img = el("img"); img.alt = ""; img.loading = "lazy"; img.src = i.image;
      img.addEventListener("error", function () { mark.innerHTML = iconSvg(i.icon); });
      mark.appendChild(img);
    } else mark.innerHTML = iconSvg(i.icon);
    li.appendChild(mark);
    var body = el("div");
    body.appendChild(el("p", "interest-name", i.name));
    if (i.note) body.appendChild(el("p", "interest-note", i.note));
    li.appendChild(body);
    return li;
  }));
  // ---------- adventures ----------
  var places = adv.places || [];
  function uniq(key) {
    var seen = {};
    places.forEach(function (p) { if (p[key]) seen[p[key]] = 1; });
    return Object.keys(seen).length;
  }
  var stats = [
    { label: "places pinned", value: String(places.length) },
    { label: "countries", value: String(uniq("country")) },
    { label: "continents", value: uniq("continent") + " of 7" }
  ].map(function (s) {
    var row = el("div");
    row.appendChild(el("dt", "", s.label));
    row.appendChild(el("dd", "", s.value));
    return row;
  });
  fill("adventure-stats", stats);

  var W = window.WORLD;
  var mapHost = byId("map");
  if (W && mapHost) {
    var root = svg("svg", { viewBox: "0 0 " + W.width + " " + W.height, role: "img",
      "aria-label": "World map with a pin on each place: " + places.map(function (p) { return p.name; }).join(", ") });
    root.appendChild(svg("path", { "class": "land", d: W.path }));
    var pts = places.map(function (p) {
      return { p: p, x: (p.lon + 180) / 360 * W.width, y: (W.top - p.lat) / 360 * W.width };
    });
    // dashed legs between consecutive places, taking the shorter way round
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i];
      if (Math.abs(a.x - b.x) > W.width / 2) {
        var left = a.x < b.x ? a : b, right = a.x < b.x ? b : a;
        var span = left.x + (W.width - right.x);
        var yEdge = right.y + (left.y - right.y) * ((W.width - right.x) / span);
        root.appendChild(svg("path", { "class": "leg", d: "M" + right.x + " " + right.y + " L" + W.width + " " + yEdge }));
        root.appendChild(svg("path", { "class": "leg", d: "M0 " + yEdge + " L" + left.x + " " + left.y }));
      } else {
        root.appendChild(svg("path", { "class": "leg", d: "M" + a.x + " " + a.y + " L" + b.x + " " + b.y }));
      }
    }
    pts.forEach(function (q) {
      var g = svg("g", { "class": "pin" + (q.p.here ? " here" : "") });
      g.appendChild(svg("circle", { cx: q.x, cy: q.y, r: 5 }));
      var onRight = q.x < W.width - 130;
      var t = svg("text", { x: q.x + (onRight ? 9 : -9), y: q.y + 4, "text-anchor": onRight ? "start" : "end" });
      t.textContent = q.p.name;
      g.appendChild(t);
      root.appendChild(g);
    });
    mapHost.appendChild(root);
  }
  fill("pin-list", places.map(function (p) {
    var li = el("li", p.here ? "here" : "", p.name);
    if (p.note) li.appendChild(el("span", "", " (" + p.note + ")"));
    return li;
  }));

  var next = adv.next || {};
  var cd = byId("countdown");
  if (cd && next.where && next.date) {
    var days = Math.ceil((new Date(next.date + "T00:00:00").getTime() - Date.now()) / 86400000);
    if (days > 0) {
      cd.textContent = days + (days === 1 ? " day" : " days") + " until " + next.where;
      cd.hidden = false;
    }
  }

  fill("adventure-log", (adv.log || []).map(function (g) {
    var li = el("li");
    li.appendChild(el("p", "post-when", g.when || ""));
    var body = el("div");
    body.appendChild(el("p", "post-title", g.what));
    if (g.where) body.appendChild(el("p", "post-blurb", g.where));
    li.appendChild(body);
    return li;
  }), "Nothing logged yet.");

  // ---------- résumé ----------
  var rb = byId("resume-box");
  if (rb) {
    if (S.resume) {
      rb.appendChild(el("p", "pending-title", "One page, PDF"));
      var dl = el("a", "button", "Download résumé");
      dl.href = S.resume;
      dl.setAttribute("download", "");
      rb.appendChild(dl);
    } else {
      rb.appendChild(el("p", "pending-title", "Coming soon"));
      rb.appendChild(el("p", "pending-note", "The PDF isn't up yet. Email me and I'll send it over."));
    }
  }

  // ---------- footer ----------
  var mail = byId("foot-email");
  if (mail && S.email) {
    var m = el("a", "", S.email);
    m.href = "mailto:" + S.email;
    mail.appendChild(m);
    mail.appendChild(copyButton(S.email));
  }
  if (S.updated) setText("foot-updated", "Last updated " + S.updated + ".");
  fill("foot-links", (S.links || []).map(function (l) {
    var li = el("li");
    li.appendChild(link(l.label, l.url));
    return li;
  }));

  // ---------- polaroids in the side margins ----------
  var photos = (S.photos || []).slice(0, 6);
  if (photos.length) {
    var sides = [el("div", "mg l"), el("div", "mg r")];
    var half = Math.ceil(photos.length / 2);
    var TILT = [-6, 5, -4, 6, -5, 4], DRIFT = [0.05, 0.11, 0.07, 0.09, 0.05, 0.12];
    photos.forEach(function (ph, i) {
      var col = i < half ? 0 : 1, row = i < half ? i : i - half, rows = col === 0 ? half : photos.length - half;
      var wrap = el("div", "pol"), frame = el("div", "pframe"), img = el("img");
      img.src = ph.src; img.alt = ph.cap || ""; img.loading = "lazy";
      frame.appendChild(img);
      if (ph.cap) frame.appendChild(el("p", "", ph.cap));
      frame.style.setProperty("--r", TILT[i] + "deg");
      frame.style.animationDelay = (i * 0.7) + "s";
      wrap.style.top = (14 + row * (62 / Math.max(1, rows - 1 || 1))) + "%";
      wrap.style.setProperty("--k", DRIFT[i]);
      wrap.appendChild(frame);
      sides[col].appendChild(wrap);
    });
    sides.forEach(function (d) { document.body.appendChild(d); });
    // they drift a little as the page scrolls
    window.addEventListener("scroll", function () {
      if (!motionOff()) document.body.style.setProperty("--sy", String(Math.round(window.scrollY)));
    }, { passive: true });
  }

  // ---------- motion on and off ----------
  var motionBtn = byId("motion");
  var PAUSE = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1" fill="currentColor"/><rect x="13.800" y="5" width="4.200" height="14" rx="1" fill="currentColor"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path d="M8 5.500v13l11-6.500z" fill="currentColor"/></svg>';
  function labelMotion() {
    if (!motionBtn) return;
    var off = document.documentElement.getAttribute("data-motion") === "off";
    motionBtn.innerHTML = off ? PLAY : PAUSE;
    motionBtn.setAttribute("aria-label", off ? "Turn animations on" : "Turn animations off");
    motionBtn.title = off ? "Animations are off" : "Pause animations";
  }
  try { if (localStorage.getItem("motion") === "off") document.documentElement.setAttribute("data-motion", "off"); } catch (e) {}
  if (motionBtn) {
    motionBtn.addEventListener("click", function () {
      var off = document.documentElement.getAttribute("data-motion") === "off";
      if (off) document.documentElement.removeAttribute("data-motion"); else document.documentElement.setAttribute("data-motion", "off");
      try { localStorage.setItem("motion", off ? "on" : "off"); } catch (e) {}
      labelMotion();
      if (onHome) startScreen();
    });
  }
  labelMotion();

  // ---------- day and night ----------
  var html = document.documentElement;
  var modeBtn = byId("mode");
  function isNight() {
    var t = html.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  var MOON = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path fill="currentColor" d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a.6.6 0 0 0-.8-.7 9.8 9.8 0 1 0 12.6 12.6.6.6 0 0 0-.7-.8z"/></svg>';
  var SUN = '<svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="12" cy="12" r="4.4" fill="currentColor"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/></g></svg>';
  function labelMode() {
    if (!modeBtn) return;
    var night = isNight();
    var slot = byId("mode-ico") || modeBtn;
    slot.innerHTML = night ? SUN : MOON;   // the icon shows the mode you would switch to
    modeBtn.setAttribute("aria-label", night ? "Switch to day mode" : "Switch to night mode");
    modeBtn.title = night ? "Day mode" : "Night mode";
  }
  var lights = byId("lights");
  var pulling = false;
  function flip() {
    var to = isNight() ? "light" : "dark";
    html.setAttribute("data-theme", to);
    try { localStorage.setItem("mode", to); } catch (e) {}
    labelMode();
    return to;
  }
  if (modeBtn) {
    modeBtn.addEventListener("click", function () {
      if (motionOff()) { flip(); return; }
      if (pulling) return;
      pulling = true;
      // tug the cord, switch at the bottom of the pull, then let the light flicker
      modeBtn.classList.add("pulling");
      window.setTimeout(function () {
        var to = flip();
        if (lights) {
          lights.className = "lights";
          void lights.offsetWidth;   // restart the animation
          lights.className = "lights " + (to === "dark" ? "going-dark" : "going-light");
        }
      }, 230);
      window.setTimeout(function () { modeBtn.classList.remove("pulling"); pulling = false; }, 750);
    });
  }
  try {
    var savedMode = localStorage.getItem("mode");
    if (savedMode === "light" || savedMode === "dark") html.setAttribute("data-theme", savedMode);
  } catch (e) {}
  labelMode();

  // ---------- the name: "Ian Pua" eases into "Hian Hoe Pua" while hovered ----------
  var hit = byId("name-hit"), first = byId("first-name");
  if (hit && first) {
    var shortName = first.querySelector(".f-a"), longName = first.querySelector(".f-b");
    var widthOf = function (layer) { return Math.ceil(layer.getBoundingClientRect().width); };
    var open = false;
    var setOpen = function (on) {
      open = on;
      first.style.width = widthOf(on ? longName : shortName) + "px";
      hit.classList.toggle("full", on);
    };
    hit.addEventListener("mouseenter", function () { setOpen(true); });
    hit.addEventListener("mouseleave", function () { setOpen(false); });
    hit.addEventListener("focus", function () { setOpen(true); });
    hit.addEventListener("blur", function () { setOpen(false); });
    // touch screens have no hover: a tap switches it
    hit.addEventListener("touchstart", function (e) { e.preventDefault(); setOpen(!open); }, { passive: false });
    var settle = function () { first.style.width = widthOf(open ? longName : shortName) + "px"; };
    settle();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(settle);
    window.addEventListener("resize", settle);
  }

  // ---------- page switching ----------
  var views = Array.prototype.slice.call(document.querySelectorAll("[data-view]"));
  var names = views.map(function (v) { return v.getAttribute("data-view"); });
  var onHome = true;

  // old page names now live as sections inside a combined page
  var ALIAS = {
    about: ["home", "sec-about"],
    experience: ["work", "sec-experience"], projects: ["work", "sec-projects"],
    writing: ["media", "sec-writing"], interests: ["offscreen", "sec-interests"],
    adventures: ["offscreen", "sec-adventures"]
  };
  function show() {
    var want = (location.hash || "").replace("#", "");
    var navName = want, anchor = null;
    if (ALIAS[want]) { anchor = ALIAS[want][1]; want = navName = ALIAS[want][0]; }
    if (want.indexOf("post-") === 0 && posts[want.slice(5)]) {
      renderPost(posts[want.slice(5)]);
      want = "post"; navName = "media";
    } else if (want === "post" || names.indexOf(want) === -1) {
      want = "home"; navName = "home";
    }
    onHome = want === "home";
    views.forEach(function (v) { v.hidden = v.getAttribute("data-view") !== want; });
    document.querySelectorAll("[data-route]").forEach(function (a) {
      if (a.getAttribute("data-route") === navName && !onHome) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    var target = anchor && byId(anchor);
    if (target) target.scrollIntoView(); else window.scrollTo(0, 0);
    if (onHome) startLeader(); else stopLeader();
  }
  window.addEventListener("hashchange", show);

  // ---------- the home page screen ----------
  var canvas = byId("leader");
  var ctx = canvas && canvas.getContext ? canvas.getContext("2d") : null;
  var overlay = byId("screen-html");
  var raf = 0, typer = 0, ticker = 0;
  var FACE = "'Courier Prime', 'Courier New', monospace";

  // the time right now in another time zone
  function zoneTime(tz) {
    var out = { h: 0, m: 0, s: 0 };
    try {
      new Intl.DateTimeFormat("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
        .formatToParts(new Date()).forEach(function (p) {
          if (p.type === "hour") out.h = Number(p.value) % 24;
          if (p.type === "minute") out.m = Number(p.value);
          if (p.type === "second") out.s = Number(p.value);
        });
    } catch (e) { var d = new Date(); out = { h: d.getHours(), m: d.getMinutes(), s: d.getSeconds() }; }
    return out;
  }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function timeOfDay(h) { return h < 5 ? "NIGHT" : h < 7 ? "DAWN" : h < 17 ? "DAY" : h < 19 ? "DUSK" : "NIGHT"; }
  function sceneHeading() {
    var t = zoneTime("America/Los_Angeles");
    return { text: "INT. BERKELEY – " + timeOfDay(t.h), clock: two(t.h) + ":" + two(t.m) + " in Berkeley" };
  }

  function prep() {
    var r0 = canvas.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var cw = Math.round(r0.width * dpr), ch = Math.round(r0.height * dpr);
    if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, r0.width, r0.height);
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    return r0;
  }

  // 1. Countdown leader
  function drawLeader(t) {
    var b = prep(), w = b.width, h = b.height;
    var cx = w / 2, cy = h / 2, r = h * 0.32;
    ctx.strokeStyle = "rgba(255,255,255,0.45)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
    var frac = (t % 1000) / 1000;   // the wedge sweeps once per number
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r * 1.9, -Math.PI / 2, -Math.PI / 2 + frac * Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 0.8, 0, Math.PI * 2); ctx.stroke();
    var n = 8 - (Math.floor(t / 1000) % 7);   // 8 down to 2, then loops
    ctx.font = "700 " + Math.round(r * 1.1) + "px " + FACE;
    ctx.fillStyle = "#f2f2f2";
    ctx.fillText(String(n), cx, cy + r * 0.05);
  }

  // 2. Two clocks
  function drawClocks() {
    var b = prep(), w = b.width, h = b.height;
    var r = Math.min(w * 0.19, h * 0.27), cy = h * 0.42;
    [["BERKELEY", "America/Los_Angeles", w * 0.27], ["SINGAPORE", "Asia/Singapore", w * 0.73]].forEach(function (c) {
      var t = zoneTime(c[1]), cx = c[2];
      ctx.strokeStyle = "rgba(255,255,255,0.8)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.lineWidth = 1.2;
      for (var k = 0; k < 12; k++) {
        var a = k * Math.PI / 6, inner = k % 3 === 0 ? 0.8 : 0.9;
        ctx.beginPath();
        ctx.moveTo(cx + Math.sin(a) * r * inner, cy - Math.cos(a) * r * inner);
        ctx.lineTo(cx + Math.sin(a) * r * 0.97, cy - Math.cos(a) * r * 0.97);
        ctx.stroke();
      }
      function hand(turn, len, width, colour) {
        var a2 = turn * Math.PI * 2;
        ctx.strokeStyle = colour; ctx.lineWidth = width; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(a2) * r * len, cy - Math.cos(a2) * r * len); ctx.stroke();
      }
      hand(((t.h % 12) + t.m / 60) / 12, 0.5, 3, "#f2f2f2");
      hand((t.m + t.s / 60) / 60, 0.74, 2, "#f2f2f2");
      hand(t.s / 60, 0.8, 1, "#ff8073");
      ctx.fillStyle = "#f2f2f2";
      ctx.font = "700 " + Math.round(r * 0.3) + "px " + FACE;
      ctx.fillText(two(t.h) + ":" + two(t.m), cx, cy + r + r * 0.42);
      ctx.fillStyle = "#b9b7b0";
      ctx.font = Math.round(Math.max(10, r * 0.2)) + "px " + FACE;
      ctx.fillText(c[0], cx, cy + r + r * 0.78);
    });
  }

  // 3. Live scene heading
  function showHeading() {
    var box = el("div", "sc-heading"), line = el("b"), clock = el("span");
    box.appendChild(line); box.appendChild(clock);
    overlay.appendChild(box);
    function tick() { var s = sceneHeading(); line.textContent = s.text; clock.textContent = s.clock; }
    tick();
    ticker = window.setInterval(tick, 15000);
  }

  // 4. Opening scene that types itself
  function showFadeIn() {
    var box = el("div", "sc-fade");
    var page = el("div", "sc-titlepage");
    var lines = [el("b", "sc-title"), el("span"), el("span"), el("b"), el("b"), el("p")];
    lines.slice(0, 3).forEach(function (n) { page.appendChild(n); });
    box.appendChild(page);
    lines.slice(3).forEach(function (n) { box.appendChild(n); });
    var pool = [].concat(S.opening || []);
    var pickAt = Math.floor(Math.random() * pool.length);
    try {   // step through the lines in order, one per visit
      pickAt = ((Number(localStorage.getItem("opening")) || 0) + (openingCounted ? 0 : 1)) % (pool.length || 1);
      localStorage.setItem("opening", String(pickAt));
    } catch (e) {}
    openingCounted = true;
    var text = [S.title || "", "by", "Ian Pua", "FADE IN:", sceneHeading().text, pool[pickAt] || ""];
    var cursor = el("span", "cursor");
    overlay.appendChild(box);
    if (motionOff()) { lines.forEach(function (n, i) { n.textContent = text[i]; }); return; }
    var li = 0, ci = 0;
    function step() {
      if (li >= lines.length) { lines[lines.length - 1].appendChild(cursor); return; }
      ci++;
      lines[li].textContent = text[li].slice(0, ci);
      lines[li].appendChild(cursor);
      var pause = 36;
      if (ci >= text[li].length) { li++; ci = 0; pause = li === 3 ? 900 : 420; }
      typer = window.setTimeout(step, pause);
    }
    typer = window.setTimeout(step, 400);
  }

  // 5. Clapperboard slate
  function showSlate() {
    var take = 1;
    try {
      take = (Number(localStorage.getItem("take")) || 0) + (slateCounted ? 0 : 1);
      localStorage.setItem("take", String(take));
    } catch (e) {}
    slateCounted = true;
    var d = new Date();
    var MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    var box = el("div", "sc-slate");
    box.appendChild(el("div", "sticks"));
    var dl = el("dl");
    [["PRODUCTION", "Ian Pua"], ["SCENE", "Home"], ["TAKE", String(take)],
     ["DATE", two(d.getDate()) + " " + MONTHS[d.getMonth()] + " " + d.getFullYear()]].forEach(function (f) {
      var cell = el("div");
      cell.appendChild(el("dt", "", f[0]));
      cell.appendChild(el("dd", "", f[1]));
      dl.appendChild(cell);
    });
    box.appendChild(dl);
    overlay.appendChild(box);
  }
  var slateCounted = false, openingCounted = false;

  var SCREENS = [
    { key: "heading", name: "Live scene heading" },
    { key: "fadein", name: "Opening scene" },
    { key: "slate", name: "Clapperboard" },
    { key: "clocks", name: "Two clocks" },
    { key: "leader", name: "Countdown only" }
  ];
  var screenIndex = 0;

  function stopScreen() {
    if (raf) { window.cancelAnimationFrame(raf); raf = 0; }
    if (typer) { window.clearTimeout(typer); typer = 0; }
    if (ticker) { window.clearInterval(ticker); ticker = 0; }
  }
  function startScreen() {
    stopScreen();
    if (!ctx || !overlay) return;
    var key = SCREENS[screenIndex].key;
    overlay.textContent = "";
    overlay.hidden = key === "leader" || key === "clocks";
    prep();
    if (key === "leader") {
      if (motionOff()) drawLeader(250);
      else raf = window.requestAnimationFrame(function loop(t) { drawLeader(t); raf = window.requestAnimationFrame(loop); });
    } else if (key === "clocks") {
      drawClocks();
      ticker = window.setInterval(drawClocks, motionOff() ? 15000 : 1000);
    } else if (key === "heading") showHeading();
    else if (key === "fadein") showFadeIn();
    else showSlate();
  }
  function startLeader() { startScreen(); }   // called when the home page is shown
  function stopLeader() { stopScreen(); }
  window.addEventListener("resize", function () {
    if (!onHome || !ctx) return;
    var key = SCREENS[screenIndex].key;
    if (key === "clocks") drawClocks();
    if (key === "leader" && motionOff()) drawLeader(250);
  });

  SCREENS.forEach(function (sc, i) { if (sc.key === (S.screen || "fadein")) screenIndex = i; });

  document.querySelectorAll("[data-sticker]").forEach(function (n) { if (!n.firstChild) n.innerHTML = STICKERS[n.getAttribute("data-sticker")] || ""; });
  show();
})();
