package com.neokart.Controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.Order;
import com.neokart.Entity.Product;
import com.neokart.Repository.OrderRepository;
import com.neokart.Repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})
public class DashboardController {
	
	@Autowired
	private  ProductRepository productRepository;
	
	@Autowired
    private  OrderRepository orderRepository;

    // 1️⃣ Total Products
    @GetMapping("/dashboard/total-products")
    public Long getTotalProducts() {
        return productRepository.count();
    }

    // 2️⃣ Weekly Income
 // 2️⃣ Weekly Income (daily breakdown)
    @GetMapping("/dashboard/weekly-income")
    public List<Map<String, Object>> getWeeklyIncome() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);

        return orderRepository.findByOrderDateAfter(weekAgo)
                .stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().toLocalDate(),
                        Collectors.mapping(Order::getTotalPrice,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey()) // sort by date
                .map(entry -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("date", entry.getKey().toString());
                    map.put("income", entry.getValue());
                    return map;
                })
                .collect(Collectors.toList());
    }


    // 3️⃣ Monthly Income
    @GetMapping("/dashboard/monthly-income")
    public Map<String, BigDecimal> getMonthlyIncome() {
        return orderRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(
                        order -> order.getOrderDate().getMonth().toString(),
                        LinkedHashMap::new,
                        Collectors.mapping(Order::getTotalPrice,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))
                ));
    }

    // 4️⃣ Top Products by quantity sold
 // 4️⃣ Top Products by quantity sold
    @GetMapping("/dashboard/top-products")
    public List<Map<String, Object>> getTopProducts() {
        Map<Long, Integer> productSales = new HashMap<>();

        orderRepository.findAll().forEach(order -> {
            order.getItems().forEach(item -> {
                productSales.put(item.getProduct().getId(),
                        productSales.getOrDefault(item.getProduct().getId(), 0) + item.getQuantity());
            });
        });

        return productSales.entrySet()
                .stream()
                .sorted((a, b) -> b.getValue() - a.getValue())
                .limit(5)
                .map(e -> {
                    Product product = productRepository.findById(e.getKey()).orElse(null);
                    if (product != null) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", product.getId());
                        map.put("name", product.getName());
                        map.put("quantitySold", e.getValue());
                        map.put("price", product.getPrice());
                        if (product.getImages() != null && !product.getImages().isEmpty()) {
                            map.put("imageUrl", product.getImages().get(0).getImageUrl());
                        } else {
                            map.put("imageUrl", "/uploads/default.png");
                        }
                        return map;
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    // 5️⃣ Orders by Status
    @GetMapping("/dashboard/orders-status")
    public Map<String, Long> getOrdersByStatus() {
        return orderRepository.findAll()
                .stream()
                .collect(Collectors.groupingBy(Order::getStatus,
                        Collectors.counting()));
    }

    // 6️⃣ Low-stock Products (<5 items)
    @GetMapping("/dashboard/low-stock")
    public List<Product> getLowStockProducts() {
        return productRepository.findAll()
                .stream()
                .filter(p -> p.getStock() != null && p.getStock() < 5)
                .collect(Collectors.toList());
    }
}
