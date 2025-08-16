package com.neokart.Controller;
import com.neokart.Services.PayPalservice;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
public class PayPalController {
	
	 @Autowired
	    private PayPalservice service;

	    private static final String SUCCESS_URL = "http://localhost:3000/success";
	    private static final String CANCEL_URL = "http://localhost:3000/cancel";

	    @PostMapping("/create")
	    public String createPayment(@RequestParam double total) {
	        try {
	            Payment payment = service.createPayment(
	                    total,
	                    "USD",
	                    "paypal",
	                    "sale",
	                    "NeoKart Order",
	                    CANCEL_URL,
	                    SUCCESS_URL);
	            for (Links link : payment.getLinks()) {
	                if (link.getRel().equals("approval_url")) {
	                    return link.getHref();
	                }
	            }
	        } catch (PayPalRESTException e) {
	            e.printStackTrace();
	        }
	        return "Error occurred during payment creation.";
	    }

	    @GetMapping("/success")
	    public String successPayment(@RequestParam("paymentId") String paymentId,
	                                 @RequestParam("PayerID") String payerId) {
	        try {
	            Payment payment = service.executePayment(paymentId, payerId);
	            if (payment.getState().equals("approved")) {
	                return "Payment successful";
	            }
	        } catch (PayPalRESTException e) {
	            e.printStackTrace();
	        }
	        return "Payment failed";
	    }

}
