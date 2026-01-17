package com.neokart.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.DTO.UpdateProfileRequest;
import com.neokart.Entity.User;
import com.neokart.Services.UserProfileService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})
public class UserProfileController {
	
	@Autowired
	 private  UserProfileService userProfileService;

	    @GetMapping("/me")
	    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
	        String email = authentication.getName();
	        User user = userProfileService.getUserByEmail(email);
	        return ResponseEntity.ok(user);
	    }

	    @PutMapping("/me")
	    public ResponseEntity<User> updateUserProfile(
	            Authentication authentication,
	            @RequestBody UpdateProfileRequest request // contains name, phone, currentPassword, newPassword
	    ) {
	        String email = authentication.getName();

	        User savedUser = userProfileService.updateUserProfile(
	                email,
	                new User(request.getName(), request.getPhone()), // only name & phone
	                request.getCurrentPassword(),
	                request.getNewPassword()
	        );
	        return ResponseEntity.ok(savedUser);
	    }


}
