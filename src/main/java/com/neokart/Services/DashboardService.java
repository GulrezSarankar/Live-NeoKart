package com.neokart.Services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.DTO.TopProductDto;
import com.neokart.Repository.OrderItemRepository;
import com.neokart.Repository.OrderRepository;

@Service
public class DashboardService {
//	
//	OrderItemService
//	@Autowired
//    private  OrderItemRepository orderItemRepository;
//
//    public List<TopProductDto> getTopProducts() {
//        return orderItemRepository.findTopProducts();
//    }
	
	
    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public Long getTotalOrders() {
        return orderRepository.count();
    }

    public Double getTotalRevenue() {
        return orderRepository.getTotalRevenue();
    }

    public Double getTodayRevenue() {
        return orderRepository.getRevenueByDate(LocalDate.now());
    }

    public List<TopProductDto> getTopProducts() {
        return orderItemRepository.findTopProducts();
    }

    public List<Object[]> getSalesTrend() {
        return orderRepository.getSalesTrend();
    }

}
