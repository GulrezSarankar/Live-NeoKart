package com.neokart.DTO;

import java.math.BigDecimal;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class CartResponseDto {


	
    private Long cartId;
    private Long userId;
    private BigDecimal subtotal;
    private BigDecimal shipping;
    private BigDecimal total;
    private List<CartItemDto> items;
	
   
}
