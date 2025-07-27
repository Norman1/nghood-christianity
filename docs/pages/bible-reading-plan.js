import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class BibleReadingPlan extends HTMLElement {
    async connectedCallback() {
        // Clear right sidebar
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        // Show loading state
        this.appendChild(createLoadingElement());

        try {
            // Load template content
            const templateContent = await loadTemplate('./templates/bible-reading-plan.html');
            
            // Clear this page's content and append the loaded content
            this.innerHTML = '';
            this.innerHTML = templateContent;
            
            // Set up event listeners after content is loaded
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
        const booksList = this.querySelector('#books-list');
        
        // Reset UI
        generateBtn.disabled = true;
        loadingIndicator.style.display = 'block';
        errorMessage.style.display = 'none';
        resultsSection.style.display = 'none';
        
        try {
            // Call backend API
            const response = await fetch(`${window.CONFIG.API_BASE_URL}/api/bible-reading-plan`, {
                headers: {
                    'X-API-Key': window.CONFIG.API_SECRET
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to generate reading plan: ${response.statusText}`);
            }
            
            const bookNames = await response.json();
            
            // Display the results
            this.displayReadingPlan(bookNames);
            
            // Show results section
            resultsSection.style.display = 'block';
            
            // Scroll to results
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
        } catch (error) {
            console.error('Error generating reading plan:', error);
            this.querySelector('#error-text').textContent = error.message;
            errorMessage.style.display = 'block';
        } finally {
            generateBtn.disabled = false;
            loadingIndicator.style.display = 'none';
        }
    }
    
    displayReadingPlan(bookNames) {
        const booksList = this.querySelector('#books-list');
        booksList.innerHTML = '';
        
        bookNames.forEach((bookName) => {
            const bookDiv = document.createElement('div');
            bookDiv.textContent = bookName;
            booksList.appendChild(bookDiv);
        });
    }
}

customElements.define('bible-reading-plan', BibleReadingPlan);