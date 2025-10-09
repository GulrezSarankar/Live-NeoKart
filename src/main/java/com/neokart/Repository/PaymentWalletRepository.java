package com.neokart.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.Wallet;

public interface PaymentWalletRepository extends JpaRepository<Wallet, Long> {
	
    Optional<Wallet> findByUserId(Long userId);


}
