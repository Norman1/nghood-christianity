package com.nghood.christianity.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class HelloController {

    private static final Logger log = LoggerFactory.getLogger(HelloController.class);

    @Value("${app.api.secret}")
    private String apiSecret;

    @GetMapping("/hello/{userName}")
    public String hello(@PathVariable String userName,
                       @RequestHeader(value = "X-API-Key", required = false) String apiKey) {
        
        log.info("Hello endpoint called for user: {}", userName);
        
        // Check API key
        if (apiKey == null || !apiSecret.equals(apiKey)) {
            log.warn("Invalid API key provided");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid API key");
        }
        
        return String.format("Hello %s, I am the Backend", userName);
    }
}