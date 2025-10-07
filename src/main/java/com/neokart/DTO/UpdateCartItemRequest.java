package com.neokart.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateCartItemRequest {
	
    private int quantity;
    
    
//    public UpdateCartItemRequest() {}
//    public UpdateCartItemRequest(int quantity) { this.quantity = quantity; }
//    public int getQuantity() { return quantity; }

}
