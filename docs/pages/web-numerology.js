import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class WebNumerologyPage extends HTMLElement {
    async connectedCallback() {
        // Optional: We can enable the TOC if we want, though the article is short. 
        // Let's keep it simple for now, or enable it to match other articles.
        // The satire format might be better as a single flow. 
        // Let's just render the template.
        
        this.appendChild(createLoadingElement());

        try {
            const templateContent = await loadTemplate('./templates/web-numerology.html');
            this.innerHTML = templateContent;
        } catch (error) {
            console.error('Error loading article:', error);
            this.innerHTML = `
                <div style="color: #f87171; padding: 2rem; text-align: center;">
                    <h2>Could not load the article</h2>
                    <p>Please refresh the page or try again later.</p>
                </div>
            `;
        }
    }
}

customElements.define('web-numerology-page', WebNumerologyPage);