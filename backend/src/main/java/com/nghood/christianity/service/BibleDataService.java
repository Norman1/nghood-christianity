package com.nghood.christianity.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nghood.christianity.model.BibleChapter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Slf4j
public class BibleDataService {

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // Bible data structure: Book -> Chapter -> Verse -> Text
    private final Map<String, Map<Integer, Map<Integer, String>>> bibleData = new ConcurrentHashMap<>();
    
    // List of all available books
    private final List<String> availableBooks = new ArrayList<>();

    @PostConstruct
    public void loadBibleData() {
        log.info("Loading World English Bible data into memory...");
        long startTime = System.currentTimeMillis();
        
        // Load all Bible books
        String[] bookFiles = {
            "genesis", "exodus", "leviticus", "numbers", "deuteronomy",
            "joshua", "judges", "ruth", "1samuel", "2samuel", "1kings", "2kings",
            "1chronicles", "2chronicles", "ezra", "nehemiah", "esther", "job",
            "psalms", "proverbs", "ecclesiastes", "songofsolomon", "isaiah",
            "jeremiah", "lamentations", "ezekiel", "daniel", "hosea", "joel",
            "amos", "obadiah", "jonah", "micah", "nahum", "habakkuk", "zephaniah",
            "haggai", "zechariah", "malachi",
            "matthew", "mark", "luke", "john", "acts", "romans", "1corinthians",
            "2corinthians", "galatians", "ephesians", "philippians", "colossians",
            "1thessalonians", "2thessalonians", "1timothy", "2timothy", "titus",
            "philemon", "hebrews", "james", "1peter", "2peter", "1john", "2john",
            "3john", "jude", "revelation"
        };

        Map<String, String> fileToBookName = createFileToBookNameMapping();

        for (String fileName : bookFiles) {
            try {
                loadBook(fileName, fileToBookName.get(fileName));
            } catch (Exception e) {
                log.error("Failed to load book: {}", fileName, e);
            }
        }

        long endTime = System.currentTimeMillis();
        log.info("Loaded {} Bible books into memory in {}ms. Total verses: {}",
                availableBooks.size(), (endTime - startTime), getTotalVerseCount());
    }

    private Map<String, String> createFileToBookNameMapping() {
        Map<String, String> mapping = new HashMap<>();
        mapping.put("genesis", "Genesis");
        mapping.put("exodus", "Exodus");
        mapping.put("leviticus", "Leviticus");
        mapping.put("numbers", "Numbers");
        mapping.put("deuteronomy", "Deuteronomy");
        mapping.put("joshua", "Joshua");
        mapping.put("judges", "Judges");
        mapping.put("ruth", "Ruth");
        mapping.put("1samuel", "1 Samuel");
        mapping.put("2samuel", "2 Samuel");
        mapping.put("1kings", "1 Kings");
        mapping.put("2kings", "2 Kings");
        mapping.put("1chronicles", "1 Chronicles");
        mapping.put("2chronicles", "2 Chronicles");
        mapping.put("ezra", "Ezra");
        mapping.put("nehemiah", "Nehemiah");
        mapping.put("esther", "Esther");
        mapping.put("job", "Job");
        mapping.put("psalms", "Psalms");
        mapping.put("proverbs", "Proverbs");
        mapping.put("ecclesiastes", "Ecclesiastes");
        mapping.put("songofsolomon", "Song of Solomon");
        mapping.put("isaiah", "Isaiah");
        mapping.put("jeremiah", "Jeremiah");
        mapping.put("lamentations", "Lamentations");
        mapping.put("ezekiel", "Ezekiel");
        mapping.put("daniel", "Daniel");
        mapping.put("hosea", "Hosea");
        mapping.put("joel", "Joel");
        mapping.put("amos", "Amos");
        mapping.put("obadiah", "Obadiah");
        mapping.put("jonah", "Jonah");
        mapping.put("micah", "Micah");
        mapping.put("nahum", "Nahum");
        mapping.put("habakkuk", "Habakkuk");
        mapping.put("zephaniah", "Zephaniah");
        mapping.put("haggai", "Haggai");
        mapping.put("zechariah", "Zechariah");
        mapping.put("malachi", "Malachi");
        mapping.put("matthew", "Matthew");
        mapping.put("mark", "Mark");
        mapping.put("luke", "Luke");
        mapping.put("john", "John");
        mapping.put("acts", "Acts");
        mapping.put("romans", "Romans");
        mapping.put("1corinthians", "1 Corinthians");
        mapping.put("2corinthians", "2 Corinthians");
        mapping.put("galatians", "Galatians");
        mapping.put("ephesians", "Ephesians");
        mapping.put("philippians", "Philippians");
        mapping.put("colossians", "Colossians");
        mapping.put("1thessalonians", "1 Thessalonians");
        mapping.put("2thessalonians", "2 Thessalonians");
        mapping.put("1timothy", "1 Timothy");
        mapping.put("2timothy", "2 Timothy");
        mapping.put("titus", "Titus");
        mapping.put("philemon", "Philemon");
        mapping.put("hebrews", "Hebrews");
        mapping.put("james", "James");
        mapping.put("1peter", "1 Peter");
        mapping.put("2peter", "2 Peter");
        mapping.put("1john", "1 John");
        mapping.put("2john", "2 John");
        mapping.put("3john", "3 John");
        mapping.put("jude", "Jude");
        mapping.put("revelation", "Revelation");
        return mapping;
    }

    private void loadBook(String fileName, String bookName) throws IOException {
        String resourcePath = "/data/bible/" + fileName + ".json";
        
        try (InputStream inputStream = getClass().getResourceAsStream(resourcePath)) {
            if (inputStream == null) {
                throw new IOException("Resource not found: " + resourcePath);
            }

            List<JsonNode> bookData = objectMapper.readValue(inputStream, new TypeReference<List<JsonNode>>() {});
            
            Map<Integer, Map<Integer, String>> chapters = new HashMap<>();
            
            for (JsonNode item : bookData) {
                if ("paragraph text".equals(item.get("type").asText())) {
                    int chapterNumber = item.get("chapterNumber").asInt();
                    int verseNumber = item.get("verseNumber").asInt();
                    String text = item.get("value").asText().trim();
                    
                    chapters.computeIfAbsent(chapterNumber, k -> new HashMap<>())
                            .put(verseNumber, text);
                }
            }
            
            if (!chapters.isEmpty()) {
                bibleData.put(bookName, chapters);
                availableBooks.add(bookName);
                log.debug("Loaded {} with {} chapters", bookName, chapters.size());
            }
        }
    }

    public List<String> getAvailableBooks() {
        return new ArrayList<>(availableBooks);
    }

    public BibleChapter getChapter(String book, int chapter) {
        Map<Integer, Map<Integer, String>> bookData = bibleData.get(book);
        if (bookData == null) {
            return null;
        }
        
        Map<Integer, String> chapterData = bookData.get(chapter);
        if (chapterData == null) {
            return null;
        }
        
        return new BibleChapter(book, chapter, chapterData);
    }

    public String getVerse(String book, int chapter, int verse) {
        BibleChapter chapterData = getChapter(book, chapter);
        return chapterData != null ? chapterData.getVerse(verse) : null;
    }

    public List<Integer> getChaptersForBook(String book) {
        Map<Integer, Map<Integer, String>> bookData = bibleData.get(book);
        if (bookData == null) {
            return Collections.emptyList();
        }
        return new ArrayList<>(bookData.keySet());
    }

    public boolean hasBook(String book) {
        return bibleData.containsKey(book);
    }

    private long getTotalVerseCount() {
        return bibleData.values().stream()
                .flatMap(chapters -> chapters.values().stream())
                .mapToLong(verses -> verses.size())
                .sum();
    }
}