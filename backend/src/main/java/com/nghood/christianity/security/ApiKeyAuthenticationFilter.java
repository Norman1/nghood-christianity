package com.nghood.christianity.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiKeyAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(ApiKeyAuthenticationFilter.class);

    @Value("${app.api.secret}")
    private String apiSecret;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        String requestUri = request.getRequestURI();
        
        // Only apply API key validation to /api/* endpoints
        if (requestUri.startsWith("/api/")) {
            String apiKey = request.getHeader("X-API-Key");
            
            log.debug("API Key validation - Request: {}, Received key: {}, Expected key: {}", 
                requestUri, apiKey, apiSecret);
            
            if (apiKey == null || !apiSecret.equals(apiKey)) {
                log.warn("Invalid or missing API key for request: {} from IP: {}. Received: '{}', Expected: '{}'", 
                    requestUri, request.getRemoteAddr(), apiKey, apiSecret);
                
                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Invalid or missing API key\"}");
                return;
            }
            
            log.debug("Valid API key provided for request: {}", requestUri);
        }

        filterChain.doFilter(request, response);
    }
}