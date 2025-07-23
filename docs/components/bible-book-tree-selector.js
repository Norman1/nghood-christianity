class BibleBookTreeSelector extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.selectedBooks = new Set();
        this.bibleStructure = {
            'Old Testament': {
                'Law (Torah)': ['Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy'],
                'Historical Books': ['Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther'],
                'Wisdom Literature': ['Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon'],
                'Major Prophets': ['Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel'],
                'Minor Prophets': ['Hosea', 'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi']
            },
            'New Testament': {
                'Gospels': ['Matthew', 'Mark', 'Luke', 'John'],
                'History': ['Acts'],
                'Pauline Epistles': ['Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon'],
                'General Epistles': ['Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude'],
                'Apocalyptic': ['Revelation']
            }
        };
        
        // Initialize with some popular defaults
        this.initializeDefaults();
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.updateDisplay();
    }

    initializeDefaults() {
        // Pre-select some popular categories for better UX
        const defaults = ['Matthew', 'Mark', 'Luke', 'John', 'Romans', 'Psalms', 'Genesis', 'Exodus'];
        defaults.forEach(book => this.selectedBooks.add(book));
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

                .testament {
                    margin-bottom: 1rem;
                }

                .testament-header {
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

                .testament-header:hover {
                    background: rgba(59, 130, 246, 0.1);
                }

                .testament-checkbox {
                    width: 16px;
                    height: 16px;
                    accent-color: var(--primary-color);
                }

                .testament-title {
                    flex: 1;
                }

                .testament-count {
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

                .testament.expanded .expand-icon {
                    transform: rotate(90deg);
                }

                .categories {
                    margin-left: 1.5rem;
                    margin-top: 0.5rem;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease;
                }

                .testament.expanded .categories {
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

                .books {
                    margin-left: 1.5rem;
                    margin-top: 0.3rem;
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease;
                }

                .category.expanded .books {
                    max-height: 500px;
                }

                .book {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.3rem;
                    border-radius: 3px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .book:hover {
                    background: rgba(59, 130, 246, 0.03);
                }

                .book-checkbox {
                    width: 12px;
                    height: 12px;
                    accent-color: var(--primary-color);
                }

                .book-name {
                    font-size: 0.85rem;
                    color: var(--text-primary);
                }

                .book.selected {
                    background: rgba(59, 130, 246, 0.1);
                    border-left: 3px solid var(--primary-color);
                }

                /* Indeterminate state for partial selections */
                .testament-checkbox:indeterminate,
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
                <h3 class="title">Select Bible Books</h3>
                <div class="selection-count" id="selectionCount">0</div>
            </div>

            <div class="actions">
                <button class="action-btn" id="selectAll">Select All</button>
                <button class="action-btn" id="selectNone">Select None</button>
                <button class="action-btn" id="selectPopular">Popular Books</button>
                <button class="action-btn" id="selectNT">New Testament</button>
                <button class="action-btn" id="selectOT">Old Testament</button>
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
        this.shadowRoot.getElementById('selectPopular').addEventListener('click', () => this.selectPopular());
        this.shadowRoot.getElementById('selectNT').addEventListener('click', () => this.selectTestament('New Testament'));
        this.shadowRoot.getElementById('selectOT').addEventListener('click', () => this.selectTestament('Old Testament'));

        // Tree interactions will be set up in updateDisplay()
    }

    generateTree() {
        const tree = this.shadowRoot.getElementById('tree');
        tree.innerHTML = '';

        Object.entries(this.bibleStructure).forEach(([testamentName, categories]) => {
            const testamentDiv = document.createElement('div');
            testamentDiv.className = 'testament expanded'; // Start expanded
            testamentDiv.dataset.testament = testamentName;

            const selectedInTestament = this.getBooksInTestament(testamentName).filter(book => this.selectedBooks.has(book)).length;
            const totalInTestament = this.getBooksInTestament(testamentName).length;

            testamentDiv.innerHTML = `
                <div class="testament-header">
                    <input type="checkbox" class="testament-checkbox" ${selectedInTestament === totalInTestament ? 'checked' : ''}>
                    <span class="testament-title">${testamentName}</span>
                    <span class="testament-count">${selectedInTestament}/${totalInTestament}</span>
                    <span class="expand-icon">▶</span>
                </div>
                <div class="categories">
                    ${Object.entries(categories).map(([categoryName, books]) => {
                        const selectedInCategory = books.filter(book => this.selectedBooks.has(book)).length;
                        return `
                            <div class="category expanded" data-category="${categoryName}">
                                <div class="category-header">
                                    <input type="checkbox" class="category-checkbox" ${selectedInCategory === books.length ? 'checked' : ''}>
                                    <span class="category-title">${categoryName}</span>
                                    <span class="category-count">${selectedInCategory}/${books.length}</span>
                                </div>
                                <div class="books">
                                    ${books.map(book => `
                                        <div class="book ${this.selectedBooks.has(book) ? 'selected' : ''}" data-book="${book}">
                                            <input type="checkbox" class="book-checkbox" ${this.selectedBooks.has(book) ? 'checked' : ''}>
                                            <span class="book-name">${book}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            // Set indeterminate states
            const testamentCheckbox = testamentDiv.querySelector('.testament-checkbox');
            if (selectedInTestament > 0 && selectedInTestament < totalInTestament) {
                testamentCheckbox.indeterminate = true;
            }

            Object.entries(categories).forEach(([categoryName, books]) => {
                const selectedInCategory = books.filter(book => this.selectedBooks.has(book)).length;
                const categoryCheckbox = testamentDiv.querySelector(`[data-category="${categoryName}"] .category-checkbox`);
                if (selectedInCategory > 0 && selectedInCategory < books.length) {
                    categoryCheckbox.indeterminate = true;
                }
            });

            tree.appendChild(testamentDiv);
        });

        this.attachTreeEventListeners();
    }

    attachTreeEventListeners() {
        // Testament expand/collapse
        this.shadowRoot.querySelectorAll('.testament-header').forEach(header => {
            header.addEventListener('click', (e) => {
                if (e.target.type === 'checkbox') return;
                const testament = header.closest('.testament');
                testament.classList.toggle('expanded');
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

        // Testament checkboxes
        this.shadowRoot.querySelectorAll('.testament-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const testamentName = e.target.closest('.testament').dataset.testament;
                this.toggleTestament(testamentName, e.target.checked);
            });
        });

        // Category checkboxes
        this.shadowRoot.querySelectorAll('.category-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const categoryName = e.target.closest('.category').dataset.category;
                this.toggleCategory(categoryName, e.target.checked);
            });
        });

        // Book checkboxes and rows
        this.shadowRoot.querySelectorAll('.book').forEach(bookRow => {
            bookRow.addEventListener('click', (e) => {
                const bookName = bookRow.dataset.book;
                this.toggleBook(bookName);
            });
        });

        this.shadowRoot.querySelectorAll('.book-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const bookName = e.target.closest('.book').dataset.book;
                this.toggleBook(bookName);
            });
        });
    }

    toggleTestament(testamentName, selected) {
        const books = this.getBooksInTestament(testamentName);
        if (selected) {
            books.forEach(book => this.selectedBooks.add(book));
        } else {
            books.forEach(book => this.selectedBooks.delete(book));
        }
        this.updateDisplay();
        this.emitChangeEvent();
    }

    toggleCategory(categoryName, selected) {
        const books = this.getBooksInCategory(categoryName);
        if (selected) {
            books.forEach(book => this.selectedBooks.add(book));
        } else {
            books.forEach(book => this.selectedBooks.delete(book));
        }
        this.updateDisplay();
        this.emitChangeEvent();
    }

    toggleBook(bookName) {
        if (this.selectedBooks.has(bookName)) {
            this.selectedBooks.delete(bookName);
        } else {
            this.selectedBooks.add(bookName);
        }
        this.updateDisplay();
        this.emitChangeEvent();
    }

    getBooksInTestament(testamentName) {
        const books = [];
        Object.values(this.bibleStructure[testamentName]).forEach(categoryBooks => {
            books.push(...categoryBooks);
        });
        return books;
    }

    getBooksInCategory(categoryName) {
        for (const testament of Object.values(this.bibleStructure)) {
            if (testament[categoryName]) {
                return testament[categoryName];
            }
        }
        return [];
    }

    selectAll() {
        Object.values(this.bibleStructure).forEach(testament => {
            Object.values(testament).forEach(books => {
                books.forEach(book => this.selectedBooks.add(book));
            });
        });
        this.updateDisplay();
        this.emitChangeEvent();
    }

    selectNone() {
        this.selectedBooks.clear();
        this.updateDisplay();
        this.emitChangeEvent();
    }

    selectPopular() {
        this.selectNone();
        const popular = ['Genesis', 'Exodus', 'Psalms', 'Proverbs', 'Isaiah', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', 'Ephesians', 'Philippians', 'Revelation'];
        popular.forEach(book => this.selectedBooks.add(book));
        this.updateDisplay();
        this.emitChangeEvent();
    }

    selectTestament(testamentName) {
        const books = this.getBooksInTestament(testamentName);
        books.forEach(book => this.selectedBooks.add(book));
        this.updateDisplay();
        this.emitChangeEvent();
    }

    updateDisplay() {
        this.generateTree();
        
        // Update selection count
        const count = this.shadowRoot.getElementById('selectionCount');
        count.textContent = this.selectedBooks.size;
    }

    emitChangeEvent() {
        this.dispatchEvent(new CustomEvent('selection-changed', {
            detail: {
                selectedBooks: Array.from(this.selectedBooks),
                count: this.selectedBooks.size
            }
        }));
    }

    // Public methods
    getSelectedBooks() {
        return Array.from(this.selectedBooks);
    }

    setSelectedBooks(books) {
        this.selectedBooks = new Set(books);
        this.updateDisplay();
        this.emitChangeEvent();
    }

    reset() {
        this.initializeDefaults();
        this.updateDisplay();
        this.emitChangeEvent();
    }
}

customElements.define('bible-book-tree-selector', BibleBookTreeSelector);