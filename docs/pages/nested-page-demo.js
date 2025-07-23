class NestedPageDemo extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <div class="content-area">
                <h1>Nested Page Demo</h1>
                
                <div class="intro-section">
                    <p>This page demonstrates the deepest level of navigation - a page within a subcategory, which is itself within a category. This shows the full 3-level hierarchy in action.</p>
                </div>
                
                <h2>Three-Level Navigation Hierarchy</h2>
                
                <p>This page demonstrates the complete navigation structure:</p>
                
                <div class="code-tabs">
                    <div class="tab-content">
                        <strong>Navigation Path:</strong>
                        <pre><code>Category Example
  └── Subcategory Example
      └── Nested Page Demo (you are here)</code></pre>
                    </div>
                </div>
                
                <h3>Subcategory Features</h3>
                
                <p>Subcategories provide an additional level of organization:</p>
                
                <ul>
                    <li><strong>Nested Structure</strong> - Subcategories exist within parent categories</li>
                    <li><strong>Independent Collapse</strong> - Can be collapsed separately from parent categories</li>
                    <li><strong>Visual Hierarchy</strong> - Styled to show the nested relationship</li>
                    <li><strong>State Persistence</strong> - Remembers expanded/collapsed state individually</li>
                </ul>
                
                <h3>When to Use Deep Nesting</h3>
                
                <p>Consider using subcategories when you have:</p>
                
                <ol>
                    <li>Large categories with distinct sub-themes</li>
                    <li>Complex applications with multiple functional areas</li>
                    <li>Content that naturally groups into hierarchical structures</li>
                    <li>Users who benefit from progressive disclosure of features</li>
                </ol>
                
                <div class="callout callout-warning">
                    <strong>Design Note:</strong> While this framework supports 3 levels, avoid going deeper as it can create navigation complexity. Most applications work well with 2-3 levels maximum.
                </div>
            </div>
        `;
    }
}

customElements.define('nested-page-demo', NestedPageDemo);
