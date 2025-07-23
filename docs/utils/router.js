import { updatePageMetadata } from './page-metadata.js';
import { prepareForAnimation } from './performance-utils.js';

const routes = {
    // Navigation showcase pages
    '#/navigation-showcase': 'navigation-showcase',
    '#/category-page-demo': 'category-page-demo', 
    '#/nested-page-demo': 'nested-page-demo',
    
    // Layout examples
    '#/test-minimal': 'test-minimal',
    '#/test-full': 'test-full',
    '#/test-with-sidebar': 'test-with-sidebar',
    '#/test-scrollable': 'test-scrollable',
    '#/components-gallery': 'components-gallery',
    
    // Account
    '#/profile': 'user-profile',
    
    // Standalone pages
    '#/privacy': 'privacy-policy',
    '#/test-404': 'not-found-page',
    
    // Legacy routes (for backwards compatibility)
    '#/page1': 'navigation-showcase',
    '#/page2': 'category-page-demo',
    '#/about': 'navigation-showcase'
};

let currentPage = null;
let isTransitioning = false;

export function initRouter() {
    const outlet = document.querySelector('#router-view');
    
    // Set styles to prevent layout shifts
    outlet.style.flex = '1';
    outlet.style.display = 'block';

    function render() {
        if (isTransitioning) return;
        
        const path = location.hash || '#/page1';
        const tag = routes[path] || 'not-found-page';

        // Update page metadata for SEO
        updatePageMetadata(path);

        isTransitioning = true;
        
        // Remove old content immediately to prevent position conflicts
        if (currentPage) {
            currentPage.remove();
        }
        
        // Create new page element
        const newPage = document.createElement(tag);
        newPage.style.opacity = '0';
        newPage.style.transition = 'opacity 0.1s ease';
        newPage.style.margin = '0';
        newPage.style.padding = '0';
        newPage.style.position = 'static';
        
        // Add new page to DOM
        outlet.appendChild(newPage);
        
        // Force layout recalculation
        newPage.offsetHeight;
        
        // Transition in new page immediately
        requestAnimationFrame(() => {
            newPage.style.opacity = '1';
        });
        
        // Clean up after transition
        setTimeout(() => {
            currentPage = newPage;
            isTransitioning = false;
        }, 100);
    }

    window.addEventListener('hashchange', render);
    window.addEventListener('DOMContentLoaded', render);
}
