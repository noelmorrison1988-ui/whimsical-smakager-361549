EDGE by NM — YouTube server-side API edition

1. Rotate/revoke the API key shared in chat.
2. Netlify > existing site > Site configuration > Environment variables: add YOUTUBE_API_KEY as a secret, with the new key.
3. Google Cloud: restrict that key to YouTube Data API v3. Do NOT add website referrer restrictions to a server-side key; they block server-side access. API keys restricted by IP are only applicable if the hosting egress IP is stable.
4. Upload this entire ZIP to the existing Netlify site under Deploys. ZIP includes netlify/functions/youtube.js. Verify that Netlify deploy log detects a function.
5. Visit the site and use GO or Pick a Category. No key entry in EDGE.

SECURITY: The public serverless proxy conceals your key but is publicly callable, and can consume quota. Consider server-side rate limiting and an allowlisted source catalogue for tighter protection.
