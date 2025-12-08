// Mattis&Co - Interaction Scripts
// Handles scroll animations and accordion functionality

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initAccordions();
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const sections = document.querySelectorAll('[data-scroll-section]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger animation: 50-80ms per section
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 60);
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// ============================================
// ACCORDION FUNCTIONALITY
// ============================================
function initAccordions() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        
        if (!header || !content) return;
        
        header.addEventListener('click', function() {
            // Close other accordions (optional - remove to allow multiple open)
            accordionItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    otherContent.style.maxHeight = '0';
                    otherItem.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
                }
            });
            
            // Toggle current accordion
            const isActive = item.classList.contains('active');
            
            if (isActive) {
                item.classList.remove('active');
                content.style.maxHeight = '0';
                header.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                header.setAttribute('aria-expanded', 'true');
            }
        });
        
        // Make accordion keyboard accessible
        header.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

// ============================================
// BUTTON HOVER EFFECTS
// ============================================
// CSS handles the transform and brightness
// This section is for any additional JS-based interactions if needed

// ============================================
// TIMELINE STEP ACTIVATION
// ============================================
// Optional: Add click handlers to timeline steps for interactive demo
function initTimelineInteractions() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    timelineSteps.forEach((step, index) => {
        step.addEventListener('click', function() {
            // Remove active class from all steps
            timelineSteps.forEach(s => s.classList.remove('timeline-active'));
            
            // Add active class to clicked step
            step.classList.add('timeline-active');
        });
    });
}

// Uncomment to enable timeline step activation
// initTimelineInteractions();

// ============================================
// SMOOTH SCROLL TO SECTIONS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// ACCESSIBILITY: FOCUS MANAGEMENT
// ============================================
// Ensure focus is visible for keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-nav');
});
