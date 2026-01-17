package com.neokart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.User;
import com.neokart.Services.UserService;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})public class UserController {
	
	
    @Autowired
    private UserService userService;

    //  Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    //  Get user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    //  Search users by email
    @GetMapping("/search")
    public List<User> searchUsers(@RequestParam String email) {
        return userService.searchUsersByEmail(email);
    }

    //  Toggle active/inactive
    @PutMapping("/{id}/toggle-status")
    public User toggleUserStatus(@PathVariable Long id) {
        return userService.toggleUserStatus(id);
    }

    //  Reset password
    @PutMapping("/{id}/reset-password")
    public User resetPassword(@PathVariable Long id, @RequestParam String newPassword) {
        return userService.resetPassword(id, newPassword);
    }

}
