package com.neokart.Services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Coupon;
import com.neokart.Repository.CouponReporitory;

@Service
public class CouponService {
	
    @Autowired
    private CouponReporitory couponRepository;

    public Optional<Coupon> getCouponByCode(String code) {
        return couponRepository.findByCode(code);
    }

    public BigDecimal applyCoupon(BigDecimal totalAmount, String code) throws Exception {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new Exception("Coupon not found"));

        LocalDateTime now = LocalDateTime.now();

        if (!coupon.isStatus()) {
            throw new Exception("Coupon is inactive");
        }

        if (now.isBefore(coupon.getStartDate()) || now.isAfter(coupon.getEndDate())) {
            throw new Exception("Coupon is not valid at this time");
        }

        if (totalAmount.compareTo(coupon.getMinPurchaseAmount()) < 0) {
            throw new Exception("Cart total is less than minimum required for this coupon");
        }

        if (coupon.getTimesUsed() >= coupon.getUsageLimit()) {
            throw new Exception("Coupon usage limit reached");
        }

        BigDecimal discountedAmount;
        if ("percentage".equalsIgnoreCase(coupon.getDiscountType())) {
            discountedAmount = totalAmount.subtract(totalAmount.multiply(coupon.getDiscountValue())
                    .divide(new BigDecimal(100)));
        } else if ("fixed".equalsIgnoreCase(coupon.getDiscountType())) {
            discountedAmount = totalAmount.subtract(coupon.getDiscountValue());
        } else {
            throw new Exception("Invalid coupon type");
        }

        // Increment times used
        coupon.setTimesUsed(coupon.getTimesUsed() + 1);
        couponRepository.save(coupon);

        // Ensure discountedAmount is not negative
        if (discountedAmount.compareTo(BigDecimal.ZERO) < 0) {
            discountedAmount = BigDecimal.ZERO;
        }

        return discountedAmount;
    }
}
