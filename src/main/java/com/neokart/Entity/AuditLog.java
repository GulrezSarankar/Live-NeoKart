package com.neokart.Entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "auditlogs")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class AuditLog {
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;        // e.g. "Updated Profile", "Changed Password"
    private String performedBy;   // admin email or ID
    private LocalDateTime timestamp;

}
