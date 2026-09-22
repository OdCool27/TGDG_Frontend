# The Great Date Glitch — frontend

Standalone React + TypeScript + Tailwind application. This directory builds and deploys independently of the NestJS backend.

Use Node.js 22+. Run `npm ci`, copy `.env.example` to `.env.local` (or update your existing file), set `VITE_API_BASE_URL=http://localhost:3001`, then run `npm run dev`. Open http://localhost:3000. The backend has separate database/migration instructions in its own README.

`npm run build` checks TypeScript and builds `dist/`. `npm run preview` serves that build locally. The original missing entrypoint and React/Tailwind dependencies are included; avatars, rooms, pixel art and audio remain in place. Outfit style now has an explicit selector.

For Netlify, select this project as the base directory (`tgdg_frontend` if deploying the parent repository; blank if this directory is the repository). Build command: `npm run build`. Publish directory: `dist`. Set the build environment variable `VITE_API_BASE_URL` to the Render origin, for example `https://your-date-api.onrender.com`, with no `/api/v1` suffix. Redeploy after changing it because Vite embeds these values at build time. See [Netlify environment variables](https://docs.netlify.com/build/environment-variables/overview/). Never place database credentials in VITE variables.

Set the backend's `FRONTEND_ORIGIN` to this site's exact origin. The existing `netlify.toml` serves SPA routes. No project-root config or shared package is required.

Production always calls the HTTP API. Missing configuration produces an explicit error instead of silently using a mock. The original local preview remains available only in Vite development with `VITE_USE_MOCK=true`; its legacy story is not the production story and it cannot connect separate devices. Preview and live browser credentials have separate storage keys. Production builds exclude the mock/story resolver.

The client polls every two seconds, avoids overlapping polls, ignores older state revisions and stops scheduling on unmount. Temporary connection failures display a reconnect message while keeping the last scene. Requests allow up to 60 seconds for a sleeping service. Invite links go through avatar setup before claiming the guest seat. A partner submitting first does not skip your dialogue. Refresh restores the server phase, including private waiting, outcome, recap and ending.

Advance requests include the backend's `phaseId` to protect against delayed duplicate taps. The backend owns all consequences and story state. Keep both copies of the API contract aligned when changing fields; neither independently deployed project imports from the other.

Verification completed: TypeScript/production build and backend-driven two-token HTTP playthroughs for all three endings. For a visual two-device check, create on one browser profile, join on another, submit separately, refresh during the outcome, and make both players acknowledge each recap. The backend README and `test/playthrough-report.json` document the full routes, consequences and estimated 25–35 minute playtime. Deployment/account configuration and a human mobile playtest remain to be done.
