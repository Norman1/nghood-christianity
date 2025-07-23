import { GOOGLE_CLIENT_ID } from '../config/google-auth.js';

const CLIENT_ID = GOOGLE_CLIENT_ID || '921086640739-1eo9j9ll8rk4v7s6gdc69i8c5kdi2p9i.apps.googleusercontent.com';

class CustomAuth extends HTMLElement {
    constructor() {
        super();
        this.user = null;
        this.modalOpen = false;
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }

                .auth-button {
                    background: #0969da;
                    border: 1px solid #0550ae;
                    color: white;
                    border-radius: 6px;
                    padding: 6px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.15s ease-in-out;
                    text-align: center;
                    line-height: 20px;
                    min-height: 32px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    white-space: nowrap;
                }

                .auth-button:hover {
                    background: #0860ca;
                    border-color: #0550ae;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
                }

                .auth-button:active {
                    background: #0757ba;
                    border-color: #044289;
                    box-shadow: inset 0 1px 0 rgba(0, 0, 0, 0.15);
                }

                .user-display {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 4px;
                    padding: 0.25rem 0.75rem;
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    transition: all 0.2s;
                }

                .user-display:hover {
                    background: white;
                    border-color: rgba(0, 0, 0, 0.2);
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 2px solid rgba(0, 0, 0, 0.1);
                }

                .user-name {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #333;
                }

                .logout-button {
                    background: rgba(220, 53, 69, 0.1);
                    border: 1px solid rgba(220, 53, 69, 0.3);
                    color: #dc3545;
                    border-radius: 3px;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .logout-button:hover {
                    background: rgba(220, 53, 69, 0.2);
                    border-color: rgba(220, 53, 69, 0.5);
                }

                /* Modal Styles */
                .modal-overlay {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    animation: fadeIn 0.2s ease-out;
                }

                .modal-overlay.show {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-content {
                    background: white;
                    border-radius: 8px;
                    padding: 2rem;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    animation: slideUp 0.3s ease-out;
                }

                .modal-header {
                    text-align: center;
                    margin-bottom: 1.5rem;
                }

                .modal-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #333;
                    margin: 0 0 0.5rem 0;
                }

                .modal-subtitle {
                    color: #666;
                    font-size: 0.95rem;
                }

                .sign-in-options {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    margin: 2rem 0;
                }

                #googleSignInDiv {
                    display: flex;
                    justify-content: center;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: #999;
                    cursor: pointer;
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: all 0.2s;
                }

                .close-button:hover {
                    background: #f5f5f5;
                    color: #666;
                }

                .auth-container {
                    display: flex;
                    align-items: center;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            </style>
            
            <div class="auth-container">
                <button class="auth-button" id="loginButton">Login</button>
                
                <div class="user-display" id="userDisplay" style="display: none;">
                    <img class="user-avatar" id="userAvatar" src="" alt="">
                    <span class="user-name" id="userName"></span>
                    <button class="logout-button" id="signOutButton">Logout</button>
                </div>
            </div>

            <div class="modal-overlay" id="loginModal">
                <div class="modal-content">
                    <button class="close-button" id="closeModal">&times;</button>
                    <div class="modal-header">
                        <h2 class="modal-title">Welcome Back</h2>
                        <p class="modal-subtitle">Sign in to access your account</p>
                    </div>
                    <div class="sign-in-options">
                        <div id="googleSignInDiv"></div>
                        <div class="privacy-notice">
                            <p style="font-size: 0.85rem; color: #666; text-align: center; margin: 1rem 0 0 0;">
                                By signing in, you agree to our <a href="#/privacy" style="color: #4285f4;">Privacy & Terms</a>. 
                                We only use your name, email, and profile picture to save your progress.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.setupEventListeners();
        this.loadGoogleSignIn();
    }

    setupEventListeners() {
        const loginButton = this.querySelector('#loginButton');
        const loginModal = this.querySelector('#loginModal');
        const closeModal = this.querySelector('#closeModal');
        const signOutButton = this.querySelector('#signOutButton');

        loginButton.addEventListener('click', () => this.showLoginModal());
        closeModal.addEventListener('click', () => this.hideLoginModal());
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) this.hideLoginModal();
        });

        signOutButton.addEventListener('click', () => this.signOut());
    }

    showLoginModal() {
        const modal = this.querySelector('#loginModal');
        modal.classList.add('show');
        this.modalOpen = true;
        
        // Re-render Google button if needed
        if (window.google && window.google.accounts) {
            this.renderGoogleButton();
        }
    }

    hideLoginModal() {
        const modal = this.querySelector('#loginModal');
        modal.classList.remove('show');
        this.modalOpen = false;
    }

    loadGoogleSignIn() {
        if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
            const script = document.createElement('script');
            script.src = 'https://accounts.google.com/gsi/client';
            script.async = true;
            script.defer = true;
            script.onload = () => this.initGoogleAuth();
            document.head.appendChild(script);
        } else {
            this.initGoogleAuth();
        }
    }

    initGoogleAuth() {
        if (!window.google) {
            console.error('Google Identity Services not loaded');
            return;
        }

        try {
            // Check for saved user first
            const savedUser = this.getSavedUser();
            if (savedUser) {
                this.user = savedUser;
                this.showUserInfo(savedUser);
            }

            // Initialize Google
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (response) => this.handleCredentialResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true,
            });

        } catch (error) {
            console.error('Error initializing Google auth:', error);
        }
    }

    renderGoogleButton() {
        const container = document.getElementById('googleSignInDiv');
        if (container && window.google && window.google.accounts) {
            container.innerHTML = '';
            google.accounts.id.renderButton(
                container,
                {
                    theme: 'outline',
                    size: 'large',
                    text: 'signin_with',
                    shape: 'rectangular',
                    logo_alignment: 'left',
                    width: 300
                }
            );
        }
    }

    handleCredentialResponse(response) {
        const responsePayload = this.decodeJwtResponse(response.credential);
        
        const userProfile = {
            id: responsePayload.sub,
            name: responsePayload.name,
            email: responsePayload.email,
            picture: responsePayload.picture
        };
        
        this.user = userProfile;
        this.saveUser(userProfile);
        this.showUserInfo(userProfile);
        this.hideLoginModal();
        
        this.dispatchEvent(new CustomEvent('google-signin', {
            detail: { user: userProfile },
            bubbles: true
        }));
    }

    showUserInfo(user) {
        const loginButton = this.querySelector('#loginButton');
        const userDisplay = this.querySelector('#userDisplay');
        const userAvatar = this.querySelector('#userAvatar');
        const userName = this.querySelector('#userName');

        loginButton.style.display = 'none';
        userDisplay.style.display = 'flex';
        userAvatar.src = user.picture || user.imageUrl;
        userAvatar.alt = user.name;
        userName.textContent = user.name;
    }

    signOut() {
        if (window.google && window.google.accounts) {
            google.accounts.id.disableAutoSelect();
        }
        
        this.user = null;
        this.clearSavedUser();
        
        const loginButton = this.querySelector('#loginButton');
        const userDisplay = this.querySelector('#userDisplay');
        
        loginButton.style.display = 'block';
        userDisplay.style.display = 'none';
        
        this.dispatchEvent(new CustomEvent('google-signout', {
            bubbles: true
        }));
    }

    decodeJwtResponse(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }

    saveUser(user) {
        localStorage.setItem('googleUser', JSON.stringify(user));
    }

    getSavedUser() {
        const saved = localStorage.getItem('googleUser');
        return saved ? JSON.parse(saved) : null;
    }

    clearSavedUser() {
        localStorage.removeItem('googleUser');
    }
}

customElements.define('custom-auth', CustomAuth);