import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class NotFoundPage extends HTMLElement {
    async connectedCallback() {
        // Clear right sidebar
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        // Show loading state
        this.appendChild(createLoadingElement());

        try {
            // Load template content
            const templateContent = await loadTemplate('./templates/not-found.html');
            
            // Clear this page's content and append the loaded content
            this.innerHTML = '';
            this.innerHTML = templateContent;
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

customElements.define('not-found-page', NotFoundPage);
