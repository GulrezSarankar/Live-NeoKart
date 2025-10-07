package com.neokart.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.neokart.Entity.Coupon;

@Repository
public interface CouponReporitory extends JpaRepository<Coupon, Long>{
	
    // Find a coupon by its code
    Optional<Coupon> findByCode(String code);
    
    // Optional: find active coupons only
    Optional<Coupon> findByCodeAndStatusTrue(String code);
    Optional<Coupon> findByCodeAndStatus(String code, boolean status);


}
