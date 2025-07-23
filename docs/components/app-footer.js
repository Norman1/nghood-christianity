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
          margin-left: 0.5rem;
        }

        a:hover {
          text-decoration: underline;
        }
      </style>

      <div>
        © ${currentYear} – <a href="https://github.com/your-github-name" target="_blank">My GitHub</a> |
        <a href="#/about">About</a> |
        <a href="#/privacy">Privacy & Terms</a>
      </div>
    `;
    }
}

customElements.define('app-footer', AppFooter);
