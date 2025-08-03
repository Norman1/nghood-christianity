package com.nghood.christianity.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BibleVerse {
    private String text;
    private String book;
    private int chapter;
    private int verseNumber;
    private String reference;
    private boolean canExpandMore;
    private int totalVersesInChapter;

    // Constructor for basic verse data
    public BibleVerse(String text, String book, int chapter, int verseNumber) {
        this.text = text;
        this.book = book;
        this.chapter = chapter;
        this.verseNumber = verseNumber;
        this.reference = formatReference(book, chapter, verseNumber);
    }

    private String formatReference(String book, int chapter, int verse) {
        return String.format("%s %d:%d", book, chapter, verse);
    }

    public String getFormattedReference() {
        return formatReference(book, chapter, verseNumber);
    }
}