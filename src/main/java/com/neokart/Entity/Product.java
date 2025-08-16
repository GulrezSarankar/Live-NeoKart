package com.neokart.Entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "products")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Product {


    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price = BigDecimal.ZERO;

    private Integer stock; // available quantity

    private String sku;

    private String imageUrl; // path or url to image

    private String category; // simple string category (or map to Category entity)
    
    @OneToMany
    (mappedBy = "product", cascade = CascadeType.ALL)
    private List<ProductRating> ratings;

    
    // getters & setters

//    public double getAverageRating() {
//        if (ratings == null || ratings.isEmpty()) return 0;
//        return ratings.stream().mapToInt(Rating::getStars).average().orElse(0);
//    }
}
