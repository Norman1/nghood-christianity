class HierarchicalTreeSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedItems = new Set();
        this.data = {};
        this.title = 'Select Items';
        this.allowPresets = true;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        // Load data from attributes or use demo data
        this.loadData();
        this.updateDisplay();
    }

    static get observedAttributes() {
        return ['data', 'title', 'allow-presets', 'selected-items'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'data' && newValue) {
            try {
                this.data = JSON.parse(newValue);
                if (this.shadowRoot) this.updateDisplay();
            } catch (e) {
                console.error('Invalid JSON data:', e);
            }
        } else if (name === 'title') {
            this.title = newValue || 'Select Items';
            if (this.shadowRoot) this.updateTitle();
        } else if (name === 'allow-presets') {
            this.allowPresets = newValue !== 'false';
            if (this.shadowRoot) this.updatePresets();
        } else if (name === 'selected-items' && newValue) {
            try {
                const items = JSON.parse(newValue);
                this.setSelectedItems(items);
            } catch (e) {
                console.error('Invalid selected items JSON:', e);
            }
        }
    }

    loadData() {
        const dataAttr = this.getAttribute('data');
        if (dataAttr) {
            try {
                this.data = JSON.parse(dataAttr);
            } catch (e) {
                console.error('Invalid JSON data:', e);
                this.data = this.getDemoData();
            }
        } else {
            this.data = this.getDemoData();
        }

        this.title = this.getAttribute('title') || 'Select Items';
        this.allowPresets = this.getAttribute('allow-presets') !== 'false';
        
        // Set initial selection from attribute
        const selectedAttr = this.getAttribute('selected-items');
        if (selectedAttr) {
            try {
                const items = JSON.parse(selectedAttr);
                items.forEach(item => this.selectedItems.add(item));
            } catch (e) {
                console.error('Invalid selected items JSON:', e);
            }
        }
    }

    getDemoData() {
        return {
            'Programming Languages': {
                'Frontend': ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
                'Backend': ['Python', 'Java', 'C#', 'Go', 'Rust'],
                'Mobile': ['Swift', 'Kotlin', 'Dart', 'React Native'],
                'Systems': ['C', 'C++', 'Assembly', 'Zig']
            },
            'Frameworks & Tools': {
                'Web Frameworks': ['React', 'Vue', 'Angular', 'Svelte'],
                'Backend Frameworks': ['Express', 'Django', 'Spring', 'Laravel'],
                'Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'],
                'DevOps': ['Docker', 'Kubernetes', 'Jenkins', 'GitHub Actions']
            }
        };
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--surface-secondary);
                    padding: 1rem;
                    font-family: inherit;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                }

                .selection-count {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    background: var(--primary-color);
                    color: white;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    min-width: 2rem;
                    text-align: center;
                }

                .actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-bottom: 1rem;
                    flex-wrap: wrap;
                }

                .actions.hidden {
                    display: none;
                }

                .action-btn {
                    font-size: 0.8rem;
                    padding: 0.4rem 0.8rem;
                    border: 1px solid var(--border-color);
                    background: var(--surface-primary);
                    color: var(--text-primary);
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .action-btn:hover {
                    background: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .tree {
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 0.5rem;
                }

                .tree::-webkit-scrollbar {
                    width: 6px;
                }

                .tree::-webkit-scrollbar-track {
                    background: var(--surface-primary);
                    border-radius: 3px;
                }

                .tree::-webkit-scrollbar-thumb {
                    background: var(--border-color);
                    border-radius: 3px;
                }

                .group {
                    margin-bottom: 1rem;
                }

                .group-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem;
                    background: var(--surface-primary);
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: 600;
                    color: var(--text-primary);
                    transition: background 0.2s ease;
                }

                .group-header:hover {
                    background: rgba(59, 130, 246, 0.1);
                }

                .group-checkbox {
                    width: 16px;
                    height: 16px;
                    accent-color: var(--primary-color);
                }

                .group-title {
                    flex: 1;
                }

                .group-count {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    background: var(--border-color);
                    padding: 0.2rem 0.4rem;
                    border-radius: 3px;
                    min-width: 1.5rem;
                    text-align: center;
                }

                .expand-icon {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    transition: transform 0.2s ease;
                }

                .group.expanded .expand-icon {
                    transform: rotate(90deg);
                }

                .categories {
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }

                .group.expanded .categories {
                    max-height: 1000px;
                }

                .category {
                    margin-bottom: 0.5rem;
                }

                .category-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.4rem;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .category-header:hover {
                    background: rgba(59, 130, 246, 0.05);
                }

                .category-checkbox {
                    width: 14px;
                    height: 14px;
                    accent-color: var(--primary-color);
                }

                .category-title {
                    flex: 1;
                    font-weight: 500;
                    color: var(--text-primary);
                    font-size: 0.9rem;
                }

                .category-count {
                    font-size: 0.75rem;
                    color: var(--text-secondary);
                }

                .items {
                    margin-left: 1.5rem;
                    margin-top: 0.3rem;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease;
                }

                .category.expanded .items {
                    max-height: 500px;
                }

                .item {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.3rem;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .item:hover {
                    background: rgba(59, 130, 246, 0.03);
                }

                .item-checkbox {
                    width: 12px;
                    height: 12px;
                    accent-color: var(--primary-color);
                }

                .item-name {
                    font-size: 0.85rem;
                    color: var(--text-primary);
                }

                .item.selected {
                    background: rgba(59, 130, 246, 0.1);
                    border-left: 3px solid var(--primary-color);
                }

                /* Indeterminate state for partial selections */
                .group-checkbox:indeterminate,
                .category-checkbox:indeterminate {
                    opacity: 0.7;
                }

                /* Responsive design */
                @media (max-width: 600px) {
                    :host {
                        padding: 0.75rem;
                    }

                    .header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.5rem;
                    }

                    .actions {
                        flex-wrap: wrap;
                    }

                    .action-btn {
                        font-size: 0.75rem;
                        padding: 0.3rem 0.6rem;
                    }

                    .tree {
                        max-height: 300px;
                    }
                }
            </style>

            <div class="header">
                <h3 class="title" id="titleElement">${this.title}</h3>
                <div class="selection-count" id="selectionCount">0</div>
            </div>

            <div class="actions" id="actions">
                <button class="action-btn" id="selectAll">Select All</button>
                <button class="action-btn" id="selectNone">Select None</button>
            </div>

            <div class="tree" id="tree">
                <!-- Tree will be generated here -->
            </div>
        `;
    }

    setupEventListeners() {
        // Action buttons
        this.shadowRoot.getElementById('selectAll').addEventListener('click', () => this.selectAll());
        this.shadowRoot.getElementById('selectNone').addEventListener('click', () => this.selectNone());
    }

    generateTree() {
        const tree = this.shadowRoot.getElementById('tree');
        tree.innerHTML = '';

        Object.entries(this.data).forEach(([groupName, categories]) => {
            const groupDiv = document.createElement('div');
            groupDiv.className = 'group expanded';
            groupDiv.dataset.group = groupName;

            const selectedInGroup = this.getItemsInGroup(groupName).filter(item => this.selectedItems.has(item)).length;
            const totalInGroup = this.getItemsInGroup(groupName).length;

            groupDiv.innerHTML = `
                <div class="group-header">
                    <input type="checkbox" class="group-checkbox" ${selectedInGroup === totalInGroup ? 'checked' : ''}>
                    <span class="group-title">${groupName}</span>
                    <span class="group-count">${selectedInGroup}/${totalInGroup}</span>
                    <span class="expand-icon">▶</span>
                </div>
                <div class="categories">
                    ${Object.entries(categories).map(([categoryName, items]) => {
                        const selectedInCategory = items.filter(item => this.selectedItems.has(item)).length;
                        return `
                            <div class="category expanded" data-category="${categoryName}">
                                <div class="category-header">
                                    <input type="checkbox" class="category-checkbox" ${selectedInCategory === items.length ? 'checked' : ''}>
                                    <span class="category-title">${categoryName}</span>
                                    <span class="category-count">${selectedInCategory}/${items.length}</span>
                                </div>
                                <div class="items">
                                    ${items.map(item => `
                                        <div class="item ${this.selectedItems.has(item) ? 'selected' : ''}" data-item="${item}">
                                            <input type="checkbox" class="item-checkbox" ${this.selectedItems.has(item) ? 'checked' : ''}>
                                            <span class="item-name">${item}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            // Set indeterminate states
            const groupCheckbox = groupDiv.querySelector('.group-checkbox');
            if (selectedInGroup > 0 && selectedInGroup < totalInGroup) {
                groupCheckbox.indeterminate = true;
            }

            Object.entries(categories).forEach(([categoryName, items]) => {
                const selectedInCategory = items.filter(item => this.selectedItems.has(item)).length;
                const categoryCheckbox = groupDiv.querySelector(`[data-category="${categoryName}"] .category-checkbox`);
                if (selectedInCategory > 0 && selectedInCategory < items.length) {
                    categoryCheckbox.indeterminate = true;
                }
            });

            tree.appendChild(groupDiv);
        });

        this.attachTreeEventListeners();
    }

    attachTreeEventListeners() {
        // Group expand/collapse
        this.shadowRoot.querySelectorAll('.group-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                const group = header.closest('.group');
                group.classList.toggle('expanded');
            });
        });

        // Category expand/collapse
        this.shadowRoot.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                const category = header.closest('.category');
                category.classList.toggle('expanded');
            });
        });

        // Group checkboxes
        this.shadowRoot.querySelectorAll('.group-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const groupName = e.target.closest('.group').dataset.group;
                this.toggleGroup(groupName, e.target.checked);
            });
        });

        // Category checkboxes
        this.shadowRoot.querySelectorAll('.category-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const categoryName = e.target.closest('.category').dataset.category;
                this.toggleCategory(categoryName, e.target.checked);
            });
        });

        // Item checkboxes and rows
        this.shadowRoot.querySelectorAll('.item').forEach(itemRow => {
            itemRow.addEventListener('click', (e) => {
                const itemName = itemRow.dataset.item;
                this.toggleItem(itemName);
            });
        });

        this.shadowRoot.querySelectorAll('.item-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemName = e.target.closest('.item').dataset.item;
                this.toggleItem(itemName);
            });
        });
    }

    toggleGroup(groupName, selected) {
        const items = this.getItemsInGroup(groupName);
        if (selected) {
            items.forEach(item => this.selectedItems.add(item));
        } else {
            items.forEach(item => this.selectedItems.delete(item));
        }
        this.updateDisplay();
        this.emitChangeEvent();
    }

    toggleCategory(categoryName, selected) {
        const items = this.getItemsInCategory(categoryName);
        if (selected) {
            items.forEach(item => this.selectedItems.add(item));
        } else {
            items.forEach(item => this.selectedItems.delete(item));
        }
        this.updateDisplay();
        this.emitChangeEvent();
    }

    toggleItem(itemName) {
        if (this.selectedItems.has(itemName)) {
            this.selectedItems.delete(itemName);
        } else {
            this.selectedItems.add(itemName);
        }
        this.updateDisplay();
        this.emitChangeEvent();
    }

    getItemsInGroup(groupName) {
        const items = [];
        if (this.data[groupName]) {
            Object.values(this.data[groupName]).forEach(categoryItems => {
                items.push(...categoryItems);
            });
        }
        return items;
    }

    getItemsInCategory(categoryName) {
        for (const group of Object.values(this.data)) {
            if (group[categoryName]) {
                return group[categoryName];
            }
        }
        return [];
    }

    selectAll() {
        Object.values(this.data).forEach(group => {
            Object.values(group).forEach(items => {
                items.forEach(item => this.selectedItems.add(item));
            });
        });
        this.updateDisplay();
        this.emitChangeEvent();
    }

    selectNone() {
        this.selectedItems.clear();
        this.updateDisplay();
        this.emitChangeEvent();
    }

    updateTitle() {
        const titleElement = this.shadowRoot.getElementById('titleElement');
        if (titleElement) {
            titleElement.textContent = this.title;
        }
    }

    updatePresets() {
        const actions = this.shadowRoot.getElementById('actions');
        if (actions) {
            actions.classList.toggle('hidden', !this.allowPresets);
        }
    }

    updateDisplay() {
        this.generateTree();
        
        // Update selection count
        const count = this.shadowRoot.getElementById('selectionCount');
        count.textContent = this.selectedItems.size;

        // Update presets visibility
        this.updatePresets();
    }

    emitChangeEvent() {
        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedItems: Array.from(this.selectedItems),
                count: this.selectedItems.size
            }
        }));
    }

    // Public methods
    getSelectedItems() {
        return Array.from(this.selectedItems);
    }

    setSelectedItems(items) {
        this.selectedItems = new Set(items);
        this.updateDisplay();
        this.emitChangeEvent();
    }

    setData(data) {
        this.data = data;
        this.updateDisplay();
    }

    reset() {
        this.selectedItems.clear();
        this.updateDisplay();
        this.emitChangeEvent();
    }
}

customElements.define('hierarchical-tree-selector', HierarchicalTreeSelector);