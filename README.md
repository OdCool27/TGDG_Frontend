# The Great Date Glitch — frontend

Standalone React + TypeScript + Tailwind application. This directory builds and deploys independently of the NestJS backend.

Use Node.js 22+. Run `npm ci`, copy `.env.example` to `.env.local` (or update your existing file), set `VITE_API_BASE_URL=http://localhost:3001`, then run `npm run dev`. Open http://localhost:3000. The backend has separate database/migration instructions in its own README.

`npm run build` checks TypeScript and builds `dist/`. `npm run preview` serves that build locally. The original missing entrypoint and React/Tailwind dependencies are included; avatars, rooms, pixel art and audio remain in place. Outfit style now has an explicit selector.

For Netlify, select this project as the base directory (`tgdg_frontend` if deploying the parent repository; blank if this directory is the repository). Build command: `npm run build`. Publish directory: `dist`. Set the build environment variable `VITE_API_BASE_URL` to `https://tgdgbackend-production.up.railway.app` (or your own backend origin). Do not append `/3001` or `/api/v1`: Railway exposes HTTPS on its public hostname; `3001` is the internal listening port. Local development uses `http://localhost:3001`. The build rejects API URLs containing paths. Redeploy after changing the variable because Vite embeds it at build time. Never place database credentials in VITE variables.

Set the backend's `FRONTEND_ORIGIN` to this site's exact origin. The existing `netlify.toml` serves SPA routes. No project-root config or shared package is required.

Production always calls the HTTP API. Missing configuration produces an explicit error instead of silently using a mock. The original local preview remains available only in Vite development with `VITE_USE_MOCK=true`; its legacy story is not the production story and it cannot connect separate devices. Preview and live browser credentials have separate storage keys. Production builds exclude the mock/story resolver.

The client polls every two seconds, avoids overlapping polls, ignores older state revisions and stops scheduling on unmount. Temporary connection failures display a reconnect message while keeping the last scene. Requests allow up to 60 seconds for a sleeping service. Invite links go through avatar setup before claiming the guest seat. A partner submitting first does not skip your dialogue. Refresh restores the server phase, including private waiting, outcome, recap and ending.

Advance requests include the backend's `phaseId` to protect against delayed duplicate taps. The backend owns all consequences and story state. Keep both copies of the API contract aligned when changing fields; neither independently deployed project imports from the other.

Verification completed: TypeScript/production build and backend-driven two-token HTTP playthroughs for all three endings. For a visual two-device check, create on one browser profile, join on another, submit separately, refresh during the outcome, and make both players acknowledge each recap. The backend README and `test/playthrough-report.json` document the full routes, consequences and estimated 25–35 minute playtime. Deployment/account configuration and a human mobile playtest remain to be done.

## Browser regression checks

Run `npm test` with the frontend and backend running locally on ports 3000 and 3001. The suite uses installed Google Chrome via Playwright, creates one real two-player room, and completes all 15 scenes and three recaps. It checks failed-create form preservation, guest setup readiness, private choices, both-player advancement, refresh and temporary offline recovery. Set `E2E_APP_ORIGIN` and `E2E_API_BASE_URL` to target another environment; use a test environment when possible. Test rooms are subject to normal backend expiry.

To check a production build before deploying, run `npm run build`, set `E2E_USE_DIST=true`, and set `E2E_APP_ORIGIN` to an origin allowed by the backend. Playwright serves local `dist/` files only within its isolated browsers at that origin. API requests still reach the configured backend directly and enforce CORS; this does not publish any files. Ensure the build's `VITE_API_BASE_URL` matches `E2E_API_BASE_URL`.

For the original `Cannot POST /3001/api/v1/sessions` deployment error, `netlify.toml` pins `VITE_API_BASE_URL` to the Railway origin without a path. This file-based value overrides a stale Netlify UI variable and prevents the origin validation from failing the build. Change `[build.environment]` when moving the backend, then rebuild/redeploy. Editing a local env file alone cannot update an already deployed bundle.
