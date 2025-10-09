package com.neokart.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neokart.DTO.AdminProfileDto;
import com.neokart.Entity.User;
import com.neokart.Repository.UserRepository;

@Service
public class AdminProfileService {
	
	
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuditLogService auditLogService; // ✅ Log admin activities

    // ✅ Get admin profile
    public AdminProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // Log view action (optional)
        auditLogService.readaction(email, "Viewed profile");

        return new AdminProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    // ✅ Update admin profile
    public AdminProfileDto updateProfile(String email, AdminProfileDto updatedProfile) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        boolean updated = false;

        if (!user.getName().equals(updatedProfile.getName())) {
            user.setName(updatedProfile.getName());
            updated = true;
        }
        if (!user.getPhone().equals(updatedProfile.getPhone())) {
            user.setPhone(updatedProfile.getPhone());
            updated = true;
        }
        if (!user.getEmail().equals(updatedProfile.getEmail())) {
            user.setEmail(updatedProfile.getEmail());
            updated = true;
        }

        if (updated) {
            User savedUser = userRepository.save(user);
            auditLogService.readaction(email, "Updated profile details");

            return new AdminProfileDto(
                    savedUser.getId(),
                    savedUser.getName(),
                    savedUser.getEmail(),
                    savedUser.getPhone()
            );
        } else {
            throw new RuntimeException("No changes detected in profile update.");
        }
    }

    // ✅ Change password
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("New password cannot be same as old password");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        auditLogService.readaction(email, "Changed account password");
    }

}
