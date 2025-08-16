package com.neokart.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neokart.Entity.User;
import com.neokart.Repository.UserRepository;


@Service
public class UserProfileService {

    private final PasswordEncoder passwordEncoder;
	
	@Autowired
	  private  UserRepository userRepository;

	
    UserProfileService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

	    public User getUserByEmail(String email) {
	        return userRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	    }

	    public User updateUserProfile(String email, User updatedUser, String currentPassword, String newPassword) {
	        User existingUser = getUserByEmail(email);

	        // Update name & phone
	        existingUser.setName(updatedUser.getName());
	        existingUser.setPhone(updatedUser.getPhone());

	        // Handle password change
	        if (newPassword != null && !newPassword.isEmpty()) {
	            if (!passwordEncoder.matches(currentPassword, existingUser.getPassword())) {
	                throw new RuntimeException("Current password is incorrect");
	            }
	            existingUser.setPassword(passwordEncoder.encode(newPassword));
	        }

	        return userRepository.save(existingUser);
	    }

}
