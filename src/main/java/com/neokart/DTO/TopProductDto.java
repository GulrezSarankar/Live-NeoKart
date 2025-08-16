package com.neokart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TopProductDto {
	
	
    private Long productId;
    private String productName;
    private Long totalQuantitySold;
    private Double totalRevenue;
	
	
	

}
