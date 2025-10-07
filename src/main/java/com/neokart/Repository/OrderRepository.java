package com.neokart.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.neokart.DTO.OrderStatusCountDto;
import com.neokart.Entity.Order;
import com.neokart.Entity.User;

public interface OrderRepository extends JpaRepository<Order, Long>{
    List<Order> findByUser(User user);
   

    //  Order status counts
    @Query("SELECT OrderStatusCountDTO(o.status, COUNT(o)) " +
           "FROM Order o GROUP BY o.status")
    List<OrderStatusCountDto> findOrderStatusCounts();

    
    @Query("SELECT COALESCE(SUM(o.totalPrice), 0) FROM Order o")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o")
    long countAllOrders();

    @Query("SELECT COUNT(DISTINCT o.user.id) FROM Order o")
    long countUniqueCustomers();

    // Daily sales (works on MySQL/MariaDB; H2/Postgres also ok with DATE())
    @Query("SELECT FUNCTION('DATE', o.orderDate) AS day, COALESCE(SUM(o.totalPrice), 0) " +
           "FROM Order o GROUP BY FUNCTION('DATE', o.orderDate) ORDER BY day ASC")
    List<Object[]> findDailySales();

//    // Order status counts
//    @Query("SELECT new com.neokart.DTO.OrderStatusCountDto(o.status, COUNT(o)) " +
//           "FROM Order o GROUP BY o.status")
//    List<OrderStatusCountDto> findOrderStatusCounts();
//}
    
    // ✅ Fix field name: totalPrice (not totalAmount)
    @Query("SELECT SUM(o.totalPrice) FROM Order o")
    Double getTotalRevenue();

    // ✅ Use native query for date comparison
    @Query(value = "SELECT SUM(o.total_price) FROM orders o WHERE DATE(o.order_date) = :date", nativeQuery = true)
    Double getRevenueByDate(LocalDate date);

    // ✅ Sales trend grouped by date
    @Query(value = "SELECT DATE(o.order_date) as orderDate, SUM(o.total_price) as totalRevenue " +
                   "FROM orders o GROUP BY DATE(o.order_date) ORDER BY DATE(o.order_date)", nativeQuery = true)
    List<Object[]> getSalesTrend();
    
    List<Order> findByOrderDateAfter(LocalDateTime dateTime);

}
