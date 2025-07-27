package com.nghood.christianity.controller;

import com.nghood.christianity.service.BibleReadingPlanService;
import com.nghood.christianity.model.BibleBook;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bible-reading-plan")
public class BibleReadingPlanController {

    private final BibleReadingPlanService bibleReadingPlanService;

    public BibleReadingPlanController(BibleReadingPlanService bibleReadingPlanService) {
        this.bibleReadingPlanService = bibleReadingPlanService;
    }

    @GetMapping
    public ResponseEntity<List<BibleBook>> getBibleReadingPlan() {
        List<BibleBook> orderedBooks = bibleReadingPlanService.getOrderedBibleBooks();
        return ResponseEntity.ok(orderedBooks);
    }
}