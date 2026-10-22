# Security deployment notes

This site uses static HTML and Node.js Vercel functions, not PHP. PHP runtime
advisories do not directly apply to this code.

The form APIs validate field types and lengths, reject malformed JSON bodies,
escape CRM note HTML, use a honeypot, keep credentials out of URLs, limit upstream
request duration, reject cross-site browser origins, and avoid logging upstream
response bodies. They do not return internal CRM identifiers.

## Hosting controls still required

In the Vercel project Firewall, publish a rate limit for `/api/contact` and
`/api/sponsorship`, including `.js` URL aliases if served: 5 requests per 60
seconds per source IP. Review false positives for shared office IPs. Honeypots
and Origin checks are not substitutes for distributed rate limiting or bot
verification. No in-memory limiter is used because serverless instances do not
share counters. Verify these rules separately on production and previews.

Set PIPEDRIVE_DOMAIN to the company subdomain only, and PIPEDRIVE_API_TOKEN to a
server-only credential in Vercel. Never add it to browser scripts or public env
variables. Review historical request logs for credentials in query strings;
rotate the token if exposed, coordinating other integrations using it.

Use `node --test tests/security.test.mjs` for local mocked API checks. No test
should submit personal data to the live CRM. After deployment, check CSP and
headers, navigation, fonts, and both forms. JSON-LD schema scripts are created by
structured-data.js; check structured-data validation after changing the policy.
