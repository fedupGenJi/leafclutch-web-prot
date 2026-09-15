# Leafclutch Web

Frontend (Vite + React) and content API (Express + SQLite).

## Running it

Two terminals:

```bash
cd backend && npm install && npm start     # http://localhost:5000
cd frontend && npm install && npm run dev  # http://localhost:5173
```

Vite proxies `/api` and `/assets` to the backend, so open the frontend URL only.

On first boot the backend creates `backend/data/leafclutch.db`, creates any
missing tables, and seeds the ones that are empty. It logs which tables it
found versus created. Restarting never overwrites existing rows.

## Where images come from

| Image                                 | Served by                         |
| ------------------------------------- | --------------------------------- |
| Intro animation logo                  | `frontend/public/brandIcon.png` |
| Browser tab favicon                   | `frontend/public/brandIcon.png` |
| Everything on a page (navbar, footer) | backend`/assets/*`              |

The three backend assets are `logo-hor.png`, `logo-ver.png` and `icon.png`.
All four files have had their baked-in transparent padding trimmed, so CSS
sizing matches the visible artwork.

## API

| Route                    | Returns                                                              |
| ------------------------ | -------------------------------------------------------------------- |
| `GET /api/site`        | assets + heroContent + socials + services (one call for the browser) |
| `GET /api/hero`        | heroContent + socials                                                |
| `GET /api/services`    | services                                                             |
| `GET /api/jobs`        | jobs                                                                 |
| `GET /api/internships` | internships                                                          |
| `GET /api/health`      | liveness                                                             |

## Tables

- **hero_content** — one row. `description`, `email`, `phone_primary`,
  `phone_secondary`, `address_display`, `map_link`.
- **socials** — `platform`, `label`, `icon_key`, `url`, `sort_order`,
  `is_active`. A row is its own record so an admin can add or delete platforms
  without a migration. `icon_key` must match a key in
  `frontend/src/components/Icon.jsx`.
- **services** / **jobs** / **internships** — `slug`, `name`, `description`,
  `sort_order`, `is_active`.

## Placeholder behaviour

Nothing is wired to real pages yet, so every link points at `/404`.

Missing content renders the string `404` instead of collapsing to an empty
element — see `backend/utils/fallback.js`. Links are the exception: a missing
url becomes `null` rather than the string `404`, because `href="404"` would
resolve as a relative path. Socials with no url are dropped by the API and
never reach the footer, which is how the "show the icon only if a link exists"
rule is enforced.

If the API is unreachable entirely, the navbar and footer still render using
the placeholders in `frontend/src/api/site.js`.

## Layout notes

The navbar and footer share `--shell-min` (320px) and `--shell-max` (1320px)
from `index.css`. Between those the chrome scales with the viewport; outside
them it stops.

Breakpoints:

- **1100px** — footer brand block spans the full row, link columns sit beneath.
- **1024px** — navbar collapses to logo plus menu button.
- **720px** — every footer column stacks vertically.

The navbar logo scrolls to the top of the current page. The footer logo
navigates home.
