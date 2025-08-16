package com.neokart.Entity;

import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "wishlists")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class WishList {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Long id;

	    // One wishlist per user
	    @OneToOne(fetch = FetchType.LAZY)
	    @JoinColumn(name = "user_id", unique = true)
	    private User user;

	    // Many products in wishlist (many-to-many)
	    @ManyToMany
	    @JoinTable(
	        name = "wishlist_products",
	        joinColumns = @JoinColumn(name = "wishlist_id"),
	        inverseJoinColumns = @JoinColumn(name = "product_id")
	    )
	    private Set<Product> products = new HashSet<>();
}
