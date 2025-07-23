// Performance utilities to prevent layout shifts and optimize rendering

/**
 * Batch DOM updates to prevent layout thrashing
 * @param {Function[]} updates - Array of update functions
 */
export function batchDOMUpdates(updates) {
    // Read phase
    const reads = [];
    
    // Write phase
    requestAnimationFrame(() => {
        updates.forEach(update => update());
    });
}

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Preconnect to external domains for faster resource loading
 * @param {string[]} origins - Array of origin URLs
 */
export function preconnectOrigins(origins) {
    origins.forEach(origin => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = origin;
        link.crossOrigin = 'anonymous';
        document.head.appendChild(link);
    });
}

/**
 * Add will-change CSS property for upcoming animations
 * @param {HTMLElement} element - Element that will be animated
 * @param {string} property - CSS property that will change
 */
export function prepareForAnimation(element, property = 'transform') {
    element.style.willChange = property;
    
    // Remove will-change after animation to free up memory
    element.addEventListener('transitionend', () => {
        element.style.willChange = 'auto';
    }, { once: true });
}

/**
 * Use Intersection Observer for lazy loading
 * @param {string} selector - CSS selector for elements to observe
 * @param {Function} callback - Callback when element is visible
 */
export function lazyLoad(selector, callback) {
    const options = {
        root: null,
        rootMargin: '50px',
        threshold: 0.01
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
}