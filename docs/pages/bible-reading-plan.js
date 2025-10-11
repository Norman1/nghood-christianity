import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class BibleReadingPlan extends HTMLElement {
    async connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        this.appendChild(createLoadingElement());

        try {
            const templateContent = await loadTemplate('./templates/bible-reading-plan.html');

            this.innerHTML = '';
            this.innerHTML = templateContent;

            this.setupEventListeners();
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
    
    setupEventListeners() {
        const generateBtn = this.querySelector('#generate-plan-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateReadingPlan());
        }
    }
    
    async generateReadingPlan() {
        const generateBtn = this.querySelector('#generate-plan-btn');
        const loadingIndicator = this.querySelector('#loading-indicator');
        const errorMessage = this.querySelector('#error-message');
        const resultsSection = this.querySelector('#reading-plan-results');

        if (!generateBtn || !loadingIndicator || !errorMessage || !resultsSection) {
            return;
        }

        generateBtn.disabled = true;
        loadingIndicator.hidden = false;
        errorMessage.hidden = true;
        resultsSection.hidden = true;

        try {
            const response = await fetch(`${window.CONFIG.API_BASE_URL}/api/bible-reading-plan`, {
                headers: {
                    'X-API-Key': window.CONFIG.API_SECRET
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to generate reading plan: ${response.statusText}`);
            }

            const bookNames = await response.json();

            this.displayReadingPlan(bookNames);

            resultsSection.hidden = false;
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        } catch (error) {
            console.error('Error generating reading plan:', error);
            const errorText = this.querySelector('#error-text');
            if (errorText) {
                errorText.textContent = error.message;
            }
            errorMessage.hidden = false;
        } finally {
            generateBtn.disabled = false;
            loadingIndicator.hidden = true;
        }
    }
    
    displayReadingPlan(bookNames) {
        const booksList = this.querySelector('#books-list');
        if (!booksList) {
            return;
        }

        booksList.innerHTML = '';

        bookNames.forEach((bookName) => {
            const bookDiv = document.createElement('div');
            bookDiv.textContent = bookName;
            booksList.appendChild(bookDiv);
        });
    }
}

customElements.define('bible-reading-plan', BibleReadingPlan);
