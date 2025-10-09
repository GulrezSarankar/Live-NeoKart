package com.neokart.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.neokart.Entity.ProductVarient;

public interface ProductVarientsRepo  extends JpaRepository<ProductVarient,Long>{

    List<ProductVarient> findByProductId(Long productId);

}
