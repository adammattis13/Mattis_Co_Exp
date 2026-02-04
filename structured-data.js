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
        "description": "Boutique strategy consultancy for executives navigating change. We help leaders design operating models, drive digital strategy, and execute large-scale change.",
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
            "telephone": "+1-814-232-7404",
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
        "description": "Boutique strategy consultancy for executives navigating change",
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
        "description": "Strategic advisory services including Strategy & Growth, Operating Model Design, Digital & AI Strategy, and Transformation & Change.",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "5200 Greens Dairy Rd",
            "addressLocality": "Raleigh",
            "addressRegion": "NC",
            "postalCode": "27616",
            "addressCountry": "US"
        },
        "telephone": "+1-814-232-7404",
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
                        "name": "Strategy & Growth",
                        "description": "Market positioning, partnership strategy, growth architecture, and competitive strategy for organizations at inflection points."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Operating Model Design",
                        "description": "Organizational structure, shared services, vendor strategy, and employee experience transformation."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Digital & AI Strategy",
                        "description": "Digital transformation, AI readiness, governance frameworks, and technology architecture."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Transformation & Change",
                        "description": "M&A integration, carve-outs, divestitures, and enterprise-scale change programs."
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
    // Strategy & Growth
    else if (path.includes('strategy-growth')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Strategy & Growth",
                "description": "Market positioning, partnership strategy, growth architecture, and competitive strategy for organizations at inflection points.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Strategy & Growth Services",
                    "itemListElement": [
                        "Growth strategy and market entry",
                        "Partnership and ecosystem design",
                        "Competitive positioning",
                        "Strategic planning and alignment"
                    ]
                }
            }
        ];
    }
    // Operating Model Design
    else if (path.includes('operating-model')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Operating Model Design",
                "description": "Organizational structure, shared services, vendor strategy, and employee experience transformation.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Operating Model Design Services",
                    "itemListElement": [
                        "Organizational structure and governance",
                        "Shared services and centralization",
                        "Vendor strategy and insourcing",
                        "Employee experience design"
                    ]
                }
            }
        ];
    }
    // Digital & AI Strategy
    else if (path.includes('digital-ai')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Digital & AI Strategy",
                "description": "Digital transformation, AI readiness, governance frameworks, and technology architecture.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Digital & AI Strategy Services",
                    "itemListElement": [
                        "Digital transformation strategy",
                        "AI readiness and governance",
                        "Technology and data architecture",
                        "Digital operating models"
                    ]
                }
            }
        ];
    }
    // Transformation & Change
    else if (path.includes('transformation')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Transformation & Change",
                "description": "Large-scale change programs, M&A integration, carve-outs, divestitures, and enterprise transformation.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Transformation & Change Services",
                    "itemListElement": [
                        "Post-merger integration",
                        "Carve-outs and divestitures",
                        "Enterprise transformation programs",
                        "Change management and adoption"
                    ]
                }
            }
        ];
    }
    // Perspectives (Articles)
    else if (path.includes('perspectives') && !path.includes('perspectives.html')) {
        // Individual article pages
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
                "description": "Get in touch with Mattis & Company to discuss your transformation needs.",
                "url": "https://mattisco.com/pages/contact.html",
                "mainEntity": {
                    "@id": "https://mattisco.com/#organization"
                }
            }
        ];
    }
    // Approach page
    else if (path.includes('approach')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "AboutPage",
                "name": "Our Approach | Mattis&Co",
                "description": "Clarity is our operating system. We bring strategic clarity to complex transformations.",
                "url": "https://mattisco.com/pages/approach.html",
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
                "description": "Client case studies from Mattis&Co. Real transformation stories across education, healthcare, logistics, publishing, and financial services.",
                "url": "https://mattisco.com/pages/case-studies.html",
                "mainEntity": {
                    "@id": "https://mattisco.com/#organization"
                }
            }
        ];
    }
    // Events
    else if (path.includes('events')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "CollectionPage",
                "name": "Events | Mattis&Co",
                "description": "Executive roundtables, speaking engagements, and community events hosted by Mattis&Co.",
                "url": "https://mattisco.com/pages/events.html"
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
