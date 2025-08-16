package com.neokart.Entity;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Carts")
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Cart {
	
	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    @OneToOne(fetch = FetchType.LAZY, optional = false)
	    @JoinColumn(name = "user_id", unique = true, nullable = false)
	    private User user;

	    @OneToMany(mappedBy = "cart", cascade = CascadeType.ALL, orphanRemoval = true)
	    private List<CartItem> items = new ArrayList<>();

	    @Column(nullable = false)
	    private BigDecimal subtotal = BigDecimal.ZERO;

	    @Column(nullable = false)
	    private BigDecimal shipping = BigDecimal.ZERO;

	    @Column(nullable = false)
	    private BigDecimal total = BigDecimal.ZERO;

}
