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

            const { bookId, chapter } = this.resolveInitialSelection();
            const initialBook = this.bookMap.get(bookId) ?? this.books[0];
            this.populateBookSelect(initialBook.osisID);
            const selectedChapter = this.populateChapterSelect(initialBook, chapter);
            this.renderChapter(initialBook.osisID, selectedChapter);
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

    populateChapterSelect(book, desiredChapter = 1) {
        if (!this.chapterSelect) {
            return 1;
        }
        this.chapterSelect.innerHTML = '';
        for (let i = 1; i <= book.chapterCount; i += 1) {
            const option = document.createElement('option');
            option.value = String(i);
            option.textContent = String(i);
            this.chapterSelect.appendChild(option);
        }
        const safeChapter = Math.min(Math.max(desiredChapter, 1), book.chapterCount);
        this.chapterSelect.value = String(safeChapter);
        return safeChapter;
    }

    handleBookChange() {
        if (!this.bookSelect) {
            return;
        }
        const selectedBook = this.bookMap.get(this.bookSelect.value);
        if (!selectedBook) {
            return;
        }
        const chapter = this.populateChapterSelect(selectedBook, 1);
        this.renderChapter(selectedBook.osisID, chapter);
    }

    handleChapterChange() {
        if (!this.chapterSelect || !this.currentBookId) {
            return;
        }
        const chapterNumber = Number.parseInt(this.chapterSelect.value, 10);
        if (Number.isNaN(chapterNumber)) {
            return;
        }
        this.renderChapter(this.currentBookId, chapterNumber);
    }

    navigateByOffset(offset) {
        if (!this.currentBookId || typeof this.currentChapter !== 'number') {
            return;
        }

        const currentIndex = this.books.findIndex((book) => book.osisID === this.currentBookId);
        if (currentIndex === -1) {
            return;
        }

        const currentBook = this.books[currentIndex];
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

    renderChapter(bookId, chapterNumber) {
        if (!this.chapterHeading || !this.chapterContent || !this.chapterContainer) {
            return;
        }
        const book = this.bookMap.get(bookId);
        if (!book) {
            this.setError('Selected book is not available in the World English Bible source.');
            return;
        }

        const safeChapter = Math.min(Math.max(chapterNumber, 1), book.chapterCount);
        if (Number.isNaN(safeChapter)) {
            this.setError('The chapter number is not valid.');
            return;
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
        this.currentChapter = safeChapter;
        this.setError(null);
        this.updateNavigationState();
        this.updateUrl(book.osisID, safeChapter);
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

    updateNavigationState() {
        if (!this.prevButton || !this.nextButton || !this.currentBookId) {
            return;
        }

        const bookIndex = this.books.findIndex((book) => book.osisID === this.currentBookId);
        if (bookIndex === -1) {
            this.prevButton.disabled = true;
            this.nextButton.disabled = true;
            return;
        }

        const currentBook = this.books[bookIndex];
        const isFirstBook = bookIndex === 0;
        const isLastBook = bookIndex === this.books.length - 1;

        this.prevButton.disabled = isFirstBook && this.currentChapter <= 1;
        this.nextButton.disabled = isLastBook && this.currentChapter >= currentBook.chapterCount;
    }

    resolveInitialSelection() {
        const url = new URL(window.location.href);
        const bookId = url.searchParams.get('book');
        const chapter = Number.parseInt(url.searchParams.get('chapter') || '1', 10) || 1;
        return { bookId, chapter };
    }

    updateUrl(bookId, chapterNumber) {
        const url = new URL(window.location.href);
        url.searchParams.set('book', bookId);
        url.searchParams.set('chapter', String(chapterNumber));
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
