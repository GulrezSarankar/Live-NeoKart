package com.neokart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class AddToCart {
	
	
    private Long productId;
    private int quantity;

}
