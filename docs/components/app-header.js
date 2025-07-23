import '../components/custom-auth.js';

class AppHeader extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
          width: 100%;
          font-family: system-ui, sans-serif;
        }

        .header {
          position: relative;
          height: 60px;              /* Much smaller, like IntelliJ docs */
          overflow: hidden;
          background: #21262d;       /* Solid background instead of image */
          border-bottom: 1px solid #30363d;
          display: flex;
          align-items: center;
          padding: 0 1.5rem;
        }

        .site-title {
          color: #f0f6fc;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
          flex-grow: 1;
        }

        .auth-wrapper {
          margin-left: auto;
        }
      </style>

      <div class="header">
        <h1 class="site-title">Learning Hub</h1>
        <div class="auth-wrapper">
          <custom-auth></custom-auth>
        </div>
      </div>
    `;
    }
}

customElements.define('app-header', AppHeader);
