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
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "productVarient")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class ProductVarient {

	
	
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String variantName; // e.g. "8GB / 128GB / Black"
    private String color;
    private String size;
    private String storage;
    private BigDecimal price;
    private int stock;
    private String sku; // unique stock keeping unit

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
