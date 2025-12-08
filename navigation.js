// Mattis&Co - Modular Navigation System
// Loads header and footer dynamically across all pages

document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
    loadFooter();
    initializeMobileMenu();
    initializeScrollEffects();
});

function loadNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return;

    nav.innerHTML = `
        <div class="nav-container">
            <div class="logo">
                <a href="/index.html">
                    <img src="/assets/mattisco - logo.webp" alt="Mattis&Co" class="logo-image">
                </a>
            </div>
            
            <ul class="nav-menu">
                <li><a href="/index.html">Home</a></li>
                
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">Services</a>
                    <ul class="dropdown-menu">
                        <li><a href="/pages/enterprise-strategy.html">Enterprise Strategy</a></li>
                        <li><a href="/pages/operating-model.html">Operating Model</a></li>
                        <li><a href="/pages/ai-operations.html">AI Operations</a></li>
                        <li><a href="/pages/digital-integration.html">Digital Integration</a></li>
                    </ul>
                </li>
                
                <li><a href="/pages/pe-strategy.html">PE</a></li>
                
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">About</a>
                    <ul class="dropdown-menu">
                        <li><a href="/pages/partners.html">Partners</a></li>
                        <li><a href="/pages/leadership.html">Leadership</a></li>
                    </ul>
                </li>
                
                <li><a href="/pages/media.html">Media</a></li>
            </ul>
            
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    `;

    setActiveNavLink();
    initializeDropdowns();
}

function loadFooter() {
    const footer = document.querySelector('footer');
    if (!footer) return;

    footer.innerHTML = `
        <div class="footer-container">
            <div class="footer-column footer-brand">
                <div class="footer-logo">
                    <img src="/assets/mattisco - logo.webp" alt="Mattis&Co" class="footer-logo-image">
                </div>
                <p class="footer-tagline">Capital for growth. Clarity for scale. Intelligence for the edge.</p>
                <p class="footer-subtitle">Operator-led transformation and investment advisory.</p>
            </div>
            
            <div class="footer-column">
                <h4>Company</h4>
                <ul>
                    <li><a href="/pages/partners.html">Partners</a></li>
                    <li><a href="/pages/leadership.html">Leadership</a></li>
                    <li><a href="/pages/pe-strategy.html">PE Strategy</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Services</h4>
                <ul>
                    <li><a href="/pages/enterprise-strategy.html">Enterprise Strategy</a></li>
                    <li><a href="/pages/operating-model.html">Operating Model</a></li>
                    <li><a href="/pages/ai-operations.html">AI Operations</a></li>
                    <li><a href="/pages/digital-integration.html">Digital Integration</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Resources</h4>
                <ul>
                    <li><a href="/pages/media.html">Media</a></li>
                    <li><a href="/pages/contact.html">Contact</a></li>
                    <li><a href="/pages/privacy.html">Privacy</a></li>
                    <li><a href="/pages/terms.html">Terms</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Mattis&Co. All rights reserved.</p>
            <p>Honoring the memory of 1st Lt. Kevin J. Smith, KIA 8 Dec 2005</p>
        </div>
    `;
}

function setActiveNavLink() {
    // Active states disabled - all nav items remain black
    return;
}

function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        let closeTimeout;
        
        // Desktop: hover behavior with delay
        dropdown.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                clearTimeout(closeTimeout);
                menu.style.display = 'block';
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                // Small delay before closing to allow mouse movement
                closeTimeout = setTimeout(() => {
                    menu.style.display = 'none';
                }, 150);
            }
        });
        
        // Keep menu open when hovering over it
        menu.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                clearTimeout(closeTimeout);
                menu.style.display = 'block';
            }
        });
        
        menu.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                closeTimeout = setTimeout(() => {
                    menu.style.display = 'none';
                }, 150);
            }
        });
        
        // Mobile: click behavior
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                dropdown.classList.toggle('active');
            }
        });
    });
}

function initializeMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.nav-menu');
    const body = document.body;
    
    if (!toggle || !menu) return;
    
    toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        body.classList.toggle('menu-open');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // Close menu on nav link click
    const navLinks = menu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });
}

function initializeScrollEffects() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}
