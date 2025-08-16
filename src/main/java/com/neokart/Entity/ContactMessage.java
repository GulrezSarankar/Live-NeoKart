package com.neokart.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NegativeOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;

@Entity
@Table(name = "contactUs")
@AllArgsConstructor
@NegativeOrZero
@Data
public class ContactMessage {

	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;        // User name
    private String email;       // User email
    private String subject;     // Message subject
    @Column(columnDefinition = "TEXT")
    private String message;     // Feedback text

    private LocalDateTime createdAt;
}
