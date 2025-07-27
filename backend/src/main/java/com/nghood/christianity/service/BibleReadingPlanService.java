package com.nghood.christianity.service;

import com.nghood.christianity.model.BibleBook;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BibleReadingPlanService {

    private static final List<BibleBook> BIBLE_BOOKS = initializeBibleBooks();

    public List<BibleBook> getOrderedBibleBooks() {
        // TODO: Implement smart ordering algorithm based on word count and testament
        // For now, return a simple alternating pattern between OT and NT
        
        List<BibleBook> oldTestament = BIBLE_BOOKS.stream()
            .filter(BibleBook::isOldTestament)
            .sorted(Comparator.comparingInt(BibleBook::getWordCount))
            .collect(Collectors.toList());
            
        List<BibleBook> newTestament = BIBLE_BOOKS.stream()
            .filter(book -> !book.isOldTestament())
            .sorted(Comparator.comparingInt(BibleBook::getWordCount))
            .collect(Collectors.toList());

        return interleaveBooks(oldTestament, newTestament);
    }

    private List<BibleBook> interleaveBooks(List<BibleBook> oldTestament, List<BibleBook> newTestament) {
        List<BibleBook> result = new ArrayList<>();
        int maxSize = Math.max(oldTestament.size(), newTestament.size());
        
        for (int i = 0; i < maxSize; i++) {
            if (i < oldTestament.size()) {
                result.add(oldTestament.get(i));
            }
            if (i < newTestament.size()) {
                result.add(newTestament.get(i));
            }
        }
        
        return result;
    }

    private static List<BibleBook> initializeBibleBooks() {
        // TODO: Load this data from JSON file or database
        // For now, using placeholder data
        List<BibleBook> books = new ArrayList<>();
        
        // Old Testament books with approximate word counts
        books.add(new BibleBook("Genesis", true, 38267));
        books.add(new BibleBook("Exodus", true, 32692));
        books.add(new BibleBook("Leviticus", true, 24546));
        books.add(new BibleBook("Numbers", true, 32902));
        books.add(new BibleBook("Deuteronomy", true, 28461));
        
        // Add more books here...
        books.add(new BibleBook("Psalms", true, 42704));
        books.add(new BibleBook("Proverbs", true, 15038));
        
        // New Testament books with approximate word counts
        books.add(new BibleBook("Matthew", false, 23684));
        books.add(new BibleBook("Mark", false, 15171));
        books.add(new BibleBook("Luke", false, 25944));
        books.add(new BibleBook("John", false, 19099));
        books.add(new BibleBook("Acts", false, 24250));
        
        // Add shorter books for testing
        books.add(new BibleBook("Philemon", false, 335));
        books.add(new BibleBook("2 John", false, 245));
        books.add(new BibleBook("3 John", false, 219));
        books.add(new BibleBook("Jude", false, 461));
        
        return books;
    }
}