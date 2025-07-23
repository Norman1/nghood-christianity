// Lazy loading utility for page components
const componentCache = new Map();
const loadingPromises = new Map();

// Mapping of component tags to their script paths
const componentPaths = {
    'page-one': './pages/page-one.js',
    'page-two': './pages/page-two.js',
    'tool-a': './pages/tool-a.js',
    'tool-b': './pages/tool-b.js',
    'page-about': './pages/page-about.js',
    'not-found-page': './pages/not-found-page.js',
    'user-profile': './pages/user-profile.js'
};

export async function loadComponent(tagName) {
    // Return immediately if component is already loaded
    if (componentCache.has(tagName)) {
        return componentCache.get(tagName);
    }

    // Return existing promise if component is currently loading
    if (loadingPromises.has(tagName)) {
        return loadingPromises.get(tagName);
    }

    // Get component path
    const componentPath = componentPaths[tagName];
    if (!componentPath) {
        throw new Error(`Unknown component: ${tagName}`);
    }

    // Create loading promise
    const loadingPromise = import(componentPath)
        .then(() => {
            componentCache.set(tagName, true);
            loadingPromises.delete(tagName);
            return true;
        })
        .catch(error => {
            loadingPromises.delete(tagName);
            console.error(`Failed to load component ${tagName}:`, error);
            throw error;
        });

    loadingPromises.set(tagName, loadingPromise);
    return loadingPromise;
}

// Preload critical components for better UX
export async function preloadComponents(components = []) {
    const preloadPromises = components
        .filter(component => componentPaths[component])
        .map(component => loadComponent(component).catch(err => 
            console.warn(`Failed to preload ${component}:`, err)
        ));
    
    await Promise.allSettled(preloadPromises);
}

// Check if component is loaded
export function isComponentLoaded(tagName) {
    return componentCache.has(tagName);
}