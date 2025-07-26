class AppFooter extends HTMLElement {
    connectedCallback() {
        const currentYear = new Date().getFullYear();

        this.innerHTML = `
      <style>
        :host {
          display: block;
          background: #eeeeee;
          padding: 1rem 2rem;
          font-size: 0.85rem;
          color: #444;
          text-align: center;
          border-top: 1px solid #ddd;
        }

        a {
          color: #0055aa;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }
      </style>

      <div>
        <a href="https://github.com/Norman1/nghood-christianity" target="_blank">GitHub</a> |
        <a href="#/about">About</a>
      </div>
    `;
    }
}

customElements.define('app-footer', AppFooter);
