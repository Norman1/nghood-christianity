import { generateTOC } from '../utils/toc-generator.js';
import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class TestWithSidebar extends HTMLElement {
    async connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout.setAttribute('with-right', '');

        // Clear old right sidebar content from layout
        layout.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        // Show loading state
        this.appendChild(createLoadingElement());

        try {
            // Load template content
            const templateContent = await loadTemplate('./templates/test-with-sidebar.html');
            
            // Create main content container
            const mainContent = document.createElement('div');
            mainContent.innerHTML = templateContent;

            // Clear this page's content and append the loaded content
            this.innerHTML = '';
            this.appendChild(mainContent);

            // Create sidebar TOC based on that content
            const toc = generateTOC(mainContent);
            const sidebar = document.createElement('div');
            sidebar.setAttribute('slot', 'right');
            sidebar.appendChild(toc);

            // Inject sidebar into layout (outside this page component)
            layout.appendChild(sidebar);
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

customElements.define('test-with-sidebar', TestWithSidebar);