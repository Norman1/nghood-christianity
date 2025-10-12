import { loadTemplate, createLoadingElement } from '../utils/template-loader.js';

const OSIS_NAMESPACE = 'http://www.bibletechnologies.net/2003/OSIS/namespace';

const BOOK_ORDER = [
    'Gen', 'Exod', 'Lev', 'Num', 'Deut',
    'Josh', 'Judg', 'Ruth', '1Sam', '2Sam',
    '1Kgs', '2Kgs', '1Chr', '2Chr', 'Ezra',
    'Neh', 'Esth', 'Job', 'Ps', 'Prov',
    'Eccl', 'Song', 'Isa', 'Jer', 'Lam',
    'Ezek', 'Dan', 'Hos', 'Joel', 'Amos',
    'Obad', 'Jonah', 'Mic', 'Nah', 'Hab',
    'Zeph', 'Hag', 'Zech', 'Mal', 'Matt',
    'Mark', 'Luke', 'John', 'Acts', 'Rom',
    '1Cor', '2Cor', 'Gal', 'Eph', 'Phil',
    'Col', '1Thess', '2Thess', '1Tim', '2Tim',
    'Titus', 'Phlm', 'Heb', 'Jas', '1Pet',
    '2Pet', '1John', '2John', '3John', 'Jude',
    'Rev'
];

const BOOK_NAME_MAP = new Map([
    ['Gen', 'Genesis'],
    ['Exod', 'Exodus'],
    ['Lev', 'Leviticus'],
    ['Num', 'Numbers'],
    ['Deut', 'Deuteronomy'],
    ['Josh', 'Joshua'],
    ['Judg', 'Judges'],
    ['Ruth', 'Ruth'],
    ['1Sam', '1 Samuel'],
    ['2Sam', '2 Samuel'],
    ['1Kgs', '1 Kings'],
    ['2Kgs', '2 Kings'],
    ['1Chr', '1 Chronicles'],
    ['2Chr', '2 Chronicles'],
    ['Ezra', 'Ezra'],
    ['Neh', 'Nehemiah'],
    ['Esth', 'Esther'],
    ['Job', 'Job'],
    ['Ps', 'Psalms'],
    ['Prov', 'Proverbs'],
    ['Eccl', 'Ecclesiastes'],
    ['Song', 'Song of Solomon'],
    ['Isa', 'Isaiah'],
    ['Jer', 'Jeremiah'],
    ['Lam', 'Lamentations'],
    ['Ezek', 'Ezekiel'],
    ['Dan', 'Daniel'],
    ['Hos', 'Hosea'],
    ['Joel', 'Joel'],
    ['Amos', 'Amos'],
    ['Obad', 'Obadiah'],
    ['Jonah', 'Jonah'],
    ['Mic', 'Micah'],
    ['Nah', 'Nahum'],
    ['Hab', 'Habakkuk'],
    ['Zeph', 'Zephaniah'],
    ['Hag', 'Haggai'],
    ['Zech', 'Zechariah'],
    ['Mal', 'Malachi'],
    ['Matt', 'Matthew'],
    ['Mark', 'Mark'],
    ['Luke', 'Luke'],
    ['John', 'John'],
    ['Acts', 'Acts'],
    ['Rom', 'Romans'],
    ['1Cor', '1 Corinthians'],
    ['2Cor', '2 Corinthians'],
    ['Gal', 'Galatians'],
    ['Eph', 'Ephesians'],
    ['Phil', 'Philippians'],
    ['Col', 'Colossians'],
    ['1Thess', '1 Thessalonians'],
    ['2Thess', '2 Thessalonians'],
    ['1Tim', '1 Timothy'],
    ['2Tim', '2 Timothy'],
    ['Titus', 'Titus'],
    ['Phlm', 'Philemon'],
    ['Heb', 'Hebrews'],
    ['Jas', 'James'],
    ['1Pet', '1 Peter'],
    ['2Pet', '2 Peter'],
    ['1John', '1 John'],
    ['2John', '2 John'],
    ['3John', '3 John'],
    ['Jude', 'Jude'],
    ['Rev', 'Revelation']
]);

class PlainMeaningBiblePage extends HTMLElement {
    async connectedCallback() {
        const layout = document.querySelector('main-layout');
        layout?.removeAttribute('with-right');
        layout?.querySelectorAll('[slot="right"]').forEach((el) => el.remove());

        this.innerHTML = '';
        this.appendChild(createLoadingElement());

        try {
            const template = await loadTemplate('./templates/plain-meaning-bible.html');
            this.innerHTML = template;
            this.cacheElements();
            this.currentBookId = null;
            this.currentChapter = null;
            this.currentSelection = null;
            this.attachEventListeners();
            await this.loadBible();
        } catch (error) {
            console.error('Error loading Plain Meaning Bible template:', error);
            this.innerHTML = `
                <div class="callout callout-error">
                    <strong>Load Error:</strong>
                    <p>We could not load the Plain Meaning Bible workspace. ${error.message || 'Unexpected error.'}</p>
                </div>
            `;
        }
    }

    cacheElements() {
        this.bookSelect = this.querySelector('#bible-book-select');
        this.chapterSelect = this.querySelector('#bible-chapter-select');
        this.prevButton = this.querySelector('#bible-prev-chapter');
        this.nextButton = this.querySelector('#bible-next-chapter');
        this.loadingNotice = this.querySelector('#bible-loading');
        this.errorNotice = this.querySelector('#bible-error');
        this.chapterContainer = this.querySelector('#bible-chapter');
        this.chapterHeader = this.querySelector('.bible-chapter-header');
        this.introductionContainer = this.querySelector('#bible-introduction');
        this.chapterHeading = this.querySelector('#bible-chapter-heading');
        this.chapterContent = this.querySelector('#bible-chapter-content');
    }

    attachEventListeners() {
        this.bookSelect?.addEventListener('change', () => this.handleBookChange());
        this.chapterSelect?.addEventListener('change', () => this.handleChapterChange());
        this.prevButton?.addEventListener('click', () => this.navigateByOffset(-1));
        this.nextButton?.addEventListener('click', () => this.navigateByOffset(1));
    }

    async loadBible() {
        this.showLoading(true);
        this.setError(null);

        try {
            const response = await fetch('./bible-data/web.xml', { cache: 'no-cache' });
            if (!response.ok) {
                throw new Error(`Failed to load OSIS source (HTTP ${response.status})`);
            }

            const xmlText = await response.text();
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
            const parseError = xmlDoc.querySelector('parsererror');
            if (parseError) {
                throw new Error(parseError.textContent || 'Unable to parse OSIS XML.');
            }

            this.osisDocument = xmlDoc;
            this.buildBookIndex();

            if (!this.books.length) {
                throw new Error('No books were found in the OSIS document.');
            }

            const { bookId, selection } = this.resolveInitialSelection();
            const initialBook = this.bookMap.get(bookId) ?? this.books[0];
            this.populateBookSelect(initialBook.osisID);
            const selectedValue = this.populateChapterSelect(initialBook, selection);
            this.renderChapter(initialBook.osisID, selectedValue);
        } catch (error) {
            console.error('Plain Meaning Bible load error:', error);
            this.setError(error.message || 'Unable to load the World English Bible.');
        } finally {
            this.showLoading(false);
        }
    }

    buildBookIndex() {
        const orderMap = new Map(BOOK_ORDER.map((id, index) => [id, index]));

        const osisText =
            this.osisDocument.getElementsByTagNameNS(OSIS_NAMESPACE, 'osisText')[0] ??
            this.osisDocument.querySelector('osisText');
        if (!osisText) {
            this.books = [];
            this.bookMap = new Map();
            return;
        }

        const bookNodes = Array.from(osisText.children).filter(
            (el) => el.localName === 'div' && el.getAttribute('type') === 'book'
        );

        const books = bookNodes
            .map((node, index) => {
                const osisID = node.getAttribute('osisID');
                const chapterNodes = Array.from(node.children).filter((child) => child.localName === 'chapter');
                return {
                    osisID,
                    title: BOOK_NAME_MAP.get(osisID) ?? osisID,
                    chapterCount: chapterNodes.length,
                    node,
                    order: orderMap.has(osisID) ? orderMap.get(osisID) : BOOK_ORDER.length + index
                };
            })
            .filter((book) => book.osisID && book.chapterCount > 0)
            .sort((a, b) => a.order - b.order);

        this.books = books;
        this.bookMap = new Map(books.map((book) => [book.osisID, book]));
    }

    bookHasIntroduction(book) {
        if (!book || !book.node) {
            return false;
        }
        return Array.from(book.node.children).some(
            (child) => child.localName === 'div' && child.getAttribute('type') === 'introduction'
        );
    }

    populateBookSelect(selectedId) {
        if (!this.bookSelect) {
            return;
        }
        this.bookSelect.innerHTML = '';
        this.books.forEach((book) => {
            const option = document.createElement('option');
            option.value = book.osisID;
            option.textContent = book.title;
            this.bookSelect.appendChild(option);
        });
        const validId = this.bookMap.has(selectedId) ? selectedId : this.books[0].osisID;
        this.bookSelect.value = validId;
    }

    populateChapterSelect(book, desiredSelection) {
        if (!this.chapterSelect) {
            if (desiredSelection === '__intro') {
                return '__intro';
            }
            return 1;
        }

        const hasIntroduction = this.bookHasIntroduction(book);
        this.chapterSelect.innerHTML = '';

        if (hasIntroduction) {
            const introOption = document.createElement('option');
            introOption.value = '__intro';
            introOption.textContent = 'Overview';
            this.chapterSelect.appendChild(introOption);
        }

        for (let i = 1; i <= book.chapterCount; i += 1) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i);
            this.chapterSelect.appendChild(option);
        }

        let selection = desiredSelection;

        if (selection === undefined) {
            selection = hasIntroduction ? '__intro' : 1;
        }

        if (selection === '__intro' && !hasIntroduction) {
            selection = 1;
        }

        let normalizedChapter = 1;

        if (selection !== '__intro') {
            const numericSelection = Number.parseInt(selection, 10);
            normalizedChapter = Number.isNaN(numericSelection)
                ? 1
                : Math.min(Math.max(numericSelection, 1), book.chapterCount);
            selection = normalizedChapter;
        }

        if (selection === '__intro') {
            this.chapterSelect.value = '__intro';
            return '__intro';
        }

        this.chapterSelect.value = String(normalizedChapter);
        return normalizedChapter;
    }

    handleBookChange() {
        if (!this.bookSelect) {
            return;
        }
        const selectedBook = this.bookMap.get(this.bookSelect.value);
        if (!selectedBook) {
            return;
        }
        const selection = this.populateChapterSelect(selectedBook);
        this.renderChapter(selectedBook.osisID, selection);
    }

    handleChapterChange() {
        if (!this.chapterSelect || !this.currentBookId) {
            return;
        }
        const selectedValue = this.chapterSelect.value;
        const selection = selectedValue === '__intro' ? '__intro' : Number.parseInt(selectedValue, 10);
        if (selectedValue !== '__intro' && Number.isNaN(selection)) {
            return;
        }
        this.renderChapter(this.currentBookId, selection);
    }

    navigateByOffset(offset) {
        if (!this.currentBookId || !this.chapterSelect) {
            return;
        }

        const currentIndex = this.books.findIndex((book) => book.osisID === this.currentBookId);
        if (currentIndex === -1) {
            return;
        }

        const currentBook = this.books[currentIndex];

        if (this.currentSelection === '__intro') {
            if (offset > 0 && currentBook.chapterCount > 0) {
                this.chapterSelect.value = '1';
                this.renderChapter(currentBook.osisID, 1);
            }
            return;
        }

        if (typeof this.currentChapter !== 'number') {
            return;
        }

        let targetBook = currentBook;
        let targetChapter = this.currentChapter + offset;

        if (targetChapter < 1) {
            if (currentIndex === 0) {
                return;
            }
            targetBook = this.books[currentIndex - 1];
            targetChapter = targetBook.chapterCount;
        } else if (targetChapter > currentBook.chapterCount) {
            if (currentIndex === this.books.length - 1) {
                return;
            }
            targetBook = this.books[currentIndex + 1];
            targetChapter = 1;
        }

        if (targetBook.osisID !== currentBook.osisID) {
            this.bookSelect.value = targetBook.osisID;
            const chapter = this.populateChapterSelect(targetBook, targetChapter);
            this.renderChapter(targetBook.osisID, chapter);
            return;
        }

        this.chapterSelect.value = String(targetChapter);
        this.renderChapter(targetBook.osisID, targetChapter);
    }

    renderChapter(bookId, selection) {
        if (!this.chapterHeading || !this.chapterContent || !this.chapterContainer) {
            return;
        }
        const book = this.bookMap.get(bookId);
        if (!book) {
            this.setError('Selected book is not available in the World English Bible source.');
            return;
        }

        const hasIntroduction = this.bookHasIntroduction(book);

        if (selection === '__intro') {
            if (!hasIntroduction) {
                this.renderChapter(bookId, 1);
                return;
            }
            if (this.chapterSelect) {
                this.chapterSelect.value = '__intro';
            }
            if (this.chapterHeader) {
                this.chapterHeader.hidden = true;
            }
            if (this.chapterHeading) {
                this.chapterHeading.textContent = '';
            }
            this.renderIntroductionBlock(book, true);
            this.chapterContent.innerHTML = '';
            this.chapterContainer.hidden = false;
            this.currentBookId = book.osisID;
            this.currentSelection = '__intro';
            this.currentChapter = null;
            this.setError(null);
            this.updateNavigationState(book, true);
            this.updateUrl(book.osisID, '__intro');
            return;
        }

        const numericSelection = Number.parseInt(selection, 10);
        const safeChapter = Number.isNaN(numericSelection)
            ? 1
            : Math.min(Math.max(numericSelection, 1), book.chapterCount);

        this.renderIntroductionBlock(book, false);
        if (this.chapterHeader) {
            this.chapterHeader.hidden = false;
        }

        const chapterElement = this.getChapterElement(book, safeChapter);
        if (!chapterElement) {
            this.setError(`Chapter ${safeChapter} could not be located for ${book.title}.`);
            return;
        }

        if (this.bookSelect) {
            this.bookSelect.value = book.osisID;
        }
        if (this.chapterSelect) {
            this.chapterSelect.value = String(safeChapter);
        }

        this.chapterHeading.textContent = `${book.title} ${safeChapter}`;
        this.chapterContent.innerHTML = '';

        const verses = Array.from(chapterElement.children).filter((node) => node.localName === 'verse');
        if (!verses.length) {
            const empty = document.createElement('p');
            empty.textContent = 'This chapter does not contain any verses in the current data set.';
            this.chapterContent.appendChild(empty);
        } else {
            const fragment = document.createDocumentFragment();
            verses.forEach((verseNode) => fragment.appendChild(this.createVerseElement(verseNode)));
            this.chapterContent.appendChild(fragment);
        }

        this.chapterContainer.hidden = false;
        this.currentBookId = book.osisID;
        this.currentSelection = safeChapter;
        this.currentChapter = safeChapter;
        this.setError(null);
        this.updateNavigationState(book, false);
        this.updateUrl(book.osisID, safeChapter);
    }

    renderIntroductionBlock(book, show) {
        if (!this.introductionContainer) {
            return;
        }

        const introductionElement = Array.from(book.node.children).find(
            (child) => child.localName === 'div' && child.getAttribute('type') === 'introduction'
        );

        if (!introductionElement || !show) {
            this.introductionContainer.hidden = true;
            this.introductionContainer.innerHTML = '';
            return;
        }

        const block = document.createElement('div');
        block.classList.add('osis-block', 'osis-div');
        block.setAttribute('data-osis-element', 'div');
        block.setAttribute('data-osis-type', 'introduction');

        Array.from(introductionElement.childNodes).forEach((node) => {
            block.appendChild(node.cloneNode(true));
        });

        this.introductionContainer.innerHTML = '';
        this.introductionContainer.appendChild(block);
        this.introductionContainer.hidden = false;
    }

    getChapterElement(book, chapterNumber) {
        const desiredId = `${book.osisID}.${chapterNumber}`;
        return Array.from(book.node.children).find(
            (child) => child.localName === 'chapter' && child.getAttribute('osisID') === desiredId
        );
    }

    createVerseElement(verseNode) {
        const osisID = verseNode.getAttribute('osisID') || '';
        const verseNumber = this.extractVerseNumber(osisID);

        const wrapper = document.createElement('div');
        wrapper.classList.add('bible-verse');
        wrapper.dataset.osisId = osisID;

        const number = document.createElement('span');
        number.classList.add('bible-verse-number');
        number.textContent = verseNumber;

        const text = document.createElement('span');
        text.classList.add('bible-verse-text');
        Array.from(verseNode.childNodes).forEach((node) => {
            text.appendChild(node.cloneNode(true));
        });

        wrapper.appendChild(number);
        wrapper.appendChild(text);
        return wrapper;
    }

    extractVerseNumber(osisID) {
        if (!osisID) {
            return '';
        }
        const segments = osisID.split('.');
        const finalSegment = segments[segments.length - 1] || '';
        return finalSegment.replace(/^0+/, '');
    }

    updateNavigationState(currentBook, isOverview) {
        if (!this.prevButton || !this.nextButton) {
            return;
        }

        const bookIndex = this.books.findIndex((book) => book.osisID === currentBook?.osisID);
        if (bookIndex === -1) {
            this.prevButton.disabled = true;
            this.nextButton.disabled = true;
            return;
        }

        if (isOverview) {
            this.prevButton.disabled = true;
            this.nextButton.disabled = currentBook.chapterCount === 0;
            return;
        }

        if (typeof this.currentChapter !== 'number') {
            this.prevButton.disabled = true;
            this.nextButton.disabled = true;
            return;
        }

        const isFirstBook = bookIndex === 0;
        const isLastBook = bookIndex === this.books.length - 1;

        this.prevButton.disabled = isFirstBook && this.currentChapter <= 1;
        this.nextButton.disabled = isLastBook && this.currentChapter >= currentBook.chapterCount;
    }

    resolveInitialSelection() {
        const url = new URL(window.location.href);
        const bookId = url.searchParams.get('book');
        if (url.searchParams.get('section') === 'intro') {
            return { bookId, selection: '__intro' };
        }
        const chapter = Number.parseInt(url.searchParams.get('chapter') || '1', 10) || 1;
        return { bookId, selection: chapter };
    }

    updateUrl(bookId, chapterNumber) {
        const url = new URL(window.location.href);
        url.searchParams.set('book', bookId);
        if (chapterNumber === '__intro') {
            url.searchParams.set('section', 'intro');
            url.searchParams.delete('chapter');
        } else {
            url.searchParams.set('chapter', String(chapterNumber));
            url.searchParams.delete('section');
        }
        window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
    }

    showLoading(show) {
        if (!this.loadingNotice) {
            return;
        }
        this.loadingNotice.hidden = !show;
    }

    setError(message) {
        if (!this.errorNotice) {
            return;
        }
        if (!message) {
            this.errorNotice.hidden = true;
            this.errorNotice.textContent = '';
            return;
        }
        this.errorNotice.hidden = false;
        this.errorNotice.textContent = message;
    }
}

customElements.define('plain-meaning-bible-page', PlainMeaningBiblePage);

