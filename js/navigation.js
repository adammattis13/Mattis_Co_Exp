// navigation.js - Loads header and footer components dynamically

/**
 * Component Loader System
 * Loads header and footer from centralized HTML files
 * Maintains single source of truth for navigation and footer
 */

class ComponentLoader {
    constructor() {
        this.headerPlaceholder = document.getElementById('header-placeholder');
        this.footerPlaceholder = document.getElementById('footer-placeholder');
        this.currentPage = this.getCurrentPage();
    }

    /**
     * Initialize component loading
     */
    async init() {
        try {
            // Load both components in parallel
            await Promise.all([
                this.loadHeader(),
                this.loadFooter()
            ]);
            
            // After components are loaded, initialize interactions
            this.initializeNavigation();
            this.setActivePage();
            
        } catch (error) {
            console.error('Error loading components:', error);
        }
    }

    /**
     * Load header component
     */
    async loadHeader() {
        if (!this.headerPlaceholder) return;
        
        try {
            const response = await fetch('components/header.html');
            if (!response.ok) throw new Error('Failed to load header');
            
            const html = await response.text();
            this.headerPlaceholder.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading header:', error);
            // Fallback content
            this.headerPlaceholder.innerHTML = `
                <nav class="navbar">
                    <div class="navbar-container">
                        <a href="index.html" class="navbar-brand">Mattis & Co.</a>
                        <p style="color: red;">Navigation failed to load</p>
                    </div>
                </nav>
            `;
        }
    }

    /**
     * Load footer component
     */
    async loadFooter() {
        if (!this.footerPlaceholder) return;
        
        try {
            const response = await fetch('components/footer.html');
            if (!response.ok) throw new Error('Failed to load footer');
            
            const html = await response.text();
            this.footerPlaceholder.innerHTML = html;
            
        } catch (error) {
            console.error('Error loading footer:', error);
            // Fallback content
            this.footerPlaceholder.innerHTML = `
                <footer class="footer">
                    <div class="footer-content">
                        <p>© 2024 Mattis & Co. All rights reserved.</p>
                    </div>
                </footer>
            `;
        }
    }

    /**
     * Get current page from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    /**
     * Set active state on current page link
     */
    setActivePage() {
        // Remove any existing active classes
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current page
        const activeLink = document.querySelector(`.navbar-link[data-page="${this.currentPage}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Also check dropdown links
        const activeDropdownLink = document.querySelector(`.dropdown-link[data-page="${this.currentPage}"]`);
        if (activeDropdownLink) {
            // Mark the parent Services dropdown as active when on XA page
            const servicesDropdown = activeDropdownLink.closest('.dropdown');
            if (servicesDropdown) {
                const servicesLink = servicesDropdown.querySelector('.dropdown-toggle');
                if (servicesLink) {
                    servicesLink.classList.add('active');
                }
            }
        }
    }

    /**
     * Initialize navigation interactions
     */
    initializeNavigation() {
        const navbarToggle = document.querySelector('.navbar-toggle');
        const navbarMenu = document.querySelector('.navbar-menu');
        const overlay = document.querySelector('.overlay');
        const navbar = document.querySelector('.navbar');
        
        // Mobile menu toggle
        if (navbarToggle && navbarMenu) {
            navbarToggle.addEventListener('click', () => {
                navbarToggle.classList.toggle('active');
                navbarMenu.classList.toggle('active');
                document.body.style.overflow = navbarMenu.classList.contains('active') ? 'hidden' : '';
                
                if (overlay) {
                    overlay.classList.toggle('active');
                }
            });
        }
        
        // Close mobile menu when clicking overlay
        if (overlay) {
            overlay.addEventListener('click', () => {
                if (navbarToggle) navbarToggle.classList.remove('active');
                if (navbarMenu) navbarMenu.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        // Close mobile menu when clicking a link
        const navLinks = document.querySelectorAll('.navbar-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    if (navbarToggle) navbarToggle.classList.remove('active');
                    if (navbarMenu) navbarMenu.classList.remove('active');
                    if (overlay) overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        });
        
        // Navbar scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (navbar) {
                // Add shadow when scrolled
                if (currentScroll > 10) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }
            
            lastScroll = currentScroll;
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const loader = new ComponentLoader();
    loader.init();
});

// Export for use in other modules if needed
window.ComponentLoader = ComponentLoader;