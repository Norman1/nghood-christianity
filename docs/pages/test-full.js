import { loadTemplate } from '../utils/template-loader.js';

class TestFull extends HTMLElement {
    async connectedCallback() {
        // Clear right sidebar
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        const templateContent = await loadTemplate('./templates/test-full.html');
        this.innerHTML = templateContent;
    }
}

customElements.define('test-full', TestFull);