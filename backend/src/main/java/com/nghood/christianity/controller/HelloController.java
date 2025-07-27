package com.nghood.christianity.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hello")
public class HelloController {

    private static final Logger log = LoggerFactory.getLogger(HelloController.class);

    @GetMapping("/{userName}")
    public String hello(@PathVariable String userName) {
        log.info("Hello endpoint called for user: {}", userName);
        return String.format("Hello %s, I am the Backend", userName);
    }
}