export function generateTOC(fromElement) {
    const headings = fromElement.querySelectorAll('h2, h3');
    
    // Create container for the entire TOC
    const tocContainer = document.createElement('div');
    
    // Add title
    const title = document.createElement('div');
    title.textContent = 'On this page';
    title.style.fontSize = '0.75rem';
    title.style.fontWeight = '600';
    title.style.color = '#7d8590';
    title.style.textTransform = 'uppercase';
    title.style.letterSpacing = '0.05em';
    title.style.marginBottom = '0.75rem';
    title.style.padding = '0 0.75rem';
    
    tocContainer.appendChild(title);
    
    const toc = document.createElement('ul');
    toc.style.listStyle = 'none';
    toc.style.padding = '0';
    toc.style.margin = '0';

    const links = [];

    headings.forEach((heading, index) => {
        if (!heading.id) {
            heading.id = `auto-heading-${index}`;
        }

        const li = document.createElement('li');
        // H3 headings get indented
        if (heading.tagName === 'H3') {
            li.style.marginLeft = '1rem';
        }

        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.dataset.target = heading.id;
        
        // JetBrains styling
        setLinkStyle(link, false);

        // Hover styles
        link.addEventListener('mouseenter', () => {
            if (!link.classList.contains('active')) {
                link.style.background = 'rgba(88, 166, 255, 0.08)';
                link.style.color = '#58a6ff';
                link.style.borderLeftColor = '#58a6ff';
            }
        });
        
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                setLinkStyle(link, false);
            }
        });

        // Smooth scroll navigation
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        });

        li.appendChild(link);
        toc.appendChild(li);
        links.push(link);
    });

    // Set up scroll spy
    setupScrollSpy(Array.from(headings), links);

    tocContainer.appendChild(toc);
    return tocContainer;
}

function setLinkStyle(link, isActive) {
    link.style.display = 'block';
    link.style.textDecoration = 'none';
    link.style.padding = '0.375rem 0.75rem';
    link.style.borderRadius = '4px';
    link.style.transition = 'all 0.15s ease';
    link.style.borderLeft = '2px solid transparent';
    link.style.lineHeight = '1.4';
    link.style.fontSize = '0.875rem';
    
    if (isActive) {
        link.style.background = 'rgba(88, 166, 255, 0.12)';
        link.style.color = '#58a6ff';
        link.style.borderLeftColor = '#58a6ff';
        link.style.fontWeight = '500';
        link.classList.add('active');
    } else {
        link.style.background = 'transparent';
        link.style.color = '#8b949e';
        link.style.borderLeftColor = 'transparent';
        link.style.fontWeight = '400';
        link.classList.remove('active');
    }
}

function setupScrollSpy(headings, links) {
    // Find the main scrollable container
    const scrollContainer = document.querySelector('main-layout').shadowRoot.querySelector('main');
    
    let currentActiveIndex = -1;
    
    function updateActiveSection() {
        const containerRect = scrollContainer.getBoundingClientRect();
        const containerTop = containerRect.top;
        const containerHeight = containerRect.height;
        
        let activeIndex = -1;
        let minDistance = Infinity;
        
        // Find the heading that's closest to the top of the viewport
        for (let i = 0; i < headings.length; i++) {
            const heading = headings[i];
            const headingRect = heading.getBoundingClientRect();
            const headingTop = headingRect.top;
            
            // Calculate distance from heading to the top of the scrollable container
            const distanceFromTop = headingTop - containerTop;
            
            // If heading is visible in the container (not below the fold)
            if (distanceFromTop <= containerHeight && headingRect.bottom >= containerTop) {
                // If heading is at or near the top (within 60px), prioritize it
                if (distanceFromTop >= -10 && distanceFromTop <= 60) {
                    if (Math.abs(distanceFromTop) < minDistance) {
                        minDistance = Math.abs(distanceFromTop);
                        activeIndex = i;
                    }
                }
                // If no heading is near the top, find the first visible one
                else if (activeIndex === -1 && distanceFromTop >= -200) {
                    activeIndex = i;
                }
            }
        }
        
        // Fallback: if no heading found using above logic, use the traditional approach
        if (activeIndex === -1) {
            for (let i = headings.length - 1; i >= 0; i--) {
                const heading = headings[i];
                const headingRect = heading.getBoundingClientRect();
                const headingTop = headingRect.top - containerTop;
                
                if (headingTop <= 80) {
                    activeIndex = i;
                    break;
                }
            }
        }
        
        // Update active link if changed
        if (activeIndex !== currentActiveIndex) {
            // Remove active from all links
            links.forEach(link => setLinkStyle(link, false));
            
            // Set active on current link
            if (activeIndex >= 0) {
                setLinkStyle(links[activeIndex], true);
            }
            
            currentActiveIndex = activeIndex;
        }
    }
    
    // Set up scroll listener with throttling for better performance
    let ticking = false;
    scrollContainer.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial update
    setTimeout(updateActiveSection, 100);
    
    // Update when window resizes
    window.addEventListener('resize', updateActiveSection);
}
