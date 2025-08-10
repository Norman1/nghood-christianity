class BibleAtlasPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                h1 {
                    color: #f0f6fc;
                    font-size: 2.5rem;
                    margin-bottom: 1rem;
                    font-weight: 600;
                }

                .content {
                    background: #1c2128;
                    border-radius: 8px;
                    padding: 2rem;
                    margin-top: 2rem;
                    border: 1px solid #30363d;
                }

                .todo {
                    color: #8b949e;
                    font-style: italic;
                    font-size: 1.1rem;
                }
            </style>

            <h1>Bible Atlas</h1>
            <div class="content">
                <p class="todo">TODO</p>
            </div>
        `;
    }
}

customElements.define('bible-atlas-page', BibleAtlasPage);