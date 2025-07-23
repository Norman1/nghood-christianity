class NavigationShowcase extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="content-area">
                <h1>Navigation Showcase</h1>
                
                <div class="intro-section">
                    <p>This page demonstrates the top-level navigation behavior. It appears at the root level without being nested in any category.</p>
                </div>
                
                <h2>Framework Navigation Features</h2>
                
                <p>This framework supports a flexible 3-level navigation hierarchy:</p>
                
                <ul>
                    <li><strong>Top-level pages</strong> - Like this page, appear prominently at the top</li>
                    <li><strong>Categories with pages</strong> - Collapsible sections containing related pages</li>
                    <li><strong>Subcategories</strong> - Nested sections within categories for deeper organization</li>
                    <li><strong>Bottom-level pages</strong> - Standalone pages at the bottom (like Privacy & Terms)</li>
                </ul>
                
                <h3>Navigation State Persistence</h3>
                
                <p>The navigation remembers which categories and subcategories you've expanded or collapsed, storing this state locally for a better user experience across sessions.</p>
                
                <div class="callout callout-info">
                    <strong>Try it:</strong> Expand and collapse the "Category Example" section in the left sidebar, then refresh the page. Your preferences will be remembered.
                </div>
            </div>
        `;
    }
}

customElements.define('navigation-showcase', NavigationShowcase);
