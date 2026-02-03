// Mattis&Co - Careers Application Form Handler
// Sends applications via API with resume as Base64

document.addEventListener('DOMContentLoaded', function() {
    // Job listing toggle functionality
    initJobToggles();

    // Application form handling
    initApplicationForm();

    // File upload display
    initFileUpload();
});

function initJobToggles() {
    const toggles = document.querySelectorAll('.career-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const detailsId = this.getAttribute('aria-controls');
            const details = document.getElementById(detailsId);
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            // Toggle state
            this.setAttribute('aria-expanded', !isExpanded);
            details.hidden = isExpanded;

            // Update button text
            const toggleText = this.querySelector('.toggle-text');
            toggleText.textContent = isExpanded ? 'View Details' : 'Hide Details';
        });
    });
}

function initFileUpload() {
    const fileInput = document.getElementById('resume');
    const fileNameDisplay = document.querySelector('.file-name');

    if (!fileInput || !fileNameDisplay) return;

    fileInput.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                showStatus('File is too large. Maximum size is 5MB.', 'error');
                this.value = '';
                fileNameDisplay.textContent = '';
                return;
            }

            // Validate file type
            const validExtensions = ['.pdf', '.doc', '.docx'];
            const fileName = file.name.toLowerCase();
            const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

            if (!hasValidExtension) {
                showStatus('Please upload a PDF, DOC, or DOCX file.', 'error');
                this.value = '';
                fileNameDisplay.textContent = '';
                return;
            }

            fileNameDisplay.textContent = `${file.name} (${fileSizeMB} MB)`;
        } else {
            fileNameDisplay.textContent = '';
        }
    });

    // Drag and drop visual feedback
    const wrapper = document.querySelector('.file-upload-wrapper');
    if (wrapper) {
        wrapper.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.querySelector('.file-upload-display').style.borderColor = '#BADA55';
            this.querySelector('.file-upload-display').style.background = 'rgba(186, 218, 85, 0.1)';
        });

        wrapper.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.querySelector('.file-upload-display').style.borderColor = '';
            this.querySelector('.file-upload-display').style.background = '';
        });

        wrapper.addEventListener('drop', function(e) {
            this.querySelector('.file-upload-display').style.borderColor = '';
            this.querySelector('.file-upload-display').style.background = '';
        });
    }
}

// Convert file to Base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

function initApplicationForm() {
    const applicationForm = document.getElementById('applicationForm');

    if (!applicationForm) return;

    applicationForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = applicationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';

        try {
            // Get form values
            const firstName = applicationForm.querySelector('#first_name').value.trim();
            const lastName = applicationForm.querySelector('#last_name').value.trim();
            const email = applicationForm.querySelector('#email').value.trim();
            const phone = applicationForm.querySelector('#phone').value.trim();
            const linkedin = applicationForm.querySelector('#linkedin').value.trim();
            const position = applicationForm.querySelector('#position').value;
            const resumeInput = applicationForm.querySelector('#resume');

            // Validate resume file
            if (!resumeInput.files || !resumeInput.files[0]) {
                showStatus('Please attach your resume.', 'error');
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                return;
            }

            const resumeFile = resumeInput.files[0];

            // Convert resume to Base64
            const resumeData = await fileToBase64(resumeFile);

            // Prepare data
            const data = {
                firstName,
                lastName,
                email,
                phone,
                linkedin,
                position,
                resumeData,
                resumeName: resumeFile.name
            };

            const response = await fetch('/api/careers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');

            if (!response.ok) {
                if (contentType && contentType.includes('application/json')) {
                    const result = await response.json();
                    throw new Error(result.error || `Server error: ${response.status}`);
                } else {
                    const text = await response.text();
                    console.error('Server returned HTML error:', text.substring(0, 200));

                    if (response.status === 404) {
                        throw new Error('Application API not configured. Please email your resume directly to careers@mattisco.com');
                    } else if (response.status === 500) {
                        throw new Error('Server error. Please email your resume directly to careers@mattisco.com');
                    } else {
                        throw new Error(`Server error (${response.status}). Please try again later.`);
                    }
                }
            }

            const result = await response.json();

            if (result.success) {
                showStatus(result.message || 'Thank you for your application! We\'ll review it and be in touch.', 'success');
                applicationForm.reset();
                document.querySelector('.file-name').textContent = '';
            } else {
                showStatus(result.error || 'Something went wrong. Please email your resume directly to careers@mattisco.com', 'error');
            }

        } catch (error) {
            console.error('Application submission error:', error);

            let errorMessage = 'Unable to submit your application. ';

            if (error.message.includes('not found') || error.message.includes('404') || error.message.includes('not configured')) {
                errorMessage = 'Application system is being configured. Please email your resume directly to careers@mattisco.com';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage += 'Network error. Please check your connection and try again.';
            } else {
                errorMessage += error.message || 'Please email your resume directly to careers@mattisco.com';
            }

            showStatus(errorMessage, 'error');

        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    // Clear error status on input
    const inputs = applicationForm.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            const formStatus = document.getElementById('formStatus');
            if (formStatus && formStatus.classList.contains('error')) {
                formStatus.style.display = 'none';
            }
        });
    });
}

function showStatus(message, type) {
    const formStatus = document.getElementById('formStatus');
    if (!formStatus) return;

    formStatus.textContent = message;
    formStatus.className = 'form-status ' + type;
    formStatus.style.display = 'block';

    // Auto-hide success messages after 10 seconds
    if (type === 'success') {
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 10000);
    }

    // Scroll to status message
    formStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
}
