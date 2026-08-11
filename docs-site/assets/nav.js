// docs-site/assets/nav.js
// Tiny progressive enhancement:
//   -1- mark the current page in the nav
//   -2- smooth-scroll fallback for #ids
//   -3- copy-link buttons on <pre> blocks
// (No frameworks. Runs in every modern browser.)

(function () {
  "use strict";

  // Mark current page
  var here = location.pathname.split("/").pop() || "index.html";
  var navs = document.querySelectorAll(".nav a");
  navs.forEach(function (a) {
    if (a.getAttribute("href") === here) {
      a.setAttribute("aria-current", "page");
    }
  });

  // Copy-link buttons on <pre>
  document.querySelectorAll("pre").forEach(function (pre) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--ghost";
    btn.style.position = "absolute";
    btn.style.right = "0.5rem";
    btn.style.top = "0.5rem";
    btn.style.fontSize = "0.8rem";
    btn.style.padding = "0.25em 0.5em";
    btn.textContent = "Copy";
    btn.setAttribute("aria-label", "Copy code");

    // Wrap pre if not already positioned
    var pos = getComputedStyle(pre).position;
    if (pos === "static") {
      pre.style.position = "relative";
    }
    pre.appendChild(btn);

    btn.addEventListener("click", function () {
      var txt = pre.innerText.replace(/^Copy\s*/, "");
      navigator.clipboard.writeText(txt).then(
        function () { btn.textContent = "Copied"; setTimeout(function(){ btn.textContent = "Copy"; }, 1500); },
        function () { btn.textContent = "Copy failed"; }
      );
    });
  });

  // Last-updated timestamp
  var ts = document.querySelector("[data-last-updated]");
  if (ts) {
    ts.textContent = new Date().toISOString().slice(0, 10);
  }

  // Truth-Diff filter (used on truth.html)
  var filter = document.querySelector("[data-truth-filter]");
  if (filter) {
    filter.addEventListener("input", function () {
      var q = filter.value.toLowerCase();
      document.querySelectorAll(".truth-row").forEach(function (row) {
        row.style.display = row.textContent.toLowerCase().indexOf(q) === -1 ? "none" : "";
      });
    });
  }
})();
