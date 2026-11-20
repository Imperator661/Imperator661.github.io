(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var themeBtn = document.getElementById("theme-toggle");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

  function currentTheme() {
    return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
  }

  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
  });

  /* ---------- Mobile menu ---------- */
  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menu-toggle");

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenu(false);
  });

  /* ---------- Highlight the section in view ---------- */
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll("a"));
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (a) {
      var section = document.querySelector(a.getAttribute("href"));
      if (section) sectionObserver.observe(section);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Project filter ---------- */
  var chips = document.querySelectorAll(".filters .chip");
  var projects = document.querySelectorAll(".project");

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      var filter = chip.dataset.filter;
      chips.forEach(function (c) {
        var active = c === chip;
        c.classList.toggle("is-active", active);
        c.setAttribute("aria-pressed", String(active));
      });
      projects.forEach(function (p) {
        var cats = p.dataset.cat.split(" ");
        var show = filter === "all" || cats.indexOf(filter) !== -1;
        p.classList.toggle("is-hidden", !show);
        if (show) p.classList.add("is-visible");
      });
    });
  });

  /* ---------- Terminal typing ---------- */
  var term = document.getElementById("terminal");
  var lines = [
    { text: "$ run news-radar", cls: "t-cmd", typed: true },
    { text: "✓ 10 feeds fetched (HR + DE)", cls: "t-ok" },
    { text: "✓ 214 items → 9 relevant", cls: "t-ok" },
    { text: "✓ 9 sent to the newsroom on Telegram", cls: "t-ok" },
    { text: "done in 4.2 s", cls: "t-dim" }
  ];

  function span(text, cls) {
    var s = document.createElement("span");
    s.className = cls;
    s.textContent = text;
    return s;
  }

  function renderStatic() {
    var code = document.createElement("code");
    lines.forEach(function (l, i) {
      code.appendChild(span(l.text, l.cls));
      if (i < lines.length - 1) code.appendChild(document.createTextNode("\n"));
    });
    term.replaceChildren(code);
  }

  function animate() {
    var code = document.createElement("code");
    var cursor = document.createElement("span");
    cursor.className = "cursor";
    term.replaceChildren(code);

    var lineIndex = 0;

    function nextLine() {
      if (lineIndex >= lines.length) {
        code.appendChild(document.createTextNode("\n"));
        code.appendChild(cursor);
        setTimeout(restart, 5000);
        return;
      }
      var line = lines[lineIndex];
      if (lineIndex > 0) code.appendChild(document.createTextNode("\n"));
      var s = span("", line.cls);
      code.appendChild(s);
      code.appendChild(cursor);

      if (line.typed) {
        var i = 0;
        (function typeChar() {
          s.textContent = line.text.slice(0, ++i);
          if (i < line.text.length) setTimeout(typeChar, 45 + Math.random() * 40);
          else { lineIndex++; setTimeout(nextLine, 500); }
        })();
      } else {
        s.textContent = line.text;
        lineIndex++;
        setTimeout(nextLine, 420);
      }
    }

    function restart() {
      code.replaceChildren();
      lineIndex = 0;
      nextLine();
    }

    nextLine();
  }

  if (term) {
    if (reduceMotion) renderStatic();
    else animate();
  }

  /* ---------- Copy email ---------- */
  var toast = document.getElementById("toast");
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("is-shown"); }, 2200);
  }

  var copyBtn = document.getElementById("copy-email");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email;
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(
          function () { showToast("Email copied"); },
          function () { showToast(email); }
        );
      } else {
        showToast(email);
      }
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
