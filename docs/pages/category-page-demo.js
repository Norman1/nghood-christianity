class CategoryPageDemo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="content-area">
                <h1>Category Page Demo</h1>
                
                <div class="intro-section">
                    <p>This page demonstrates a page that belongs to a category ("Category Example"). It shows how content can be organized within collapsible sections.</p>
                </div>
                
                <h2>Category-Level Organization</h2>
                
                <p>This page is located within the "Category Example" category in the navigation sidebar. Categories help organize related content and can be:</p>
                
                <ul>
                    <li><strong>Expanded</strong> - Showing all contained pages and subcategories</li>
                    <li><strong>Collapsed</strong> - Hidden to reduce visual clutter</li>
                    <li><strong>Mixed</strong> - Some subcategories expanded, others collapsed</li>
                </ul>
                
                <h3>Category Benefits</h3>
                
                <p>Using categories in navigation provides several advantages:</p>
                
                <ol>
                    <li><strong>Organization</strong> - Groups related functionality together</li>
                    <li><strong>Scalability</strong> - Handles large numbers of pages without overwhelming users</li>
                    <li><strong>User Control</strong> - Users can focus on relevant sections</li>
                    <li><strong>Progressive Disclosure</strong> - Reveals complexity gradually</li>
                </ol>
                
                <div class="callout callout-success">
                    <strong>Navigation Tip:</strong> Look at the sidebar to see how this page is nested within the "Category Example" section.
                </div>
            </div>
        `;
    }
}

customElements.define('category-page-demo', CategoryPageDemo);
