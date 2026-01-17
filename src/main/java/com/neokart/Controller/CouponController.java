package com.neokart.Controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.Coupon;
import com.neokart.Services.CouponService;

@RestController
@RequestMapping("/api/admin/coupons")
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})
public class CouponController {
	
	
    @Autowired
    private CouponService couponService;

    @PostMapping("/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody Map<String, String> request) {
        try {
            String code = request.get("code");
            BigDecimal totalAmount = new BigDecimal(request.get("totalAmount"));
            BigDecimal discountedAmount = couponService.applyCoupon(totalAmount, code);
            return ResponseEntity.ok(Map.of(
                    "originalAmount", totalAmount,
                    "discountedAmount", discountedAmount
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
