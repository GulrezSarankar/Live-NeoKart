package com.neokart.Services;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Product;
import com.neokart.Entity.ProductVarient;
import com.neokart.Repository.ProductRepository;
import com.neokart.Repository.ProductVarientsRepo;

@Service
public class ProductVarientService {
	
	
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVarientsRepo variantRepository;

    public ProductVarient addVariant(Long productId, ProductVarient variant) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("❌ Product not found with ID: " + productId));

        variant.setProduct(product);
        return variantRepository.save(variant);
    }

    public List<ProductVarient> getVariants(Long productId) {
        return variantRepository.findByProductId(productId);
    }

    public String deleteVariant(Long variantId) {
        if (!variantRepository.existsById(variantId)) {
            throw new RuntimeException("❌ Variant not found with ID: " + variantId);
        }
        variantRepository.deleteById(variantId);
        return "✅ Variant deleted successfully";
    }

    public ProductVarient updateVariant(Long variantId, BigDecimal price, int stock) {
        ProductVarient variant = variantRepository.findById(variantId)
                .orElseThrow(() -> new RuntimeException("❌ Variant not found"));

        variant.setPrice(price);
        variant.setStock(stock);
        return variantRepository.save(variant);
    }

    public List<ProductVarient> getLowStockVariants(int threshold) {
        return variantRepository.findAll().stream()
                .filter(v -> v.getStock() < threshold)
                .toList();
    }

}
