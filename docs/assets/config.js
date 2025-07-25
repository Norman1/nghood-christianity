// Environment detection and configuration
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Global configuration object
window.CONFIG = {
    API_BASE_URL: isLocal ? 'http://localhost:8080' : 'http://3.218.30.26:8080',
    API_SECRET: isLocal ? 'dev-secret-123' : 'prod-secret-456',
    ENVIRONMENT: isLocal ? 'development' : 'production'
};

// Log environment for debugging
console.log(`Running in ${window.CONFIG.ENVIRONMENT} mode`);
console.log(`API URL: ${window.CONFIG.API_BASE_URL}`);