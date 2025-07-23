import { authService } from '../utils/auth-service.js';

class AuthGuard extends HTMLElement {
    connectedCallback() {
        this.checkAuthentication();
        
        // Listen for auth state changes
        this.authListener = (event) => this.checkAuthentication();
        authService.subscribe(this.authListener);
    }

    disconnectedCallback() {
        if (this.authListener) {
            authService.unsubscribe(this.authListener);
        }
    }

    checkAuthentication() {
        if (!authService.isAuthenticated()) {
            this.showAuthRequired();
        } else {
            this.showProtectedContent();
        }
    }

    showAuthRequired() {
        this.innerHTML = `
            <style>
                .auth-required {
                    max-width: 600px;
                    margin: 4rem auto;
                    padding: 3rem;
                    text-align: center;
                    background: #f8f9fa;
                    border: 1px solid #e0e0e0;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                
                .auth-icon {
                    font-size: 4rem;
                    color: #6c757d;
                    margin-bottom: 1.5rem;
                }
                
                .auth-required h2 {
                    color: #333;
                    margin-bottom: 1rem;
                    font-size: 1.5rem;
                }
                
                .auth-required p {
                    color: #666;
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                    line-height: 1.6;
                }
                
                .login-prompt {
                    display: inline-block;
                    padding: 0.75rem 2rem;
                    background: #4285f4;
                    color: white;
                    text-decoration: none;
                    border-radius: 6px;
                    cursor: pointer;
                    border: none;
                    font-size: 1rem;
                    font-weight: 500;
                    transition: all 0.2s;
                    box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
                }
                
                .login-prompt:hover {
                    background: #357ae8;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
                }
                
                .login-prompt:active {
                    transform: translateY(0);
                }
            </style>
            
            <div class="auth-required">
                <div class="auth-icon">🔐</div>
                <h2>Authentication Required</h2>
                <p>This page requires you to be signed in to view its content.<br>
                Please sign in with your Google account to continue.</p>
                <button class="login-prompt" id="authLoginButton">Sign In with Google</button>
            </div>
        `;

        // Set up login button
        const loginButton = this.querySelector('#authLoginButton');
        loginButton.addEventListener('click', () => {
            authService.redirectToLogin();
        });
    }

    showProtectedContent() {
        // Show the actual protected content
        const content = this.querySelector('[slot="protected-content"]');
        if (content) {
            this.innerHTML = '';
            this.appendChild(content.cloneNode(true));
        } else {
            // If no slotted content, dispatch event for parent to handle
            this.dispatchEvent(new CustomEvent('auth-success', {
                bubbles: true,
                detail: { user: authService.getUser() }
            }));
        }
    }
}

customElements.define('auth-guard', AuthGuard);