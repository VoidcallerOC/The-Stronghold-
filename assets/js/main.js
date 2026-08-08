/* =========================================================
   THE STRONGHOLD — interactive site behaviour
   Vanilla JS, no dependencies. Edit the DATA block below
   to update games, events and hours — no other changes needed.
   ========================================================= */

/* ------------------------------------------------------------------
   DATA — the only thing you normally need to edit.
   ------------------------------------------------------------------ */
const GAMES = [
  { tag: "Trading Card Game", name: "Magic: The Gathering", note: "Singles, sealed, Commander decks & supplies.", suit: "🔮", color: "#c06b2e" },
  { tag: "Trading Card Game", name: "Pokémon", note: "Booster boxes, ETBs, singles & league play.", suit: "⚡", color: "#e0b400" },
  { tag: "Trading Card Game", name: "Yu-Gi-Oh!", note: "Structure decks, tins, singles & tournaments.", suit: "🎴", color: "#7a4dd0" },
  { tag: "Trading Card Game", name: "One Piece TCG", note: "The fastest-growing anime TCG — sealed & singles.", suit: "🏴‍☠️", color: "#c0392b" },
  { tag: "Trading Card Game", name: "Disney Lorcana", note: "Inklands await — sets, singles & starter decks.", suit: "✨", color: "#2e86c0" },
  { tag: "Gear", name: "Supplies & Accessories", note: "Sleeves, deck boxes, binders, playmats & more.", suit: "🛡️", color: "#6CBE45" },
];

// Weekly play schedule. Times are illustrative — update from your real calendar.
const EVENTS = [
  { day: "Thursday",  title: "Commander Night", time: "Casual EDH · Grab a pod" },
  { day: "Friday",    title: "Friday Night Magic", time: "Draft & Constructed · WPN" },
  { day: "Saturday",  title: "Pokémon League", time: "All ages · Open play" },
  { day: "Sunday",    title: "Open Gaming", time: "Tables open · Bring your crew" },
];

// Store hours. Order = Sunday..Saturday to match Date.getDay().
// closed:true renders "Closed". Verify against your real hours before launch.
const HOURS = [
  { day: "Sunday",    open: "12:00 PM", close: "8:00 PM" },
  { day: "Monday",    open: "12:00 PM", close: "8:00 PM" },
  { day: "Tuesday",   open: "12:00 PM", close: "8:00 PM" },
  { day: "Wednesday", open: "2:00 PM",  close: "7:30 PM" },
  { day: "Thursday",  open: "2:00 PM",  close: "10:00 PM" },
  { day: "Friday",    open: "2:00 PM",  close: "8:00 PM" },
  { day: "Saturday",  open: "2:00 PM",  close: "8:00 PM" },
];

// Cards for the "Pull A Card" reveal.
/* ------------------------------------------------------------------
   Helpers
   ------------------------------------------------------------------ */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------
   Render: games
   ------------------------------------------------------------------ */
function renderGames() {
  const grid = $("#gamesGrid");
  if (!grid) return;
  grid.innerHTML = GAMES.map((g, i) => `
    <article class="game" data-reveal data-reveal-delay="${(i % 4) + 1}">
      <div class="glow" style="background:${g.color}"></div>
      <span class="tag">${g.tag}</span>
      <div>
        <h4>${g.name}</h4>
        <p>${g.note}</p>
      </div>
      <span class="chip-suit">${g.suit}</span>
    </article>`).join("");
}

/* ------------------------------------------------------------------
   Render: events
   ------------------------------------------------------------------ */
function renderEvents() {
  const grid = $("#eventsGrid");
  if (!grid) return;
  grid.innerHTML = EVENTS.map((e, i) => `
    <article class="event" data-reveal data-reveal-delay="${(i % 4) + 1}">
      <span class="day">${e.day}</span>
      <h4>${e.title}</h4>
      <span class="time">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
        ${e.time}
      </span>
    </article>`).join("");
}

/* ------------------------------------------------------------------
   Render: hours (highlight today)
   ------------------------------------------------------------------ */
function renderHours() {
  const list = $("#hoursList");
  if (!list) return;
  const today = new Date().getDay(); // 0 = Sunday
  list.innerHTML = HOURS.map((h, i) => `
    <li class="${i === today ? "today" : ""}">
      <span class="d">${h.day}</span>
      <span class="t">${h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
    </li>`).join("");
}

/* ------------------------------------------------------------------
   Scroll reveal
   ------------------------------------------------------------------ */
function initReveal() {
  const els = $$("[data-reveal]");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  els.forEach((el) => io.observe(el));
}

/* ------------------------------------------------------------------
   Nav: scrolled state + mobile menu + smooth anchors
   ------------------------------------------------------------------ */
function initNav() {
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("#navToggle");
  const closeMenu = () => { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navMenu a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
}

/* ------------------------------------------------------------------
   Custom cursor glow (desktop, pointer:fine only)
   ------------------------------------------------------------------ */
function initCursor() {
  const glow = $(".cursor-glow");
  if (!glow || reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
  let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
  window.addEventListener("mousemove", (e) => {
    tx = e.clientX; ty = e.clientY;
    document.body.classList.add("cursor-active");
  });
  (function loop() {
    x += (tx - x) * 0.14; y += (ty - y) * 0.14;
    glow.style.transform = `translate(${x}px, ${y}px)`;
    requestAnimationFrame(loop);
  })();
}

/* ------------------------------------------------------------------
   Hero floating cards + parallax
   ------------------------------------------------------------------ */
function initHeroCards() {
  const layer = $("#heroCards");
  if (!layer) return;
  const spots = [
    { l: "8%",  t: "22%", r: -14, d: 0 },
    { l: "16%", t: "64%", r: 10,  d: 1 },
    { l: "78%", t: "18%", r: 12,  d: 2 },
    { l: "86%", t: "60%", r: -10, d: 3 },
    { l: "50%", t: "78%", r: 6,   d: 4 },
  ];
  if (reduceMotion) return;
  layer.innerHTML = spots.map((s) =>
    `<div class="float-card" style="left:${s.l};top:${s.t};transform:rotate(${s.r}deg)" data-depth="${s.d}"><i></i></div>`
  ).join("");

  const cards = $$(".float-card", layer);
  // gentle idle float
  cards.forEach((c, i) => {
    c.animate(
      [{ transform: c.style.transform + " translateY(0px)" },
       { transform: c.style.transform + " translateY(-18px)" },
       { transform: c.style.transform + " translateY(0px)" }],
      { duration: 6000 + i * 900, iterations: Infinity, easing: "ease-in-out" }
    );
  });

  // mouse parallax
  if (window.matchMedia("(pointer:fine)").matches) {
    window.addEventListener("mousemove", (e) => {
      const dx = (e.clientX / innerWidth - 0.5);
      const dy = (e.clientY / innerHeight - 0.5);
      cards.forEach((c) => {
        const depth = (+c.dataset.depth + 1) * 6;
        c.style.marginLeft = `${dx * depth * -1}px`;
        c.style.marginTop = `${dy * depth * -1}px`;
      });
    }, { passive: true });
  }
}

/* ------------------------------------------------------------------
   3D tilt on pillar cards
   ------------------------------------------------------------------ */
function initTilt() {
  if (reduceMotion || !window.matchMedia("(pointer:fine)").matches) return;
  $$(".tilt").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${py * -6}deg) rotateY(${px * 8}deg)`;
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

/* ------------------------------------------------------------------
   Misc
   ------------------------------------------------------------------ */
function initMisc() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
  // duplicate marquee content for a seamless loop
  const track = $("#marquee");
  if (track) track.innerHTML += track.innerHTML;
}

/* ------------------------------------------------------------------
   Boot
   ------------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderGames();
  renderEvents();
  renderHours();
  initMisc();
  initReveal();
  initNav();
  initCursor();
  initHeroCards();
  initTilt();
});
