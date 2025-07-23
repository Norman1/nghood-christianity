class AuthService {
    constructor() {
        this.listeners = [];
        this.pendingRedirect = null;
    }

    isAuthenticated() {
        const saved = localStorage.getItem('googleUser');
        return !!saved;
    }

    getUser() {
        const saved = localStorage.getItem('googleUser');
        return saved ? JSON.parse(saved) : null;
    }

    setPendingRedirect(path) {
        this.pendingRedirect = path;
        sessionStorage.setItem('pendingRedirect', path);
    }

    getPendingRedirect() {
        return this.pendingRedirect || sessionStorage.getItem('pendingRedirect');
    }

    clearPendingRedirect() {
        this.pendingRedirect = null;
        sessionStorage.removeItem('pendingRedirect');
    }

    redirectToLogin() {
        // Set the current path as pending redirect
        this.setPendingRedirect(window.location.hash || '#/page1');
        
        // Trigger login modal
        const authComponent = document.querySelector('custom-auth');
        if (authComponent) {
            authComponent.showLoginModal();
        }
    }

    handleSuccessfulLogin() {
        const redirectPath = this.getPendingRedirect();
        this.clearPendingRedirect();
        
        if (redirectPath && redirectPath !== window.location.hash) {
            window.location.hash = redirectPath;
        }
    }

    handleLogout() {
        // If user is on a protected page, redirect to home
        const protectedRoutes = ['#/profile'];
        const currentPath = window.location.hash;
        
        if (protectedRoutes.includes(currentPath)) {
            window.location.hash = '#/page1';
        }
    }

    subscribe(listener) {
        this.listeners.push(listener);
    }

    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    notify(event, data) {
        this.listeners.forEach(listener => listener(event, data));
    }
}

// Create singleton instance
export const authService = new AuthService();

// Listen for auth events
window.addEventListener('google-signin', (event) => {
    authService.handleSuccessfulLogin();
    authService.notify('signin', event.detail);
});

window.addEventListener('google-signout', () => {
    authService.handleLogout();
    authService.notify('signout');
});