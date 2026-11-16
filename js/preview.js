/* Builds the six margin options and a chooser to switch them on and off. */
(function () {
  "use strict";
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  var body = document.body;

  // 1. scene numbers, restarting on each page
  document.querySelectorAll("[data-view]").forEach(function (view) {
    var n = 0;
    view.querySelectorAll(".page-title.slug, .sub, .home-about > h2, .home-index > h2").forEach(function (h) {
      n++;
      h.classList.add("scene-host");
      h.appendChild(el("span", "scene-no l", String(n)));
      h.appendChild(el("span", "scene-no r", String(n)));
    });
  });

  // 2. binder tabs
  var tabs = el("nav", "tabs");
  tabs.setAttribute("aria-label", "Sections");
  [["home", "Home"], ["work", "Work"], ["media", "Words"], ["offscreen", "Off screen"], ["resume", "Résumé"]].forEach(function (t) {
    var a = el("a", "", t[1]); a.href = "#" + t[0]; a.setAttribute("data-tab", t[0]); tabs.appendChild(a);
  });
  body.appendChild(tabs);
  var GROUP = { experience: "work", projects: "work", writing: "media", interests: "offscreen", adventures: "offscreen", about: "home" };
  function markTab() {
    var h = (location.hash || "#home").slice(1);
    if (h.indexOf("post-") === 0) h = "media";
    h = GROUP[h] || h;
    tabs.querySelectorAll("a").forEach(function (a) {
      if (a.getAttribute("data-tab") === h) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }
  window.addEventListener("hashchange", markTab); markTab();

  // 3. margin notes (placeholder wording: these should become your own)
  [[".card", "r", "150px", "← ask me about the poker thing"],
   [".home-about", "l", "70px", "all true →"],
   ["#sec-experience", "l", "50px", "the good stuff goes here →"],
   ["#sec-media", "r", "110px", "← watch Yi Yi. seriously."],
   ["#sec-interests", "l", "60px", "fingers still intact →"],
   ["#sec-adventures", "r", "200px", "← more pins soon"]].forEach(function (m) {
    var host = document.querySelector(m[0]);
    if (!host) return;
    host.classList.add("mnote-host");
    var note = el("span", "mnote " + m[1], m[3]);
    note.style.top = m[2];
    note.setAttribute("aria-hidden", "true");
    host.appendChild(note);
  });

  // 4. film strip that runs as you scroll
  var strip = el("div", "strip"), reel = el("div", "strip-reel");
  strip.setAttribute("aria-hidden", "true");
  var art = window.__ART;
  if (art) {
    for (var i = 0; i < 40; i++) {
      var f = el("div", "strip-frame");
      f.innerHTML = art.draw(art.keys[i % art.keys.length]);
      reel.appendChild(f);
    }
  }
  strip.appendChild(reel); body.appendChild(strip);
  var drift = 0;
  function runStrip() {
    drift += 0.25;
    var y = -((window.scrollY * 0.6 + drift) % (70 * 14));
    reel.style.transform = "translateY(" + y + "px)";
    window.requestAnimationFrame(runStrip);
  }
  if (!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches)) window.requestAnimationFrame(runStrip);

  // 5. page number and (CONTINUED)
  var pageno = el("div", "pageno", "1."), contd = el("div", "contd", "(CONTINUED)");
  body.appendChild(pageno); body.appendChild(contd);
  function pages() {
    var p = 1 + Math.floor((window.scrollY + 40) / window.innerHeight);
    pageno.textContent = p + ".";
    var atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 60;
    contd.style.visibility = atEnd ? "hidden" : "visible";
  }
  window.addEventListener("scroll", pages, { passive: true }); window.addEventListener("hashchange", function () { setTimeout(pages, 50); }); pages();

  // the chooser
  var OPTS = [["m-scenes", "1 Scene numbers"], ["m-tabs", "2 Binder tabs"], ["m-notes", "3 Margin notes"], ["m-strip", "4 Film strip"], ["m-pages", "5 Page number"], ["m-wide", "6 Wider page"]];
  var bar = el("div", "chooser");
  bar.appendChild(el("b", "", "Margins:"));
  var on = {};
  try { on = JSON.parse(localStorage.getItem("margins") || "{}"); } catch (e) {}
  if (!Object.keys(on).length) on = { "m-scenes": true };
  OPTS.forEach(function (o) {
    var b = el("button", "", o[1]); b.type = "button";
    function paint() { b.setAttribute("aria-pressed", String(!!on[o[0]])); body.classList.toggle(o[0], !!on[o[0]]); }
    b.addEventListener("click", function () { on[o[0]] = !on[o[0]]; paint(); try { localStorage.setItem("margins", JSON.stringify(on)); } catch (e) {} });
    paint(); bar.appendChild(b);
  });
  bar.appendChild(el("span", "warn", "Make this window wider to see the margins (laptop or desktop width)."));
  body.appendChild(bar);
})();
