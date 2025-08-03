package com.nghood.christianity.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BibleChapter {
    private String book;
    private int chapter;
    private Map<Integer, String> verses; // verseNumber -> text

    public int getVerseCount() {
        return verses.size();
    }

    public String getVerse(int verseNumber) {
        return verses.get(verseNumber);
    }

    public boolean hasVerse(int verseNumber) {
        return verses.containsKey(verseNumber);
    }

    public int getFirstVerse() {
        return verses.keySet().stream().min(Integer::compareTo).orElse(1);
    }

    public int getLastVerse() {
        return verses.keySet().stream().max(Integer::compareTo).orElse(1);
    }
}