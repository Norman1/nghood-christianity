const fs = require('fs');
const path = require('path');

const BIBLE_DIR = path.join(__dirname, '../backend/src/main/resources/data/bible');

const BOOKS_ORDER = [
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
    "joshua", "judges", "ruth", "1samuel", "2samuel", "1kings", "2kings", "1chronicles", "2chronicles", "ezra", "nehemiah", "esther",
    "job", "psalms", "proverbs", "ecclesiastes", "songofsolomon",
    "isaiah", "jeremiah", "lamentations", "ezekiel", "daniel",
    "hosea", "joel", "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi",
    "matthew", "mark", "luke", "john",
    "acts",
    "romans", "1corinthians", "2corinthians", "galatians", "ephesians", "philippians", "colossians", "1thessalonians", "2thessalonians", "1timothy", "2timothy", "titus", "philemon",
    "hebrews", "james", "1peter", "2peter", "1john", "2john", "3john", "jude",
    "revelation"
];

const MAGIC_NUMBERS = [7, 12, 40, 70, 153, 365, 666, 777, 888, 1000, 144000];
const DIVISORS = [7, 153, 666, 888];

// 1. Load Data
function loadBible() {
    const bible = [];
    for (const filename of BOOKS_ORDER) {
        const fullPath = path.join(BIBLE_DIR, `${filename}.json`);
        if (!fs.existsSync(fullPath)) continue;
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        
        const verses = [];
        for (const item of content) {
            if (item.type === 'paragraph text') {
                verses.push({
                    book: filename,
                    chapter: item.chapterNumber,
                    verse: item.verseNumber,
                    text: item.value
                });
            }
        }
        bible.push({ name: filename, verses });
    }
    return bible;
}

// 2. Gematria Utilities
function getSimpleGematria(text) {
    // A=1, B=2... Z=26
    let sum = 0;
    const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
    for (let i = 0; i < clean.length; i++) {
        sum += clean.charCodeAt(i) - 64;
    }
    return sum;
}

function getEnglishGematria(text) {
    // A=6, B=12... Z=156
    return getSimpleGematria(text) * 6;
}

function getASCII(text) {
    let sum = 0;
    for (let i = 0; i < text.length; i++) {
        sum += text.charCodeAt(i);
    }
    return sum;
}

// 3. Analysis Logic
function check(context, label, value) {
    if (MAGIC_NUMBERS.includes(value)) {
        console.log(`[EXACT MATCH] ${context} | ${label}: ${value}`);
    }
    for (const div of DIVISORS) {
        if (value > 0 && value % div === 0) {
            // Filter noise
            if (div === 7 && value < 50) continue;
            console.log(`[Divisible by ${div}] ${context} | ${label}: ${value} (${div} x ${value/div})`);
        }
    }
}

function analyzeGematria(context, verses) {
    // Check sum of FIRST verse, LAST verse, MIDDLE verse
    if (verses.length === 0) return;

    const first = verses[0];
    const last = verses[verses.length - 1];
    const middle = verses[Math.floor(verses.length / 2)];

    const metrics = [
        { name: "First Verse Simple Gematria", val: getSimpleGematria(first.text) },
        { name: "Last Verse Simple Gematria", val: getSimpleGematria(last.text) },
        { name: "Middle Verse Simple Gematria", val: getSimpleGematria(middle.text) },
        { name: "Total Verses", val: verses.length }
    ];

    metrics.forEach(m => check(context, m.name, m.val));
}

function analyzeVocabulary(context, verses) {
    const words = new Set();
    let totalWords = 0;
    
    verses.forEach(v => {
        const tokens = v.text.toLowerCase().replace(/[^a-z\s]/g, '').split(/\s+/).filter(x => x);
        totalWords += tokens.length;
        tokens.forEach(t => words.add(t));
    });

    check(context, "Unique Vocabulary Count", words.size);
    check(context, "Total Word Count", totalWords);
}

// 4. Main
function main() {
    console.log("Loading Bible...");
    const bible = loadBible();
    const allVerses = bible.flatMap(b => b.verses);

    console.log(`Loaded ${allVerses.length} verses.`);

    // A. Whole Bible Analysis
    console.log("\n--- WHOLE BIBLE ---");
    analyzeGematria("BIBLE", allVerses);
    analyzeVocabulary("BIBLE", allVerses);

    // B. Middle Verse Calculation
    const middleIndex = Math.floor(allVerses.length / 2);
    const middleVerse = allVerses[middleIndex];
    console.log(`\n--- CENTER OF THE BIBLE ---`);
    console.log(`Verse: ${middleVerse.book} ${middleVerse.chapter}:${middleVerse.verse}`);
    console.log(`Text: "${middleVerse.text}"`);
    
    const midSimple = getSimpleGematria(middleVerse.text);
    const midEng = getEnglishGematria(middleVerse.text);
    const midAscii = getASCII(middleVerse.text);
    
    console.log(`Simple Gematria: ${midSimple}`);
    check("CENTER VERSE", "Simple Gematria", midSimple);
    check("CENTER VERSE", "English Gematria", midEng);
    check("CENTER VERSE", "ASCII Sum", midAscii);

    // C. Book-by-Book "Panin" check
    console.log("\n--- BOOK ANALYSIS (Sampling) ---");
    bible.forEach(book => {
        analyzeVocabulary(book.name.toUpperCase(), book.verses);
        analyzeGematria(book.name.toUpperCase(), book.verses);
    });

    // D. Specific "Holy" phrases Gematria
    console.log("\n--- HOLY PHRASES GEMATRIA ---");
    const phrases = ["Jesus", "Christ", "Jesus Christ", "Lord Jesus", "Holy Spirit", "God", "Lord", "Love"];
    phrases.forEach(p => {
        const s = getSimpleGematria(p);
        const e = getEnglishGematria(p);
        console.log(`"${p}" -> Simple: ${s}, English: ${e}`);
        check(`Phrase "${p}"`, "Simple", s);
        check(`Phrase "${p}"`, "English", e);
    });
}

main();
