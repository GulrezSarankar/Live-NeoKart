package com.neokart.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})
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
	    public ResponseEntity<Order> createOrder(
	            Authentication authentication,
	            @RequestBody com.neokart.DTO.OrderRequest orderRequest
	    ) {
	        String email = authentication.getName();

	        // Create order
	        Order order = orderService.createOrder(
	            email,
	            orderRequest.getItems(),
	            orderRequest.getShippingAddress()
	        );

	        try {
	            // Always take user's registered email from DB
	            String userEmail = order.getUser().getEmail();
	            String userName = order.getUser().getName();

	            emailService.sendOrderPlacedEmail(
	                userEmail,
	                userName,
	                order.getId(),
	                order.getTotalPrice()
	            );
	        } catch (Exception e) {
	            e.printStackTrace();
	        }

	        return ResponseEntity.ok(order);
	    }

	    
	    @GetMapping("/{id}")
	    @PreAuthorize("isAuthenticated()")
	    public ResponseEntity<Order> getOrderById(
	            Authentication authentication,
	            @PathVariable Long id
	    ) {
	        String email = authentication.getName();
	        Order order = orderService.getOrderByIdAndUser(email, id);
	        if (order == null) {
	            return ResponseEntity.notFound().build();
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

	    // Delete/cancel order by ID (only for owner)
	    @DeleteMapping("/{orderId}")
	    @PreAuthorize("isAuthenticated()")
	    public ResponseEntity<?> cancelOrder(
	            @PathVariable Long orderId,
	            Authentication authentication
	    ) {
	        String email = authentication.getName();
	        try {
	            orderService.cancelOrder(orderId, email);
	            return ResponseEntity.ok(Map.of("message", "Order cancelled successfully"));
	        } catch (IllegalArgumentException e) {
	            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
	        } catch (Exception e) {
	            return ResponseEntity.status(500).body(Map.of("message", "Failed to cancel order"));
	        }
	    }
	 // Fetch all orders for admin
	    @GetMapping
	    @PreAuthorize("hasRole('ADMIN')")
	    public ResponseEntity<List<Order>> getAllOrders() {
	        List<Order> orders = orderService.getAllOrders(); // Implement this in your service
	        return ResponseEntity.ok(orders);
	    }


}
