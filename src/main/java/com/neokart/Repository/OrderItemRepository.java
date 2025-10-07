package com.neokart.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.neokart.DTO.TopProductDto;
import com.neokart.Entity.OrderItem;
@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
	
	
	
	@Query("SELECT new com.neokart.DTO.TopProductDto(oi.product.name, SUM(oi.quantity)) " +
		       "FROM OrderItem oi " +
		       "GROUP BY oi.product.name " +
		       "ORDER BY SUM(oi.quantity) DESC")
		List<TopProductDto> findTopProducts();

    
   
}