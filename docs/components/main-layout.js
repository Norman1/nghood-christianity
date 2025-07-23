class MainLayout extends HTMLElement {
    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this.shadowRoot.innerHTML = `
      <style>
:host {
  /* Layout dimensions */
  --header-height: 60px;
  --sidebar-left-width: 200px;
  --sidebar-right-width: 220px;
  --mobile-sidebar-width: 250px;
  
  /* Colors */
  --bg-primary: #0f1419;
  --bg-secondary: #161b22;
  --bg-tertiary: #0d1117;
  --bg-footer: #21262d;
  --text-primary: #f0f6fc;
  --text-link: #58a6ff;
  --border-color: #30363d;
  --border-color-subtle: rgba(48, 54, 61, 0.5);
  
  /* Spacing */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Scrollbar */
  --scrollbar-width: 10px;
  --scrollbar-radius: 5px;
  
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  display: grid;
  grid-template-rows: var(--header-height) 1fr;
  grid-template-columns: var(--sidebar-left-width) 1fr minmax(0, var(--sidebar-right-width));
  grid-template-areas: 
    "header header header"
    "left main right";
  height: 100vh;
  box-sizing: border-box;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* Custom scrollbar styles */
::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
}

::-webkit-scrollbar-track {
  background: rgba(13, 17, 23, 0.3);
  border-radius: var(--scrollbar-radius);
}

::-webkit-scrollbar-thumb {
  background: rgba(48, 54, 61, 0.8);
  border-radius: var(--scrollbar-radius);
  border: 1px solid rgba(13, 17, 23, 0.3);
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(88, 166, 255, 0.4);
}

::-webkit-scrollbar-thumb:active {
  background: rgba(88, 166, 255, 0.6);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(48, 54, 61, 0.8) rgba(13, 17, 23, 0.3);
}

/* Header */
header {
  grid-area: header;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  position: relative;
}

header ::slotted(*) {
  flex: 1;
}

/* Left sidebar */
aside.left {
  grid-area: left;
  background: var(--bg-tertiary);
  border-right: 1px solid var(--border-color-subtle);
  overflow-y: auto;
  padding: var(--spacing-lg) var(--spacing-md);
}

/* Right sidebar */
aside.right {
  grid-area: right;
  background: var(--bg-tertiary);
  border-left: 1px solid var(--border-color-subtle);
  overflow-y: auto;
  padding: var(--spacing-lg) var(--spacing-md);
  transition: width 0.2s ease, opacity 0.2s ease;
}

/* Auto-hide when empty using modern CSS */
aside.right:empty,
aside.right:not(:has(::slotted(*))) {
  width: 0;
  padding: 0;
  border: none;
  overflow: hidden;
}

/* Auto-hide when empty using modern CSS */
aside.right:empty,
aside.right:not(:has(::slotted(*))) {
  width: 0;
  padding: 0;
  border: none;
  overflow: hidden;
}

/* When right sidebar is empty, adjust grid */
:host:has(aside.right:empty),
:host:has(aside.right:not(:has(::slotted(*)))) {
  grid-template-columns: var(--sidebar-left-width) 1fr;
}

/* Right sidebar TOC styling - JetBrains style */
aside.right ::slotted(*) {
  font-size: 0.875rem;
}

aside.right ::slotted(ul) {
  list-style: none;
  padding: 0;
  margin: 0;
}

aside.right ::slotted(li) {
  margin: 0.125rem 0;
}

aside.right ::slotted(a) {
  display: block;
  color: #8b949e;
  text-decoration: none;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  transition: all 0.15s ease;
  border-left: 2px solid transparent;
  font-weight: 400;
  line-height: 1.4;
}

aside.right ::slotted(a:hover) {
  background: rgba(88, 166, 255, 0.08);
  color: var(--text-link);
  border-left-color: var(--text-link);
}

aside.right ::slotted(a.active) {
  background: rgba(88, 166, 255, 0.12);
  color: var(--text-link);
  border-left-color: var(--text-link);
  font-weight: 500;
}

:host(:not([with-right])) {
  grid-template-columns: var(--sidebar-left-width) 1fr;
  grid-template-areas: 
    "header header"
    "left main";
}

:host(:not([with-right])) .right {
  display: none;
}

/* Main content area */
main {
  grid-area: main;
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

/* Always allow scrolling in main content area */

/* Ensure sidebar scrolling always works */
aside.left {
  overflow-y: auto !important;
}

/* Content styling - JetBrains inspired */
main ::slotted(h1) {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 1.5rem 0;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

main ::slotted(h2) {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 2rem 0 1rem 0;
  color: var(--text-primary);
  letter-spacing: -0.005em;
}

main ::slotted(h3) {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 1.5rem 0 0.75rem 0;
  color: var(--text-primary);
}

main ::slotted(p) {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 1rem 0;
  color: #e6edf3;
  max-width: 65ch;
}

main ::slotted(a) {
  color: var(--text-link);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: all 0.15s ease;
}

main ::slotted(a:hover) {
  color: #79c0ff;
  border-bottom-color: var(--text-link);
}

main ::slotted(code) {
  font-family: 'JetBrains Mono', 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  background: #21262d;
  color: var(--text-primary);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  border: 1px solid var(--border-color);
}

/* Footer within main content */
footer {
  background: var(--bg-footer);
  padding: var(--spacing-md);
  margin: auto calc(-1 * var(--spacing-lg)) calc(-1 * var(--spacing-lg)) calc(-1 * var(--spacing-lg));
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

/* Mobile menu toggle */
.menu-toggle {
  display: none;
  position: absolute;
  top: var(--spacing-md);
  left: var(--spacing-md);
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  padding: var(--spacing-sm);
  line-height: 1;
  color: var(--text-primary);
}

.menu-toggle:hover {
  background: rgba(0,0,0,0.1);
  border-radius: 4px;
}

/* Mobile styles */
@media (max-width: 768px) {
  :host {
    grid-template-columns: 1fr !important;
    grid-template-areas: 
      "header"
      "main" !important;
  }
  
  .menu-toggle {
    display: block;
  }
  
  aside.left {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--mobile-sidebar-width);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 999;
    box-shadow: 2px 0 10px rgba(0,0,0,0.1);
    grid-area: unset !important;
  }
  
  :host([mobile-menu-open]) aside.left {
    transform: translateX(0);
  }
  
  /* Hide right sidebar on mobile */
  aside.right {
    display: none !important;
    grid-area: unset !important;
  }
  
  main {
    padding: var(--spacing-md);
    grid-area: main !important;
    width: 100%;
  }
  
  /* Overlay when menu is open */
  .mobile-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    z-index: 998;
  }
  
  :host([mobile-menu-open]) .mobile-overlay {
    display: block;
  }
}


#sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.nav-section {
  border-bottom: 1px solid rgba(48, 54, 61, 0.3);
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
}

.nav-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.nav-toggle {
  background: none;
  border: none;
  font-weight: 600;
  font-size: 0.75rem;
  padding: 0.5rem 0.75rem 0.375rem 0.75rem;
  cursor: pointer;
  color: #7d8590;
  text-align: left;
  width: 100%;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: color 0.15s ease;
}

.nav-toggle:hover {
  color: #8b949e;
}

.nav-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-items li {
  margin: 0;
}

.nav-items a {
  text-decoration: none;
  color: #8b949e;
  display: block;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  margin: 0.125rem 0;
  transition: all 0.15s ease;
  font-weight: 400;
  line-height: 1.4;
  border-left: 2px solid transparent;
}

.nav-items a:hover {
  background: rgba(88, 166, 255, 0.08);
  color: var(--text-link);
  border-left-color: var(--text-link);
}

.nav-items a.active {
  background: rgba(88, 166, 255, 0.12);
  color: var(--text-link);
  border-left-color: var(--text-link);
  font-weight: 500;
}


      </style>

      <header>
        <button class="menu-toggle" aria-label="Toggle menu">☰</button>
        <slot name="header"></slot>
      </header>

      <aside class="left">
        <slot name="nav"></slot>
      </aside>

      <main>
        <slot name="main"></slot>
        
        <footer>
          <slot name="footer"></slot>
        </footer>
      </main>

      <aside class="right">
        <slot name="right"></slot>
      </aside>
      
      <div class="mobile-overlay"></div>
    `;
    
        this.setupMobileMenu();
        this.setupSwipeGestures();
    }
    
    setupMobileMenu() {
        const menuToggle = this.shadowRoot.querySelector('.menu-toggle');
        const overlay = this.shadowRoot.querySelector('.mobile-overlay');
        
        menuToggle.addEventListener('click', () => {
            this.toggleAttribute('mobile-menu-open');
        });
        
        overlay.addEventListener('click', () => {
            this.removeAttribute('mobile-menu-open');
        });
    }

    setupSwipeGestures() {
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        // Listen for touch events on the main content area
        const main = this.shadowRoot.querySelector('main');
        
        main.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            isSwiping = false;
        });
        
        main.addEventListener('touchmove', (e) => {
            if (!touchStartX || !touchStartY) return;
            
            const touchCurrentX = e.touches[0].clientX;
            const touchCurrentY = e.touches[0].clientY;
            
            const diffX = touchStartX - touchCurrentX;
            const diffY = touchStartY - touchCurrentY;
            
            // Only trigger if horizontal swipe is more significant than vertical
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                isSwiping = true;
                
                // Swipe right (showing menu) - only if menu is closed
                if (diffX < -50 && !this.hasAttribute('mobile-menu-open')) {
                    this.setAttribute('mobile-menu-open', '');
                }
                // Swipe left (hiding menu) - only if menu is open  
                else if (diffX > 50 && this.hasAttribute('mobile-menu-open')) {
                    this.removeAttribute('mobile-menu-open');
                }
            }
        });
        
        main.addEventListener('touchend', () => {
            touchStartX = 0;
            touchStartY = 0;
            isSwiping = false;
        });
    }
}

customElements.define('main-layout', MainLayout);
