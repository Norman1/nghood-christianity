import { loadTemplate } from '../utils/template-loader.js';

class TestMinimal extends HTMLElement {
    async connectedCallback() {
        // Clear right sidebar
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        const templateContent = await loadTemplate('./templates/test-minimal.html');
        this.innerHTML = templateContent;
    }
}

customElements.define('test-minimal', TestMinimal);