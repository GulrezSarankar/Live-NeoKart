package com.neokart.DTO;

import com.neokart.Entity.Product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ProductWithRatingDTO {
	
    private Product product;
    private Double averageRating;

}
