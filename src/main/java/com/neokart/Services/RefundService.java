package com.neokart.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.PaymentHistory;

@Service
public class RefundService {

	


	    @Autowired
	    
	    private PAymentHistoryService paymentHistoryService;

	    @Autowired
	    private PaymentWalletService walletService;

	    public void refundToWallet(Long userId, Long paymentId) {
	        // Get payment details
	        PaymentHistory payment = paymentHistoryService.getUserPayments(userId)
	                .stream()
	                .filter(p -> p.getId().equals(paymentId))
	                .findFirst()
	                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

	        // Credit wallet
	        walletService.addFunds(userId, payment.getAmount());

	        // Update payment status
	        payment.setStatus("Refunded to Wallet");
	        paymentHistoryService.savePayment(
	                userId,
	                payment.getPaymentId(),
	                payment.getPaymentMethod(),
	                payment.getAmount(),
	                "Refunded to Wallet",
	                payment.getReceiptUrl()
	        );
	    }
	}


