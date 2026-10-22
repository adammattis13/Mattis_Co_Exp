// Shared validation for public form endpoints. No credentials belong in this file.
const LIMIT = 16 * 1024;

export function validateSubmission(req, res, required, optional) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        res.status(405).json({ error: 'Method not allowed' });
        return null;
    }
    // Browsers submit JSON from this site. Reject cross-site browser requests;
    // this is not a replacement for firewall rate limits against direct clients.
    const origin = req.headers.origin;
    const allowed = new Set(['https://mattisco.com', 'https://www.mattisco.com',
        'https://mattis-co-exp.vercel.app']);
    for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
        if (host) allowed.add(`https://${host}`);
    }
    if (origin && !allowed.has(origin)) {
        res.status(403).json({ success: false, error: 'Origin not allowed' });
        return null;
    }
    if (!/^application\/json(?:\s*;|$)/i.test(req.headers['content-type'] || '')) {
        res.status(415).json({ success: false, error: 'Expected application/json' });
        return null;
    }
    const body = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
        res.status(400).json({ success: false, error: 'Invalid submission' });
        return null;
    }
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > LIMIT) {
        res.status(413).json({ success: false, error: 'Submission too large' });
        return null;
    }
    if (body.website) {
        // Honeypot: do not create CRM records or teach spambots which check fired.
        res.status(200).json({ success: true, message: 'Thank you for your submission.' });
        return null;
    }
    const limits = { firstName: 100, lastName: 100, email: 254, phone: 50,
        company: 200, interest: 100, team: 200, discipline: 100, series: 200, message: 5000 };
    const data = {};
    for (const field of [...required, ...optional]) {
        const value = body[field];
        if (value === undefined && optional.includes(field)) { data[field] = ''; continue; }
        if (typeof value !== 'string' || value.length > limits[field] ||
            /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value) ||
            (required.includes(field) && !value.trim())) {
            res.status(400).json({ success: false, error: 'Invalid form fields' });
            return null;
        }
        data[field] = value.trim();
    }
    if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(data.email)) {
        res.status(400).json({ success: false, error: 'Invalid email address' });
        return null;
    }
    return data;
}

// Pipedrive note content is HTML. Treat every submitted value as plain text.
export function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}
