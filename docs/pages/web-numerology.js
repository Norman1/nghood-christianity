import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';
import { generateTOC } from '../utils/toc-generator.js';

class WebNumerologyPage extends HTMLElement {
    async connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout?.setAttribute('with-right', '');
        layout?.querySelectorAll('[slot="right"]').forEach((el) => el.remove());
        
        this.appendChild(createLoadingElement());

        try {
            const templateContent = await loadTemplate('./templates/web-numerology.html');
            this.innerHTML = templateContent;

            const toc = generateTOC(this);
            const sidebar = document.createElement('div');
            sidebar.setAttribute('slot', 'right');
            sidebar.appendChild(toc);
            layout?.appendChild(sidebar);
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