// Mattis&Co - Contact Form Handler
// Sends form data directly to Pipedrive CRM via serverless function

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            firstName: formData.get('first_name'),
            lastName: formData.get('last_name'),
            email: formData.get('email'),
            phone: formData.get('phone') || '',
            company: formData.get('company') || '',
            interest: formData.get('interest') || '',
            message: formData.get('message')
        };
        
        try {
            const response = await fetch('/api/contact', {
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
                showStatus(result.message || 'Thank you! We\'ll be in touch within 24 hours.', 'success');
                contactForm.reset();
            } else {
                showStatus(result.error || 'Something went wrong. Please email us directly at amattis@mattisco.com', 'error');
            }
            
        } catch (error) {
            console.error('Form submission error:', error);
            
            // User-friendly error messages
            let errorMessage = 'Unable to send your message. ';
            
            if (error.message.includes('not found') || error.message.includes('404')) {
                errorMessage += 'The contact API is not configured yet. Please email us directly at amattis@mattisco.com';
            } else if (error.message.includes('configuration')) {
                errorMessage += 'Server configuration issue. Please email us directly at amattis@mattisco.com';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your connection and try again.';
            } else {
                errorMessage += error.message || 'Please email us directly at amattis@mattisco.com';
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
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (formStatus.classList.contains('error')) {
                formStatus.style.display = 'none';
            }
        });
    });
});
