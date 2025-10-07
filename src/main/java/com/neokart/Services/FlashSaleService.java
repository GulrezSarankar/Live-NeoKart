package com.neokart.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.FlashSale;
import com.neokart.Entity.FlashSaleProduct;
import com.neokart.Entity.Product;
import com.neokart.Repository.FlashSaleRepository;
import com.neokart.Repository.ProductRepository;

@Service
public class FlashSaleService {

    @Autowired
    private FlashSaleRepository flashSaleRepository;

    @Autowired
    private ProductRepository productRepository;

    /**
     * Get all flash sales
     */
    public List<FlashSale> getAllFlashsale() {
        return flashSaleRepository.findAll();
    }

    /**
     * Create a flash sale safely
     */
    public FlashSale createFlashsale(FlashSale flashSale) {

        // Ensure all products exist in DB
        for (FlashSaleProduct fp : flashSale.getProducts()) {
            Product product = productRepository.findById(fp.getProduct().getId())
                    .orElseThrow(() -> new RuntimeException("Product not found with id " + fp.getProduct().getId()));
            fp.setProduct(product);
            fp.setFlashSale(flashSale); // set parent reference
        }

        // Save flash sale with products
        return flashSaleRepository.save(flashSale);
    }

    /**
     * Delete flash sale by ID
     */
    public void deleteFlashSale(Long id) {
        flashSaleRepository.deleteById(id);
    }

}
