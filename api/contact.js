// Vercel Serverless Function - Pipedrive Integration
// Place this file at: /api/contact.js

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { firstName, lastName, email, phone, company, interest, message } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !message) {
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
                    phone: phone ? [{ value: phone, primary: true, label: 'work' }] : [],
                    visible_to: 3 // Visible to entire company
                })
            }
        );

        const personData = await personResponse.json();

        if (!personData.success) {
            console.error('Pipedrive Person Error:', personData);
            throw new Error('Failed to create person in Pipedrive');
        }

        // Step 2: Create Lead linked to the person
        const leadTitle = company 
            ? `${company} - ${interest || 'Website Inquiry'}` 
            : `${firstName} ${lastName} - ${interest || 'Website Inquiry'}`;

        const leadNote = `
📋 Contact Form Submission

Company: ${company || 'Not provided'}
Interest Area: ${interest || 'Not specified'}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
Submitted via mattisco.com contact form
`.trim();

        const leadResponse = await fetch(
            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/leads?api_token=${PIPEDRIVE_API_TOKEN}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: leadTitle,
                    person_id: personData.data.id,
                    visible_to: 3, // Visible to entire company
                    value: {
                        amount: 0,
                        currency: 'USD'
                    },
                    // Optional: Add label for filtering (create labels in Pipedrive first)
                    // label_ids: ['LABEL_UUID_HERE'],
                    note: leadNote
                })
            }
        );

        const leadData = await leadResponse.json();

        if (!leadData.success) {
            console.error('Pipedrive Lead Error:', leadData);
            throw new Error('Failed to create lead in Pipedrive');
        }

        // Success response
        return res.status(200).json({ 
            success: true, 
            message: 'Thank you! We\'ll be in touch within 24 hours.',
            leadId: leadData.data.id,
            personId: personData.data.id
        });

    } catch (error) {
        console.error('Pipedrive Integration Error:', error);
        
        // Return user-friendly error
        return res.status(500).json({ 
            success: false, 
            error: 'Unable to process your submission. Please email us directly at amattis@mattisco.com'
        });
    }
}
