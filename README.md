# RAMZY AI

Private, mobile-friendly AI workspace for authorized web and network penetration testing, security learning, and defensive assessment.

## Current capabilities
- Owner-only password login using an HTTP-only, signed session cookie.
- Server-side AI connection; the API key is never sent to the browser.
- AI assistant specialized in authorized web and network penetration-testing workflows.
- Website security review checklist covering TLS, headers, authentication, dependencies, input handling, backups, and logging.
- Network security guidance covering routers, devices, asset visibility, and incident readiness.
- Learning lab guidance for web, network, and secure-development fundamentals.
- Responsive black/neon-green interface and installable web-app manifest.
- Health endpoint at `/api/health`.

## AI provider configuration
The chat endpoint uses the OpenAI-compatible Chat Completions format.

For Google AI Studio Gemini, set these Vercel environment variables:
- `AI_API_KEY`: your Gemini API key.
- `AI_BASE_URL`: `https://generativelanguage.googleapis.com/v1beta/openai/`
- `AI_MODEL`: a Gemini model enabled for your account, for example `gemini-3.8-flash`.

For an OpenAI-compatible provider, set its documented base URL, model, and API key. Never commit keys to GitHub or expose them in client-side code.

## Local setup
1. Install Node.js 20.9 or later.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set a long unique `OWNER_PASSWORD` and a random `SESSION_SECRET` of at least 32 characters.
5. Set `AI_API_KEY`, `AI_BASE_URL`, and `AI_MODEL` for your provider.
6. Run `npm run dev` and open http://localhost:3000.

Generate a session secret with: `openssl rand -base64 48`.

## Deploy on Vercel
1. Import this GitHub repository into Vercel.
2. Add the environment variables from `.env.example` in Project Settings → Environment Variables.
3. Set values for Production (and Preview only if needed).
4. Deploy. Redeploy after changing environment variables.

Keep the repository public only if you are comfortable with its source being visible. Never commit real API keys or passwords.

## Authorized assessment boundaries
RAMZY AI is an assistant and guided assessment workspace; it does not currently execute port scans, exploit code, or automatically test remote targets. It can help plan an authorized engagement, explain tools, interpret evidence supplied by the owner, review code/configuration, and recommend safe validation and remediation.

Only assess systems you own or have explicit written permission to test. Use intentionally vulnerable local labs for exploit-development practice. Do not use the assistant to compromise third-party systems.

## Production hardening still required
- The in-memory chat rate limit is best-effort on serverless hosting; use a persistent shared rate limiter or edge/WAF rule for stronger protection.
- Review session secret rotation and cookie settings before production use.
- Add audit logging and a persistent engagement/scope record before enabling any active assessment integrations.
