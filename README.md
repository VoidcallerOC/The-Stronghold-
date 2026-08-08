# The Stronghold — Website

The official website for **The Stronghold** — gaming, vintage collectibles &
trading cards in Plainville, CT. _Buy · Sell · Trade · Play._

A fast, fully interactive, **zero-build** static site. No frameworks, no
compile step — just open `index.html`. That means it hosts anywhere and stays
easy to update for years.

```
index.html            ← page markup & content
assets/
  css/styles.css      ← all styling / design system
  js/main.js          ← interactions + EDITABLE content (games, events, hours)
  img/mark.svg        ← shield + tower logo mark
  img/favicon.svg     ← browser tab icon
vercel.json           ← deploy config (optional)
```

## Preview it locally

Because the paths are absolute (`/assets/...`), run a tiny local server rather
than double-clicking the file:

```bash
# from this folder — pick whichever you have
python3 -m http.server 8000      # → http://localhost:8000
# or
npx serve .
```

## Update the content (no coding needed)

Open **`assets/js/main.js`** and edit the blocks at the top:

- **`GAMES`** — the games/collectibles cards on the shelf.
- **`EVENTS`** — the weekly play schedule.
- **`HOURS`** — store hours. Order is Sunday → Saturday. Set `closed: true` on a
  day to show "Closed". Today's row auto-highlights.
- **`PULLS`** — the fun "Pull a Card" reveal cards.

Business name, address `433 East St, Plainville, CT 06062`, and phone
`(860) 280-6546` live in **`index.html`** (search for them to change).

> **Before launch:** double-check the hours in `HOURS` against the real store
> schedule — they were seeded from public listings and should be confirmed.

## Deploy

Any static host works. Easiest options:

- **Vercel** — import the repo (or `npx vercel`). `vercel.json` is included.
- **Netlify** — drag-and-drop this folder, or connect the repo.
- **GitHub Pages** — enable Pages on the branch, serve from root.

Point the domain **strongholdct.com** at whichever host you choose.

## Notes

- Fonts (Anton / Oswald / Inter) load from Google Fonts. To go fully offline,
  self-host them and swap the `<link>` in `index.html`.
- Respects `prefers-reduced-motion` and is fully keyboard-navigable.
- Includes SEO meta tags, Open Graph, and LocalBusiness structured data.
