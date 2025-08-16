package com.neokart.DTO;

import java.util.List;

import com.neokart.Services.OrderService;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderRequest {
	
	  private List<OrderService.OrderItemRequest> items;


}
