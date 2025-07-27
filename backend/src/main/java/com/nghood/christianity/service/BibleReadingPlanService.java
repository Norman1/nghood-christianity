package com.nghood.christianity.service;

import com.nghood.christianity.model.BibleBook;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BibleReadingPlanService {

    private static final List<BibleBook> BIBLE_BOOKS = initializeBibleBooks();

    public List<BibleBook> getOrderedBibleBooks() {

        // Step 1: Get OT books sorted by size, NT books shuffled
        List<BibleBook> oldTestament = BIBLE_BOOKS.stream()
                .filter(BibleBook::isOldTestament)
                .sorted(Comparator.comparingInt(BibleBook::getWordCount))
                .collect(Collectors.toList());

        List<BibleBook> newTestament = BIBLE_BOOKS.stream()
                .filter(book -> !book.isOldTestament())
                .collect(Collectors.toList());

        Collections.shuffle(newTestament);

        // Calculate median word count of all Bible books
        List<Integer> allWordCounts = BIBLE_BOOKS.stream()
                .map(BibleBook::getWordCount)
                .sorted()
                .toList();
        int median = allWordCounts.get(allWordCounts.size() / 2);

        // Identify the 12 largest NT books (they get 2 OT books each)
        Set<BibleBook> largestNtBooks = BIBLE_BOOKS.stream()
                .filter(book -> !book.isOldTestament())
                .sorted(Comparator.comparingInt(BibleBook::getWordCount).reversed())
                .limit(12)
                .collect(Collectors.toSet());

        // Step 2: Initialize the mapping of NT to OT books
        Map<BibleBook, List<BibleBook>> ntToOtMapping = new HashMap<>();
        for (BibleBook ntBook : newTestament) {
            ntToOtMapping.put(ntBook, new ArrayList<>());
        }

        // Assign OT books using median-based algorithm
        assignOtBooksToNtBooks(oldTestament, newTestament, ntToOtMapping, median, largestNtBooks);

        // DEBUG: Calculate and print total imbalance
        int totalImbalance = 0;
        for (Map.Entry<BibleBook, List<BibleBook>> entry : ntToOtMapping.entrySet()) {
            int ntWords = entry.getKey().getWordCount();
            int otTotal = entry.getValue().stream().mapToInt(BibleBook::getWordCount).sum();
            totalImbalance += Math.abs(ntWords - otTotal);
        }


        // Shuffle NT books again before flattening for additional randomness
        Collections.shuffle(newTestament);
        
        // Flatten to final list
        return flattenToReadingOrder(newTestament, ntToOtMapping);
    }


    private void assignOtBooksToNtBooks(List<BibleBook> oldTestament, List<BibleBook> newTestament,
                                        Map<BibleBook, List<BibleBook>> ntToOtMapping, int median,
                                        Set<BibleBook> largestNtBooks) {
        // OT books are sorted by size (smallest to largest)
        // Use two pointers to assign from start (small) or end (large)
        int startIdx = 0;
        int endIdx = oldTestament.size() - 1;

        // Process each NT book in shuffled order
        for (BibleBook ntBook : newTestament) {
            if (largestNtBooks.contains(ntBook)) {
                // Large NT books get 2 OT books: 1 large + 1 small
                if (endIdx >= startIdx) {
                    // First, get a large OT book from the end
                    ntToOtMapping.get(ntBook).add(oldTestament.get(endIdx));
                    endIdx--;
                }
                if (startIdx <= endIdx) {
                    // Then, get a small OT book from the start
                    ntToOtMapping.get(ntBook).add(oldTestament.get(startIdx));
                    startIdx++;
                }
            } else {
                // Small NT books get 1 small OT book
                if (startIdx <= endIdx) {
                    ntToOtMapping.get(ntBook).add(oldTestament.get(startIdx));
                    startIdx++;
                }
            }
        }
    }


    private List<BibleBook> flattenToReadingOrder(List<BibleBook> newTestament,
                                                  Map<BibleBook, List<BibleBook>> ntToOtMapping) {
        List<BibleBook> result = new ArrayList<>();

        for (BibleBook ntBook : newTestament) {
            result.add(ntBook);
            result.addAll(ntToOtMapping.get(ntBook));
        }
        return result;
    }

    private static List<BibleBook> initializeBibleBooks() {
        List<BibleBook> books = new ArrayList<>();

        // Old Testament books with word counts
        books.add(new BibleBook("Genesis", true, 32046));
        books.add(new BibleBook("Exodus", true, 25957));
        books.add(new BibleBook("Leviticus", true, 18852));
        books.add(new BibleBook("Numbers", true, 25048));
        books.add(new BibleBook("Deuteronomy", true, 23008));
        books.add(new BibleBook("Joshua", true, 15671));
        books.add(new BibleBook("Judges", true, 15385));
        books.add(new BibleBook("Ruth", true, 2039));
        books.add(new BibleBook("1 Samuel", true, 20837));
        books.add(new BibleBook("2 Samuel", true, 17170));
        books.add(new BibleBook("1 Kings", true, 20361));
        books.add(new BibleBook("2 Kings", true, 18784));
        books.add(new BibleBook("1 Chronicles", true, 16664));
        books.add(new BibleBook("2 Chronicles", true, 21349));
        books.add(new BibleBook("Ezra", true, 5605));
        books.add(new BibleBook("Nehemiah", true, 8507));
        books.add(new BibleBook("Esther", true, 4932));
        books.add(new BibleBook("Job", true, 12674));
        books.add(new BibleBook("Psalms", true, 30147));
        books.add(new BibleBook("Proverbs", true, 9921));
        books.add(new BibleBook("Ecclesiastes", true, 4537));
        books.add(new BibleBook("Song of Solomon", true, 2020));
        books.add(new BibleBook("Isaiah", true, 25608));
        books.add(new BibleBook("Jeremiah", true, 33002));
        books.add(new BibleBook("Lamentations", true, 2324));
        books.add(new BibleBook("Ezekiel", true, 29918));
        books.add(new BibleBook("Daniel", true, 9001));
        books.add(new BibleBook("Hosea", true, 3615));
        books.add(new BibleBook("Joel", true, 1447));
        books.add(new BibleBook("Amos", true, 3027));
        books.add(new BibleBook("Obadiah", true, 440));
        books.add(new BibleBook("Jonah", true, 1082));
        books.add(new BibleBook("Micah", true, 2118));
        books.add(new BibleBook("Nahum", true, 855));
        books.add(new BibleBook("Habakkuk", true, 1011));
        books.add(new BibleBook("Zephaniah", true, 1141));
        books.add(new BibleBook("Haggai", true, 926));
        books.add(new BibleBook("Zechariah", true, 4855));
        books.add(new BibleBook("Malachi", true, 1320));

        // New Testament books with word counts
        books.add(new BibleBook("Matthew", false, 18346));
        books.add(new BibleBook("Mark", false, 11304));
        books.add(new BibleBook("Luke", false, 19482));
        books.add(new BibleBook("John", false, 15635));
        books.add(new BibleBook("Acts", false, 18450));
        books.add(new BibleBook("Romans", false, 7111));
        books.add(new BibleBook("1 Corinthians", false, 6830));
        books.add(new BibleBook("2 Corinthians", false, 4477));
        books.add(new BibleBook("Galatians", false, 2230));
        books.add(new BibleBook("Ephesians", false, 2422));
        books.add(new BibleBook("Philippians", false, 1629));
        books.add(new BibleBook("Colossians", false, 1582));
        books.add(new BibleBook("1 Thessalonians", false, 1481));
        books.add(new BibleBook("2 Thessalonians", false, 823));
        books.add(new BibleBook("1 Timothy", false, 1591));
        books.add(new BibleBook("2 Timothy", false, 1238));
        books.add(new BibleBook("Titus", false, 659));
        books.add(new BibleBook("Philemon", false, 335));
        books.add(new BibleBook("Hebrews", false, 4971));
        books.add(new BibleBook("James", false, 1742));
        books.add(new BibleBook("1 Peter", false, 1684));
        books.add(new BibleBook("2 Peter", false, 1099));
        books.add(new BibleBook("1 John", false, 1950));
        books.add(new BibleBook("2 John", false, 219));
        books.add(new BibleBook("3 John", false, 185));
        books.add(new BibleBook("Jude", false, 451));
        books.add(new BibleBook("Revelation", false, 9851));
        return books;
    }
}