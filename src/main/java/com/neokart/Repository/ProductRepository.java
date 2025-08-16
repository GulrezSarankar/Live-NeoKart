package com.neokart.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	
	
	
    Page<Product> findByNameContainingIgnoreCase(String q, Pageable pageable);
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
    List<Product> findTop10ByOrderByIdDesc();
    
    
 // Find all with pagination
    Page<Product> findAll(Pageable pageable);
    
    
    List<Product> findByCategoryIgnoreCase(String category);


    // Find by category with pagination
 

	
}
