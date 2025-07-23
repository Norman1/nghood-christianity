class QuizCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isCorrect = false;
        this.answered = false;
        this.hasUserInput = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: var(--surface-secondary);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 2rem;
                    margin: 1rem 0;
                    transition: all 0.3s ease;
                    position: relative;
                }

                :host([answered="correct"]) {
                    border-color: var(--success-color);
                    box-shadow: 0 0 20px rgba(46, 160, 67, 0.15);
                }

                .question-section {
                    margin-bottom: 1.5rem;
                }

                ::slotted([slot="question"]) {
                    font-size: 1.25rem;
                    font-weight: 500;
                    color: var(--text-primary);
                    display: block;
                    margin-bottom: 1rem;
                }

                .answer-section {
                    margin-bottom: 1.5rem;
                    transition: opacity 0.3s ease;
                    position: relative;
                }

                .correct-answer-reveal {
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease-out;
                    max-height: 0;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .correct-answer-reveal.show {
                    opacity: 1;
                    transform: translateY(0);
                    max-height: 500px;
                    margin-top: 1rem;
                }

                .answer-label {
                    font-weight: 600;
                    display: block;
                    margin-bottom: 0.5rem;
                }

                .visual-feedback {
                    position: absolute;
                    right: -2rem;
                    top: 50%;
                    transform: translateY(-50%) scale(0);
                    font-size: 1.5rem;
                    transition: all 0.3s ease;
                }

                .visual-feedback.show {
                    transform: translateY(-50%) scale(1);
                }

                .visual-feedback.correct::before {
                    content: '✓';
                    color: var(--success-color);
                    font-weight: bold;
                }

                .visual-feedback.incorrect::before {
                    content: '✗';
                    color: var(--error-color);
                    font-weight: bold;
                }

                /* Answer box styling based on correctness */
                .correct-answer-reveal.correct {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    padding: 1rem;
                    border-radius: 6px;
                }

                .correct-answer-reveal.correct .answer-label {
                    color: #22c55e;
                }

                .correct-answer-reveal.correct .answer-label::before {
                    content: '✓ ';
                    font-weight: bold;
                    color: #22c55e;
                }

                .correct-answer-reveal.incorrect {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    padding: 1rem;
                    border-radius: 6px;
                }

                .correct-answer-reveal.incorrect .answer-label {
                    color: #ef4444;
                }

                .correct-answer-reveal.incorrect .answer-label::before {
                    content: '✗ ';
                    font-weight: bold;
                    color: #ef4444;
                }

                .correct-answer-reveal.neutral {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    padding: 1rem;
                    border-radius: 6px;
                }

                .correct-answer-reveal.neutral .answer-label {
                    color: #3b82f6;
                }

                .correct-answer-reveal.neutral .answer-label::before {
                    content: 'ℹ ';
                    font-weight: bold;
                    color: #3b82f6;
                }

                .explanation-section {
                    background: var(--surface-primary);
                    border: 1px solid var(--border-color);
                    border-left: 3px solid var(--primary-color);
                    border-radius: 6px;
                    padding: 1.5rem;
                    margin-top: 1.5rem;
                    opacity: 0;
                    max-height: 0;
                    overflow: hidden;
                    transition: all 0.4s ease-out;
                }

                .explanation-section.show {
                    opacity: 1;
                    max-height: 2000px;
                }

                .explanation-header {
                    font-weight: 600;
                    color: var(--primary-color);
                    margin-bottom: 0.75rem;
                    display: block;
                }

                .button-section {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    align-items: center;
                }

                .button-section button {
                    min-width: 140px;
                }

                /* Button styles - imported from global CSS to work within shadow DOM */
                button {
                    font: inherit;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: none;
                    outline: none;
                }

                button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    color: white;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .btn-primary:hover:not(:disabled) {
                    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .btn-commit {
                    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                    color: white;
                    padding: 0.5rem 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .btn-commit:hover:not(:disabled) {
                    background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                }

                .btn-secondary {
                    background: transparent;
                    border: 2px solid #3b82f6;
                    border-radius: 6px;
                    color: #3b82f6;
                    padding: 0.4rem 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .btn-secondary:hover:not(:disabled) {
                    background: rgba(59, 130, 246, 0.1);
                    border-color: #2563eb;
                    color: #2563eb;
                    transform: translateY(-1px);
                }

                .btn-primary:disabled,
                .btn-commit:disabled,
                .btn-secondary:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* Message styles - imported from global CSS to work within shadow DOM */
                .message {
                    padding: 0.75rem 1rem;
                    border-radius: 6px;
                    margin: 1rem 0;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .message-success {
                    background: rgba(34, 197, 94, 0.1);
                    border: 1px solid rgba(34, 197, 94, 0.3);
                    color: #7ee787;
                }

                .message-success::before {
                    content: '✓';
                    font-weight: bold;
                    color: #22c55e;
                }

                .message-error {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.3);
                    color: #ffa198;
                }

                .message-error::before {
                    content: '✗';
                    font-weight: bold;
                    color: #ef4444;
                }

                .message-warning {
                    background: rgba(245, 158, 11, 0.1);
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    color: #ffc649;
                }

                .message-warning::before {
                    content: '⚠';
                    font-weight: bold;
                    color: #f59e0b;
                }

                .message-info {
                    background: rgba(59, 130, 246, 0.1);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    color: #79c0ff;
                }

                .message-info::before {
                    content: 'ℹ';
                    font-weight: bold;
                    color: #3b82f6;
                }

                .message.compact {
                    padding: 0.5rem 0.75rem;
                    font-size: 0.85rem;
                    margin: 0.5rem 0;
                }

                /* Disabled input styling */
                ::slotted(input:disabled),
                ::slotted(textarea:disabled),
                ::slotted(select:disabled) {
                    opacity: 0.6;
                    cursor: not-allowed;
                    background: rgba(128, 128, 128, 0.1);
                }

                ::slotted(.radio-wrapper:has(input:disabled)),
                ::slotted(.checkbox-wrapper:has(input:disabled)) {
                    opacity: 0.6;
                    cursor: not-allowed;
                    pointer-events: none;
                }

                ::slotted(label:has(input:disabled)) {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                /* Animations */
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }

                :host([shake]) {
                    animation: shake 0.5s ease-in-out;
                }

                @keyframes celebrate {
                    0% { transform: scale(1); }
                    25% { transform: scale(1.05) rotate(2deg); }
                    50% { transform: scale(1.05) rotate(-2deg); }
                    75% { transform: scale(1.05) rotate(2deg); }
                    100% { transform: scale(1); }
                }

                :host([celebrate]) {
                    animation: celebrate 0.6s ease-in-out;
                }

                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.6; }
                    100% { opacity: 1; }
                }

                .answer-section.highlight-correct ::slotted(.correct-choice) {
                    background: rgba(46, 160, 67, 0.1) !important;
                    border-color: var(--success-color) !important;
                    animation: pulse 1s ease-in-out;
                }

                /* Wrong answer styles */
                .answer-section.has-wrong-answers ::slotted(.quiz-wrong-answer) {
                    opacity: 0.5;
                    position: relative;
                }

                .answer-section.has-wrong-answers ::slotted(.quiz-wrong-answer)::after {
                    content: '';
                    position: absolute;
                    left: 0;
                    right: 0;
                    top: 50%;
                    height: 2px;
                    background-color: var(--error-color);
                    transform: rotate(-2deg);
                }

                /* Responsive adjustments */
                @media (max-width: 600px) {
                    :host {
                        padding: 1.5rem;
                    }
                    
                    .visual-feedback {
                        right: -1.5rem;
                        font-size: 1.25rem;
                    }
                }
            </style>

            <div class="quiz-card-content">
                <div class="question-section">
                    <slot name="question"></slot>
                </div>

                <div class="answer-section" id="answerSection">
                    <slot name="answer-input"></slot>
                    <div class="visual-feedback" id="visualFeedback"></div>
                </div>

                <div class="correct-answer-reveal" id="correctAnswer">
                    <span class="answer-label">Answer:</span>
                    <slot name="correct-answer"></slot>
                </div>

                <div class="explanation-section" id="explanationSection">
                    <span class="explanation-header">Explanation</span>
                    <slot name="explanation"></slot>
                </div>

                <div class="button-section">
                    <button type="button" class="btn-primary" id="showAnswerBtn">
                        Show Answer
                    </button>
                    <button type="button" class="btn-commit" id="nextBtn" style="display: none;">
                        Next Question
                    </button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const showAnswerBtn = this.shadowRoot.getElementById('showAnswerBtn');
        const nextBtn = this.shadowRoot.getElementById('nextBtn');

        showAnswerBtn.addEventListener('click', () => this.handleShowAnswer());
        nextBtn.addEventListener('click', () => this.handleNext());

        // Listen for input changes
        this.addEventListener('input', () => {
            if (!this.answered) {
                this.hasUserInput = this.checkForUserInput();
            }
        });
    }

    handleShowAnswer() {
        this.answered = true;
        this.hasUserInput = this.checkForUserInput();
        
        // Validate answer if user provided input
        if (this.hasUserInput) {
            const validationEvent = new CustomEvent('validate-answer', {
                detail: {
                    questionId: this.getAttribute('question-id'),
                    hasInput: true,
                    metadata: this.getMetadata()
                }
            });
            
            this.dispatchEvent(validationEvent);
            
            // Parent should call setValidationResult immediately
            // Using a promise to ensure proper timing
            Promise.resolve().then(() => {
                if (!this.isCorrect) {
                    this.showIncorrectFeedback();
                } else {
                    this.showCorrectFeedback();
                }
                this.revealAnswer();
            });
        } else {
            // No input provided, show hint-style message then answer
            this.showNoAnswerFeedback();
            setTimeout(() => this.revealAnswer(), 1000);
        }
    }

    showCorrectFeedback() {
        const visualFeedback = this.shadowRoot.getElementById('visualFeedback');
        const answerSection = this.shadowRoot.getElementById('answerSection');
        
        // Add visual feedback
        visualFeedback.classList.add('show', 'correct');
        
        // Add celebration animation
        this.setAttribute('answered', 'correct');
        this.setAttribute('celebrate', '');
        setTimeout(() => this.removeAttribute('celebrate'), 600);
        
        // Highlight correct answer
        answerSection.classList.add('highlight-correct');
    }

    showIncorrectFeedback() {
        const visualFeedback = this.shadowRoot.getElementById('visualFeedback');
        const answerSection = this.shadowRoot.getElementById('answerSection');
        
        // Add visual feedback
        visualFeedback.classList.add('show', 'incorrect');
        
        // Add shake animation
        this.setAttribute('shake', '');
        setTimeout(() => this.removeAttribute('shake'), 500);
        
        // Style the answer section
        answerSection.classList.add('has-wrong-answers');
    }

    revealAnswer() {
        const correctAnswer = this.shadowRoot.getElementById('correctAnswer');
        const explanationSection = this.shadowRoot.getElementById('explanationSection');
        const showAnswerBtn = this.shadowRoot.getElementById('showAnswerBtn');
        const nextBtn = this.shadowRoot.getElementById('nextBtn');
        
        // Show correct answer with appropriate styling
        correctAnswer.classList.add('show');
        
        // Style the answer box based on user's performance
        if (this.isCorrect && this.hasUserInput) {
            // User got it right - green success styling
            correctAnswer.classList.add('correct');
        } else if (this.hasUserInput && !this.isCorrect) {
            // User got it wrong - red error styling
            correctAnswer.classList.add('incorrect');
        } else {
            // No user input - neutral blue info styling
            correctAnswer.classList.add('neutral');
        }
        
        // Show explanation if available
        if (this.querySelector('[slot="explanation"]')) {
            setTimeout(() => {
                explanationSection.classList.add('show');
            }, 300);
        }
        
        // Disable all input fields
        this.disableInputs();
        
        // Update buttons
        showAnswerBtn.style.display = 'none';
        nextBtn.style.display = 'block';
        
        // Emit result event
        this.dispatchEvent(new CustomEvent('answer-revealed', {
            detail: {
                questionId: this.getAttribute('question-id'),
                correct: this.isCorrect,
                hadUserInput: this.hasUserInput,
                timestamp: new Date().toISOString()
            }
        }));
    }

    handleNext() {
        this.dispatchEvent(new CustomEvent('next-question', {
            detail: {
                questionId: this.getAttribute('question-id')
            }
        }));
    }

    checkForUserInput() {
        // Check various input types
        const inputs = this.querySelectorAll('input[type="radio"]:checked, input[type="checkbox"]:checked');
        const textInputs = this.querySelectorAll('input[type="text"], textarea');
        const selects = this.querySelectorAll('select');
        
        if (inputs.length > 0) return true;
        
        for (let input of textInputs) {
            if (input.value.trim()) return true;
        }
        
        for (let select of selects) {
            if (select.value && select.value !== '') return true;
        }
        
        return false;
    }

    // Public method for parent to set validation result
    setValidationResult(isCorrect) {
        this.isCorrect = isCorrect;
    }

    // Method to mark specific wrong answers (called by parent)
    markWrongAnswers(selector) {
        const elements = this.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('quiz-wrong-answer');
        });
    }

    showNoAnswerFeedback() {
        // No separate feedback needed - will be handled in answer box styling
    }

    // Method to get metadata for the question
    getMetadata() {
        const metadata = {
            difficulty: this.getAttribute('difficulty') || 'medium',
            topics: this.getAttribute('topics') ? this.getAttribute('topics').split(',') : [],
            bibleBooks: this.getAttribute('bible-books') ? this.getAttribute('bible-books').split(',') : [],
            category: this.getAttribute('category') || 'general',
            estimatedTime: parseInt(this.getAttribute('estimated-time')) || 60,
            points: parseInt(this.getAttribute('points')) || 1
        };
        
        return metadata;
    }

    // Method to disable all input fields
    disableInputs() {
        // Disable all input types
        const inputs = this.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            // Don't disable our own component buttons
            if (!input.closest('.button-section')) {
                input.disabled = true;
            }
        });
        
        // Add disabled styling to wrappers
        const wrappers = this.querySelectorAll('.radio-wrapper, .checkbox-wrapper, .input-wrapper, .select-wrapper, .autocomplete-wrapper');
        wrappers.forEach(wrapper => {
            wrapper.style.opacity = '0.6';
            wrapper.style.pointerEvents = 'none';
            wrapper.style.cursor = 'not-allowed';
        });
    }
    
    // Method to re-enable all input fields (for reset)
    enableInputs() {
        const inputs = this.querySelectorAll('input, textarea, select, button');
        inputs.forEach(input => {
            if (!input.closest('.button-section')) {
                input.disabled = false;
            }
        });
        
        const wrappers = this.querySelectorAll('.radio-wrapper, .checkbox-wrapper, .input-wrapper, .select-wrapper, .autocomplete-wrapper');
        wrappers.forEach(wrapper => {
            wrapper.style.opacity = '1';
            wrapper.style.pointerEvents = 'auto';
            wrapper.style.cursor = 'pointer';
        });
    }

    // Method to highlight correct answer (called by parent)
    highlightCorrectAnswer(selector) {
        const elements = this.querySelectorAll(selector);
        elements.forEach(el => {
            el.classList.add('correct-choice');
        });
    }

    // Reset the card for reuse
    reset() {
        this.isCorrect = false;
        this.answered = false;
        this.hasUserInput = false;
        this.removeAttribute('answered');
        
        const correctAnswer = this.shadowRoot.getElementById('correctAnswer');
        const explanationSection = this.shadowRoot.getElementById('explanationSection');
        const visualFeedback = this.shadowRoot.getElementById('visualFeedback');
        const showAnswerBtn = this.shadowRoot.getElementById('showAnswerBtn');
        const nextBtn = this.shadowRoot.getElementById('nextBtn');
        const answerSection = this.shadowRoot.getElementById('answerSection');
        
        correctAnswer.classList.remove('show', 'correct', 'incorrect', 'neutral');
        explanationSection.classList.remove('show');
        visualFeedback.classList.remove('show', 'correct', 'incorrect');
        
        showAnswerBtn.style.display = 'block';
        nextBtn.style.display = 'none';
        
        answerSection.classList.remove('has-wrong-answers', 'highlight-correct');
        
        // Re-enable inputs
        this.enableInputs();
        
        // Clear any wrong answer indicators
        this.querySelectorAll('.quiz-wrong-answer, .correct-choice').forEach(el => {
            el.classList.remove('quiz-wrong-answer', 'correct-choice');
        });
    }
}

customElements.define('quiz-card', QuizCard);