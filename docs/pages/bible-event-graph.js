const MANIFEST_PATH = './bible-data/bible-event-graph.demo.json';

class BibleEventGraphPage extends HTMLElement {
    constructor() {
        super();

        this.state = {
            expanded: new Set(),
        };

        this.events = {};
        this.childrenByParent = new Map();
        this.parentById = new Map();
        this.manifestLoaded = false;
    }

    connectedCallback() {
        this.layout = document.querySelector('main-layout');
        this.layout?.removeAttribute('with-right');
        this.layout?.querySelectorAll('[slot="right"]').forEach((el) => el.remove());
        this.render();
    }

    render() {
        this.innerHTML = `
            <style>
                .event-graph {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }

                .page-header {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }

                .eyebrow {
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    letter-spacing: 0.08em;
                    color: #7d8590;
                }

                .helper-text {
                    font-size: 0.9rem;
                    color: #8b949e;
                    margin: 0;
                }

                .table-wrapper {
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    background: rgba(13, 17, 23, 0.85);
                    padding: 1rem;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                thead th {
                    text-align: left;
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #8b949e;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding-bottom: 0.35rem;
                }

                tbody tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
                }

                tbody tr:last-child {
                    border-bottom: none;
                }

                td {
                    padding: 0.5rem 0.25rem;
                    vertical-align: top;
                }

                .node-cell {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                }

                .node-label {
                    font-weight: 500;
                }

                .depth-spacer {
                    display: inline-block;
                    width: var(--indent, 0);
                }

                .toggle-button {
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                    color: inherit;
                    border-radius: 4px;
                    width: 1.5rem;
                    height: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    font-size: 0.85rem;
                    transition: background 0.2s ease, border 0.2s ease;
                }

                .toggle-button:hover {
                    background: rgba(88, 166, 255, 0.15);
                    border-color: rgba(88, 166, 255, 0.5);
                }

                .toggle-placeholder {
                    width: 1.5rem;
                    height: 1.5rem;
                }

                .controls {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .controls button {
                    background: rgba(88, 166, 255, 0.15);
                    border: 1px solid rgba(88, 166, 255, 0.4);
                    color: #58a6ff;
                    border-radius: 6px;
                    padding: 0.4rem 0.8rem;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .controls button:hover {
                    background: rgba(88, 166, 255, 0.25);
                }
            </style>
            <div class="content-area event-graph">
                <header class="page-header">
                    <p class="eyebrow">Event-first Bible harmony</p>
                    <h1>Bible Storyline Explorer</h1>
                </header>

                <div id="graph-status" class="callout callout-warning">
                    Loading manifest…
                </div>

                <section class="table-wrapper">
                    <div class="controls">
                        <button type="button" id="expand-all">Expand all</button>
                        <button type="button" id="collapse-all">Collapse all</button>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Event Flow</th>
                            </tr>
                        </thead>
                        <tbody id="graph-table-body">
                            <tr><td class="helper-text">Parsing manifest…</td></tr>
                        </tbody>
                    </table>
                </section>

            </div>
        `;

        this.cacheElements();
        this.bindStaticHandlers();
        this.loadManifest();
    }

    cacheElements() {
        this.statusCallout = this.querySelector('#graph-status');
        this.tableBody = this.querySelector('#graph-table-body');
        this.expandAllButton = this.querySelector('#expand-all');
        this.collapseAllButton = this.querySelector('#collapse-all');
    }

    bindStaticHandlers() {
        this.tableBody?.addEventListener('click', (event) => {
            const button = event.target.closest('.toggle-button');
            if (!button) return;
            const eventId = button.dataset.eventId;
            if (!eventId) return;

            if (this.state.expanded.has(eventId)) {
                this.state.expanded.delete(eventId);
            } else {
                this.state.expanded.add(eventId);
            }

            this.renderTable();
        });

        this.expandAllButton?.addEventListener('click', () => {
            Object.keys(this.events).forEach((id) => {
                if ((this.childrenByParent.get(id) || []).length) {
                    this.state.expanded.add(id);
                }
            });
            this.renderTable();
        });

        this.collapseAllButton?.addEventListener('click', () => {
            this.state.expanded.clear();
            this.renderTable();
        });
    }

    setStatus(type, message) {
        if (!this.statusCallout) return;
        this.statusCallout.classList.remove('callout-warning', 'callout-success', 'callout-error');
        this.statusCallout.classList.add(type);
        this.statusCallout.textContent = message;
    }

    async loadManifest() {
        this.setStatus('callout-warning', 'Loading manifest…');
        try {
            const response = await fetch(MANIFEST_PATH, { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const manifest = await response.json();
            this.applyManifest(manifest);
            this.setStatus('callout-success', 'Outline ready.');
            this.renderTable();
        } catch (error) {
            console.error('Failed to load Bible Storyline Explorer manifest:', error);
            this.setStatus('callout-error', `Failed to load manifest: ${error.message}`);
            if (this.tableBody) {
                this.tableBody.innerHTML = '<tr><td colspan="2" class="helper-text">Unable to render outline.</td></tr>';
            }
        }
    }

    applyManifest(manifest) {
        this.events = manifest?.events || {};
        this.childrenByParent.clear();
        this.parentById.clear();

        Object.values(this.events).forEach((event) => {
            const parentId = event.parent_id ?? null;
            if (!this.childrenByParent.has(parentId)) {
                this.childrenByParent.set(parentId, []);
            }
            this.childrenByParent.get(parentId).push(event.id);
            this.parentById.set(event.id, parentId);
        });

        this.manifestLoaded = true;
    }

    getChildren(parentId) {
        const children = this.childrenByParent.get(parentId ?? null) || [];
        return [...children].sort((a, b) => {
            const diff = this.getOrderNumber(a) - this.getOrderNumber(b);
            if (diff !== 0) return diff;
            return (this.events[a]?.title || '').localeCompare(this.events[b]?.title || '');
        });
    }

    getOrderNumber(eventId) {
        const raw = this.events[eventId]?.attributes?.order?.[0];
        return raw ? parseInt(raw, 10) : Number.MAX_SAFE_INTEGER;
    }

    buildVisibleRows(parentId = null, depth = 0, rows = []) {
        const children = this.getChildren(parentId);
        children.forEach((childId) => {
            rows.push({ id: childId, depth });
            if (this.state.expanded.has(childId)) {
                this.buildVisibleRows(childId, depth + 1, rows);
            }
        });
        return rows;
    }

    renderTable() {
        if (!this.tableBody) return;

        if (!this.manifestLoaded) {
            this.tableBody.innerHTML = '<tr><td class="helper-text">Loading outline…</td></tr>';
            return;
        }

        const rows = this.buildVisibleRows();
        if (!rows.length) {
            this.tableBody.innerHTML = '<tr><td class="helper-text">No events defined. Add entries to the manifest.</td></tr>';
            return;
        }

        const fragment = document.createDocumentFragment();

        rows.forEach(({ id, depth }) => {
            const event = this.events[id];
            const hasChildren = (this.childrenByParent.get(id) || []).length > 0;
            const tr = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.className = 'node-cell';
            nameCell.innerHTML = `
                <span class="depth-spacer" style="--indent: ${depth * 1.25}rem;"></span>
                ${hasChildren ? `<button class="toggle-button" data-event-id="${id}" aria-label="Toggle ${event.title}">
                    ${this.state.expanded.has(id) ? '−' : '+'}
                </button>` : '<span class="toggle-placeholder"></span>'}
                <span class="node-label">${event.title}</span>
            `;

            tr.appendChild(nameCell);

            fragment.appendChild(tr);
        });

        this.tableBody.innerHTML = '';
        this.tableBody.appendChild(fragment);
    }
}

customElements.define('bible-event-graph-page', BibleEventGraphPage);
