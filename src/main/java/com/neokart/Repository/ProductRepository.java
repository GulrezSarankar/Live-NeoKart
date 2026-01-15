package com.neokart.Repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.neokart.DTO.ProductWithRatingDTO;
import com.neokart.Entity.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
	
	
	
	
    Page<Product> findByNameContainingIgnoreCase(String q, Pageable pageable);
    Page<Product> findByCategoryIgnoreCase(String category, Pageable pageable);
    List<Product> findTop10ByOrderByIdDesc();
    
    
 // Find all with pagination
    Page<Product> findAll(Pageable pageable);
    
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.category) = LOWER(:category)")
    List<Product> findByCategoryIgnoreCase(@Param("category") String category);  
    
    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL")
    List<String> findDistinctCategories();

    List<Product> findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(String category, String subCategory);
	List<Product> findByCategory(String category);


	 // Search by name, category, or subcategory
    List<Product> findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubCategoryContainingIgnoreCase(
        String name, String category, String subCategory
    );

    // Find by category with pagination
    
    @Query("""
    		SELECT new com.neokart.DTO.ProductWithRatingDTO(p, COALESCE(AVG(r.stars),0))
    		FROM Product p
    		LEFT JOIN p.ratings r
    		WHERE LOWER(p.category)=LOWER(:category)
    		AND p.id <> :productId
    		GROUP BY p
    		ORDER BY AVG(r.stars) DESC
    		""")
    		List<ProductWithRatingDTO> findRelatedWithRating(String category, Long productId);

 

	
}
