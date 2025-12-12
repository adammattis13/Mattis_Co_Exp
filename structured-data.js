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
        "description": "Operator-led advisory for companies building the ecosystems, architectures, and operating models needed to compete in the age of AI.",
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
        "slogan": "We don't implement. We architect."
    };

    // WebSite Schema
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": "https://mattisco.com/#website",
        "url": "https://mattisco.com",
        "name": "Mattis&Co",
        "description": "Operator-led advisory for digital transformation",
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
        "description": "Strategic advisory services including Ecosystem Strategy, Adaptive Architecture, and AI Operating Model consulting.",
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
                        "name": "Ecosystem Strategy",
                        "description": "Design, build, and lead powerful ecosystems that accelerate growth, defensibility, and impact."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Adaptive Architecture",
                        "description": "Build organizations that sense, respond, and evolve faster than the environment around them."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "AI Operating Model",
                        "description": "Rebuild your company into an AI-native organism ready for agentic systems and multi-agent coordination."
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
    // Ecosystem Strategy
    else if (path.includes('ecosystem-strategy')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Ecosystem Strategy",
                "description": "Move from linear growth to exponential, network-powered growth by orchestrating partners, platforms, and communities around your business.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Ecosystem Strategy Deliverables",
                    "itemListElement": [
                        "Ecosystem map and value-exchange model",
                        "Partnership and platform plays",
                        "Go-to-ecosystem roadmap",
                        "Governance and engagement frameworks",
                        "Metrics and playbooks for ecosystem ROI"
                    ]
                }
            }
        ];
    }
    // Adaptive Architecture
    else if (path.includes('adaptive-architecture')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "Adaptive Architecture",
                "description": "Design organizations that sense, respond, and evolve faster than the environment around them. Fixed architecture eventually fails. Adaptive architecture compounds advantage.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Adaptive Architecture Deliverables",
                    "itemListElement": [
                        "Modular, recomposable operating core",
                        "Real-time feedback loops",
                        "Optionality in platforms and partnerships",
                        "Experimentation governance",
                        "Organizational immune system"
                    ]
                }
            }
        ];
    }
    // AI Operating Model
    else if (path.includes('ai-operating-model')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "Service",
                "serviceType": "Business Consulting",
                "name": "AI Operating Model",
                "description": "Rebuild your company into an AI-native organism ready for agentic systems, multi-agent coordination, and exponentially improving intelligence.",
                "provider": {
                    "@id": "https://mattisco.com/#organization"
                },
                "areaServed": "United States",
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "AI Operating Model Deliverables",
                    "itemListElement": [
                        "Decision architectures for human-AI routing",
                        "Self-healing data systems",
                        "Agent frameworks and orchestration",
                        "Interface standards and safety rails",
                        "Verification and alignment systems",
                        "Talent evolution playbooks",
                        "Economic alignment models"
                    ]
                }
            }
        ];
    }
    // Contact page
    else if (path.includes('contact')) {
        pageSchemas = [
            organizationSchema,
            {
                "@context": "https://schema.org",
                "@type": "ContactPage",
                "name": "Contact Mattis&Co",
                "description": "Schedule a complimentary diagnostic session with Mattis&Co.",
                "url": "https://mattisco.com/pages/contact.html",
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
