package com.neokart.Entity;

import java.time.LocalDateTime;

import com.neokart.Enum.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class User {
	
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String password;

    private String phone;

    private boolean verified;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String provider; // "LOCAL", "GOOGLE"
    
    private LocalDateTime createdAt;
    
    
    // 🔹 For Forgot/Reset Password
    private String resetToken; // unique token sent via email
    private LocalDateTime resetTokenExpiry; // validity (e.g. 15 min)
    
 // inside User class
    public User(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }



}
