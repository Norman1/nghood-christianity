import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';
import { generateTOC } from '../utils/toc-generator.js';
import '../components/quiz-card.js';
import '../components/hierarchical-tree-selector.js';
import '../components/collapsible-section.js';
import '../components/auth-guard.js';
import { authService } from '../utils/auth-service.js';

class ComponentsGallery extends HTMLElement {
    async connectedCallback() {
        // Check if user is authenticated
        if (!authService.isAuthenticated()) {
            this.innerHTML = '<auth-guard></auth-guard>';

            const handleAuthSuccess = () => {
                this.removeEventListener('auth-success', handleAuthSuccess);
                this.renderComponentsGallery();
            };

            this.addEventListener('auth-success', handleAuthSuccess);
            return;
        }

        await this.renderComponentsGallery();
    }
    
    async renderComponentsGallery() {
        const layout = document.querySelector('main-layout');
        layout.setAttribute('with-right', '');

        // Clear old right sidebar content from layout
        layout.querySelectorAll('[slot="right"]').forEach(el => el.remove());

        // Set main content
        this.innerHTML = '';
        const loader = createLoadingElement();
        this.appendChild(loader);

        const templateContent = await loadTemplate("./templates/components-gallery.html");
        this.innerHTML = templateContent;

        // Generate TOC from headings and add to right sidebar
        const toc = generateTOC(this);
        const sidebar = document.createElement('div');
        sidebar.setAttribute('slot', 'right');
        sidebar.appendChild(toc);

        // Inject sidebar into layout
        layout.appendChild(sidebar);

        // Make toggle switches interactive
        this.setupToggleSwitches();
        
        // Setup autocomplete functionality
        this.setupAutocomplete();
        
        // Setup quiz cards
        this.setupQuizCards();
        
        // Setup bible book selector
        this.setupBibleSelector();
        
        // Setup collapsible sections
        this.setupCollapsibleSections();
    }

    setupToggleSwitches() {
        // Add click handlers to toggle switches
        this.querySelectorAll('.toggle-switch input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', function() {
                // The CSS handles the visual state change automatically
                // This is where you could add custom logic if needed
                console.log(`Toggle ${this.id} is now: ${this.checked ? 'ON' : 'OFF'}`);
            });
        });

        // Make the wrapper clickable too (better UX)
        this.querySelectorAll('.toggle-wrapper').forEach(wrapper => {
            if (!wrapper.classList.contains('disabled')) {
                wrapper.addEventListener('click', function(e) {
                    // Only handle clicks on the wrapper itself, not the input
                    if (e.target === this || e.target.classList.contains('toggle-slider')) {
                        const toggle = this.querySelector('input[type="checkbox"]');
                        if (toggle && !toggle.disabled) {
                            toggle.checked = !toggle.checked;
                            // Trigger change event
                            toggle.dispatchEvent(new Event('change'));
                        }
                    }
                });
            }
        });
    }

    setupAutocomplete() {
        // Bible books data for autocomplete
        const bibleBooks = [
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
            '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
            'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs',
            'Ecclesiastes', 'Song of Solomon', 'Isaiah', 'Jeremiah', 'Lamentations',
            'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
            'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk',
            'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
            'Matthew', 'Mark', 'Luke', 'John', 'Acts',
            'Romans', '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
            'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy',
            '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
            '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
            'Jude', 'Revelation'
        ];

        // Setup autocomplete for each autocomplete input
        this.querySelectorAll('.autocomplete-wrapper').forEach(wrapper => {
            const input = wrapper.querySelector('.autocomplete-input');
            const dropdown = wrapper.querySelector('.autocomplete-dropdown');
            let highlightedIndex = -1;

            // Filter and display suggestions
            function showSuggestions(query) {
                if (query.length === 0) {
                    dropdown.classList.remove('show');
                    return;
                }

                const filtered = bibleBooks.filter(book => 
                    book.toLowerCase().includes(query.toLowerCase())
                );

                if (filtered.length === 0) {
                    dropdown.innerHTML = '<div class="autocomplete-no-results">No matches found</div>';
                    dropdown.classList.add('show');
                    highlightedIndex = -1;
                    return;
                }

                dropdown.innerHTML = filtered.map((book, index) => {
                    const highlighted = book.replace(
                        new RegExp(`(${query})`, 'gi'),
                        '<span class="autocomplete-match">$1</span>'
                    );
                    return `<div class="autocomplete-option" data-value="${book}" data-index="${index}">${highlighted}</div>`;
                }).join('');

                dropdown.classList.add('show');
                highlightedIndex = -1;
            }

            // Handle input changes
            input.addEventListener('input', (e) => {
                showSuggestions(e.target.value);
            });

            // Handle keyboard navigation
            input.addEventListener('keydown', (e) => {
                const options = dropdown.querySelectorAll('.autocomplete-option');
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    highlightedIndex = Math.min(highlightedIndex + 1, options.length - 1);
                    updateHighlight(options);
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    highlightedIndex = Math.max(highlightedIndex - 1, -1);
                    updateHighlight(options);
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    if (highlightedIndex >= 0 && options[highlightedIndex]) {
                        selectOption(options[highlightedIndex]);
                    }
                } else if (e.key === 'Escape') {
                    dropdown.classList.remove('show');
                    highlightedIndex = -1;
                }
            });

            // Handle option selection
            dropdown.addEventListener('click', (e) => {
                if (e.target.classList.contains('autocomplete-option')) {
                    selectOption(e.target);
                }
            });

            // Update highlighting
            function updateHighlight(options) {
                options.forEach((option, index) => {
                    option.classList.toggle('highlighted', index === highlightedIndex);
                });
            }

            // Select an option
            function selectOption(option) {
                input.value = option.dataset.value;
                dropdown.classList.remove('show');
                highlightedIndex = -1;
                // Trigger change event for form handling
                input.dispatchEvent(new Event('change'));
            }

            // Hide dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!wrapper.contains(e.target)) {
                    dropdown.classList.remove('show');
                    highlightedIndex = -1;
                }
            });
        });
    }
    
    setupQuizCards() {
        // Setup validation for quiz card demos
        const quizCard1 = this.querySelector('#quizCard1');
        const quizCard2 = this.querySelector('#quizCard2');
        const quizCard3 = this.querySelector('#quizCard3');
        
        // Multiple choice quiz validation
        if (quizCard1) {
            quizCard1.addEventListener('validate-answer', (e) => {
                const selected = quizCard1.querySelector('input[name="q1-answer"]:checked');
                const isCorrect = selected && selected.value === 'exodus';
                
                quizCard1.setValidationResult(isCorrect);
                
                if (!isCorrect && selected) {
                    // Mark wrong answer
                    quizCard1.markWrongAnswers(`input[name="q1-answer"]:checked`);
                }
                
                if (isCorrect && selected) {
                    // Highlight correct answer
                    quizCard1.highlightCorrectAnswer(`input[value="exodus"]`);
                }
            });
            
            quizCard1.addEventListener('answer-revealed', (e) => {
                console.log('Quiz 1 answer revealed:', e.detail);
            });
            
            quizCard1.addEventListener('next-question', () => {
                console.log('Next question requested for quiz 1');
            });
        }
        
        // Checkbox quiz validation
        if (quizCard2) {
            quizCard2.addEventListener('validate-answer', (e) => {
                const checked = Array.from(quizCard2.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.value);
                const correct = ['love', 'joy', 'peace', 'patience'];
                const isCorrect = correct.length === checked.length && 
                    correct.every(fruit => checked.includes(fruit));
                
                quizCard2.setValidationResult(isCorrect);
                
                if (!isCorrect) {
                    // Mark wrong selections
                    quizCard2.querySelectorAll('input[type="checkbox"]').forEach(cb => {
                        if (cb.checked && !correct.includes(cb.value)) {
                            // Wrong selection
                            quizCard2.markWrongAnswers(`input[value="${cb.value}"]`);
                        } else if (!cb.checked && correct.includes(cb.value)) {
                            // Missed correct answer
                            const wrapper = cb.closest('.checkbox-wrapper');
                            wrapper.style.background = 'rgba(46, 160, 67, 0.1)';
                            wrapper.style.border = '1px solid rgba(46, 160, 67, 0.3)';
                        }
                    });
                }
                
                if (isCorrect) {
                    // Highlight all correct answers
                    correct.forEach(value => {
                        quizCard2.highlightCorrectAnswer(`input[value="${value}"]`);
                    });
                }
            });
        }
        
        // Text input quiz validation
        if (quizCard3) {
            const input = quizCard3.querySelector('#q3-answer');
            
            // Validation
            quizCard3.addEventListener('validate-answer', (e) => {
                const answer = input.value.trim().toLowerCase();
                const isCorrect = answer === 'saul';
                
                quizCard3.setValidationResult(isCorrect);
                
                if (!isCorrect && answer) {
                    input.style.color = 'var(--error-color)';
                    input.style.textDecoration = 'line-through';
                } else if (isCorrect) {
                    input.style.color = 'var(--success-color)';
                    input.style.background = 'rgba(46, 160, 67, 0.1)';
                }
            });
        }
        
        // Log all quiz events for demo purposes
        this.querySelectorAll('quiz-card').forEach(card => {
            card.addEventListener('answer-revealed', (e) => {
                console.log('Answer revealed:', e.detail);
            });
            
            card.addEventListener('next-question', (e) => {
                console.log('Next question requested:', e.detail);
            });
        });
    }
    
    setupBibleSelector() {
        const bibleSelector = this.querySelector('#bibleSelector');
        
        if (bibleSelector) {
            // Log selection changes for demo
            bibleSelector.addEventListener('selection-changed', (e) => {
                console.log('Bible books selected:', e.detail.selectedBooks);
                console.log('Total count:', e.detail.count);
                
                // You could update UI here to show selected books
                // For demo purposes, just log to console
            });
        }
    }
    
    setupCollapsibleSections() {
        // Set up status and count for demo sections
        const activeSection = this.querySelector('#activeSection');
        const itemsSection = this.querySelector('#itemsSection');
        
        if (activeSection) {
            activeSection.setStatus('active');
            
            activeSection.addEventListener('toggle', (e) => {
                console.log('Active section toggled:', e.detail.expanded);
            });
        }
        
        if (itemsSection) {
            // Count checked checkboxes
            const updateItemCount = () => {
                const checkedItems = itemsSection.querySelectorAll('input[type="checkbox"]:checked');
                itemsSection.setCount(checkedItems.length);
            };
            
            // Initial count
            updateItemCount();
            
            // Update count when checkboxes change
            itemsSection.addEventListener('change', (e) => {
                if (e.target.type === 'checkbox') {
                    updateItemCount();
                }
            });
        }
        
        // Log all section toggle events for demo
        this.querySelectorAll('collapsible-section').forEach(section => {
            section.addEventListener('toggle', (e) => {
                console.log(`Section "${e.detail.title}" ${e.detail.expanded ? 'expanded' : 'collapsed'}`);
            });
        });
    }
}

customElements.define('components-gallery', ComponentsGallery);





