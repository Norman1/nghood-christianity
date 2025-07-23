import '../components/auth-guard.js';
import { authService } from '../utils/auth-service.js';
import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

class UserProfile extends HTMLElement {
    connectedCallback() {
        // Clear right sidebar
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());
        
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            this.innerHTML = '<auth-guard></auth-guard>';
            
            // Listen for successful authentication
            this.addEventListener('auth-success', () => {
                this.renderUserProfile();
            });
            return;
        }

        this.renderUserProfile();
    }
    
    async renderUserProfile() {
        const savedUser = authService.getUser();
        
        // Show loading state
        this.appendChild(createLoadingElement());

        try {
            // Load template content
            const templateContent = await loadTemplate('./templates/user-profile.html');
            
            // Create main content container
            const mainContent = document.createElement('div');
            mainContent.innerHTML = templateContent;

            // Populate dynamic content
            this.populateUserData(mainContent, savedUser);

            // Clear this page's content and append the loaded content
            this.innerHTML = '';
            this.appendChild(mainContent);
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

    populateUserData(container, userData) {
        // Populate profile data
        const profileElements = container.querySelectorAll('[data-profile]');
        profileElements.forEach(element => {
            const field = element.getAttribute('data-profile');
            if (field === 'picture') {
                element.src = userData.picture || userData.imageUrl;
                const altField = element.getAttribute('data-alt-profile');
                if (altField) element.alt = userData[altField];
            } else {
                element.textContent = userData[field] || '';
            }
        });

        // Populate debug data
        const debugElements = container.querySelectorAll('[data-debug]');
        debugElements.forEach(element => {
            const debugType = element.getAttribute('data-debug');
            if (debugType === 'user-json') {
                element.textContent = JSON.stringify(userData, null, 2);
            } else if (debugType === 'system-info') {
                element.textContent = `Current Time: ${new Date().toISOString()}
User Agent: ${navigator.userAgent}
LocalStorage Keys: ${Object.keys(localStorage).join(', ')}
Session Active: ${!!userData}`;
            }
        });
    }

}

customElements.define('user-profile', UserProfile);