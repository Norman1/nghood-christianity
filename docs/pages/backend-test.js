import '../components/auth-guard.js';
import { authService } from '../utils/auth-service.js';
import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class BackendTest extends HTMLElement {
    connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');

        if (!authService.isAuthenticated()) {
            this.innerHTML = '<auth-guard></auth-guard>';

            this.addEventListener('auth-success', () => {
                this.renderContent();
            });
            return;
        }

        this.renderContent();
    }

    async renderContent() {
        this.appendChild(createLoadingElement());

        try {
            const templateContent = await loadTemplate('./templates/backend-test.html');
            this.innerHTML = templateContent;

            const user = authService.getUser();
            const userNameElement = this.querySelector('#user-name');
            if (userNameElement) {
                userNameElement.textContent = user.name;
            }

            const environmentElement = this.querySelector('#environment');
            if (environmentElement) {
                environmentElement.textContent = window.CONFIG.ENVIRONMENT;
            }

            const apiEndpointElement = this.querySelector('#api-endpoint');
            if (apiEndpointElement) {
                apiEndpointElement.textContent = `${window.CONFIG.API_BASE_URL}/api/hello/{userName}`;
            }

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
            if (!responseElement || !errorElement) {
                return;
            }

            responseElement.textContent = '';
            errorElement.textContent = '';
            responseElement.hidden = true;
            errorElement.hidden = true;

            testButton.disabled = true;
            testButton.textContent = 'Calling Backend...';

            try {
                const user = authService.getUser();
                const userName = user.name;

                const response = await fetch(`${window.CONFIG.API_BASE_URL}/api/hello/${encodeURIComponent(userName)}`, {
                    headers: {
                        'X-API-Key': window.CONFIG.API_SECRET
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const message = await response.text();
                responseElement.textContent = message;
                responseElement.hidden = false;
            } catch (error) {
                errorElement.textContent = `Error: ${error.message}`;
                errorElement.hidden = false;
            } finally {
                testButton.disabled = false;
                testButton.textContent = 'Call Backend';
            }
        });
    }
}

customElements.define('backend-test', BackendTest);
