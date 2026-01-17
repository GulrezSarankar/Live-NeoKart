package com.neokart.Controller;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.PaymentHistory;
import com.neokart.Entity.Wallet;
import com.neokart.Services.PAymentHistoryService;
import com.neokart.Services.PaymentWalletService;
import com.neokart.Services.RefundService;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})public class PaymentWalletController {

	@Autowired
	PaymentWalletService service;
	
	@GetMapping("/{userid}")
	public Wallet getWallet(@PathVariable Long id) {
		return service.getWallet(id);
	}
	
	@PostMapping("/add/{userId}")
    public Wallet addFunds(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        return service.addFunds(userId, amount);
    }

    @PostMapping("/deduct/{userId}")
    public Wallet deductFunds(@PathVariable Long userId, @RequestParam BigDecimal amount) {
        return service.deductFunds(userId, amount);
    }
	
    
    @Autowired
    private PAymentHistoryService paymentHistoryService;

    @Autowired
    private RefundService refundService;

    // 🧾 Get payment history
    @GetMapping("/{userId}")
    public ResponseEntity<List<PaymentHistory>> getPaymentHistory(@PathVariable Long userId) {
        return ResponseEntity.ok(paymentHistoryService.getUserPayments(userId));
    }

    // 💳 Refund to wallet
    @PostMapping("/refund/{userId}/{paymentId}")
    public ResponseEntity<String> refundToWallet(
            @PathVariable Long userId,
            @PathVariable Long paymentId) {
        refundService.refundToWallet(userId, paymentId);
        return ResponseEntity.ok("Refund credited to NeoKart Wallet successfully!");
    }
	
	
}
