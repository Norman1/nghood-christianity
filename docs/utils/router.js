import { updatePageMetadata } from './page-metadata.js';
import { prepareForAnimation } from './performance-utils.js';

const routes = {
    '/bible-reading-plan': 'bible-reading-plan',
    '/bible-verse-game': 'bible-verse-game-page',
    '/components-gallery': 'components-gallery',
    
    // Account
    '/profile': 'user-profile',
    '/backend-test': 'backend-test',
    
    // Standalone pages
    '/about': 'about-page',
    '/test-404': 'not-found-page',
    
    // Legacy routes (for backwards compatibility)
    '/page1': 'not-found-page',
    '/page2': 'not-found-page',
    '/privacy': 'about-page'  // Redirect old privacy link to about
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
        
        const path = location.pathname || '/about';
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

    // Handle browser back/forward buttons
    window.addEventListener('popstate', render);
    window.addEventListener('DOMContentLoaded', render);
    
    // Handle clicks on links with client-side routing
    document.addEventListener('click', (e) => {
        // Check if clicked element is a link
        const link = e.target.closest('a');
        if (!link) return;
        
        // Check if it's an internal link
        const href = link.getAttribute('href');
        if (!href || href.startsWith('http') || href.startsWith('#')) return;
        
        // Prevent default navigation
        e.preventDefault();
        
        // Use History API to update URL
        history.pushState(null, '', href);
        
        // Render the new page
        render();
    });
}
