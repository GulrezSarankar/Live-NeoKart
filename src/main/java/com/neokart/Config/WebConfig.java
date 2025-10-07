package com.neokart.Config;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ Load upload directory from application.properties
    @Value("${file.upload-dir:uploads}") // Default value = "uploads"
    private String uploadDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ Serve image files directly from the uploads folder
        // Example: http://localhost:4000/uploads/image.jpg
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadDir + "/")
                .setCachePeriod(0); // Disable caching during development
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // ✅ Allow React frontend to access backend API & images
        registry.addMapping("/**")
                .allowedOrigins(
                        "http://localhost:4000", // React default port
                        "http://localhost:3000"  // Vite dev server port
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
	
	
}
