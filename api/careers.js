// Vercel Serverless Function - Careers Application Handler
// Sends application notification and stores data
// For file uploads, uses Base64 encoding

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST');

    try {
        // Handle JSON body (from FormData serialized as JSON)
        const { firstName, lastName, email, phone, linkedin, position, resumeData, resumeName } = req.body;

        // Validate required fields
        if (!firstName || !lastName || !email || !position) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Get email configuration from environment variables
        const RESEND_API_KEY = process.env.RESEND_API_KEY;
        const CAREERS_EMAIL = process.env.CAREERS_EMAIL || 'amattis@mattisco.com';

        // If Resend is configured, send email
        if (RESEND_API_KEY) {
            try {
                const emailResponse = await fetch('https://api.resend.com/emails', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${RESEND_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: 'Mattis&Co Careers <onboarding@resend.dev>',
                        to: CAREERS_EMAIL,
                        reply_to: email,
                        subject: `Job Application: ${position} - ${firstName} ${lastName}`,
                        html: `
                            <h2>New Job Application</h2>
                            <p><strong>Position:</strong> ${position}</p>
                            <hr>
                            <h3>Applicant Information</h3>
                            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                            <p><strong>LinkedIn:</strong> ${linkedin ? `<a href="${linkedin}">${linkedin}</a>` : 'Not provided'}</p>
                            ${resumeName ? `<p><strong>Resume:</strong> ${resumeName} (attached)</p>` : ''}
                            <hr>
                            <p style="color: #666; font-size: 12px;">
                                Submitted via mattisco.com careers page<br>
                                ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} ET
                            </p>
                        `,
                        attachments: resumeData ? [{
                            filename: resumeName || 'resume.pdf',
                            content: resumeData
                        }] : []
                    })
                });

                if (!emailResponse.ok) {
                    const errorData = await emailResponse.json();
                    console.error('Resend API Error:', errorData);
                    // Fall through to Pipedrive or success
                }
            } catch (emailError) {
                console.error('Email sending failed:', emailError);
                // Continue - we'll still try to log to Pipedrive
            }
        }

        // Also log to Pipedrive if configured
        const PIPEDRIVE_API_TOKEN = process.env.PIPEDRIVE_API_TOKEN;
        const PIPEDRIVE_DOMAIN = process.env.PIPEDRIVE_DOMAIN;

        if (PIPEDRIVE_API_TOKEN && PIPEDRIVE_DOMAIN) {
            try {
                // Create person in Pipedrive
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

                if (personData.success) {
                    // Create lead for the application
                    const leadResponse = await fetch(
                        `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/leads?api_token=${PIPEDRIVE_API_TOKEN}`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                title: `[CAREERS] ${position} - ${firstName} ${lastName}`,
                                person_id: personData.data.id
                            })
                        }
                    );

                    const leadData = await leadResponse.json();

                    if (leadData.success) {
                        // Add note with details
                        await fetch(
                            `https://${PIPEDRIVE_DOMAIN}.pipedrive.com/api/v1/notes?api_token=${PIPEDRIVE_API_TOKEN}`,
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    content: `📋 Job Application

Position: ${position}
LinkedIn: ${linkedin || 'Not provided'}
Resume: ${resumeName || 'Not attached'}

---
Submitted via mattisco.com careers page`,
                                    lead_id: leadData.data.id,
                                    person_id: personData.data.id
                                })
                            }
                        );
                    }
                }
            } catch (pipedriveError) {
                console.error('Pipedrive logging failed:', pipedriveError);
                // Continue - application was still received
            }
        }

        // Success response
        return res.status(200).json({
            success: true,
            message: 'Thank you for your application! We\'ll review it and be in touch if there\'s a fit.'
        });

    } catch (error) {
        console.error('Careers Application Error:', error);

        return res.status(500).json({
            success: false,
            error: 'Unable to process your application. Please email your resume directly to careers@mattisco.com'
        });
    }
}
