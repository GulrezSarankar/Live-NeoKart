package com.neokart.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.Cart;
import com.neokart.Entity.User;

public interface CartRepository extends JpaRepository<Cart, Long> {
	
    Optional<Cart> findByUser(User user);




}
