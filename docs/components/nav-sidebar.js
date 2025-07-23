class NavSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.collapsedState = this.loadCollapsedState();
    }

    connectedCallback() {
        this.render();
        this.setupCollapsibles();
        this.highlightActiveLink();
        window.addEventListener('hashchange', this.highlightActiveLink.bind(this));
        
        // Listen for auth changes
        window.addEventListener('google-signin', () => {
            this.render();
            this.setupCollapsibles();
            this.highlightActiveLink();
        });
        window.addEventListener('google-signout', () => {
            this.render();
            this.setupCollapsibles();
            this.highlightActiveLink();
        });
    }

    loadCollapsedState() {
        const saved = localStorage.getItem('nav-collapsed-state');
        return saved ? JSON.parse(saved) : {};
    }

    saveCollapsedState() {
        localStorage.setItem('nav-collapsed-state', JSON.stringify(this.collapsedState));
    }

    disconnectedCallback() {
        window.removeEventListener('hashchange', this.highlightActiveLink.bind(this));
    }

    getNavigationData() {
        const isLoggedIn = this.isUserLoggedIn();
        
        return {
            // Top-level pages (no category)
            topLevel: [
                { href: '#/navigation-showcase', title: 'Navigation Showcase' }
            ],
            
            // Categories with optional subcategories
            categories: [
                {
                    id: 'category-example',
                    title: 'Category Example',
                    pages: [
                        { href: '#/category-page-demo', title: 'Category Page Demo' }
                    ],
                    subcategories: [
                        {
                            id: 'subcategory-example',
                            title: 'Subcategory Example',
                            pages: [
                                { href: '#/nested-page-demo', title: 'Nested Page Demo' }
                            ]
                        }
                    ]
                },
                {
                    id: 'layouts',
                    title: 'Layouts',
                    pages: [
                        { href: '#/test-minimal', title: 'Minimal Content' },
                        { href: '#/test-full', title: 'Full Content' },
                        { href: '#/test-with-sidebar', title: 'With Right Sidebar' },
                        { href: '#/test-scrollable', title: 'Scrollable Sidebar' },
                        { href: '#/components-gallery', title: 'Components Gallery' }
                    ],
                    subcategories: []
                },
                ...(isLoggedIn ? [{
                    id: 'account',
                    title: 'Account',
                    pages: [
                        { href: '#/profile', title: 'My Profile' }
                    ],
                    subcategories: []
                }] : [])
            ],
            
            // Bottom-level standalone pages
            bottomLevel: [
                { href: '#/privacy', title: 'Privacy & Terms' },
                { href: '#/test-404', title: 'Test 404' }
            ]
        };
    }

    render() {
        const navData = this.getNavigationData();
        
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        #sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        /* Top-level pages */
        .top-level-pages {
          border-bottom: 1px solid rgba(48, 54, 61, 0.3);
          padding-bottom: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .top-level-page {
          margin: 0.25rem 0;
        }

        .top-level-page a {
          display: block;
          padding: 0.4rem 0.75rem;
          color: #f0f6fc;
          text-decoration: none;
          border-radius: 4px;
          transition: all 0.2s ease;
          font-weight: 500;
        }

        .top-level-page a:hover {
          background: rgba(88, 166, 255, 0.08);
          color: #58a6ff;
        }

        .top-level-page a.active {
          background: rgba(88, 166, 255, 0.15);
          color: #58a6ff;
          font-weight: 600;
        }

        /* Categories */
        .category {
          margin-bottom: 0.5rem;
        }

        .category-header {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 0.5rem 0.75rem;
          cursor: pointer;
          color: #f0f6fc;
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: 4px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .category-header:hover {
          background: rgba(88, 166, 255, 0.05);
          color: #58a6ff;
        }

        .category-icon {
          font-size: 0.8rem;
          transition: transform 0.2s ease;
        }

        .category.expanded .category-icon {
          transform: rotate(90deg);
        }

        .category-content {
          padding-left: 0.75rem;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .category.collapsed .category-content {
          max-height: 0;
        }

        .category.expanded .category-content {
          max-height: 500px;
        }

        /* Category-level pages */
        .category-pages {
          margin: 0.25rem 0;
        }

        .category-page {
          margin: 0.2rem 0;
        }

        .category-page a {
          display: block;
          padding: 0.35rem 0.5rem;
          color: #e6edf3;
          text-decoration: none;
          border-radius: 3px;
          transition: all 0.2s ease;
          border-left: 2px solid transparent;
        }

        .category-page a:hover {
          background: rgba(88, 166, 255, 0.08);
          color: #58a6ff;
          border-left-color: #58a6ff;
        }

        .category-page a.active {
          background: rgba(88, 166, 255, 0.12);
          color: #58a6ff;
          border-left-color: #58a6ff;
          font-weight: 500;
        }

        /* Subcategories */
        .subcategory {
          margin: 0.5rem 0;
        }

        .subcategory-header {
          background: none;
          border: none;
          width: 100%;
          text-align: left;
          padding: 0.35rem 0.5rem;
          cursor: pointer;
          color: #8b949e;
          font-weight: 500;
          font-size: 0.85rem;
          border-radius: 3px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .subcategory-header:hover {
          background: rgba(88, 166, 255, 0.05);
          color: #58a6ff;
        }

        .subcategory-icon {
          font-size: 0.7rem;
          transition: transform 0.2s ease;
        }

        .subcategory.expanded .subcategory-icon {
          transform: rotate(90deg);
        }

        .subcategory-content {
          padding-left: 0.5rem;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .subcategory.collapsed .subcategory-content {
          max-height: 0;
        }

        .subcategory.expanded .subcategory-content {
          max-height: 300px;
        }

        /* Subcategory pages */
        .subcategory-page {
          margin: 0.15rem 0;
        }

        .subcategory-page a {
          display: block;
          padding: 0.3rem 0.5rem;
          color: #8b949e;
          text-decoration: none;
          border-radius: 3px;
          transition: all 0.2s ease;
          font-size: 0.85rem;
          border-left: 2px solid transparent;
        }

        .subcategory-page a:hover {
          background: rgba(88, 166, 255, 0.08);
          color: #58a6ff;
          border-left-color: #58a6ff;
        }

        .subcategory-page a.active {
          background: rgba(88, 166, 255, 0.12);
          color: #58a6ff;
          border-left-color: #58a6ff;
          font-weight: 500;
        }
      </style>

      <div id="sidebar-nav">
        ${this.renderTopLevelPages(navData.topLevel)}
        ${navData.categories.map(category => this.renderCategory(category)).join('')}
        ${this.renderBottomLevelPages(navData.bottomLevel)}
      </div>
    `;
    }

    renderTopLevelPages(pages) {
        if (!pages || pages.length === 0) return '';
        
        return `
            <div class="top-level-pages">
                ${pages.map(page => `
                    <div class="top-level-page">
                        <a href="${page.href}">${page.title}</a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderBottomLevelPages(pages) {
        if (!pages || pages.length === 0) return '';
        
        return `
            <div class="top-level-pages" style="border-top: 1px solid rgba(48, 54, 61, 0.3); border-bottom: none; padding-top: 0.5rem; margin-top: 0.5rem;">
                ${pages.map(page => `
                    <div class="top-level-page">
                        <a href="${page.href}">${page.title}</a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderCategory(category) {
        const isExpanded = this.collapsedState[category.id] !== false; // Default to expanded
        const hasContent = (category.pages && category.pages.length > 0) || 
                          (category.subcategories && category.subcategories.length > 0);
        
        if (!hasContent) return '';

        return `
            <div class="category ${isExpanded ? 'expanded' : 'collapsed'}" data-category="${category.id}">
                <button class="category-header">
                    <span>${category.title}</span>
                    <span class="category-icon">▶</span>
                </button>
                <div class="category-content">
                    ${this.renderCategoryPages(category.pages)}
                    ${category.subcategories.map(sub => this.renderSubcategory(category.id, sub)).join('')}
                </div>
            </div>
        `;
    }

    renderCategoryPages(pages) {
        if (!pages || pages.length === 0) return '';
        
        return `
            <div class="category-pages">
                ${pages.map(page => `
                    <div class="category-page">
                        <a href="${page.href}">${page.title}</a>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderSubcategory(categoryId, subcategory) {
        const subId = `${categoryId}-${subcategory.id}`;
        const isExpanded = this.collapsedState[subId] !== false; // Default to expanded
        
        if (!subcategory.pages || subcategory.pages.length === 0) return '';

        return `
            <div class="subcategory ${isExpanded ? 'expanded' : 'collapsed'}" data-subcategory="${subId}">
                <button class="subcategory-header">
                    <span>${subcategory.title}</span>
                    <span class="subcategory-icon">▶</span>
                </button>
                <div class="subcategory-content">
                    ${subcategory.pages.map(page => `
                        <div class="subcategory-page">
                            <a href="${page.href}">${page.title}</a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    setupCollapsibles() {
        // Category headers
        this.shadowRoot.querySelectorAll('.category-header').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.closest('.category');
                const categoryId = category.dataset.category;
                const isExpanded = category.classList.contains('expanded');
                
                category.classList.toggle('expanded', !isExpanded);
                category.classList.toggle('collapsed', isExpanded);
                
                this.collapsedState[categoryId] = !isExpanded;
                this.saveCollapsedState();
            });
        });

        // Subcategory headers
        this.shadowRoot.querySelectorAll('.subcategory-header').forEach(button => {
            button.addEventListener('click', () => {
                const subcategory = button.closest('.subcategory');
                const subId = subcategory.dataset.subcategory;
                const isExpanded = subcategory.classList.contains('expanded');
                
                subcategory.classList.toggle('expanded', !isExpanded);
                subcategory.classList.toggle('collapsed', isExpanded);
                
                this.collapsedState[subId] = !isExpanded;
                this.saveCollapsedState();
            });
        });
    }

    highlightActiveLink() {
        const current = location.hash;
        this.shadowRoot.querySelectorAll('a').forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === current);
        });
    }
    
    isUserLoggedIn() {
        const saved = localStorage.getItem('googleUser');
        return !!saved;
    }
}

customElements.define('nav-sidebar', NavSidebar);
