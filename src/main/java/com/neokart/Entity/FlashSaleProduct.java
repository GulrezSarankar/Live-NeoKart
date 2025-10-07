package com.neokart.Entity;

import java.math.BigDecimal;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "flash-sale-product")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class FlashSaleProduct {
	
	
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String discountType; // percentage or fixed
    private BigDecimal discountValue;

    @ManyToOne
    @JoinColumn(name="flash_sale_id")
    private FlashSale flashSale;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Product product;

}
