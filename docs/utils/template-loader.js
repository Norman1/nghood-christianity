// Template cache for performance
const templateCache = new Map();

export async function loadTemplate(templatePath, options = {}) {
    const { showLoading = true, errorHandler = null, useCache = true } = options;
    
    // Check cache first
    if (useCache && templateCache.has(templatePath)) {
        return templateCache.get(templatePath);
    }
    
    try {
        const response = await fetch(templatePath);
        if (!response.ok) {
            throw new Error(`Failed to load template: ${response.status}`);
        }
        const content = await response.text();
        
        // Cache the template
        if (useCache) {
            templateCache.set(templatePath, content);
        }
        
        return content;
    } catch (error) {
        console.error('Template loading error:', error);
        
        if (errorHandler) {
            return errorHandler(error, templatePath);
        }
        
        const errorContent = `
            <div style="
                max-width: 600px;
                margin: 2rem auto;
                padding: 2rem;
                background: #fee;
                border: 1px solid #fcc;
                border-radius: 8px;
                text-align: center;
            ">
                <h2 style="color: #c00; margin-bottom: 1rem;">Error Loading Page</h2>
                <p style="color: #666; margin-bottom: 0.5rem;">Failed to load: ${templatePath}</p>
                <p style="color: #999; font-size: 0.9rem;">${error.message}</p>
            </div>
        `;
        
        // Don't cache error content
        return errorContent;
    }
}

// Preload critical templates
export function preloadTemplates(templatePaths) {
    templatePaths.forEach(path => {
        loadTemplate(path).catch(error => {
            console.warn('Failed to preload template:', path, error);
        });
    });
}

export function createLoadingElement() {
    const loading = document.createElement('div');
    loading.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 200px;
        font-size: 1.2rem;
        color: #666;
    `;
    loading.innerHTML = `
        <div style="text-align: center;">
            <div style="
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #0055aa;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            "></div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
            Loading...
        </div>
    `;
    return loading;
}