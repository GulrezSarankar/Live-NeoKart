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
	UserRepository userRepository;
	
    @Autowired
    private PasswordEncoder passwordEncoder;



    // ✅ Get admin profile
    public AdminProfileDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return new AdminProfileDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    //  Update admin profile
    public AdminProfileDto updateProfile(String email, AdminProfileDto updatedProfile) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        user.setName(updatedProfile.getName());
        user.setPhone(updatedProfile.getPhone());
        user.setEmail(updatedProfile.getEmail());

        User savedUser = userRepository.save(user);

        return new AdminProfileDto(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone()
        );
    }

    //  Change password
    public void changePassword(String email, String oldPassword, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new RuntimeException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

}
