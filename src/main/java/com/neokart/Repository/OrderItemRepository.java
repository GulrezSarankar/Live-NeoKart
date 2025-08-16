package com.neokart.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
}