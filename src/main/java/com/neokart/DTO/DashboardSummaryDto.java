package com.neokart.DTO;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DashboardSummaryDto {
	
    private long totalOrders;
    private long uniqueCustomers;
    private BigDecimal totalRevenue;
    private BigDecimal averageOrderValue;
}
