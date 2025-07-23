class CollapsibleSection extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isExpanded = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        
        // Set initial state from attributes
        this.isExpanded = this.hasAttribute('expanded') && this.getAttribute('expanded') !== 'false';
        this.updateExpandedState();
    }

    static get observedAttributes() {
        return ['title', 'summary', 'expanded', 'variant'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot) {
            if (name === 'title') {
                this.updateTitle();
            } else if (name === 'summary') {
                this.updateSummary();
            } else if (name === 'expanded') {
                // Only update internal state, don't call updateExpandedState to avoid loop
                this.isExpanded = newValue !== 'false' && newValue !== null;
            } else if (name === 'variant') {
                this.updateVariant();
            }
        }
    }

    render() {
        const title = this.getAttribute('title') || 'Section';
        const summary = this.getAttribute('summary') || '';
        const variant = this.getAttribute('variant') || 'default';

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    background: var(--surface-secondary);
                    margin: 1rem 0;
                    overflow: hidden;
                    transition: all 0.3s ease;
                }

                :host([variant="card"]) {
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                :host([variant="flat"]) {
                    border: none;
                    background: transparent;
                    border-bottom: 1px solid var(--border-color);
                    border-radius: 0;
                }

                :host([variant="accent"]) {
                    border-left: 4px solid var(--primary-color);
                }

                .header {
                    display: flex;
                    align-items: center;
                    padding: 1rem;
                    cursor: pointer;
                    user-select: none;
                    transition: background-color 0.2s ease;
                    gap: 0.75rem;
                }

                .header:hover {
                    background: rgba(59, 130, 246, 0.05);
                }

                :host([variant="flat"]) .header {
                    padding: 0.75rem 0;
                }

                .expand-icon {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    transition: transform 0.3s ease;
                    flex-shrink: 0;
                }

                :host([expanded]) .expand-icon {
                    transform: rotate(90deg);
                }

                .header-content {
                    flex: 1;
                    min-width: 0;
                }

                .title {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin: 0;
                    line-height: 1.4;
                }

                .summary {
                    font-size: 0.9rem;
                    color: var(--text-secondary);
                    margin: 0.25rem 0 0 0;
                    line-height: 1.3;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }

                :host([expanded]) .summary {
                    opacity: 0.5;
                }

                .summary:empty {
                    display: none;
                }

                .content {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out, padding 0.3s ease-out;
                    padding: 0 1rem;
                }

                :host([variant="flat"]) .content {
                    padding: 0;
                    padding-top: 0;
                }

                :host([expanded]) .content {
                    max-height: 2000px;
                    padding: 0 1rem 1rem 1rem;
                }

                :host([variant="flat"][expanded]) .content {
                    padding: 0.75rem 0 1rem 0;
                }

                .content-wrapper {
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 0.2s ease, transform 0.2s ease;
                }

                :host([expanded]) .content-wrapper {
                    opacity: 1;
                    transform: translateY(0);
                    transition-delay: 0.1s;
                }

                /* Status indicator */
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--border-color);
                    flex-shrink: 0;
                    transition: background-color 0.2s ease;
                }

                :host([status="active"]) .status-indicator {
                    background: var(--success-color);
                }

                :host([status="warning"]) .status-indicator {
                    background: var(--warning-color, #f59e0b);
                }

                :host([status="error"]) .status-indicator {
                    background: var(--error-color);
                }

                /* Count badge */
                .count-badge {
                    background: var(--primary-color);
                    color: white;
                    padding: 0.2rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    min-width: 1.5rem;
                    text-align: center;
                    flex-shrink: 0;
                }

                .count-badge:empty {
                    display: none;
                }

                /* Responsive adjustments */
                @media (max-width: 600px) {
                    .header {
                        padding: 0.75rem;
                    }

                    .title {
                        font-size: 1rem;
                    }

                    .summary {
                        font-size: 0.85rem;
                    }

                    :host([expanded]) .content {
                        padding: 0 0.75rem 0.75rem 0.75rem;
                    }
                }
            </style>

            <div class="header" id="header">
                <span class="expand-icon">▶</span>
                <div class="header-content">
                    <h3 class="title" id="titleElement">${title}</h3>
                    <p class="summary" id="summaryElement">${summary}</p>
                </div>
                <div class="status-indicator" id="statusIndicator"></div>
                <div class="count-badge" id="countBadge"></div>
            </div>

            <div class="content" id="content">
                <div class="content-wrapper">
                    <slot></slot>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const header = this.shadowRoot.getElementById('header');
        header.addEventListener('click', () => {
            this.toggle();
        });

        // Prevent clicks inside content from bubbling to header
        const content = this.shadowRoot.getElementById('content');
        content.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggle() {
        this.isExpanded = !this.isExpanded;
        this.updateExpandedState();
        
        // Emit event for parent components
        this.dispatchEvent(new CustomEvent('toggle', {
            detail: {
                expanded: this.isExpanded,
                id: this.getAttribute('id') || '',
                title: this.getAttribute('title') || ''
            }
        }));
    }

    expand() {
        if (!this.isExpanded) {
            this.toggle();
        }
    }

    collapse() {
        if (this.isExpanded) {
            this.toggle();
        }
    }

    updateExpandedState() {
        if (this.isExpanded) {
            this.setAttribute('expanded', '');
        } else {
            this.removeAttribute('expanded');
        }
    }

    updateTitle() {
        const titleElement = this.shadowRoot.getElementById('titleElement');
        if (titleElement) {
            titleElement.textContent = this.getAttribute('title') || 'Section';
        }
    }

    updateSummary() {
        const summaryElement = this.shadowRoot.getElementById('summaryElement');
        if (summaryElement) {
            summaryElement.textContent = this.getAttribute('summary') || '';
        }
    }

    updateVariant() {
        // Variant styling is handled via CSS attribute selectors
        // This method exists for potential future variant-specific logic
    }

    // Public methods
    setCount(count) {
        const badge = this.shadowRoot.getElementById('countBadge');
        badge.textContent = count > 0 ? count.toString() : '';
    }

    setStatus(status) {
        // status can be: 'active', 'warning', 'error', or null
        if (status) {
            this.setAttribute('status', status);
        } else {
            this.removeAttribute('status');
        }
    }

    getExpanded() {
        return this.isExpanded;
    }
}

customElements.define('collapsible-section', CollapsibleSection);