import { validateSubmission, escapeHtml } from '../lib/form-security.js';

// Vercel Serverless Function - Pipedrive Integration
// Place this file at: /api/contact.js

export default async function handler(req, res) {
    const data = validateSubmission(req, res, ["firstName", "lastName", "email", "message"], ["phone", "company", "interest"]);
    if (!data) return;
    const { firstName, lastName, email, phone, company, interest, message } = data;

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
                    // Removed visible_to - let Pipedrive use default settings
                })
            }
        );

        const personData = await personResponse.json();

        if (!personResponse.ok || !personData.success) {
            console.error('Pipedrive person request failed');
            throw new Error('Failed to create person in Pipedrive');
        }

        // Step 2: Create Lead linked to the person (without note - it's deprecated)
        const leadTitle = company 
            ? `${company} - ${interest || 'Website Inquiry'}` 
            : `${firstName} ${lastName} - ${interest || 'Website Inquiry'}`;

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
                    // Removed visible_to - let Pipedrive use default settings
                })
            }
        );

        const leadData = await leadResponse.json();

        if (!leadResponse.ok || !leadData.success) {
            console.error('Pipedrive lead request failed');
            throw new Error('Failed to create lead in Pipedrive');
        }

        // Step 3: Create Note and attach to the lead (using Notes API)
        const noteContent = `📋 Contact Form Submission

Company: ${company || 'Not provided'}
Interest Area: ${interest || 'Not specified'}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
Submitted via mattisco.com contact form`;

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
            message: 'Thank you! We\'ll be in touch within 24 hours.'
        });

    } catch (error) {
        console.error('Pipedrive integration failed');
        
        // Return user-friendly error
        return res.status(500).json({ 
            success: false, 
            error: 'Unable to process your submission. Please email us directly at amattis@mattisco.com'
        });
    }
}
