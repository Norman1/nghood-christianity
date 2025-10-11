import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';
import { generateTOC } from '../utils/toc-generator.js';

class ExplainingFreeGracePage extends HTMLElement {
    async connectedCallback() {
        // Enable right sidebar
        const layout = document.querySelector('main-layout');
        layout?.setAttribute('with-right', '');
        
        // Clear old right sidebar content
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        // Show loading state
        this.appendChild(createLoadingElement());

        try {
            // Load template content
            const templateContent = await loadTemplate('./templates/explaining-free-grace.html');
            
            // Clear this page's content and append the loaded content
            this.innerHTML = '';
            this.innerHTML = templateContent;
            
            // Generate TOC from headings and add to right sidebar
            const toc = generateTOC(this);
            const sidebar = document.createElement('div');
            sidebar.setAttribute('slot', 'right');
            sidebar.appendChild(toc);
            
            // Inject sidebar into layout
            layout?.appendChild(sidebar);
            
        } catch (error) {
            console.error('Error loading page:', error);
            this.innerHTML = `
                <div style="color: red; padding: 2rem; text-align: center;">
                    <h2>Error Loading Page</h2>
                    <p>Failed to load page content. Please try refreshing.</p>
                </div>
            `;
        }
    }
}

customElements.define('explaining-free-grace-page', ExplainingFreeGracePage);