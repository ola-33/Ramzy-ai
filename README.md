# RAMZY AI

Private, mobile-friendly AI workspace for authorized website and network security learning.

## Features
- Owner-only password login using an HTTP-only, signed session cookie.
- Server-side AI connection; the API key is never sent to the browser.
- Website security review checklist and defensive learning guidance.
- Network security learning notes and safe lab guidance.
- Responsive black/neon-green interface and installable web-app manifest.
- Health endpoint at `/api/health`.

## Local setup
1. Install Node.js 20.9 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set a long unique `OWNER_PASSWORD` and a random `SESSION_SECRET` of at least 32 characters.
5. Optionally set `AI_API_KEY`, `AI_MODEL`, and `AI_BASE_URL`.
6. Run `npm run dev` and open http://localhost:3000.

Generate a session secret with: `openssl rand -base64 48`.

## Deploy on Vercel
1. Import this GitHub repository into Vercel.
2. Add the environment variables from `.env.example` in Project Settings → Environment Variables.
3. Set values for Production (and Preview only if needed).
4. Deploy. Redeploy after changing environment variables.

Keep the repository public only if you are comfortable with its source being visible. Never commit real API keys or passwords.

## Security notes
- The app does not run arbitrary port scans or attack third-party systems.
- Use dedicated legal labs or systems for which you have explicit authorization.
- The in-memory chat rate limit is best-effort on serverless hosting; use an edge/WAF rate limit for stronger production protection.
- Use a strong owner password and rotate the session secret if it is exposed.
