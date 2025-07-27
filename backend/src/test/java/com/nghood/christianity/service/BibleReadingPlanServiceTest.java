package com.nghood.christianity.service;

import com.nghood.christianity.model.BibleBook;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class BibleReadingPlanServiceTest {

    private BibleReadingPlanService bibleReadingPlanService;

    @BeforeEach
    void setUp() {
        bibleReadingPlanService = new BibleReadingPlanService();
    }

    @Test
    void getOrderedBibleBooks_shouldReturnAllBibleBooks() {
        // Act
        List<BibleBook> orderedBooks = bibleReadingPlanService.getOrderedBibleBooks();

        // Assert
        assertEquals(66, orderedBooks.size(), "Should return all 66 Bible books");

        // Print all books with their type and word count
//        orderedBooks.forEach(book -> System.out.println(book.getName() + " (" + (book.isOldTestament() ? "OT" : "NT") + ") - " + book.getWordCount() + " words"));
    }
}