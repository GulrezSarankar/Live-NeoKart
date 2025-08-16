package com.neokart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.Order;
import com.neokart.Services.EmailService;
import com.neokart.Services.OrderService;
import com.neokart.Services.OrderService.OrderItemRequest;

import lombok.Data;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")

public class OrderController {


	 @Autowired
	    private OrderService orderService;

	    @Autowired
	    private EmailService emailService;

	    // Wrapper DTO for order items list
	    @Data
	    public static class OrderRequest {
	        private List<OrderItemRequest> items;
	    }

	    @PostMapping("/create")
	    @PreAuthorize("isAuthenticated()")
	    public ResponseEntity<Order> createOrder(
	        Authentication authentication,
	        @RequestBody OrderRequest orderRequest // Wrap list inside DTO
	    ) {
	        String email = authentication.getName();

	        Order order = orderService.createOrderForUser(email, orderRequest.getItems());

	        try {
	            emailService.sendOrderPlacedEmail(
	                email,
	                order.getUser().getName(),
	                order.getId(),
	                order.getTotalPrice()
	            );
	        } catch (Exception e) {
	            e.printStackTrace();
	        }

	        return ResponseEntity.ok(order);
	    }

	    @GetMapping("/my")
	    @PreAuthorize("isAuthenticated()")
	    public ResponseEntity<List<Order>> getUserOrders(Authentication authentication) {
	        String email = authentication.getName();
	        List<Order> orders = orderService.getOrdersByUser(email);
	        return ResponseEntity.ok(orders);
	    }

	    @PostMapping("/update-status")
	    @PreAuthorize("hasRole('ADMIN')")
	    public ResponseEntity<Order> updateOrderStatus(
	        @RequestParam Long orderId,
	        @RequestParam String newStatus) {

	        Order updatedOrder = orderService.updateOrderStatus(orderId, newStatus, emailService);
	        return ResponseEntity.ok(updatedOrder);
	    }

}
