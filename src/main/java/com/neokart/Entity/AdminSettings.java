package com.neokart.Entity;

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
@Table(name = "Adminsettings")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminSettings {
	
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String stripeKey;

    private String twilioSid;
    private String twilioAuthToken;

    private String smtpHost;
    private String smtpPort;
    private String smtpUser;
    private String smtpPass;

    private String theme; // dark or light

}
