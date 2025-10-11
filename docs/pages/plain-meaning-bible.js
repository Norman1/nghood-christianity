import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

const OSIS_NAMESPACE = 'http://www.bibletechnologies.net/2003/OSIS/namespace';

const INLINE_ELEMENTS = new Set([
    'a', 'abbr', 'actor', 'catchWord', 'foreign', 'mentioned', 'name', 'seg', 'w', 'hi',
    'reference', 'speaker', 'role', 'roleDesc', 'transChange', 'workPrefix', 'contributor',
    'creator', 'identifier', 'language', 'coverage', 'rights', 'source', 'subject', 'publisher',
    'format', 'relation', 'type', 'description', 'date', 'scope', 'refSystem', 'label',
    'caption', 'inscription', 'index', 'divineName'
]);

function createElementLabel(name) {
    return `This content showcases the <${name}> element.`;
}

class PlainMeaningBiblePage extends HTMLElement {
    async connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        this.innerHTML = '';
        this.appendChild(createLoadingElement());

        try {
            const template = await loadTemplate('./templates/plain-meaning-bible.html');
            this.innerHTML = template;
            await this.renderOsisShowcase();
        } catch (error) {
            console.error('Error loading Plain Meaning Bible template:', error);
            this.innerHTML = `
                <div class="callout callout-error">
                    <strong>Load Error:</strong>
                    <p>We could not load the Plain Meaning Bible workspace. Check the console for details.</p>
                </div>
            `;
        }
    }
    async renderOsisShowcase() {
        const container = this.querySelector('#osis-demo');
        if (!container) {
            return;
        }

        container.innerHTML = '';
        container.appendChild(createLoadingElement());

        try {
            const response = await fetch('./data/plain-meaning-osis-demo.xml');
            if (!response.ok) {
                throw new Error(`Failed to load OSIS demo (HTTP ${response.status})`);
            }

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error(parseError.textContent || 'Unable to parse OSIS XML.');
            }

            container.innerHTML = '';
            this.renderRoot(xmlDoc.documentElement, container);
        } catch (error) {
            console.error('Plain Meaning OSIS render error:', error);
            container.innerHTML = `
                <div class="callout callout-error">
                    <strong>OSIS Demo Error:</strong>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    renderRoot(root, container) {
        if (!root) {
            return;
        }

        if (root.localName === 'osisCorpus') {
            const corpusWrapper = document.createElement('section');
            corpusWrapper.classList.add('osis-block', 'osis-osisCorpus');
            applyOsisAttributes(root, corpusWrapper);
            corpusWrapper.appendChild(this.createLabelParagraph('osisCorpus'));

            Array.from(root.children)
                .filter((child) => child.namespaceURI === OSIS_NAMESPACE && child.localName === 'osis')
                .forEach((osisElement, index) => {
                    const section = document.createElement('section');
                    section.classList.add('osis-block', 'osis-osis');
                    applyOsisAttributes(osisElement, section);
                    section.appendChild(this.createLabelParagraph('osis'));

                    const title = document.createElement('h3');
                    title.textContent = `OSIS Entry ${index + 1}`;
                    section.appendChild(title);

                    this.renderOsis(cloneElement(osisElement), section);
                    corpusWrapper.appendChild(section);
                });

            container.appendChild(corpusWrapper);
        } else if (root.localName === 'osis') {
            const section = document.createElement('section');
            section.classList.add('osis-block', 'osis-osis');
            applyOsisAttributes(root, section);
            section.appendChild(this.createLabelParagraph('osis'));
            this.renderOsis(cloneElement(root), section);
            container.appendChild(section);
        } else {
            container.appendChild(this.renderGenericBlock(root, [{ element: container }]));
        }
    }

    renderOsis(osisElement, container) {
        Array.from(osisElement.children)
            .filter((child) => child.namespaceURI === OSIS_NAMESPACE)
            .forEach((child) => {
                if (child.localName === 'osisText') {
                    const textWrapper = document.createElement('section');
                    textWrapper.classList.add('osis-block', 'osis-osisText');
                    applyOsisAttributes(child, textWrapper);
                    textWrapper.appendChild(this.createLabelParagraph('osisText'));
                    const contextStack = [{ type: 'root', id: child.getAttribute('osisIDWork') || 'osisText', element: textWrapper }];
                    this.processChildNodes(child.childNodes, contextStack);
                    container.appendChild(textWrapper);
                } else {
                    container.appendChild(this.renderGenericBlock(child, [{ element: container }]));
                }
            });
    }

    processChildNodes(nodeList, contextStack) {
        Array.from(nodeList).forEach((node) => this.renderOsisNode(node, contextStack));
    }

    renderOsisNode(node, contextStack) {
        if (node.nodeType === Node.TEXT_NODE) {
            this.appendTextNode(node.textContent || '', contextStack);
            return;
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        const name = node.localName;

        if (name === 'chapter') {
            this.renderChapterMilestone(node, contextStack);
            return;
        }

        if (name === 'verse') {
            this.renderVerseMilestone(node, contextStack);
            return;
        }

        if (name === 'milestone' || name === 'milestoneStart' || name === 'milestoneEnd') {
            this.renderMilestoneElement(node, contextStack);
            return;
        }

        if (name === 'lb') {
            this.renderLineBreak(node, contextStack);
            return;
        }

        if (INLINE_ELEMENTS.has(name)) {
            this.renderGenericInline(node, contextStack);
            return;
        }

        if (name === 'speaker') {
            this.renderSpeaker(node, contextStack);
            return;
        }

        this.renderGenericBlock(node, contextStack);
    }

    renderChapterMilestone(node, contextStack) {
        if (node.hasAttribute('sID')) {
            const id = node.getAttribute('sID');
            const wrapper = document.createElement('section');
            wrapper.classList.add('osis-block', 'osis-chapter');
            wrapper.dataset.osisId = id;
            wrapper.appendChild(this.createLabelParagraph(`chapter start (${id})`));

            const body = document.createElement('div');
            body.className = 'osis-chapter-body';
            body.classList.add('osis-block-body');
            wrapper.appendChild(body);

            applyOsisAttributes(node, wrapper);
            this.appendToCurrent(wrapper, contextStack);
            contextStack.push({ type: 'chapter', id, element: body });
        } else if (node.hasAttribute('eID')) {
            this.closeContext(contextStack, 'chapter', node.getAttribute('eID'));
        }
    }

    renderVerseMilestone(node, contextStack) {
        if (node.hasAttribute('sID')) {
            const id = node.getAttribute('sID');
            const wrapper = document.createElement('div');
            wrapper.classList.add('osis-block', 'osis-verse');
            wrapper.dataset.osisId = id;
            wrapper.appendChild(this.createLabelParagraph(`verse start (${id})`));

            const body = document.createElement('span');
            body.className = 'osis-verse-body';
            wrapper.appendChild(body);

            applyOsisAttributes(node, wrapper);
            this.appendToCurrent(wrapper, contextStack);
            contextStack.push({ type: 'verse', id, element: body });
        } else if (node.hasAttribute('eID')) {
            this.closeContext(contextStack, 'verse', node.getAttribute('eID'));
        }
    }

    renderGenericBlock(node, contextStack) {
        const wrapper = document.createElement('div');
        wrapper.classList.add('osis-block', `osis-${node.localName}`);
        applyOsisAttributes(node, wrapper);
        wrapper.appendChild(this.createLabelParagraph(node.localName));

        const body = this.createContentElementFor(node.localName);
        body.classList.add('osis-block-body', `osis-${node.localName}-body`);
        wrapper.appendChild(body);
        this.appendToCurrent(wrapper, contextStack);

        const contextId = node.getAttribute('osisID') || null;
        contextStack.push({ type: node.localName, id: contextId, element: body });
        this.processChildNodes(node.childNodes, contextStack);
        contextStack.pop();

        return wrapper;
    }

    renderGenericInline(node, contextStack) {
        const name = node.localName;
        let el;
        if (name === 'a') {
            el = document.createElement('a');
            const href = node.getAttribute('href') || node.getAttribute('osisRef') || '#';
            el.href = href;
            el.target = '_blank';
            el.rel = 'noopener noreferrer';
        } else if (name === 'lb') {
            this.renderLineBreak(contextStack);
            return;
        } else {
            el = document.createElement('span');
        }
        el.classList.add('osis-inline', `osis-${name}`);
        el.title = createElementLabel(name);
        applyOsisAttributes(node, el);
        this.appendToCurrent(el, contextStack);
        contextStack.push({ type: name, id: null, element: el });
        this.processChildNodes(node.childNodes, contextStack);
        contextStack.pop();
    }

    renderSpeaker(node, contextStack) {
        const span = document.createElement('span');
        span.classList.add('osis-inline', 'osis-speaker');
        span.title = createElementLabel('speaker');
        applyOsisAttributes(node, span);
        this.appendToCurrent(span, contextStack);
        contextStack.push({ type: 'speaker', id: null, element: span });
        this.processChildNodes(node.childNodes, contextStack);
        contextStack.pop();
    }

    renderMilestoneElement(node, contextStack) {
        const span = document.createElement('span');
        span.classList.add('osis-milestone', `osis-${node.localName}`);
        span.textContent = createElementLabel(node.localName);
        applyOsisAttributes(node, span);
        this.appendToCurrent(span, contextStack);
    }

    renderLineBreak(node, contextStack) {
        const current = contextStack[contextStack.length - 1].element;
        const marker = document.createElement('span');
        marker.classList.add('osis-inline', 'osis-lb');
        marker.title = createElementLabel('lb');
        marker.textContent = 'LB';
        marker.setAttribute('aria-hidden', 'true');
        applyOsisAttributes(node, marker);
        current.appendChild(marker);
        current.appendChild(document.createElement('br'));
    }

    appendToCurrent(element, contextStack) {
        const current = contextStack[contextStack.length - 1];
        current.element.appendChild(element);
    }

    appendTextNode(text, contextStack) {
        const normalized = text.replace(/\s+/g, ' ');
        if (!normalized.trim()) {
            return;
        }
        const current = contextStack[contextStack.length - 1].element;
        const currentTextNode = current.lastChild;
        if (currentTextNode && currentTextNode.nodeType === Node.TEXT_NODE) {
            currentTextNode.textContent += normalized;
        } else {
            current.appendChild(document.createTextNode(normalized));
        }
    }

    closeContext(contextStack, type, id) {
        for (let i = contextStack.length - 1; i >= 0; i -= 1) {
            const ctx = contextStack[i];
            if (ctx.type === type && (!id || ctx.id === id)) {
                contextStack.splice(i, contextStack.length - i);
                break;
            }
        }
    }

    createLabelParagraph(name) {
        const label = document.createElement('div');
        label.className = 'osis-element-label';
        label.textContent = createElementLabel(name);
        return label;
    }

    createContentElementFor(name) {
        switch (name) {
            case 'p':
                return document.createElement('div');
            case 'table':
                return createRoleElement('div', 'table');
            case 'row':
                return createRoleElement('div', 'row');
            case 'cell':
                return createRoleElement('div', 'cell');
            default:
                return document.createElement('div');
        }
    }
}

function cloneElement(element) {
    return element.cloneNode(true);
}

function createRoleElement(tag, role) {
    const element = document.createElement(tag);
    element.setAttribute('role', role);
    return element;
}

function applyOsisAttributes(source, target) {
    if (!source || !target || !source.attributes) {
        return;
    }

    target.setAttribute('data-osis-element', source.localName);

    Array.from(source.attributes).forEach((attr) => {
        const sanitizedName = attr.name.replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
        target.setAttribute(`data-osis-${sanitizedName}`, attr.value);
        if (attr.name === 'xml:lang') {
            target.setAttribute('lang', attr.value);
        }
    });
}

customElements.define('plain-meaning-bible-page', PlainMeaningBiblePage);
