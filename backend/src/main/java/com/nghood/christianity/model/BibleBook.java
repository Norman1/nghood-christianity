package com.nghood.christianity.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BibleBook {
    private String name;
    private boolean isOldTestament;
    private int wordCount;
}