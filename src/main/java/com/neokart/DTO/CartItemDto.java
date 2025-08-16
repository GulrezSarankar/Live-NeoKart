package com.neokart.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
public class CartItemDto {
	
    private Long itemId;
    private Long productId;
    private String name;
    private String imageUrl;
    private BigDecimal unitPrice;   // ✅ BigDecimal, not Double
    private int quantity;
    private BigDecimal lineTotal;   // ✅ use BigDecimal

}
