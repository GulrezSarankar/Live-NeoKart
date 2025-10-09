package com.neokart.Entity;

import java.math.BigDecimal;
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
@Table(name = "PaymentHistory")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class PaymentHistory {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String paymentId;         // Stripe or PayPal ID
    private String paymentMethod;     // "Stripe" or "PayPal"
    private BigDecimal amount;
    private String status;            // "Completed", "Refunded to Wallet", etc.
    private String receiptUrl;
    private LocalDateTime paymentDate = LocalDateTime.now();


}
