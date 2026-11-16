/* Four ways to show your photos, with a chooser to switch between them. */
(function () {
  "use strict";
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var body = document.body;
  // captions are placeholders: change them to your own words
  var PHOTOS = [
    { src: "img/p-sunset.jpg", cap: "sun going down on the bay" },
    { src: "img/p-wall.jpg", cap: "the wall" },
    { src: "img/p-stadium.jpg", cap: "game day sky" },
    { src: "img/p-pole.jpg", cap: "found on a pole in the fog" },
    { src: "img/p-koi.jpg", cap: "koi" },
    { src: "img/p-boats.jpg", cap: "small boats, big wind" }
  ];
  function frame(p, r) {
    var f = el("div", "pframe"), img = el("img");
    img.src = p.src; img.alt = p.cap; img.loading = "lazy";
    f.appendChild(img); f.appendChild(el("p", "", p.cap));
    if (r != null) f.style.setProperty("--r", r + "deg");
    return f;
  }
  function section(cls, title) {
    var s = el("section", cls);
    s.appendChild(el("h2", "h-small", title));
    var anchor = document.querySelector(".home-index");
    anchor.parentNode.insertBefore(s, anchor);
    return s;
  }

  // 1. polaroids in the side margins
  var L = el("div", "mg l"), R = el("div", "mg r");
  [L, R].forEach(function (d) { d.setAttribute("aria-hidden", "true"); body.appendChild(d); });
  [[L, 0, 14, -6, 0.05], [L, 1, 44, 5, 0.11], [L, 2, 74, -4, 0.07], [R, 3, 12, 6, 0.09], [R, 4, 42, -5, 0.05], [R, 5, 72, 4, 0.12]].forEach(function (p) {
    var wrap = el("div", "pol");
    wrap.style.top = p[2] + "%"; wrap.style.setProperty("--k", p[4]);
    var f = frame(PHOTOS[p[1]], p[3]); f.style.animationDelay = (p[1] * 0.7) + "s";
    wrap.appendChild(f); p[0].appendChild(wrap);
  });
  window.addEventListener("scroll", function () { body.style.setProperty("--sy", String(Math.round(window.scrollY))); }, { passive: true });

  // 2. photo wall
  var wall = section("wall", "Lately");
  var grid = el("div", "wall-grid");
  PHOTOS.forEach(function (p, i) { grid.appendChild(frame(p, [-5, 4, -3, 6, -4, 3][i])); });
  wall.appendChild(grid);

  // 3. film strip
  var reelSec = section("reel-sec", "Lately");
  var reel = el("div", "reel"), track = el("div", "reel-track");
  PHOTOS.concat(PHOTOS).forEach(function (p) {
    var fig = el("figure"), img = el("img"); img.src = p.src; img.alt = p.cap;
    fig.appendChild(img); fig.appendChild(el("figcaption", "", p.cap)); track.appendChild(fig);
  });
  reel.appendChild(track); reelSec.appendChild(reel);

  // 4. a pile you flick through
  var pileSec = section("pile-sec", "Lately");
  var row = el("div", "pile-row"), pile = el("div", "pile"), side = el("div");
  var hint = el("p", "pile-hint", "← tap the pile"), count = el("p", "pile-count");
  side.appendChild(hint); side.appendChild(count);
  var order = PHOTOS.map(function (_, i) { return i; });
  var cards = PHOTOS.map(function (p) { var f = frame(p, 0); pile.appendChild(f); return f; });
  var TILT = [-7, 5, -3, 8, -5, 3];
  function lay() {
    order.forEach(function (idx, pos) {
      var c = cards[idx];
      c.style.zIndex = String(order.length - pos);
      c.style.transform = "translate(" + pos * 5 + "px, " + pos * 4 + "px) rotate(" + (pos === 0 ? -2 : TILT[idx]) + "deg)";
      c.style.opacity = pos > 3 ? "0" : "1";
    });
    count.textContent = (PHOTOS.length - order.indexOf(order[0]) ) && ("Photo " + (order[0] + 1) + " of " + PHOTOS.length);
  }
  pile.addEventListener("click", function () {
    var top = cards[order[0]];
    top.style.transform = "translate(280px, -30px) rotate(24deg)";   // flick the top one away
    window.setTimeout(function () { order.push(order.shift()); lay(); }, 260);
  });
  pile.setAttribute("role", "button"); pile.setAttribute("tabindex", "0"); pile.setAttribute("aria-label", "Next photo");
  pile.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pile.click(); } });
  row.appendChild(pile); row.appendChild(side); pileSec.appendChild(row);
  lay();

  // the chooser: one at a time
  var OPTS = [["m-wall", "1 Photo wall"], ["m-pile", "2 Pile to flick through"], ["m-reel", "3 Film strip"], ["m-sides", "4 In the margins"]];
  var bar = el("div", "chooser");
  bar.appendChild(el("b", "", "Photos:"));
  var current = "m-wall";
  try { current = localStorage.getItem("photos") || current; } catch (e) {}
  var btns = [];
  function paint() {
    OPTS.forEach(function (o, i) { body.classList.toggle(o[0], o[0] === current); btns[i].setAttribute("aria-pressed", String(o[0] === current)); });
  }
  OPTS.forEach(function (o) {
    var b = el("button", "", o[1]); b.type = "button";
    b.addEventListener("click", function () { current = o[0]; try { localStorage.setItem("photos", current); } catch (e) {} paint(); });
    btns.push(b); bar.appendChild(b);
  });
  body.appendChild(bar);
  paint();
})();
