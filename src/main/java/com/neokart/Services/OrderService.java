package com.neokart.Services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.DTO.OrderItemDto;
import com.neokart.DTO.ShippingAddressDto;
import com.neokart.Entity.Order;
import com.neokart.Entity.OrderItem;
import com.neokart.Entity.Product;
import com.neokart.Entity.ShippingAddress;
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
    
    public Order createOrder(String userEmail, List<OrderItemDto> itemsDto, ShippingAddressDto shippingDto) {
        User user = userRepository.findByEmail(userEmail)
                      .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());

        // Convert items
        List<OrderItem> items = itemsDto.stream().map(dto -> {
            OrderItem item = new OrderItem();
            Product product = productRepository.findById(dto.getProductId())
                                  .orElseThrow(() -> new RuntimeException("Product not found"));
            item.setProduct(product);
            item.setQuantity(dto.getQuantity());
            item.setPrice(product.getPrice().multiply(BigDecimal.valueOf(dto.getQuantity())));
            item.setOrder(order);
            return item;
        }).toList();

        order.setItems(items);

        // Total price
        BigDecimal total = items.stream()
                                .map(OrderItem::getPrice)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);
        order.setTotalPrice(total);

        // Set shipping address
        ShippingAddress shipping = new ShippingAddress();
        shipping.setName(shippingDto.getName());
        shipping.setEmail(shippingDto.getEmail());
        shipping.setPhone(shippingDto.getPhone());
        shipping.setAddress(shippingDto.getAddress());
        shipping.setCity(shippingDto.getCity());
        shipping.setState(shippingDto.getState());
        shipping.setZip(shippingDto.getZip());
        shipping.setCountry(shippingDto.getCountry());

        order.setShippingAddress(shipping);

        return orderRepository.save(order);
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
    public Order getOrderByIdAndUser(String userEmail, Long orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findById(orderId)
                .filter(order -> order.getUser().getId().equals(user.getId()))
                .orElse(null);
    }

    
//    Delete Order 
    public void cancelOrder(Long orderId, String userEmail) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getUser().getEmail().equals(userEmail)) {
            throw new IllegalArgumentException("You are not authorized to cancel this order");
        }

        if (order.getStatus().equals("DELIVERED")) {
            throw new IllegalArgumentException("Delivered orders cannot be cancelled");
        }

        // Option 1: Delete order
        orderRepository.delete(order);

        // Option 2: Update status instead of deletion
        // order.setStatus("CANCELLED");
        // orderRepository.save(order);
    }
    public List<Order> getAllOrders() {
        return orderRepository.findAll(); // JPA repository method
    }


}
