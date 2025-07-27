package com.nghood.christianity.controller;

import com.nghood.christianity.model.BibleBook;
import com.nghood.christianity.service.BibleReadingPlanService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bible-reading-plan")
public class BibleReadingPlanController {


    private final BibleReadingPlanService bibleReadingPlanService;

    public BibleReadingPlanController(BibleReadingPlanService bibleReadingPlanService) {
        this.bibleReadingPlanService = bibleReadingPlanService;
    }

    @GetMapping
    public ResponseEntity<List<String>> getBibleReadingPlan() {
        List<BibleBook> orderedBooks = bibleReadingPlanService.getOrderedBibleBooks();
        List<String> bookNames = orderedBooks.stream()
                .map(BibleBook::getName)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookNames);
    }
}