package com.neokart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.CartItem;

public interface CartItemRepository  extends JpaRepository<CartItem,Long>{

}
