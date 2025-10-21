package com.tka.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Apply to all URLs
                .allowedOrigins("*") // Allow all origins. Replace with specific domain(s) in production
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allow all standard methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(false); // If you need credentials (cookies, auth), set this to true
                
    }
}
