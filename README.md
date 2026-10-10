# Suryoday Vruddhashram

A multilingual Next.js website for Suryoday Vruddhashram, with an authenticated content dashboard and a persistent JSON content store.

## Local development

Requirements: Node.js 20.9 or newer and npm.

```powershell
npm ci
Copy-Item .env.example .env.local
npm run admin:hash
```

Set `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` (the value printed by `npm run admin:hash`), and a randomly generated `ADMIN_SECRET` of at least 32 characters in `.env.local`. For example, generate a secret with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Keep `.env.local` private; `.env*` files are ignored by Git. The app intentionally has no default admin account. Without valid server-side credentials, admin authentication and content updates remain unavailable.

```powershell
npm run dev
```

The local content store defaults to `data/site-content.json`. It is created on first read, is not committed, and can be relocated with `SITE_CONTENT_PATH`.

## Admin and public content

Open `/admin` and sign in with the configured credentials. Admin changes to organization details, contact information, support priorities, impact cards, and gallery entries are saved to the server-side content store and returned by the public `GET /api/site` endpoint. `PUT /api/site` requires a valid, expiring, HTTP-only session cookie and a same-origin request. The public page refreshes the same content source; browser storage is used only for language preference, not for authentication or published content.

The gallery accepts HTTPS image URLs hosted on `images.unsplash.com`; direct image-file uploads are not implemented. Volunteer and contribution links open an email draft in the visitor's mail application; the site does not accept or store inquiries or process donations. No payment processor, donation account, or inquiry backend is configured.

The bundled photographs are representative Unsplash stock images, not photographs of the organization, residents, or named staff. Replace them with organization-authorized imagery before representing them as real people or places. Confirm the public phone, email, address, services, and any organization-specific statements with Tejaswi Foundation before production launch. Anonymous sample testimonials and unverifiable impact metrics are not displayed.

## Render persistence and deployment

`render.yaml` configures a single-instance Node web service and a 1 GB persistent disk mounted at `/var/data`; `SITE_CONTENT_PATH` points the content store to that disk. The persistent disk is necessary because Render's ordinary service filesystem is ephemeral. Render persistent disks require a paid service and the configured disk does not support multiple service instances; review Render's current pricing and scaling constraints before applying the Blueprint.

The Blueprint prompts for `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SECRET`; supply real secrets through Render's environment settings, never source control. Generate the password hash with `npm run admin:hash`, and set a unique random secret of at least 32 characters. The admin session expires after 12 hours. The store is designed for a single Render instance; use a managed database before horizontal scaling.

This repository does not contain Render credentials or a verified linked Render service. Applying the Blueprint, provisioning its paid persistent disk, setting live credentials, and deploying must be done by an authorized Render account owner.

## Checks

The API integration suite starts the production Next.js server, so build first:

```powershell
npm run lint
npm run build
npm test
```

The test suite covers password hashing, required authentication configuration, session signatures and expiry, language preference persistence, content validation and persistence, and the login/session/logout/content API flow including anonymous access, cross-origin rejection, publication visibility, and persistence after a server restart.
