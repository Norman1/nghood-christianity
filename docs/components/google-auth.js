import { GOOGLE_CLIENT_ID } from '../config/google-auth.js';

// Fallback client ID if module import fails
const CLIENT_ID = GOOGLE_CLIENT_ID || '921086640739-1eo9j9ll8rk4v7s6gdc69i8c5kdi2p9i.apps.googleusercontent.com';

class GoogleAuth extends HTMLElement {
    constructor() {
        super();
        this.user = null;
        this.tokenClient = null;
        this.accessToken = null;
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
                :host {
                    display: inline-block;
                }

                .auth-container {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                #googleSignInButton {
                    display: inline-block;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255,255,255,0.9);
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 0.25rem 0.75rem;
                }

                .user-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                }

                .user-name {
                    font-size: 0.95rem;
                    font-weight: 500;
                    color: #333;
                }

                .sign-out-button {
                    background: transparent;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.875rem;
                    color: #666;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .sign-out-button:hover {
                    background: #f5f5f5;
                    color: #333;
                }

                .loading {
                    color: #666;
                    font-size: 0.875rem;
                }

                .hidden {
                    display: none !important;
                }
            </style>
            
            <div class="auth-container" id="authContainer">
                <span class="loading">Loading...</span>
            </div>
        `;

        this.loadGoogleSignIn();
    }

    loadGoogleSignIn() {
        // Load the new Google Identity Services library
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => this.initGoogleAuth();
        document.head.appendChild(script);
    }

    initGoogleAuth() {
        if (!window.google) {
            console.error('Google Identity Services not loaded');
            this.showError();
            return;
        }

        // Debug logs removed for security

        if (!CLIENT_ID || CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com') {
            console.error('Please update GOOGLE_CLIENT_ID in config/google-auth.js');
            const container = this.querySelector('#authContainer');
            container.innerHTML = `
                <span style="color: #d93025; font-size: 0.875rem;">Please configure Google Client ID</span>
            `;
            return;
        }

        try {
            // Initialize the Google Identity Services client FIRST
            google.accounts.id.initialize({
                client_id: CLIENT_ID,
                callback: (response) => this.handleCredentialResponse(response),
                auto_select: false,
                cancel_on_tap_outside: true,
            });

            // Initialize the token client for additional scopes
            this.tokenClient = google.accounts.oauth2.initTokenClient({
                client_id: CLIENT_ID,
                scope: 'profile email',
                callback: (response) => {
                    this.accessToken = response.access_token;
                },
            });

            // THEN check for saved user and show appropriate UI
            const savedUser = this.getSavedUser();
            if (savedUser) {
                this.user = savedUser;
                this.showUserInfo(savedUser);
            } else {
                this.showSignInButton();
            }

        } catch (error) {
            console.error('Error initializing Google auth:', error);
            this.showError();
        }
    }

    showSignInButton() {
        const container = this.querySelector('#authContainer');
        container.innerHTML = `
            <div id="googleSignInButton"></div>
        `;

        // Render the Google Sign-In button
        google.accounts.id.renderButton(
            document.getElementById('googleSignInButton'),
            {
                theme: 'outline',
                size: 'medium',
                text: 'signin_with',
                shape: 'rectangular',
                logo_alignment: 'left'
            }
        );

        // Also prompt for One Tap if appropriate
        google.accounts.id.prompt();
    }

    showUserInfo(profile) {
        const container = this.querySelector('#authContainer');
        container.innerHTML = `
            <div class="user-info">
                <img class="user-avatar" src="${profile.picture || profile.imageUrl}" alt="${profile.name}">
                <span class="user-name">${profile.name}</span>
                <button class="sign-out-button" id="signOutButton">Sign out</button>
            </div>
        `;

        const signOutButton = container.querySelector('#signOutButton');
        signOutButton.addEventListener('click', () => this.signOut());
    }

    showError() {
        const container = this.querySelector('#authContainer');
        container.innerHTML = `
            <span style="color: #d93025; font-size: 0.875rem;">Auth error</span>
        `;
    }

    handleCredentialResponse(response) {
        // Decode the JWT credential response
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
        
        this.dispatchEvent(new CustomEvent('google-signin', {
            detail: { user: userProfile },
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

    signOut() {
        // Sign out and revoke authentication
        google.accounts.id.disableAutoSelect();
        
        // Clear local user data
        this.user = null;
        this.accessToken = null;
        this.clearSavedUser();
        
        // Show sign-in button again
        this.showSignInButton();
        
        this.dispatchEvent(new CustomEvent('google-signout', {
            bubbles: true
        }));
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

customElements.define('google-auth', GoogleAuth);