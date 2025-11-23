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

// Numbers that are "cool" if they appear exactly
const EXACT_MATCH_TARGETS = [
    7, 12, 40, 70, 120, 144, 153, 365, 666, 777, 888, 1000, 144000
];

// Divisors we care about (finding multiples of these)
const DIVINE_DIVISORS = [7, 153, 666];

function loadBible() {
    const bible = [];
    for (const filename of BOOKS_ORDER) {
        const fullPath = path.join(BIBLE_DIR, `${filename}.json`);
        if (!fs.existsSync(fullPath)) {
            console.error(`Missing file: ${filename}`);
            continue;
        }
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

function tokenize(text) {
    return text.toLowerCase()
        .replace(/['’]/g, '') 
        .replace(/[.,;:\"?!()\[\]]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 0);
}

function getPhrases(tokens, n) {
    const phrases = [];
    if (tokens.length < n) return phrases;
    for (let i = 0; i <= tokens.length - n; i++) {
        phrases.push(tokens.slice(i, i + n).join(' '));
    }
    return phrases;
}

function analyzeSubset(subsetName, verses) {
    console.log(`\n--- Analyzing Subset: ${subsetName} (${verses.length} verses) ---`);
    
    const wordCounts = {};
    const phrase2Counts = {};
    const phrase3Counts = {};

    let totalWords = 0;

    // Pass 1: Count everything
    for (const v of verses) {
        const tokens = tokenize(v.text);
        totalWords += tokens.length;
        
        for (const t of tokens) {
            wordCounts[t] = (wordCounts[t] || 0) + 1;
        }
        
        const p2 = getPhrases(tokens, 2);
        for (const p of p2) phrase2Counts[p] = (phrase2Counts[p] || 0) + 1;

        const p3 = getPhrases(tokens, 3);
        for (const p of p3) phrase3Counts[p] = (phrase3Counts[p] || 0) + 1;
    }

    // Check Totals
    checkAndPrint(subsetName, "TOTAL_WORDS", totalWords);
    checkAndPrint(subsetName, "TOTAL_VERSES", verses.length);

    // Pass 2: Check Words
    // Sort by frequency to group output somewhat? No, streaming is better.
    // But we want to filter out boring stuff.
    const boringWords = ['the', 'and', 'of', 'to', 'in', 'a', 'that', 'he', 'it', 'was', 'for', 'is', 'his', 'as', 'with', 'not', 'they', 'be', 'on', 'from'];

    Object.entries(wordCounts).forEach(([word, count]) => {
        if (boringWords.includes(word)) return;
        if (count < 7) return; // Ignore very rare words unless they are exact matches for 7
        checkAndPrint(subsetName, `Word[${word}]`, count);
    });

    // Pass 3: Check Phrases (2-grams)
    Object.entries(phrase2Counts).forEach(([phrase, count]) => {
        if (count < 7) return;
        checkAndPrint(subsetName, `Phrase[${phrase}]`, count);
    });
    
     // Pass 4: Check Phrases (3-grams)
    Object.entries(phrase3Counts).forEach(([phrase, count]) => {
        if (count < 3) return; // Lower threshold for 3-grams
        checkAndPrint(subsetName, `Phrase[${phrase}]`, count);
    });
}

function checkAndPrint(context, label, value) {
    // Exact Match
    if (EXACT_MATCH_TARGETS.includes(value)) {
        console.log(`[!!! EXACT MATCH !!!] ${context} | ${label}: ${value}`);
        return; // Prioritize exact match
    }

    // Divisors
    for (const div of DIVINE_DIVISORS) {
        if (value > 0 && value % div === 0) {
            // Filter out boring divisions: e.g. divisible by 7 is common.
            // Only print if it's somewhat rare or significant.
            // For 7: Only if count > 20 to filter trivial "7" or "14".
            if (div === 7 && value < 21) continue; 
            
            console.log(`[Divisible by ${div}] ${context} | ${label}: ${value} (${div} x ${value/div})`);
        }
    }
}

function main() {
    console.log("Loading Bible Data...");
    const bible = loadBible();
    
    const allVerses = bible.flatMap(b => b.verses);
    const otVerses = bible.slice(0, 39).flatMap(b => b.verses);
    const ntVerses = bible.slice(39).flatMap(b => b.verses);
    const gospels = bible.slice(39, 43).flatMap(b => b.verses);
    const revelation = bible.slice(65, 66).flatMap(b => b.verses);
    const pentateuch = bible.slice(0, 5).flatMap(b => b.verses);
    const johnsWritings = [
        ...bible.find(b => b.name === 'john').verses,
        ...bible.find(b => b.name === '1john').verses,
        ...bible.find(b => b.name === '2john').verses,
        ...bible.find(b => b.name === '3john').verses,
        ...bible.find(b => b.name === 'revelation').verses
    ];

    // Subsets to run
    const subsets = [
        { name: "REVELATION", data: revelation },
        { name: "GOSPELS", data: gospels },
        { name: "JOHN_WRITINGS", data: johnsWritings },
        { name: "NEW_TESTAMENT", data: ntVerses },
        { name: "OLD_TESTAMENT", data: otVerses },
        // { name: "WHOLE_BIBLE", data: allVerses } // Too noisy for console, maybe run last?
    ];

    console.log("Starting Deep Grind...");
    
    for (const sub of subsets) {
        analyzeSubset(sub.name, sub.data);
    }
    
    console.log("\n--- Deep Grind Complete ---");
}

main();