// Page metadata for SEO
const pageMetadata = {
    '#/components-gallery': {
        title: 'Components Gallery | nghood Christianity',
        description: 'Showcase of all available UI components and styling elements in the framework.',
        keywords: 'components, gallery, UI elements, styling, framework'
    },
    
    // Legacy routes (for backwards compatibility)
    '#/page1': {
        title: '404 - Page Not Found | nghood Christianity',
        description: 'The requested page could not be found. Return to the main navigation to explore available content.',
        keywords: '404, not found, error page'
    },
    '#/page2': {
        title: '404 - Page Not Found | nghood Christianity',
        description: 'The requested page could not be found. Return to the main navigation to explore available content.',
        keywords: '404, not found, error page'
    },
    '#/about': {
        title: 'About | nghood Christianity',
        description: 'Learn about nghood Christianity and our privacy practices.',
        keywords: 'about, privacy policy, nghood christianity'
    },
    '#/profile': {
        title: 'User Profile | nghood Christianity',
        description: 'Manage your user profile, settings, and account information.',
        keywords: 'profile, user account, settings'
    },
    '#/test-404': {
        title: '404 - Page Not Found | nghood Christianity',
        description: 'The requested page could not be found. Return to the main navigation to explore available content.',
        keywords: '404, not found, error page'
    },
    // Default/fallback metadata
    'default': {
        title: 'nghood Christianity - Web Application Framework',
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
            "name": "nghood Christianity",
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