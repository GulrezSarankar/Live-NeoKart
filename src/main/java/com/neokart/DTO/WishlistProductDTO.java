package com.neokart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishlistProductDTO {

	
	private Long productId;
    private String productName;
    private double price;
}
