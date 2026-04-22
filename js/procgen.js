// Procedural Kandinsky-ish decorations.
// All output is SVG, deterministic per-seed via Mulberry32 — refresh = same scene.

(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  // procgen palette — distilled from the bottom (chromatic) half of the
  // seed_image k-means. The dominant greys in the source are skipped
  // intentionally so generated motifs read as colorful accents rather
  // than wallpaper.
  const PALETTE = {
    ink:       "#15324d",   // primary dark — strokes & faint dots
    darkslate: "#3f536a",   // cool dark
    midblue:   "#5e84b9",   // medium chromatic blue
    bluegray:  "#8490a1",   // soft cool neutral (used sparingly)
    peach:     "#e3ae84",
    pink:      "#cd8f7c",
    orange:    "#cb592f",
    amber:     "#de934d"
  };

  // balanced fill set — includes both warm and cool but no flat greys
  const FILL_KEYS = [
    "darkslate", "midblue", "bluegray",
    "peach", "pink", "orange", "amber"
  ];

  // ── seeded PRNG ────────────────────────────────────────────────
  function mulberry32(seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const range  = (r, lo, hi) => lo + r() * (hi - lo);
  const choice = (r, arr)    => arr[Math.floor(r() * arr.length)];

  function el(name, attrs) {
    const node = document.createElementNS(SVG_NS, name);
    for (const k in attrs) node.setAttribute(k, attrs[k]);
    return node;
  }

  // ── ambient background scatter (full viewport, very faint) ─────
  function drawBackgroundScatter(svg) {
    const w = window.innerWidth;
    const h = Math.max(window.innerHeight, document.body.scrollHeight);
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("width", w);
    svg.setAttribute("height", h);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const r = mulberry32(20260421);

    // tiny dot scatter (lots, low alpha)
    const dots = Math.floor((w * h) / 9000);
    for (let i = 0; i < dots; i++) {
      const cx = range(r, 0, w);
      const cy = range(r, 0, h);
      const rr = range(r, 0.6, 1.6);
      svg.appendChild(el("circle", {
        cx, cy, r: rr,
        fill: PALETTE.ink,
        opacity: range(r, 0.05, 0.18).toFixed(3)
      }));
    }

    // sparse colored micro-squares
    const squares = Math.floor((w * h) / 95000);
    for (let i = 0; i < squares; i++) {
      const x = range(r, 0, w);
      const y = range(r, 0, h);
      const s = range(r, 3, 6);
      svg.appendChild(el("rect", {
        x, y, width: s, height: s,
        fill: PALETTE[choice(r, FILL_KEYS)],
        opacity: range(r, 0.18, 0.42).toFixed(3)
      }));
    }

    // a few faint giant orbit ellipses
    const orbits = 4 + Math.floor(r() * 3);
    for (let i = 0; i < orbits; i++) {
      const cx = range(r, -w * 0.1, w * 1.1);
      const cy = range(r, -h * 0.05, h * 1.05);
      const rx = range(r, 220, 540);
      const ry = range(r, 80, 280);
      const rot = range(r, -40, 40);
      svg.appendChild(el("ellipse", {
        cx, cy, rx, ry,
        transform: `rotate(${rot.toFixed(2)} ${cx} ${cy})`,
        fill: "none",
        stroke: PALETTE.ink,
        "stroke-width": 0.6,
        opacity: range(r, 0.05, 0.12).toFixed(3)
      }));
    }

    // a couple of vertical "axis" tick columns (Kandinsky-y)
    const cols = 1 + Math.floor(r() * 2);
    for (let i = 0; i < cols; i++) {
      const x = range(r, w * 0.05, w * 0.95);
      const yStart = range(r, 0, h * 0.4);
      const ticks = 6 + Math.floor(r() * 8);
      for (let t = 0; t < ticks; t++) {
        const y = yStart + t * range(r, 14, 26);
        if (y > h) break;
        svg.appendChild(el("rect", {
          x: x - 1, y, width: 2, height: range(r, 1.5, 4),
          fill: PALETTE.ink,
          opacity: range(r, 0.06, 0.16).toFixed(3)
        }));
      }
    }
  }

  // ── procedural composition for a placeholder box ───────────────
  function drawComposition(svg, seed) {
    const w = 400, h = 400;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const r = mulberry32(seed);

    // 1. faint underlying grid of dots in lower-left quadrant
    const gridX0 = range(r, 30, 90);
    const gridY0 = range(r, 220, 290);
    const cols = 6 + Math.floor(r() * 5);
    const rows = 5 + Math.floor(r() * 4);
    const step = range(r, 8, 11);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (r() < 0.25) continue;
        svg.appendChild(el("circle", {
          cx: gridX0 + i * step,
          cy: gridY0 + j * step,
          r: 0.9,
          fill: PALETTE.ink,
          opacity: 0.35
        }));
      }
    }

    // 2. a couple of thin orbit ellipses
    const orbitN = 2 + Math.floor(r() * 2);
    for (let i = 0; i < orbitN; i++) {
      const cx = range(r, w * 0.35, w * 0.65);
      const cy = range(r, h * 0.4,  h * 0.6);
      const rx = range(r, 110, 170);
      const ry = range(r, 50, 110);
      const rot = range(r, -45, 45);
      svg.appendChild(el("ellipse", {
        cx, cy, rx, ry,
        transform: `rotate(${rot.toFixed(2)} ${cx} ${cy})`,
        fill: "none",
        stroke: PALETTE.ink,
        "stroke-width": 0.7,
        opacity: 0.45
      }));
    }

    // 3. a few fine straight lines emanating from a focal point
    const fx = range(r, w * 0.3, w * 0.55);
    const fy = range(r, h * 0.55, h * 0.8);
    const lineN = 4 + Math.floor(r() * 4);
    for (let i = 0; i < lineN; i++) {
      const angle = range(r, -Math.PI * 0.85, -Math.PI * 0.15);
      const len   = range(r, 90, 180);
      const x2 = fx + Math.cos(angle) * len;
      const y2 = fy + Math.sin(angle) * len;
      svg.appendChild(el("line", {
        x1: fx, y1: fy, x2, y2,
        stroke: choice(r, [PALETTE.ink, PALETTE.midblue, PALETTE.orange]),
        "stroke-width": 0.8,
        opacity: 0.55,
        "stroke-dasharray": r() < 0.4 ? "2 3" : "0"
      }));
    }

    // 4. 3-5 large filled circles (the Kandinsky moons)
    const moonN = 3 + Math.floor(r() * 3);
    const usedKeys = [];
    for (let i = 0; i < moonN; i++) {
      let key;
      let attempts = 0;
      do {
        key = choice(r, FILL_KEYS);
        attempts++;
      } while (usedKeys.includes(key) && attempts < 6);
      usedKeys.push(key);

      const cx = range(r, 80, w - 80);
      const cy = range(r, 80, h - 100);
      const rad = range(r, 28, 78);
      svg.appendChild(el("circle", {
        cx, cy, r: rad,
        fill: PALETTE[key],
        opacity: range(r, 0.55, 0.95).toFixed(3)
      }));
    }

    // 5. a few small accent dots & one square
    const accentN = 6 + Math.floor(r() * 6);
    for (let i = 0; i < accentN; i++) {
      const cx = range(r, 20, w - 20);
      const cy = range(r, 20, h - 20);
      const rad = range(r, 1.6, 3.4);
      svg.appendChild(el("circle", {
        cx, cy, r: rad,
        fill: PALETTE[choice(r, FILL_KEYS)],
        opacity: 0.85
      }));
    }
    // one small filled square
    {
      const x = range(r, 30, w - 60);
      const y = range(r, 30, h - 60);
      const s = range(r, 8, 16);
      svg.appendChild(el("rect", {
        x, y, width: s, height: s,
        fill: PALETTE[choice(r, ["midblue", "orange", "ink"])],
        opacity: 0.85
      }));
    }
  }

  // ── small corner motif for project cards (subtle, lower-right) ─
  function drawCardMotif(svg, seed) {
    const w = 200, h = 200;
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const r = mulberry32(seed);

    // 1-2 large pale circles
    const moonN = 1 + Math.floor(r() * 2);
    for (let i = 0; i < moonN; i++) {
      const cx = range(r, w * 0.45, w * 0.85);
      const cy = range(r, h * 0.45, h * 0.85);
      const rad = range(r, 50, 90);
      svg.appendChild(el("circle", {
        cx, cy, r: rad,
        fill: PALETTE[choice(r, FILL_KEYS)],
        opacity: range(r, 0.18, 0.32).toFixed(3)
      }));
    }

    // a thin orbit
    const cx = range(r, w * 0.5, w * 0.85);
    const cy = range(r, h * 0.5, h * 0.85);
    svg.appendChild(el("ellipse", {
      cx, cy,
      rx: range(r, 60, 100),
      ry: range(r, 30, 70),
      transform: `rotate(${range(r, -45, 45).toFixed(1)} ${cx} ${cy})`,
      fill: "none",
      stroke: PALETTE.ink,
      "stroke-width": 0.6,
      opacity: 0.28
    }));

    // tiny dot grid
    const gx = range(r, w * 0.25, w * 0.55);
    const gy = range(r, h * 0.55, h * 0.8);
    const cols = 4 + Math.floor(r() * 3);
    const rows = 3 + Math.floor(r() * 3);
    const step = range(r, 6, 9);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (r() < 0.35) continue;
        svg.appendChild(el("circle", {
          cx: gx + i * step,
          cy: gy + j * step,
          r: 0.7,
          fill: PALETTE.ink,
          opacity: 0.35
        }));
      }
    }

    // a single small accent square
    if (r() < 0.7) {
      svg.appendChild(el("rect", {
        x: range(r, w * 0.3, w * 0.7),
        y: range(r, h * 0.3, h * 0.7),
        width: range(r, 5, 9),
        height: range(r, 5, 9),
        fill: PALETTE[choice(r, ["midblue", "orange", "ink"])],
        opacity: 0.55
      }));
    }
  }

  // ── boot ───────────────────────────────────────────────────────
  function init() {
    const bg = document.getElementById("bg-scatter");
    if (bg) drawBackgroundScatter(bg);

    const seeds = {
      "ph-hero":     90210,
      "ph-research": 13807,
      "ph-collab":   42424
    };
    for (const id in seeds) {
      const node = document.getElementById(id);
      if (node) drawComposition(node, seeds[id]);
    }

    // project card backgrounds — IDs are proj-bg-1 .. proj-bg-N
    document.querySelectorAll('[id^="proj-bg-"]').forEach((node, idx) => {
      // mix index into seed so each card gets a distinct, stable composition
      const n = parseInt(node.id.slice("proj-bg-".length), 10) || (idx + 1);
      drawCardMotif(node, 7331 + n * 1009);
    });
  }

  // wait until DOM + lower-fold rendered (shared.js renders into .pubs/.award
  // which extends the page height, so we redraw the bg after that too).
  document.addEventListener("DOMContentLoaded", () => {
    init();
    // give the inline renderer a tick to populate .pubs / .award
    setTimeout(() => {
      const bg = document.getElementById("bg-scatter");
      if (bg) drawBackgroundScatter(bg);
    }, 0);
  });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const bg = document.getElementById("bg-scatter");
      if (bg) drawBackgroundScatter(bg);
    }, 150);
  });
})();
