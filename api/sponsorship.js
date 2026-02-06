// Vercel Serverless Function - Sponsorship Application to Pipedrive
// Place this file at: /api/sponsorship.js

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, email, phone, team, discipline, series, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !team || !discipline || !message) {
        return res.status(400).json({
            success: false,
            error: 'Missing required fields'
        });
    }

    // Get Pipedrive credentials from environment variables
    const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
    const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN; // e.g., 'mattisco'

    if (!PIPEDRIVE_API_TOKEN || !PIPEDRIVE_DOMAIN) {
        console.error('Missing Pipedrive configuration');
        return res.status(500).json({
            success: false,
            error: 'Server configuration error'
        });
    }

    try {
        // Step 1: Create or Update Person in Pipedrive
        const personResponse = await fetch(
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/persons?api_token=${PIPEDRIVE_API_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: `${firstName} ${lastName}`,
                    email: [{ value: email, primary: true, label: 'work' }],
                    phone: phone ? [{ value: phone, primary: true, label: 'work' }] : []
                })
            }
        );

        const personData = await personResponse.json();

        if (!personData.success) {
            console.error('Pipedrive Person Error:', personData);
            throw new Error('Failed to create person in Pipedrive');
        }

        // Step 2: Create Lead linked to the person
        const leadTitle = `Racing Sponsorship - ${team} (${discipline})`;

        const leadResponse = await fetch(
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/leads?api_token=${PIPEDRIVE_API_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

        if (!leadData.success) {
            console.error('Pipedrive Lead Error:', leadData);
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
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: noteContent,
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
            message: 'Application received! We\'ll review your program and get back to you.',
            leadId: leadData.data.id,
            personId: personData.data.id
        });

    } catch (error) {
        console.error('Pipedrive Integration Error:', error);

        // Return user-friendly error
        return res.status(500).json({
            success: false,
            error: 'Unable to process your application. Please email us directly at racing@mattisco.com'
        });
    }
}
