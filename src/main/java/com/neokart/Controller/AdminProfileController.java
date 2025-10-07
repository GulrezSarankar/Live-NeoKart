package com.neokart.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.DTO.AdminProfileDto;
import com.neokart.Services.AdminProfileService;


@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")

public class AdminProfileController {



	
    @Autowired
    private AdminProfileService adminProfileService;

    // Get logged-in admin profile
    @GetMapping
    public ResponseEntity<AdminProfileDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(adminProfileService.getProfile(email));
    }

    // Update profile
    @PutMapping
    public ResponseEntity<AdminProfileDto> updateProfile(
            Authentication authentication,
            @RequestBody AdminProfileDto updatedProfile) {
        String email = authentication.getName();
        return ResponseEntity.ok(adminProfileService.updateProfile(email, updatedProfile));
    }

    // Change password
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(
            Authentication authentication,
            @RequestParam String oldPassword,
            @RequestParam String newPassword) {
        String email = authentication.getName();
        adminProfileService.changePassword(email, oldPassword, newPassword);
        return ResponseEntity.ok("Password updated successfully!");
    }
    
}
