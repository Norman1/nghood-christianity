package com.nghood.christianity.service;

import com.nghood.christianity.model.BibleChapter;
import com.nghood.christianity.model.BibleVerse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Random;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class BibleGameService {

    private final BibleDataService bibleDataService;
    private final Random random = new Random();

    /**
     * Get a random verse from the selected books using Book -> Chapter -> Verse algorithm
     * This ensures small books appear as often as large books
     */
    public BibleVerse getRandomVerse(Set<String> selectedBooks) {
        if (selectedBooks.isEmpty()) {
            throw new IllegalArgumentException("No books selected");
        }

        // Step 1: Randomly select a book from the selected books
        List<String> availableBooks = selectedBooks.stream()
                .filter(bibleDataService::hasBook)
                .toList();
        
        if (availableBooks.isEmpty()) {
            throw new IllegalArgumentException("None of the selected books are available");
        }

        String randomBook = availableBooks.get(random.nextInt(availableBooks.size()));

        // Step 2: Randomly select a chapter from that book
        List<Integer> chapters = bibleDataService.getChaptersForBook(randomBook);
        if (chapters.isEmpty()) {
            throw new IllegalStateException("No chapters found for book: " + randomBook);
        }

        int randomChapter = chapters.get(random.nextInt(chapters.size()));

        // Step 3: Randomly select a verse from that chapter
        BibleChapter chapterData = bibleDataService.getChapter(randomBook, randomChapter);
        if (chapterData == null || chapterData.getVerseCount() == 0) {
            throw new IllegalStateException("No verses found for " + randomBook + " " + randomChapter);
        }

        List<Integer> verseNumbers = chapterData.getVerses().keySet().stream().sorted().toList();
        int randomVerseNumber = verseNumbers.get(random.nextInt(verseNumbers.size()));
        String verseText = chapterData.getVerse(randomVerseNumber);

        BibleVerse verse = new BibleVerse(verseText, randomBook, randomChapter, randomVerseNumber);
        
        // Set expansion metadata
        verse.setCanExpandMore(chapterData.getVerseCount() > 1);
        verse.setTotalVersesInChapter(chapterData.getVerseCount());

        log.debug("Generated random verse: {}", verse.getFormattedReference());
        return verse;
    }

    /**
     * Expand the verse range by adding one more verse from the same chapter
     */
    public BibleVerse expandVerse(String book, int chapter, int fromVerse, int toVerse) {
        BibleChapter chapterData = bibleDataService.getChapter(book, chapter);
        if (chapterData == null) {
            throw new IllegalArgumentException("Chapter not found: " + book + " " + chapter);
        }

        // Try to expand after the current range first
        int nextVerse = toVerse + 1;
        if (chapterData.hasVerse(nextVerse)) {
            String verseText = chapterData.getVerse(nextVerse);
            BibleVerse expandedVerse = new BibleVerse(verseText, book, chapter, nextVerse);
            
            // Check if more expansion is possible
            int newRangeSize = (toVerse - fromVerse + 1) + 1; // current range + 1 new verse
            expandedVerse.setCanExpandMore(newRangeSize < chapterData.getVerseCount());
            expandedVerse.setTotalVersesInChapter(chapterData.getVerseCount());
            
            log.debug("Expanded verse range to include: {}", expandedVerse.getFormattedReference());
            return expandedVerse;
        }

        // If no next verse, try to expand before the current range
        int previousVerse = fromVerse - 1;
        if (chapterData.hasVerse(previousVerse)) {
            String verseText = chapterData.getVerse(previousVerse);
            BibleVerse expandedVerse = new BibleVerse(verseText, book, chapter, previousVerse);
            
            // Check if more expansion is possible
            int newRangeSize = (toVerse - fromVerse + 1) + 1; // current range + 1 new verse
            expandedVerse.setCanExpandMore(newRangeSize < chapterData.getVerseCount());
            expandedVerse.setTotalVersesInChapter(chapterData.getVerseCount());
            
            log.debug("Expanded verse range to include: {}", expandedVerse.getFormattedReference());
            return expandedVerse;
        }

        // No expansion possible
        throw new IllegalStateException("Cannot expand verse range for " + book + " " + chapter + 
                " (currently showing verses " + fromVerse + "-" + toVerse + ")");
    }

    /**
     * Check if a verse range can be expanded
     */
    public boolean canExpandRange(String book, int chapter, int fromVerse, int toVerse) {
        BibleChapter chapterData = bibleDataService.getChapter(book, chapter);
        if (chapterData == null) {
            return false;
        }

        int currentRangeSize = toVerse - fromVerse + 1;
        return currentRangeSize < chapterData.getVerseCount();
    }
}