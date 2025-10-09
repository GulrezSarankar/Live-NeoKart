package com.neokart.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.PaymentHistory;

public interface PaymentHistoryRepo  extends JpaRepository<PaymentHistory,Long>{

	

    List<PaymentHistory> findByUserId(Long userId);

    List<PaymentHistory> findByUserIdAndStatus(Long userId, String status);

    List<PaymentHistory> findByUserIdOrderByPaymentDateDesc(Long userId);
}
