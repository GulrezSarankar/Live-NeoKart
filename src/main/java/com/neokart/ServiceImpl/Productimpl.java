package com.neokart.ServiceImpl;

import java.util.List;

import com.neokart.DTO.ProductDto;
import com.neokart.Entity.Product;

public interface Productimpl {
	
    Product addProduct(ProductDto dto);
    Product updateProduct(Long id, ProductDto dto);
    void deleteProduct(Long id);
    List<Product> getAllProducts();
    Product getProduct(Long id);

}
