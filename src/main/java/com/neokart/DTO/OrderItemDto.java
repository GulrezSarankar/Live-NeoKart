package com.neokart.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderItemDto {
    private Long productId;   // ID of the product
    private String productName; // Optional: product name
    private Integer quantity;  // Quantity ordered
    private BigDecimal price; 

}
