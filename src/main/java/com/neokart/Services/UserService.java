package com.neokart.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.neokart.Entity.User;
import com.neokart.Repository.UserRepository;

@Service
public class UserService {


	@Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //  Get all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    //  Get user by ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    //  Search users by email
    public List<User> searchUsersByEmail(String email) {
        return userRepository.findByEmailContainingIgnoreCase(email);
    }

    //  Toggle active/inactive (using verified field as status)
    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setVerified(!user.isVerified());
        return userRepository.save(user);
    }

    //  Reset password
    public User resetPassword(Long id, String newPassword) {
        User user = getUserById(id);
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }

}
