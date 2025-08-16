package com.neokart.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.neokart.Entity.Product;
import com.neokart.Entity.ProductRating;
import com.neokart.Entity.User;

@Repository
public interface ProductRatingRepository extends JpaRepository<ProductRating,Long>{
    @Query("SELECT AVG(pr.stars) FROM ProductRating pr WHERE pr.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);
	


    List<ProductRating> findByProduct(Product product);
    boolean existsByProductAndUser(Product product, User user);


	

}
