import { validateSubmission, escapeHtml } from '../lib/form-security.js';

// Vercel Serverless Function - Sponsorship Application to Pipedrive
// Place this file at: /api/sponsorship.js

export default async function handler(req, res) {
    const data = validateSubmission(req, res, ["firstName", "lastName", "email", "team", "discipline", "message"], ["phone", "series"]);
    if (!data) return;
    const { firstName, lastName, email, phone, team, discipline, series, message } = data;

    // Get Pipedrive credentials from environment variables
    const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
    const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN; // e.g., 'mattisco'

    if (!PIPEDRIVE_API_TOKEN || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(PIPEDRIVE_DOMAIN || '')) {
        console.error('Missing Pipedrive configuration');
        return res.status(500).json({
            success: false,
            error: 'Server configuration error'
        });
    }

    try {
        // Step 1: Create or Update Person in Pipedrive
        const personResponse = await fetch(
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/persons`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-token': PIPEDRIVE_API_TOKEN },
                signal: AbortSignal.timeout(2500),
                redirect: 'error',
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email: [{ value: email, primary: true, label: 'work' }],
                    phone: phone ? [{ value: phone, primary: true, label: 'work' }] : []
                })
            }
        );

        const personData = await personResponse.json();

        if (!personResponse.ok || !personData.success) {
            console.error('Pipedrive person request failed');
            throw new Error('Failed to create person in Pipedrive');
        }

        // Step 2: Create Lead linked to the person
        const leadTitle = `Racing Sponsorship - ${team} (${discipline})`;

        const leadResponse = await fetch(
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/leads`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-token': PIPEDRIVE_API_TOKEN },
                signal: AbortSignal.timeout(2500),
                redirect: 'error',
                body: JSON.stringify({
                    title: leadTitle,
                    person_id: personData.data.id,
                    value: {
                        amount: 0,
                        currency: 'USD'
                    }
                })
            }
        );

        const leadData = await leadResponse.json();

        if (!leadResponse.ok || !leadData.success) {
            console.error('Pipedrive lead request failed');
            throw new Error('Failed to create lead in Pipedrive');
        }

        // Step 3: Create Note and attach to the lead
        const noteContent = `🏁 Racing Sponsorship Application

Team/Driver: ${team}
Racing Discipline: ${discipline}
Series/League: ${series || 'Not specified'}
Phone: ${phone || 'Not provided'}

About the Program:
${message}

---
Submitted via mattisco.com/pages/racing.html`;

        const noteResponse = await fetch(
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/notes`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-token': PIPEDRIVE_API_TOKEN },
                signal: AbortSignal.timeout(2500),
                redirect: 'error',
                body: JSON.stringify({
                    content: escapeHtml(noteContent).replace(/\n/g, '<br>'),
                    lead_id: leadData.data.id,
                    person_id: personData.data.id
                })
            }
        );

        // Note creation is not critical - log error but don't fail
        if (!noteResponse.ok) {
            console.error('Failed to create note, but lead was created successfully');
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Application received! We\'ll review your program and get back to you.'
        });

    } catch (error) {
        console.error('Pipedrive integration failed');

        // Return user-friendly error
        return res.status(500).json({
            success: false,
            error: 'Unable to process your application. Please email us directly at racing@mattisco.com'
        });
    }
}
