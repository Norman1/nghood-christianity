package com.nghood.christianity.service;

import com.nghood.christianity.model.BibleBook;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BibleReadingPlanService {

    private static final List<BibleBook> BIBLE_BOOKS = initializeBibleBooks();
    private static final int OPTIMIZATION_PASSES = 3;

    public List<BibleBook> getOrderedBibleBooks() {

        // Step 1: Get randomized list of OT and NT books
        List<BibleBook> oldTestament = BIBLE_BOOKS.stream()
                .filter(BibleBook::isOldTestament).collect(Collectors.toList());

        List<BibleBook> newTestament = BIBLE_BOOKS.stream()
                .filter(book -> !book.isOldTestament()).collect(Collectors.toList());

        Collections.shuffle(oldTestament);
        Collections.shuffle(newTestament);

        // Step 2: Initialize the mapping of NT to OT books
        Map<BibleBook, List<BibleBook>> ntToOtMapping = new HashMap<>();
        for (BibleBook ntBook : newTestament) {
            ntToOtMapping.put(ntBook, new ArrayList<>());
        }

        // Assign each OT book to an NT book
        assignOtBooksToNtBooks(oldTestament, newTestament, ntToOtMapping);

        // DEBUG: Calculate and print total imbalance
        int totalImbalance = 0;
        for (Map.Entry<BibleBook, List<BibleBook>> entry : ntToOtMapping.entrySet()) {
            int ntWords = entry.getKey().getWordCount();
            int otTotal = entry.getValue().stream().mapToInt(BibleBook::getWordCount).sum();
            totalImbalance += Math.abs(ntWords - otTotal);
        }
        System.out.println("Total imbalance across all groups: " + totalImbalance);

        // Flatten to final list
        return flattenToReadingOrder(newTestament, ntToOtMapping);
    }


    private void assignOtBooksToNtBooks(List<BibleBook> oldTestament, List<BibleBook> newTestament,
                                        Map<BibleBook, List<BibleBook>> ntToOtMapping) {
        // 27 NT books, 39 OT books. 12 OT books more than NT books.
        // first assign without weighing word counts
        int currentOtIndex = 0;
        for (Map.Entry<BibleBook, List<BibleBook>> entry : ntToOtMapping.entrySet()) {
            entry.getValue().add(oldTestament.get(currentOtIndex));
            currentOtIndex++;
            // 24 = 2* 12. 12 is the difference in book count
            if (currentOtIndex <= 24) {
                entry.getValue().add(oldTestament.get(currentOtIndex));
                currentOtIndex++;
            }
        }

        // now use the word count to smoothen the reading experience
        optimizeBySwapping(ntToOtMapping);


    }

    private void optimizeBySwapping(Map<BibleBook, List<BibleBook>> ntToOtMapping) {
        // Convert to list for indexed access
        List<Map.Entry<BibleBook, List<BibleBook>>> entries = new ArrayList<>(ntToOtMapping.entrySet());

        // Repeat optimization passes
        for (int pass = 0; pass < OPTIMIZATION_PASSES; pass++) {
            // Check each adjacent pair
            for (int i = 0; i < entries.size() - 1; i++) {
                Map.Entry<BibleBook, List<BibleBook>> current = entries.get(i);
                Map.Entry<BibleBook, List<BibleBook>> next = entries.get(i + 1);

                // Try to find a beneficial swap
                trySwapBetweenGroups(current, next);
            }
        }
    }

    private void trySwapBetweenGroups(Map.Entry<BibleBook, List<BibleBook>> group1,
                                      Map.Entry<BibleBook, List<BibleBook>> group2) {
        List<BibleBook> otBooks1 = group1.getValue();
        List<BibleBook> otBooks2 = group2.getValue();

        // NT word counts
        int nt1Words = group1.getKey().getWordCount();
        int nt2Words = group2.getKey().getWordCount();

        // OT totals for each group
        int ot1Total = otBooks1.stream().mapToInt(BibleBook::getWordCount).sum();
        int ot2Total = otBooks2.stream().mapToInt(BibleBook::getWordCount).sum();

        // Current imbalance within each group (NT vs OT difference)
        int group1Imbalance = Math.abs(nt1Words - ot1Total);
        int group2Imbalance = Math.abs(nt2Words - ot2Total);
        int currentTotalImbalance = group1Imbalance + group2Imbalance;

        // Try all possible swaps
        for (int i = 0; i < otBooks1.size(); i++) {
            for (int j = 0; j < otBooks2.size(); j++) {
                BibleBook book1 = otBooks1.get(i);
                BibleBook book2 = otBooks2.get(j);

                // Calculate new OT totals if we swap
                int newOt1Total = ot1Total - book1.getWordCount() + book2.getWordCount();
                int newOt2Total = ot2Total - book2.getWordCount() + book1.getWordCount();

                // New imbalances
                int newGroup1Imbalance = Math.abs(nt1Words - newOt1Total);
                int newGroup2Imbalance = Math.abs(nt2Words - newOt2Total);
                int newTotalImbalance = newGroup1Imbalance + newGroup2Imbalance;

                // If this swap reduces total imbalance, do it
                if (newTotalImbalance < currentTotalImbalance) {
                    // Perform the swap
                    otBooks1.set(i, book2);
                    otBooks2.set(j, book1);
                    return; // Exit after first beneficial swap
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