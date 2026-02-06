// Mattis&Co Racing - Sponsorship Form Handler
// Sends form data to Pipedrive CRM via serverless function

document.addEventListener('DOMContentLoaded', function() {
    const sponsorshipForm = document.getElementById('sponsorshipForm');
    const formStatus = document.getElementById('formStatus');

    if (!sponsorshipForm) return;

    sponsorshipForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = sponsorshipForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Get form data
        const formData = new FormData(sponsorshipForm);
        const data = {
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            team: formData.get('team'),
            discipline: formData.get('discipline'),
            series: formData.get('series') || '',
            message: formData.get('message')
        };

        try {
            const response = await fetch('/api/sponsorship', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                // If response is not OK, check if it's JSON or HTML
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    throw new Error(result.error || `Server error: ${response.status}`);
                } else {
                    // It's probably an HTML error page
                    const text = await response.text();
                    console.error('Server returned HTML error:', text.substring(0, 200));

                    if (response.status === 404) {
                        throw new Error('API endpoint not found. Please contact support.');
                    } else if (response.status === 500) {
                        throw new Error('Server configuration error. Please check environment variables.');
                    } else {
                        throw new Error(`Server error (${response.status}). Please try again later.`);
                    }
                }
            }

            const result = await response.json();

            if (result.success) {
                showStatus(result.message || 'Application received! We\'ll review your program and get back to you.', 'success');
                sponsorshipForm.reset();
            } else {
                showStatus(result.error || 'Something went wrong. Please email us directly at racing@mattisco.com', 'error');
            }

        } catch (error) {
            console.error('Form submission error:', error);

            // User-friendly error messages
            let errorMessage = 'Unable to send your application. ';

            if (error.message.includes('not found') || error.message.includes('404')) {
                errorMessage += 'The sponsorship API is not configured yet. Please email us directly at racing@mattisco.com';
            } else if (error.message.includes('configuration')) {
                errorMessage += 'Server configuration issue. Please email us directly at racing@mattisco.com';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your connection and try again.';
            } else {
                errorMessage += error.message || 'Please email us directly at racing@mattisco.com';
            }

            showStatus(errorMessage, 'error');

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        formStatus.style.display = 'block';

        // Auto-hide success messages after 8 seconds
        if (type === 'success') {
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 8000);
        }
    }

    // Clear error status on input
    const inputs = sponsorshipForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (formStatus.classList.contains('error')) {
                formStatus.style.display = 'none';
            }
        });
    });
});
