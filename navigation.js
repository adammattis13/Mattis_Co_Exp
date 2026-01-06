// Mattis&Co - Modular Navigation System
// Loads header and footer dynamically across all pages

document.addEventListener('DOMContentLoaded', function() {
    loadNavigation();
    loadFooter();
    initializeMobileMenu();
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
                        <li><a href="/pages/ecosystem-strategy.html">Ecosystem Strategy</a></li>
                        <li><a href="/pages/adaptive-architecture.html">Adaptive Architecture</a></li>
                        <li><a href="/pages/ai-operating-model.html">AI Operating Model</a></li>
                    </ul>
                </li>
                
                <li><a href="/pages/approach.html">Approach</a></li>
                
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle">About</a>
                    <ul class="dropdown-menu">
                        <li><a href="/pages/leadership.html">Leadership</a></li>
                        <li><a href="/pages/partners.html">Partners</a></li>
                        <li><a href="/pages/careers.html">Careers</a></li>
                    </ul>
                </li>
                
                <li><a href="/pages/contact.html" class="nav-cta">Contact</a></li>
            </ul>
            
            <button class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    `;

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
                <p class="footer-tagline">Strategic clarity for the AI shift.</p>
                <p class="footer-subtitle">Operator-led advisory for companies building ecosystems, architectures, and operating models.</p>
            </div>
            
            <div class="footer-column">
                <h4>Services</h4>
                <ul>
                    <li><a href="/pages/ecosystem-strategy.html">Ecosystem Strategy</a></li>
                    <li><a href="/pages/adaptive-architecture.html">Adaptive Architecture</a></li>
                    <li><a href="/pages/ai-operating-model.html">AI Operating Model</a></li>
                    <li><a href="/pages/approach.html">Our Approach</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Company</h4>
                <ul>
                    <li><a href="/pages/leadership.html">Leadership</a></li>
                    <li><a href="/pages/partners.html">Partners</a></li>
                    <li><a href="/pages/careers.html">Careers</a></li>
                    <li><a href="/pages/contact.html">Contact</a></li>
                    <li><a href="https://www.linkedin.com/company/mattis-&-company/" target="_blank" rel="noopener">LinkedIn</a></li>
                    <li><a href="/pages/memorial.html">Memorial</a></li>
                </ul>
            </div>
            
            <div class="footer-column">
                <h4>Resources</h4>
                <ul>
                    <li><a href="https://theadammattisshow.com" target="_blank" rel="noopener">Podcast</a></li>
                    <li><a href="/pages/privacy.html">Privacy</a></li>
                    <li><a href="/pages/terms.html">Terms</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} Mattis&Co. All rights reserved.</p>
        </div>
    `;
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
                closeTimeout = setTimeout(() => {
                    menu.style.display = 'none';
                }, 500);
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
                }, 500);
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