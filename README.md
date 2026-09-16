# Leafclutch Web

A small prototype site: a React (Vite) frontend plus an Express + Postgres API behind it, with an admin panel for editing content.

## Running it

Two terminals:

```bash
cd backend && npm install && npm start     # http://localhost:5000
cd frontend && npm install && npm run dev  # http://localhost:5173
```

Open the frontend URL — Vite proxies `/api` and `/assets` to the backend for you.

On first boot the backend creates its own Postgres tables, seeds any that are empty, and creates an admin login (it emails the generated password via Resend, or just prints it to the console if that fails). Restarting never touches existing rows.

## Where images come from

The logo used in the intro animation and the browser tab icon are the only images the frontend keeps locally (`frontend/public/`). Everything else on the actual pages — navbar, footer — is served by the backend from `backend/assets/*` at `/assets/*`.

## API

Public, no auth:

- `GET /api/site` — everything the homepage needs, one call
- `GET /api/hero`, `/api/services`, `/api/jobs`, `/api/internships`
- `GET /api/health`
- `POST /api/contact` — the contact form. Validates the body server-side (name, email, phone required), then emails it to `ADMIN_EMAIL` via Resend using the same `RESEND_API_KEY`/`RESEND_FROM_EMAIL` used for the admin-password email. Replies go to the visitor's address, not the from-address, since Resend requires a verified sender.

Everything under `/api/admin` needs a login: session/login, and CRUD for hero content, services, socials, jobs, and internships. Jobs and internships are two separate resources now (each with its own `GET/POST/PUT/DELETE`), not one merged list.

## Content model

- **hero_content** — one row: description, contact info, address, map link.
- **socials** — one row per platform (facebook, x, linkedin, ...). Adding or removing a platform is just a row, no migration needed. The icon shown for it, though, still comes from a fixed set built into the frontend — a genuinely new platform needs a small frontend change too, not just a new row.
- **services / jobs / internships** — name + description, plus location/apply link for jobs and internships.

## Placeholder behavior

Home, About, Services (including individual service detail pages), Contact, Privacy Policy, and Terms of Service are real, live pages. Everything else — Our Products, Training & Internship, Blogs, Career, FAQ, Our Works — has no page yet, so those links still point at `/404`. Live vs. placeholder is tracked in `frontend/src/config/nav.js`; a route goes live by adding its path there, no other change needed.

Separately, any content field that hasn't been filled in yet shows the literal text `404` rather than just being blank. That one only goes away once real content is entered in the admin panel.