class BibleVerseGamePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.gameState = {
            selectedBooks: new Set(),
            currentVerse: null,
            displayedVerses: [],
            resultRevealed: false,
            isLoading: false
        };
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.initializeDefaultBooks();
        this.renderGameContent();
    }

    initializeDefaultBooks() {
        // All books except Psalms pre-selected
        const allBooksExceptPsalms = [
            'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
            'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
            '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah', 'Esther', 'Job',
            'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
            'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel',
            'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah',
            'Haggai', 'Zechariah', 'Malachi',
            'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
            '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
            '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
            'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John',
            '3 John', 'Jude', 'Revelation'
        ];
        
        this.gameState.selectedBooks = new Set(allBooksExceptPsalms);
        
        // Update the book selector
        const bookSelector = this.shadowRoot.querySelector('bible-book-tree-selector');
        if (bookSelector) {
            bookSelector.setSelectedBooks(allBooksExceptPsalms);
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                    font-family: inherit;
                }

                .game-container {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .book-selection {
                    background: var(--surface-secondary);
                    border-radius: 12px;
                    padding: 2rem;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .section-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .section-title::before {
                    content: "📖";
                    font-size: 1.1em;
                }

                .game-area {
                    background: var(--surface-secondary);
                    border-radius: 12px;
                    padding: 2rem;
                    min-height: 300px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .verse-display {
                    background: var(--surface-primary);
                    border-radius: 8px;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    border-left: 4px solid var(--primary-color);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }

                .verse-text {
                    font-size: 1.2rem;
                    line-height: 1.7;
                    color: var(--text-primary);
                    margin-bottom: 1rem;
                    font-family: Georgia, 'Times New Roman', serif;
                    text-align: justify;
                }

                .verse-text.original {
                    background: linear-gradient(135deg, rgba(99, 179, 237, 0.1), rgba(99, 179, 237, 0.05));
                    border: 2px solid rgba(99, 179, 237, 0.2);
                    border-radius: 6px;
                    padding: 1rem;
                    position: relative;
                    box-shadow: 0 2px 4px rgba(99, 179, 237, 0.1);
                }


                .verse-text.expanded {
                    background: rgba(108, 117, 125, 0.05);
                    border: 1px solid rgba(108, 117, 125, 0.1);
                    border-radius: 4px;
                    padding: 0.8rem;
                    margin-top: 0.5rem;
                    font-style: italic;
                    opacity: 0.9;
                }

                .verse-reference {
                    font-weight: 600;
                    color: var(--primary-color);
                    font-size: 0.95rem;
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid var(--border-color);
                }

                .verse-reference.hidden {
                    display: none;
                }

                .game-controls {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin-bottom: 1.5rem;
                    padding: 1rem;
                    background: rgba(255, 255, 255, 0.02);
                    border-radius: 8px;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .game-controls button {
                    min-width: 120px;
                    font-weight: 500;
                }

                .empty-state {
                    text-align: center;
                    color: var(--text-secondary);
                    padding: 3rem 1rem;
                }

                .empty-state h3 {
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                }

                .loading {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                    color: var(--text-secondary);
                    padding: 2rem;
                }

                .spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid var(--border-color);
                    border-top: 2px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 600px) {
                    :host {
                        padding: 1rem;
                    }
                    
                    .game-controls {
                        flex-direction: column;
                    }
                    
                    .game-btn {
                        justify-content: center;
                    }
                }
            </style>

            <div class="game-container">
                <div class="game-area">
                    <h2 class="section-title">Bible Verse Game</h2>
                    <div id="gameContent">
                        <div class="empty-state">
                            <h3>Ready to Play!</h3>
                            <p>Select your books below, then click "Start Playing" to begin guessing.</p>
                        </div>
                    </div>
                </div>

                <div class="book-selection">
                    <h2 class="section-title">Select Bible Books</h2>
                    <bible-book-tree-selector></bible-book-tree-selector>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const bookSelector = this.shadowRoot.querySelector('bible-book-tree-selector');
        bookSelector.addEventListener('selection-changed', (e) => {
            this.gameState.selectedBooks = new Set(e.detail.selectedBooks);
        });
    }

    async getNewVerse() {
        if (this.gameState.selectedBooks.size === 0) {
            alert('Please select at least one book first!');
            return;
        }

        this.setLoading(true);
        
        try {
            const booksParam = Array.from(this.gameState.selectedBooks).join(',');
            const response = await fetch(`/api/bible-game/random-verse?books=${encodeURIComponent(booksParam)}`, {
                headers: {
                    'X-API-Key': window.CONFIG.API_SECRET
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const verse = await response.json();
            
            this.gameState.currentVerse = verse;
            this.gameState.displayedVerses = [{
                verse: verse.verseNumber,
                text: verse.text
            }];
            this.gameState.resultRevealed = false;
            
            this.renderGameContent();
            
        } catch (error) {
            console.error('Error fetching random verse:', error);
            this.showError('Failed to fetch verse. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    async showMoreVerse() {
        if (!this.gameState.currentVerse) return;
        
        this.setLoading(true);
        
        try {
            const fromVerse = Math.min(...this.gameState.displayedVerses.map(v => v.verse));
            const toVerse = Math.max(...this.gameState.displayedVerses.map(v => v.verse));
            
            const response = await fetch(
                `/api/bible-game/expand-verse?book=${encodeURIComponent(this.gameState.currentVerse.book)}&chapter=${this.gameState.currentVerse.chapter}&fromVerse=${fromVerse}&toVerse=${toVerse}`,
                {
                    headers: {
                        'X-API-Key': window.CONFIG.API_SECRET
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const expandedVerse = await response.json();
            
            // Add the new verse to our displayed verses
            this.gameState.displayedVerses.push({
                verse: expandedVerse.verseNumber,
                text: expandedVerse.text
            });
            
            // Sort verses by number
            this.gameState.displayedVerses.sort((a, b) => a.verse - b.verse);
            
            // Update expansion possibility
            this.gameState.currentVerse.canExpandMore = expandedVerse.canExpandMore;
            
            this.renderGameContent();
            
        } catch (error) {
            console.error('Error expanding verse:', error);
            this.showError('Failed to expand verse. Please try again.');
        } finally {
            this.setLoading(false);
        }
    }

    showResult() {
        this.gameState.resultRevealed = true;
        this.renderGameContent();
    }

    renderGameContent() {
        const gameContent = this.shadowRoot.getElementById('gameContent');
        
        if (this.gameState.isLoading) {
            gameContent.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <span>Loading...</span>
                </div>
            `;
            return;
        }
        
        if (!this.gameState.currentVerse) {
            gameContent.innerHTML = `
                <div class="empty-state">
                    <h3>Ready to Play!</h3>
                    <p>Click "New Verse" to start guessing where the verse is from.</p>
                </div>
                <div class="game-controls">
                    <button class="btn-primary" onclick="this.getRootNode().host.getNewVerse()">
                        🎲 Start Playing
                    </button>
                </div>
            `;
            return;
        }
        
        const originalVerseNumber = this.gameState.displayedVerses[0].verse;
        const versesHtml = this.gameState.displayedVerses
            .map(v => {
                const isOriginal = v.verse === originalVerseNumber;
                const cssClass = isOriginal ? 'verse-text original' : 'verse-text expanded';
                return `<div class="${cssClass}">${v.text}</div>`;
            })
            .join('');
        
        gameContent.innerHTML = `
            <div class="game-controls">
                <button class="btn-secondary" 
                        onclick="this.getRootNode().host.showMoreVerse()"
                        ${!this.gameState.currentVerse.canExpandMore || this.gameState.resultRevealed ? 'disabled' : ''}>
                    📖 Show More Context
                </button>
                
                <button class="btn-commit" 
                        onclick="this.getRootNode().host.showResult()"
                        ${this.gameState.resultRevealed ? 'disabled' : ''}>
                    🔍 Reveal Answer
                </button>
                
                <button class="btn-primary" 
                        onclick="this.getRootNode().host.getNewVerse()">
                    🎲 New Verse
                </button>
            </div>

            <div class="verse-display">
                ${versesHtml}
                <div class="verse-reference ${this.gameState.resultRevealed ? '' : 'hidden'}">
                    ${this.gameState.currentVerse.reference}
                </div>
            </div>
        `;
    }

    setLoading(loading) {
        this.gameState.isLoading = loading;
        this.renderGameContent();
    }

    showError(message) {
        const gameContent = this.shadowRoot.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="empty-state">
                <h3>Error</h3>
                <p>${message}</p>
            </div>
            <div class="game-controls">
                <button class="btn-primary" onclick="this.getRootNode().host.getNewVerse()">
                    🔄 Try Again
                </button>
            </div>
        `;
    }
}

customElements.define('bible-verse-game-page', BibleVerseGamePage);