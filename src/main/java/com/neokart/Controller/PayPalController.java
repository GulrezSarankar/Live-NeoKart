package com.neokart.Controller;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Services.PayPalservice;
import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
@RestController
@RequestMapping("/api/paypal")
public class PayPalController {
	
	
    @Autowired
    private PayPalservice service;

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> create(@RequestParam double total) {
        Map<String,Object> resp = new HashMap<>();
        try {
            Payment payment = service.createPayment(total);
            for (Links link : payment.getLinks()) {
                if ("approval_url".equals(link.getRel())) {
                    resp.put("status","success");
                    resp.put("approval_url",link.getHref());
                    resp.put("paymentId", payment.getId());
                    return ResponseEntity.ok(resp);
                }
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            resp.put("status","error");
            resp.put("message",e.getMessage());
            return ResponseEntity.internalServerError().body(resp);
        }
        resp.put("status","error");
        resp.put("message","Approval URL not found");
        return ResponseEntity.badRequest().body(resp);
    }
	



	
}
