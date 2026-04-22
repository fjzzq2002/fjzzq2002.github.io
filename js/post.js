// Shared chrome for individual blog posts.
// Posts ship with bare-minimum HTML: <head> with title/description/og-tags
// (so SEO crawlers see real content) + <main class="page post"><article>...</article></main>.
// This script inserts the bg scatter, the site header, and the footer art.
//
// Assumed layout (absolute paths from site root):
//   /blog/<slug>/index.html  ← post
//   /js/post.js              ← this file
//   /css/style.css, /js/procgen.js
//   /assets/...

(function () {
  const SITE_HOME = "/";
  const BLOG_HOME = "/blog/";
  const ASSETS    = "/assets";

  // 1. ambient bg scatter — first thing in body so it sits behind everything
  const bg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  bg.classList.add("bg-scatter");
  bg.id = "bg-scatter";
  bg.setAttribute("aria-hidden", "true");
  document.body.insertBefore(bg, document.body.firstChild);

  // 2. site header — same brand + nav as everywhere else, with Blog active
  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="site-header-inner">
      <a href="${SITE_HOME}" class="brand">Ziqian Zhong</a>
      <nav class="top-nav" aria-label="Primary">
        <a href="${SITE_HOME}">Home</a>
        <a href="${BLOG_HOME}" class="active">Blog</a>
      </nav>
    </div>`;
  // place right after body opens (after bg)
  bg.after(header);

  // 3. footer art — same as the home page
  const footer = document.createElement("footer");
  footer.className = "footer-tag";
  footer.innerHTML = `
    <div class="footer-art" aria-hidden="true">
      <div class="footer-strip"></div>
      <img class="footer-art-left"  src="${ASSETS}/footer-clean-right.png" alt="">
      <img class="footer-art-right" src="${ASSETS}/footer-clean-left-flipped.png" alt="">
    </div>`;
  // append at end of body
  document.body.appendChild(footer);
})();
