/**
 * Ashish Agrawal - Portfolio Central Configuration & Data
 * 
 * Edit this file anytime you want to update your personal details,
 * skills, projects, experience, or contact information!
 */

const PORTFOLIO_CONFIG = {
  personal: {
    fullName: "Ashish Agrawal",
    email: "ashishagrwal307@gmail.com",
    phone: "9928903550",
    phoneDisplay: "+91 9928903550",
    roles: [
      "Web Developer",
      "Sales Executive",
      "Digital Problem Solver",
      "Client Growth Partner"
    ],
    headline: "Web Developer | Sales Executive | Digital Problem Solver",
    location: "India",
    availability: "Available for Web Development & Sales Opportunities",
    shortBio: "A motivated Web Developer and Sales Executive who bridges the gap between clean, responsive code and business growth. Combining modern technical development with client communication, strategic negotiation, and relationship management to deliver measurable value.",
    avatarUrl: "assets/images/ashish-agrawal.jpg",
    photoUrl: "assets/images/ashish-agrawal.jpg",
    logoUrl: "assets/images/logo.png",
    resumeUrl: "assets/docs/Ashish_Agrawal_Resume.pdf"
  },

  socials: {
    phone: {
      name: "Phone",
      number: "9928903550",
      telUrl: "tel:9928903550",
      display: "+91 9928903550",
      label: "Direct Phone Call"
    },
    linkedin: {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/ashishagrwal7014/",
      isPlaceholder: false,
      label: "Connect on LinkedIn"
    },
    github: {
      name: "GitHub",
      url: "https://github.com/ashishagrwal759-a11y",
      isPlaceholder: false,
      label: "View Code on GitHub"
    },
    whatsapp: {
      name: "WhatsApp",
      url: "https://wa.me/919928903550?text=Hello%20Ashish,%20I%20saw%20your%20portfolio",
      isPlaceholder: false,
      label: "Chat on WhatsApp"
    },
    emailDirect: "https://mail.google.com/mail/?view=cm&fs=1&to=ashishagrwal307@gmail.com"
  },

  // Verified Skills - Only skills Ashish knows as requested
  skills: {
    webDevelopment: [
      {
        name: "WordPress",
        level: 92,
        category: "CMS & Architecture",
        description: "Custom themes, Gutenberg block patterns, ACF (Advanced Custom Fields), WooCommerce, and speed optimization.",
        icon: "fa-wordpress"
      },
      {
        name: "Shopify",
        level: 90,
        category: "E-Commerce & Liquid",
        description: "Storefront customization, custom Liquid sections, cart optimization, app integration, and conversion optimization.",
        icon: "fa-shopify"
      },
      {
        name: "HTML5",
        level: 95,
        category: "Markup & Semantics",
        description: "Semantic structures, SEO optimization, and web accessibility (a11y).",
        icon: "fa-html5"
      },
      {
        name: "CSS3",
        level: 90,
        category: "Styling & Layout",
        description: "Modern Flexbox, CSS Grid, keyframe animations, and custom UI systems.",
        icon: "fa-css3-alt"
      },
      {
        name: "JavaScript",
        level: 85,
        category: "Client-Side Logic",
        description: "ES6+, DOM manipulation, asynchronous operations, and interactive UI logic.",
        icon: "fa-js"
      },
      {
        name: "Responsive Web Design",
        level: 95,
        category: "Cross-Platform Layout",
        description: "Mobile-first layouts adapting fluidly to smartphones, tablets, and large screens.",
        icon: "fa-mobile-screen"
      },
      {
        name: "UI/UX Fundamentals",
        level: 85,
        category: "User Experience",
        description: "User journey mapping, visual hierarchy, contrast accessibility, and intuitive navigation.",
        icon: "fa-wand-magic-sparkles"
      },
      {
        name: "Website Optimization",
        level: 88,
        category: "Performance",
        description: "Fast page load times, image optimization, clean code structure, and Core Web Vitals.",
        icon: "fa-gauge-high"
      }
    ],

    salesAndBusiness: [
      {
        name: "Sales Strategy",
        level: 90,
        category: "Strategy & Planning",
        description: "Designing end-to-end sales outreach frameworks and value-focused pitches.",
        icon: "fa-chess"
      },
      {
        name: "Lead Generation",
        level: 90,
        category: "Prospecting",
        description: "Identifying qualified prospects, outbound research, and converting interest into meetings.",
        icon: "fa-bullseye"
      },
      {
        name: "Client Relationship Management",
        level: 95,
        category: "Client Retention",
        description: "Fostering long-term trust, client onboarding, consistent communication, and account care.",
        icon: "fa-handshake"
      },
      {
        name: "Communication and Negotiation",
        level: 92,
        category: "Deal Closing",
        description: "Active listening, objection handling, persuasive presentations, and mutually beneficial agreements.",
        icon: "fa-comments"
      },
      {
        name: "Customer Support",
        level: 90,
        category: "Service Excellence",
        description: "Prompt issue resolution, proactive client assistance, and positive customer feedback.",
        icon: "fa-headset"
      },
      {
        name: "Business Development",
        level: 88,
        category: "Revenue Growth",
        description: "Market expansion, strategic partnerships, and positioning digital products for higher revenue.",
        icon: "fa-chart-line"
      }
    ]
  },

  // Projects & Portfolio - 5 Detailed Projects (WordPress, Shopify, & High-Converting Funnels)
  projects: [
    {
      id: "project-1",
      title: "GoGold USA — Full Custom WordPress Redesign & Client Intake",
      badge: "WordPress & Full Redesign",
      category: "wordpress",
      image: "assets/images/project-gogold.svg",
      summary: "Full end-to-end custom WordPress redesign and intake system for GoGold USA (gogoldusa.com), guiding international executives, investors, and families through structured U.S. relocation and business expansion.",
      problemSolution: "The original GoGold USA digital presence required an elevated, modern corporate aesthetic to reflect high-trust advisory services. Executed a comprehensive website redesign on custom WordPress using Gutenberg modular blocks and ACF Pro, delivering intuitive service pathway navigation, multi-step consultation scheduling, and sub-second performance across mobile and desktop.",
      technologies: ["WordPress", "Full Website Redesign", "Custom ACF Pro", "HTML5 & CSS3", "JavaScript", "Lead Intake Funnel", "SEO & Speed Optimization"],
      keyFeatures: [
        "Complete brand visual overhaul with executive corporate styling and high-trust aesthetics",
        "Custom WordPress architecture with zero page-builder bloat, cutting load time significantly",
        "Structured multi-pillar service hierarchy: Visa Pathways, Business Expansion, and Relocation Logistics",
        "Streamlined multi-step consultation booking and lead qualification intake form",
        "Cross-device mobile-first responsiveness and international SEO schema metadata integration"
      ],
      liveUrl: "https://gogoldusa.com",
      githubUrl: "#project-modal",
      isLiveClient: true,
      timelineTag: "Live Client Project • Full Redesign"
    },
    {
      id: "project-2",
      title: "Shopify High-Converting Fashion & Lifestyle Store",
      badge: "Shopify & E-Commerce",
      category: "shopify",
      image: "assets/images/project-2.svg",
      summary: "High-performance direct-to-consumer Shopify storefront custom-coded in Liquid, featuring dynamic collection filtering, slide-out upsell cart, and frictionless checkout.",
      problemSolution: "Addressed high mobile cart abandonment by creating custom Liquid sections, instant variant switches, sticky add-to-cart buttons, and quick-pay express checkout triggers, resulting in a +31.8% conversion rate lift.",
      technologies: ["Shopify", "Liquid", "HTML5", "CSS3", "JavaScript", "CRO (Conversion Optimization)"],
      keyFeatures: [
        "Custom Liquid templates optimized for mobile-first shoppers",
        "Interactive AJAX slide-out cart drawer with dynamic free-shipping threshold bar",
        "Custom product variant selectors with real-time stock level counters",
        "Klaviyo automated email flows for abandoned cart recovery",
        "Integrated payment gateways (Shop Pay, Apple Pay, Google Pay, Cards)"
      ],
      liveUrl: "#project-modal",
      githubUrl: "#project-modal",
      isPlaceholder: false,
      timelineTag: "Featured Portfolio Project"
    },
    {
      id: "project-3",
      title: "High-Converting Sales Landing Page & Lead Capture Funnel",
      badge: "Sales & Web Funnel",
      category: "sales",
      image: "assets/images/project-3.svg",
      summary: "Strategic direct-response landing page with a 2-step qualification form designed to capture qualified high-ticket B2B consulting inquiries.",
      problemSolution: "Bridged technical web development with consultative sales strategy: crafted compelling value propositions, objection-handling FAQs, trust proof badges, and interactive form logic that achieved a 26% lead capture rate.",
      technologies: ["Sales Strategy", "WordPress / HTML5", "CSS3", "JavaScript", "Lead Generation", "HubSpot CRM"],
      keyFeatures: [
        "Frictionless 2-step lead pre-qualification quiz form with real-time validation",
        "Strategic CTA placements matching decision-maker buying psychology",
        "Instant webhook integration routing qualified leads directly into CRM pipelines",
        "Automated calendar booking integration (Calendly / Google Calendar)",
        "Heatmap & scroll depth tracking to continuously optimize user engagement"
      ],
      liveUrl: "#project-modal",
      githubUrl: "#project-modal",
      isPlaceholder: false,
      timelineTag: "Recent Work (Past 3 Months)"
    },
    {
      id: "project-4",
      title: "Shopify B2B Wholesale & Multi-Tier Retail Store",
      badge: "Shopify & B2B Commerce",
      category: "shopify",
      image: "assets/images/project-4.svg",
      summary: "Comprehensive multi-channel Shopify storefront supporting standard retail consumers and gated wholesale B2B accounts with tiered volume discounts.",
      problemSolution: "Wholesale clients previously ordered through manual spreadsheets, leading to errors and delays. Engineered custom Shopify Liquid templates with tiered volume pricing tables, Net-30 invoice request workflows, and automated customer tag gating.",
      technologies: ["Shopify Plus / Standard", "Liquid", "JavaScript", "Shopify Cart API", "B2B Pricing", "3PL Sync"],
      keyFeatures: [
        "Automated customer tag gating separating retail and approved wholesale pricing",
        "Dynamic volume discount tables updating order unit prices via Cart API",
        "Quick bulk order entry by SKU and CSV bulk file uploads",
        "Automated sales tax exemptions and Net-30 terms application",
        "3PL warehouse inventory tracking preventing out-of-stock overselling"
      ],
      liveUrl: "#project-modal",
      githubUrl: "#project-modal",
      isPlaceholder: false,
      timelineTag: "Featured Portfolio Project"
    },
    {
      id: "project-5",
      title: "Custom WordPress Real Estate & Booking Portal",
      badge: "WordPress & Custom ACF",
      category: "wordpress",
      image: "assets/images/project-5.svg",
      summary: "Dynamic real estate property showcase and service appointment scheduling portal built with WordPress Custom Post Types, ACF Pro, and Google Maps API.",
      problemSolution: "Built a customized property exploration portal allowing clients to filter properties by location, amenities, and price with instant results, paired with a self-service tour scheduling calendar that reduced manual coordination by 80%.",
      technologies: ["WordPress", "ACF Pro (Custom Fields)", "JavaScript", "Google Maps API", "Appointment Scheduling"],
      keyFeatures: [
        "Dynamic multi-criteria search filter (City, Price Range, Bedrooms, Type)",
        "Interactive Google Maps API integration with custom branded property pins",
        "Self-service tour booking calendar with automatic email & SMS confirmations",
        "One-click WhatsApp direct agent consultation button",
        "Optimized media pipeline with automated WebP image conversion"
      ],
      liveUrl: "#project-modal",
      githubUrl: "#project-modal",
      isPlaceholder: false,
      timelineTag: "Recent Work (Past 3 Months)"
    }
  ],

  // Professional Experience Timeline - Clear editable placeholders, no fabricated history
  experience: [
    {
      roleTitle: "Web Developer & Digital Solutions Specialist",
      companyName: "[Company / Organization Name - Web Development]",
      period: "[Month Year – Present / Editable Date]",
      type: "Web Development",
      location: "[City, Country / Remote]",
      statusBadge: "Current / Placeholder",
      isPlaceholder: true,
      responsibilities: [
        "Develop and maintain modern, responsive web pages using HTML5, CSS3, and JavaScript.",
        "Collaborate with stakeholders to translate business requirements into intuitive, accessible user interfaces.",
        "Perform website speed optimization, code reviews, and mobile-first responsiveness testing.",
        "Ensure cross-browser compatibility and maintain clean, well-documented codebases."
      ]
    },
    {
      roleTitle: "Sales Executive & Client Relationship Manager",
      companyName: "[Company / Organization Name - Sales & Business]",
      period: "[Month Year – Month Year / Editable Date]",
      type: "Sales & Business",
      location: "[City, Country / On-Site or Hybrid]",
      statusBadge: "Editable Placeholder",
      isPlaceholder: true,
      responsibilities: [
        "Drove outbound lead generation and client discovery sessions to understand business pain points.",
        "Managed end-to-end sales pipelines, from prospect outreach and product presentations to negotiation.",
        "Fostered long-term client relationships resulting in high customer satisfaction and repeat inquiries.",
        "Delivered prompt customer support, handling client queries and facilitating smooth onboarding."
      ]
    },
    {
      roleTitle: "Freelance Web Consultant & Business Outreach",
      companyName: "Independent Professional Practice",
      period: "[Flexible / Ongoing]",
      type: "Dual Role",
      location: "Remote / Hybrid",
      statusBadge: "Active Practice",
      isPlaceholder: true,
      responsibilities: [
        "Advise small businesses on building an impactful web presence to drive inbound client inquiries.",
        "Build custom landing pages and portfolios optimized for fast load speed and lead capture.",
        "Implement tailored sales communication strategies for digital services."
      ]
    }
  ],

  // Professional Services Offered
  services: [
    {
      id: "service-web-dev",
      title: "Website Development",
      icon: "fa-code",
      accent: "cyan",
      tagline: "Clean, fast, and maintainable modern websites",
      description: "End-to-end web development using semantic HTML5, modern CSS3, and responsive JavaScript. Engineered for performance, maintainability, and clean code standards.",
      deliverables: [
        "Semantic HTML5 & Modern CSS3 architecture",
        "Interactive JavaScript UI components",
        "W3C valid, maintainable, and clean code",
        "SEO-friendly site hierarchy and meta tags"
      ]
    },
    {
      id: "service-responsive-design",
      title: "Responsive Website Design",
      icon: "fa-laptop-mobile",
      accent: "blue",
      tagline: "Seamless experiences across all screen sizes",
      description: "Crafting mobile-first layouts that adapt effortlessly to smartphones, tablets, laptops, and ultra-wide desktops without breaking layouts or degrading experience.",
      deliverables: [
        "Mobile-first responsive fluid grids",
        "Cross-browser testing (Chrome, Safari, Firefox, Edge)",
        "Touch-friendly navigation and buttons",
        "Adaptive typography and high-density image display"
      ]
    },
    {
      id: "service-landing-page",
      title: "Landing Page Development",
      icon: "fa-rocket",
      accent: "purple",
      tagline: "High-converting single-page digital experiences",
      description: "Strategic landing pages engineered specifically to present your product, capture visitor interest, and convert traffic into qualified inquiries.",
      deliverables: [
        "Conversion-focused layout & visual hierarchy",
        "Frictionless contact & lead intake forms",
        "Compelling call-to-action (CTA) button placement",
        "Fast load speed to prevent visitor bounce"
      ]
    },
    {
      id: "service-maintenance",
      title: "Website Maintenance",
      icon: "fa-screwdriver-wrench",
      accent: "green",
      tagline: "Keeping your web presence updated, secure, and fast",
      description: "Ongoing technical support, bug fixing, content updates, and routine performance optimizations to ensure your website remains smooth and trouble-free.",
      deliverables: [
        "Routine content, text, and asset updates",
        "Bug diagnosis and UI glitch fixes",
        "Performance audits and image compression",
        "Broken link checking and code cleanups"
      ]
    },
    {
      id: "service-lead-gen",
      title: "Lead Generation",
      icon: "fa-bullseye",
      accent: "orange",
      tagline: "Targeted outreach to fill your business pipeline",
      description: "Deploying systematic lead identification and outreach methods to discover ideal clients, initiate conversations, and build a strong pipeline of opportunities.",
      deliverables: [
        "Target client profiling and prospecting research",
        "Value-driven cold outreach and email drafting",
        "Lead qualification criteria establishment",
        "Pipeline tracking and follow-up sequences"
      ]
    },
    {
      id: "service-client-acquisition",
      title: "Sales & Client Acquisition Support",
      icon: "fa-handshake-angle",
      accent: "pink",
      tagline: "From discovery call to closed agreement",
      description: "Guiding prospects through the evaluation cycle with professional communication, active listening, objection handling, and clear commercial proposals.",
      deliverables: [
        "Commercial discovery and pitch presentation",
        "Objection handling and value negotiation",
        "Client onboarding communication frameworks",
        "Customer support and relationship retention"
      ]
    }
  ]
};
