const fs = require('fs');
const path = require('path');

const BIBLE_DIR = path.join(__dirname, '../backend/src/main/resources/data/bible');

// Canonical order is important for "First X books", "Last X books" logic.
// I'll infer it from a standard list or just read directory (alphabetical is bad, but for frequency it doesn't matter).
// To be precise, let's use a hardcoded list of filenames to ensure OT/NT split is correct.
const BOOKS_ORDER = [
    // Pentateuch
    "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
    // History
    "joshua", "judges", "ruth", "1samuel", "2samuel", "1kings", "2kings", "1chronicles", "2chronicles", "ezra", "nehemiah", "esther",
    // Poetry
    "job", "psalms", "proverbs", "ecclesiastes", "songofsolomon",
    // Major Prophets
    "isaiah", "jeremiah", "lamentations", "ezekiel", "daniel",
    // Minor Prophets
    "hosea", "joel", "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah", "haggai", "zechariah", "malachi",
    // NT Gospels
    "matthew", "mark", "luke", "john",
    // History
    "acts",
    // Paul's Epistles
    "romans", "1corinthians", "2corinthians", "galatians", "ephesians", "philippians", "colossians", "1thessalonians", "2thessalonians", "1timothy", "2timothy", "titus", "philemon",
    // General Epistles
    "hebrews", "james", "1peter", "2peter", "1john", "2john", "3john", "jude",
    // Prophecy
    "revelation"
];

const MAGIC_NUMBERS = [
    7, 12, 21, 40, 70, 77, 120, 144, 153, 365, 666, 777, 888, 1000, 144000
];

const HOLY_WORDS = [
    "God", "Lord", "Jesus", "Christ", "Spirit", "Father", "Son", "Holy", 
    "Love", "Light", "Life", "Faith", "Grace", "Truth", "Word", "Lamb", 
    "King", "Kingdom", "Heaven", "Cross", "Blood", "Saved", "Salvation",
    "Gospel", "Church", "Israel", "Jerusalem", "Temple", "Pray", "Prayer",
    "Sin", "Death", "Hell", "Devil", "Satan", "Beast", "Dragon"
];

function loadBible() {
    const bible = [];
    for (const filename of BOOKS_ORDER) {
        const fullPath = path.join(BIBLE_DIR, `${filename}.json`);
        if (!fs.existsSync(fullPath)) {
            console.error(`Missing file: ${filename}`);
            continue;
        }
        const content = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        
        // Extract verses
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
    // "Grinding" Trick: Simple regex.
    // Remove punctuation, lowercase.
    return text.toLowerCase()
        .replace(/['’]/g, '') // Remove apostrophes (God's -> gods) - debatable, but standard for counts
        .replace(/[.,;:"?!()[\]]/g, ' ') // Replace punct with space
        .split(/\s+/)
        .filter(w => w.length > 0);
}

function analyzeSubset(subsetName, verses) {
    let wordCounts = {};
    let totalWords = 0;
    let totalVerses = verses.length;
    let totalChars = 0;

    for (const v of verses) {
        const tokens = tokenize(v.text);
        totalWords += tokens.length;
        totalChars += v.text.length;
        
        for (const t of tokens) {
            wordCounts[t] = (wordCounts[t] || 0) + 1;
        }
    }

    const findings = [];

    // Check total words/verses for magic
    checkMagic(findings, subsetName, "Total Verses", totalVerses);
    checkMagic(findings, subsetName, "Total Words", totalWords);
    checkMagic(findings, subsetName, "Total Characters", totalChars);

    // Check Holy Words
    for (const word of HOLY_WORDS) {
        const key = word.toLowerCase();
        const count = wordCounts[key] || 0;
        checkMagic(findings, subsetName, `Word count: "${word}"`, count);
    }

    return findings;
}

function checkMagic(findings, context, label, value) {
    // 1. Exact Match
    if (MAGIC_NUMBERS.includes(value)) {
        findings.push(`[EXACT MATCH] ${context} - ${label}: ${value}`);
    }

    // 2. Divisible by 7 (The "heptadic structure")
    if (value > 0 && value % 7 === 0) {
        findings.push(`[DIVISIBLE BY 7] ${context} - ${label}: ${value} (7 x ${value/7})`);
    }

    // 3. Divisible by 153 (Fish)
    if (value > 0 && value % 153 === 0) {
        findings.push(`[DIVISIBLE BY 153] ${context} - ${label}: ${value} (153 x ${value/153})`);
    }
    
    // 4. Divisible by 666 (Beast)
    if (value > 0 && value % 666 === 0) {
        findings.push(`[DIVISIBLE BY 666] ${context} - ${label}: ${value} (666 x ${value/666})`);
    }
}

function main() {
    console.log("Loading Bible Data...");
    const bible = loadBible();
    
    // Define Subsets
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

    console.log("Grinding numbers...");
    
    let hits = [];
    hits.push(...analyzeSubset("WHOLE BIBLE", allVerses));
    hits.push(...analyzeSubset("OLD TESTAMENT", otVerses));
    hits.push(...analyzeSubset("NEW TESTAMENT", ntVerses));
    hits.push(...analyzeSubset("GOSPELS", gospels));
    hits.push(...analyzeSubset("REVELATION", revelation));
    hits.push(...analyzeSubset("PENTATEUCH", pentateuch));
    hits.push(...analyzeSubset("JOHN'S WRITINGS", johnsWritings));

    // Filter for the most impressive ones (e.g., specific word counts that are exact matches or 7x)
    console.log("\n=== TOP HITS ===\n");
    hits.forEach(h => console.log(h));
}

main();
