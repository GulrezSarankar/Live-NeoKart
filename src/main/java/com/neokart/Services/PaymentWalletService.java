package com.neokart.Services;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Wallet;
import com.neokart.Repository.PaymentWalletRepository;


@Service
public class PaymentWalletService {
	
	 @Autowired
	    private PaymentWalletRepository walletRepository;

	    // ✅ Get or create wallet for a user
	    public Wallet getWallet(Long userId) {
	        return walletRepository.findByUserId(userId)
	                .orElseGet(() -> {
	                    Wallet wallet = new Wallet();
	                    wallet.setUserId(userId);
	                    wallet.setBalance(BigDecimal.ZERO);
	                    return walletRepository.save(wallet);
	                });
	    }

	    // ✅ Add funds to wallet (e.g., refund or offer credit)
	    public Wallet addFunds(Long userId, BigDecimal amount) {
	        Wallet wallet = getWallet(userId);
	        wallet.setBalance(wallet.getBalance().add(amount));
	        return walletRepository.save(wallet);
	    }

	    // ✅ Deduct funds from wallet (e.g., use during checkout)
	    public Wallet deductFunds(Long userId, BigDecimal amount) {
	        Wallet wallet = getWallet(userId);
	        if (wallet.getBalance().compareTo(amount) < 0) {
	            throw new IllegalArgumentException("Insufficient wallet balance");
	        }
	        wallet.setBalance(wallet.getBalance().subtract(amount));
	        return walletRepository.save(wallet);
	    }
    
    

}
