import '../components/auth-guard.js';
import { authService } from '../utils/auth-service.js';
import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class BackendTest extends HTMLElement {
    connectedCallback() {
        // Clear right sidebar
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        
        // Check authentication
        if (!authService.isAuthenticated()) {
            this.innerHTML = '<auth-guard></auth-guard>';
            
            // Listen for successful authentication
            this.addEventListener('auth-success', () => {
                this.renderContent();
            });
            return;
        }
        
        this.renderContent();
    }
    
    async renderContent() {
        // Show loading
        this.appendChild(createLoadingElement());
        
        try {
            // Load template
            const templateContent = await loadTemplate('./templates/backend-test.html');
            this.innerHTML = templateContent;
            
            // Display user info
            const user = authService.getUser();
            const userNameElement = this.querySelector('#user-name');
            if (userNameElement) {
                userNameElement.textContent = user.name;
            }
            
            // Set up backend call button
            this.setupBackendCall();
        } catch (error) {
            this.innerHTML = `<div style="color: red;">Error loading template: ${error.message}</div>`;
        }
    }
    
    setupBackendCall() {
        const testButton = this.querySelector('#test-backend-call');
        const responseElement = this.querySelector('#backend-response');
        const errorElement = this.querySelector('#backend-error');
        
        testButton?.addEventListener('click', async () => {
            // Clear previous messages
            responseElement.textContent = '';
            errorElement.textContent = '';
            
            // Show loading state
            testButton.disabled = true;
            testButton.textContent = 'Calling Backend...';
            
            try {
                const user = authService.getUser();
                const userName = user.name;
                const API_SECRET = "your-api-secret-2024";
                
                const response = await fetch(`https://api.nghood.com/api/hello/${encodeURIComponent(userName)}`, {
                    headers: {
                        'X-API-Key': API_SECRET
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const message = await response.text();
                responseElement.textContent = message;
                responseElement.style.display = 'block';
            } catch (error) {
                errorElement.textContent = `Error: ${error.message}`;
                errorElement.style.display = 'block';
            } finally {
                // Reset button state
                testButton.disabled = false;
                testButton.textContent = 'Call Backend';
            }
        });
    }
}

customElements.define('backend-test', BackendTest);