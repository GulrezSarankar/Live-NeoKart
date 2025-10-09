package com.neokart.Services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.PaymentHistory;
import com.neokart.Repository.PaymentHistoryRepo;
@Service
public class PAymentHistoryService {

	
	
	@Autowired
	PaymentHistoryRepo repo;
	
	 public List<PaymentHistory> getUserPayments(Long userId) {
	        return repo.findByUserIdOrderByPaymentDateDesc(userId);
	    }

	    public PaymentHistory savePayment(Long userId, String paymentId, String method, BigDecimal amount, String status, String receiptUrl) {
	        PaymentHistory ph = new PaymentHistory();
	        ph.setUserId(userId);
	        ph.setPaymentId(paymentId);
	        ph.setPaymentMethod(method);
	        ph.setAmount(amount);
	        ph.setStatus(status);
	        ph.setReceiptUrl(receiptUrl);
	        return repo.save(ph);
	    }
}
