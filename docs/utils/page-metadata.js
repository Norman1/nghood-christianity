// Page metadata for SEO
const pageMetadata = {
    // Navigation showcase pages
    '#/navigation-showcase': {
        title: 'Navigation Showcase | Learning Hub',
        description: 'Explore the flexible 3-level navigation system and learn how to organize content effectively.',
        keywords: 'navigation, showcase, hierarchy, organization'
    },
    '#/category-page-demo': {
        title: 'Category Page Demo | Learning Hub',
        description: 'Demonstration of how pages work within categories for organized content structure.',
        keywords: 'category, organization, content structure, demo'
    },
    '#/nested-page-demo': {
        title: 'Nested Page Demo | Learning Hub',
        description: 'Example of deep navigation hierarchy with subcategories and nested page organization.',
        keywords: 'nested, subcategory, hierarchy, navigation structure'
    },
    
    // Layout examples
    '#/test-minimal': {
        title: 'Minimal Content | Learning Hub',
        description: 'Example of minimal content layout with clean, focused design.',
        keywords: 'minimal, layout, clean design, content'
    },
    '#/test-full': {
        title: 'Full Content | Learning Hub',
        description: 'Example of full content layout with comprehensive information display.',
        keywords: 'full content, layout, comprehensive, information'
    },
    '#/test-with-sidebar': {
        title: 'With Right Sidebar | Learning Hub',
        description: 'Example layout featuring a right sidebar for additional content and navigation.',
        keywords: 'sidebar, layout, additional content, navigation'
    },
    '#/test-scrollable': {
        title: 'Scrollable Sidebar | Learning Hub',
        description: 'Example of scrollable sidebar layout for handling large amounts of secondary content.',
        keywords: 'scrollable, sidebar, large content, secondary'
    },
    '#/components-gallery': {
        title: 'Components Gallery | Learning Hub',
        description: 'Showcase of all available UI components and styling elements in the framework.',
        keywords: 'components, gallery, UI elements, styling, framework'
    },
    
    // Legacy routes (for backwards compatibility)
    '#/page1': {
        title: 'Navigation Showcase | Learning Hub',
        description: 'Explore the flexible 3-level navigation system and learn how to organize content effectively.',
        keywords: 'navigation, showcase, hierarchy, organization'
    },
    '#/page2': {
        title: 'Category Page Demo | Learning Hub',
        description: 'Demonstration of how pages work within categories for organized content structure.',
        keywords: 'category, organization, content structure, demo'
    },
    '#/about': {
        title: 'Navigation Showcase | Learning Hub',
        description: 'Explore the flexible 3-level navigation system and learn how to organize content effectively.',
        keywords: 'navigation, showcase, hierarchy, organization'
    },
    '#/profile': {
        title: 'User Profile | Learning Hub',
        description: 'Manage your user profile, settings, and account information.',
        keywords: 'profile, user account, settings'
    },
    '#/privacy': {
        title: 'Privacy & Terms | Learning Hub',
        description: 'Our privacy policy and terms of service for using our application.',
        keywords: 'privacy policy, terms of service, data protection'
    },
    '#/test-404': {
        title: '404 - Page Not Found | Learning Hub',
        description: 'The requested page could not be found. Return to the main navigation to explore available content.',
        keywords: '404, not found, error page'
    },
    // Default/fallback metadata
    'default': {
        title: 'Learning Hub - Web Application Framework',
        description: 'A modern web application framework showcasing flexible navigation and layout patterns.',
        keywords: 'web app, framework, navigation, layouts, learning'
    }
};

export function updatePageMetadata(path) {
    const metadata = pageMetadata[path] || pageMetadata['default'];
    
    // Update document title
    document.title = metadata.title;
    
    // Update or create meta description
    updateMetaTag('description', metadata.description);
    
    // Update or create meta keywords
    updateMetaTag('keywords', metadata.keywords);
    
    // Add canonical URL
    updateCanonicalUrl(window.location.href);
    
    // Update Open Graph meta tags for social sharing
    updateMetaTag('og:title', metadata.title, 'property');
    updateMetaTag('og:description', metadata.description, 'property');
    updateMetaTag('og:type', 'website', 'property');
    updateMetaTag('og:url', window.location.href, 'property');
    
    // Add structured data
    updateStructuredData(metadata, path);
}

function updateMetaTag(name, content, attribute = 'name') {
    let meta = document.querySelector(`meta[${attribute}="${name}"]`);
    
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
}

function updateCanonicalUrl(url) {
    let canonical = document.querySelector('link[rel="canonical"]');
    
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    
    canonical.setAttribute('href', url);
}

function updateStructuredData(metadata, path) {
    // Remove existing structured data
    const existing = document.querySelector('script[type="application/ld+json"]#page-data');
    if (existing) {
        existing.remove();
    }
    
    // Create new structured data
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": metadata.title,
        "description": metadata.description,
        "url": window.location.href,
        "isPartOf": {
            "@type": "WebSite",
            "name": "Learning Hub",
            "url": window.location.origin + window.location.pathname
        }
    };
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'page-data';
    script.textContent = JSON.stringify(structuredData, null, 2);
    document.head.appendChild(script);
}

export function getPageMetadata(path) {
    return pageMetadata[path] || pageMetadata['default'];
}