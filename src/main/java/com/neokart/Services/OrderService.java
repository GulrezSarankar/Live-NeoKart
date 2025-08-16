package com.neokart.Services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Order;
import com.neokart.Entity.OrderItem;
import com.neokart.Entity.Product;
import com.neokart.Entity.User;
import com.neokart.Repository.OrderRepository;
import com.neokart.Repository.ProductRepository;
import com.neokart.Repository.UserRepository;

@Service
public class OrderService {

	
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    // Assuming you pass productId and quantity per product for order creation
    public Order createOrderForUser(String email, List<OrderItemRequest> orderItemRequests) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("Processing");
        order.setOrderDate(LocalDateTime.now());

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO; // use BigDecimal instead of double

        for (OrderItemRequest itemReq : orderItemRequests) {
            Product product = productRepository.findById(itemReq.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found: " + itemReq.getProductId()));

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemReq.getQuantity());

            // ✅ Correct multiplication with BigDecimal
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            orderItem.setPrice(itemTotal);
            orderItem.setOrder(order);  // important back-reference

            orderItems.add(orderItem);

            totalPrice = totalPrice.add(itemTotal); // accumulate
        }

        order.setItems(orderItems);
        order.setTotalPrice(totalPrice);

        orderRepository.save(order);

        return order;
    }

    public List<Order> getOrdersByUser(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUser(user);
    }

    public Order updateOrderStatus(Long orderId, String newStatus, EmailService emailService) {
        Order order = orderRepository.findById(orderId)
            .orElseThrow(() -> new RuntimeException("Order not found"));

        order.setStatus(newStatus);
        orderRepository.save(order);

        try {
            emailService.sendOrderStatusUpdateEmail(
                order.getUser().getEmail(),
                order.getUser().getName(),
                order.getId(),
                newStatus
            );
        } catch (Exception e) {
            e.printStackTrace();
        }

        return order;
    }

    // Simple DTO for order item request
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;

        // constructor, getters, setters
        public OrderItemRequest() {}

        public OrderItemRequest(Long productId, Integer quantity) {
            this.productId = productId;
            this.quantity = quantity;
        }

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}
