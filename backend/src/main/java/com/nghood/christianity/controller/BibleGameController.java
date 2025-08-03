package com.nghood.christianity.controller;

import com.nghood.christianity.model.BibleVerse;
import com.nghood.christianity.service.BibleGameService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bible-game")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost", "https://christianity.nghood.com"})
public class BibleGameController {

    private final BibleGameService bibleGameService;

    /**
     * Get a random verse from selected books
     * Uses Book -> Chapter -> Verse algorithm for equal book representation
     */
    @GetMapping("/random-verse")
    public ResponseEntity<BibleVerse> getRandomVerse(@RequestParam String books) {
        try {
            // Parse comma-separated book names
            Set<String> selectedBooks = Arrays.stream(books.split(","))
                    .map(String::trim)
                    .filter(book -> !book.isEmpty())
                    .collect(Collectors.toSet());

            if (selectedBooks.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            BibleVerse randomVerse = bibleGameService.getRandomVerse(selectedBooks);
            
            log.info("Generated random verse: {} for books: {}", 
                    randomVerse.getFormattedReference(), selectedBooks);
            
            return ResponseEntity.ok(randomVerse);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for random verse: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error generating random verse", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Expand the current verse range by adding one more verse from the same chapter
     */
    @GetMapping("/expand-verse")
    public ResponseEntity<BibleVerse> expandVerse(
            @RequestParam String book,
            @RequestParam int chapter,
            @RequestParam int fromVerse,
            @RequestParam int toVerse) {
        
        try {
            BibleVerse expandedVerse = bibleGameService.expandVerse(book, chapter, fromVerse, toVerse);
            
            log.info("Expanded verse range for {} {}:{}-{} to include verse {}", 
                    book, chapter, fromVerse, toVerse, expandedVerse.getVerseNumber());
            
            return ResponseEntity.ok(expandedVerse);
            
        } catch (IllegalArgumentException e) {
            log.warn("Invalid request for verse expansion: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (IllegalStateException e) {
            log.warn("Cannot expand verse range: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("Error expanding verse range", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}