package com.neokart.DTO;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishListDto {

	
	 private Long wishlistId;
	    private Set<WishlistProductDTO> products;
}
