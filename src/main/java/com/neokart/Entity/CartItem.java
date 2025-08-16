package com.neokart.Entity;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cartItems")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Getter
@Setter
public class CartItem {


	   @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "cart_id", nullable = false)
	    private Cart cart;

	    @ManyToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "product_id", nullable = false)
	    private Product product;

	    @Column(nullable = false)
	    private int quantity;

	    @Column(nullable = false, precision = 12, scale = 2)
	    private BigDecimal unitPrice = BigDecimal.ZERO;

	    @Column(nullable = false, precision = 12, scale = 2)
	    private BigDecimal lineTotal = BigDecimal.ZERO;

}
