/* Builds six margin options (round two) and a chooser to switch them on and off. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function side(cls, which) { var d = el("div", "mg " + cls + " " + which); d.setAttribute("aria-hidden", "true"); document.body.appendChild(d); return d; }
  var art = window.__ART || { draw: function () { return ""; }, stickers: {}, keys: [] };
  var body = document.body;

  // A. stickers floating in both margins
  (function () {
    var L = side("mg-scatter", "l"), R = side("mg-scatter", "r");
    var items = [
      [L, "S:cards", 16, 92, -8, 0.10], [L, "M:fox", 40, 76, 6, 0.16], [L, "S:popcorn", 62, 80, -5, 0.07], [L, "M:planet", 84, 72, 9, 0.13],
      [R, "S:ticket", 14, 128, 7, 0.14], [R, "S:boulder", 36, 96, -7, 0.08], [R, "M:camera", 58, 76, 5, 0.17], [R, "M:atom", 79, 78, -9, 0.11]
    ];
    items.forEach(function (it) {
      var wrap = el("div", "sc"), inner = el("span");
      var kind = it[1].split(":");
      inner.innerHTML = kind[0] === "S" ? (art.stickers[kind[1]] || "") : art.draw(kind[1]);
      wrap.style.top = it[2] + "%"; wrap.style.width = it[3] + "px";
      wrap.style.setProperty("--k", it[5]); inner.style.setProperty("--r", it[4] + "deg");
      inner.style.animationDelay = (it[2] % 7) / 4 + "s";
      wrap.appendChild(inner); it[0].appendChild(wrap);
    });
  })();

  // B. footprints walking down the left margin as you scroll
  var prints = [];
  (function () {
    var L = side("mg-steps", "l");
    var svg = document.createElementNS(NS, "svg");
    var N = 16, H = 1000;
    svg.setAttribute("viewBox", "0 0 110 " + H);
    svg.setAttribute("preserveAspectRatio", "xMidYMin meet");
    var html = '<g transform="translate(30 6) scale(1.1)"><path d="M18 40 a22 22 0 0 1 44 0 z" fill="#3a5429"/><path d="M12 40 h56" stroke="#3a5429" stroke-width="5" stroke-linecap="round"/><path d="M26 32 V0" stroke="#171717" stroke-width="2.200" stroke-linecap="round"/></g>';
    for (var i = 0; i < N; i++) {
      var t = i / (N - 1), y = 90 + t * (H - 230), x = 55 + (i % 2 ? 13 : -13) + Math.sin(t * 6) * 10;
      var mix = Math.round(100 * (1 - t));
      var shape = t < 0.5
        ? '<rect x="-7" y="-13" width="14" height="15" rx="4"/><rect x="-6" y="5" width="12" height="8" rx="2.500"/>'
        : '<ellipse cx="0" cy="-5" rx="6.500" ry="9"/><ellipse cx="0" cy="9" rx="5" ry="4.600"/>';
      html += '<g class="fp" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (180 + (i % 2 ? -10 : 10)) + ')" style="fill:color-mix(in srgb, #4f6f3a ' + mix + '%, #003262)">' + shape + '</g>';
    }
    html += '<g transform="translate(34 ' + (H - 118) + ')"><path d="M21 0 L14 24 H28 Z" fill="#fdb515"/><rect x="11" y="24" width="20" height="13" rx="1" fill="#003262"/><rect x="13" y="37" width="16" height="66" fill="#003262"/><circle cx="21" cy="50" r="4" fill="#fdb515"/><path d="M3 103 h36" stroke="#003262" stroke-width="4" stroke-linecap="round"/></g>';
    svg.innerHTML = html;
    L.appendChild(svg);
    prints = Array.prototype.slice.call(svg.querySelectorAll(".fp"));
  })();

  // C. taped polaroids (drawings stand in for your own photos)
  (function () {
    var L = side("mg-polaroids", "l"), R = side("mg-polaroids", "r");
    [[L, 24, -6, "S:boulder", "the wall", 0.05], [L, 64, 5, "M:jelly", "underwater", 0.12],
     [R, 16, 6, "M:dunes", "somewhere far", 0.10], [R, 54, -5, "M:sunrise", "5am, again", 0.06]].forEach(function (p) {
      var wrap = el("div", "pol"), card = el("div"), shot = el("div", "shot");
      var kind = p[3].split(":");
      shot.innerHTML = kind[0] === "S" ? (art.stickers[kind[1]] || "") : art.draw(kind[1]);
      card.appendChild(shot); card.appendChild(el("p", "", p[4]));
      card.style.setProperty("--r", p[2] + "deg");
      wrap.style.top = p[1] + "%"; wrap.style.setProperty("--k", p[5]);
      wrap.appendChild(card); p[0].appendChild(wrap);
    });
  })();

  // D. marquee lights
  ["l", "r"].forEach(function (w) {
    var col = el("div", "bulbs");
    for (var i = 0; i < 22; i++) { var b = el("i"); b.style.setProperty("--i", w === "l" ? i : 21 - i); col.appendChild(b); }
    side("mg-marquee", w).appendChild(col);
  });

  // E. theatre curtains
  ["l", "r"].forEach(function (w) { side("mg-curtains", w).appendChild(el("div", "drape")); });

  // F. climbing rope: the carabiner slides down as you scroll
  (function () {
    var R = side("mg-rope", "r");
    R.appendChild(el("div", "rope")); R.appendChild(el("div", "bolt"));
    [["#b3261e", 22, -46], ["#fdb515", 41, 22], ["#2f6b3a", 60, -50], ["#ff8a3d", 78, 26]].forEach(function (h) {
      var d = el("div", "hold"); d.style.background = h[0]; d.style.top = h[1] + "%"; d.style.left = "calc(50% + " + h[2] + "px)"; R.appendChild(d);
    });
    var biner = el("div", "biner");
    biner.innerHTML = '<svg viewBox="0 0 60 84"><path d="M14 8 H34 a18 18 0 0 1 18 18 V52 a24 24 0 0 1 -24 24 a18 18 0 0 1 -18 -18 V12 a4 4 0 0 1 4 -4 Z" fill="none" stroke="#b3261e" stroke-width="7" stroke-linejoin="round"/><path d="M19 18 V58" stroke="#8a8f98" stroke-width="5" stroke-linecap="round"/></svg>';
    R.appendChild(biner);
  })();

  // scroll drives the parallax, the footprints and the carabiner
  function onScroll() {
    var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    body.style.setProperty("--sy", String(Math.round(window.scrollY)));
    body.style.setProperty("--p", p.toFixed(4));
    var lit = Math.round(p * prints.length);
    prints.forEach(function (n, i) { n.classList.toggle("on", i < Math.max(1, lit)); });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("hashchange", function () { setTimeout(onScroll, 60); });
  onScroll();

  // the chooser
  var OPTS = [["m-scatter", "A Stickers"], ["m-steps", "B Footprints"], ["m-polaroids", "C Polaroids"], ["m-marquee", "D Marquee lights"], ["m-curtains", "E Curtains"], ["m-rope", "F Climbing rope"]];
  var bar = el("div", "chooser");
  bar.appendChild(el("b", "", "Margins:"));
  var on = {};
  try { on = JSON.parse(localStorage.getItem("margins2") || "{}"); } catch (e) {}
  if (!Object.keys(on).length) on = { "m-scatter": true };
  OPTS.forEach(function (o) {
    var b = el("button", "", o[1]); b.type = "button";
    function paint() { b.setAttribute("aria-pressed", String(!!on[o[0]])); body.classList.toggle(o[0], !!on[o[0]]); }
    b.addEventListener("click", function () { on[o[0]] = !on[o[0]]; paint(); try { localStorage.setItem("margins2", JSON.stringify(on)); } catch (e) {} });
    paint(); bar.appendChild(b);
  });
  bar.appendChild(el("span", "warn", "Make this window wider to see the margins (laptop or desktop width)."));
  body.appendChild(bar);
})();
