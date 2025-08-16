package com.neokart.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.neokart.DTO.OrderStatusCountDto;
import com.neokart.Entity.Order;
import com.neokart.Entity.User;

public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByUser(User user);







   

    //  Order status counts
    @Query("SELECT OrderStatusCountDTO(o.status, COUNT(o)) " +
           "FROM Order o GROUP BY o.status")
    List<OrderStatusCountDto> findOrderStatusCounts();

}
