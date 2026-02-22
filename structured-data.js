// Mattis&Co - Structured Data (JSON-LD)
// Helps search engines and AI understand your content

document.addEventListener('DOMContentLoaded', function() {
    injectStructuredData();
});

function injectStructuredData() {
    const path = window.location.pathname;

    // Base Organization Schema (included on all pages)
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": "https://mattisco.com/#organization",
        "name": "Mattis & Company",
        "alternateName": "Mattis&Co",
        "url": "https://mattisco.com",
        "logo": "https://mattisco.com/assets/mattisco - logo.webp",
        "description": "Strategic advisory for services businesses ready to scale—and the firms that fund them. Advisory, M&A, Scaling, and Exit Strategy from operators who've built what you're building.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "5200 Greens Dairy Rd",
            "addressLocality": "Raleigh",
            "addressRegion": "NC",
            "postalCode": "27616",
            "addressCountry": "US"
        },
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+1-919-278-7254",
            "contactType": "sales",
            "email": "amattis@mattisco.com"
        },
        "sameAs": [
            "https://www.linkedin.com/company/mattis-&-company/",
            "https://theadammattisshow.com"
        ],
        "foundingDate": "2020",
        "numberOfEmployees": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 10
        },
        "slogan": "Strategic clarity for what's next."
    };

    // WebSite Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://mattisco.com/#website",
        "url": "https://mattisco.com",
        "name": "Mattis&Co",
        "description": "Strategic advisory for scaling services businesses",
        "publisher": {
            "@id": "https://mattisco.com/#organization"
        }
    };

    // Professional Service Schema
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": "https://mattisco.com/#service",
        "name": "Mattis & Company",
        "url": "https://mattisco.com",
        "logo": "https://mattisco.com/assets/mattisco - logo.webp",
        "image": "https://mattisco.com/assets/mattisco - logo.webp",
        "description": "Strategic advisory services for scaling services businesses: Advisory, M&A, Scaling, and Exit Strategy.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "5200 Greens Dairy Rd",
            "addressLocality": "Raleigh",
            "addressRegion": "NC",
            "postalCode": "27616",
            "addressCountry": "US"
        },
        "telephone": "+1-919-278-7254",
        "email": "amattis@mattisco.com",
        "priceRange": "$$$",
        "areaServed": {
            "@type": "Country",
            "name": "United States"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Advisory Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Advisory",
                        "description": "Strategic guidance for business owners navigating growth, operational complexity, or market shifts. Fractional executive advisory, board-level counsel, and strategic planning."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "M&A",
                        "description": "Buy-side and sell-side advisory for services businesses. Due diligence, deal structuring, valuation preparation, and integration planning."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Scaling",
                        "description": "Operational infrastructure for growth: org design, process buildout, revenue operations, delivery model optimization, and go-to-market strategy."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Exit Strategy",
                        "description": "Positioning businesses for successful exits: financial readiness, operational cleanup, valuation optimization, buyer targeting, and transition planning."
                    }
                }
            ]
        }
    };

    // Page-specific schemas
    let pageSchemas = [];

    // Homepage
    if (path === '/' || path === '/index.html' || path === '') {
        pageSchemas = [organizationSchema, websiteSchema, professionalServiceSchema];
    }
    // Services page
    else if (path.includes('services')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Mattis&Co Advisory Services",
                "description": "Strategic advisory services for scaling services businesses: Advisory, M&A, Scaling, and Exit Strategy.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Service Pillars",
                    "itemListElement": [
                        "Advisory — Fractional executive advisory and strategic planning",
                        "M&A — Buy-side and sell-side advisory for services businesses",
                        "Scaling — Operational infrastructure for growth",
                        "Exit Strategy — Positioning businesses for successful exits"
                    ]
                }
            }
        ];
    }
    // Leadership page
    else if (path.includes('leadership')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "Leadership | Mattis&Co",
                "description": "Meet the operators behind Mattis&Co. We've built, scaled, and exited services businesses.",
                "url": "https://mattisco.com/pages/leadership.html",
                "mainEntity": {
                    "@id": "https://mattisco.com/#organization"
                }
            }
        ];
    }
    // Perspectives (Articles)
    else if (path.includes('perspectives')) {
        const articleSchema = {
            "@context": "https://schema.org",
            "@type": "Article",
            "author": {
                "@type": "Person",
                "name": "Adam Mattis"
            },
            "publisher": {
                "@id": "https://mattisco.com/#organization"
            }
        };
        pageSchemas = [organizationSchema, articleSchema];
    }
    // Contact page
    else if (path.includes('contact')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contact Mattis&Co",
                "description": "Start a conversation with Mattis&Co about scaling your services business, M&A advisory, or exit planning.",
                "url": "https://mattisco.com/pages/contact.html",
                "mainEntity": {
                    "@id": "https://mattisco.com/#organization"
                }
            }
        ];
    }
    // Case Studies
    else if (path.includes('case-studies')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Case Studies | Mattis&Co",
                "description": "Real results from real engagements. Case studies in scaling operations, M&A preparation, operational unification, and strategic repositioning.",
                "url": "https://mattisco.com/pages/case-studies.html",
                "mainEntity": {
                    "@id": "https://mattisco.com/#organization"
                }
            }
        ];
    }
    // Default for other pages
    else {
        pageSchemas = [organizationSchema];
    }

    // Inject all schemas
    pageSchemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `structured-data-${index}`;
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    });
}
