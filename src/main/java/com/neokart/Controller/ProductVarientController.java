package com.neokart.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.ProductVarient;
import com.neokart.Services.ProductVarientService;


@RestController
@RequestMapping("/api/admin/variants")
public class ProductVarientController {
	
	
	@Autowired
    private  ProductVarientService variantService;

//    public ProductVariantController(ProductVariantService variantService) {
//        this.variantService = variantService;
//    }

    @PostMapping("/{productId}")
    public ProductVarient addVariant(@PathVariable Long productId, @RequestBody ProductVarient variant) {
        return variantService.addVariant(productId, variant);
    }

    @GetMapping("/{productId}")
    public List<ProductVarient> getVariants(@PathVariable Long productId) {
        return variantService.getVariants(productId);
    }

    @DeleteMapping("/{variantId}")
    public void deleteVariant(@PathVariable Long variantId) {
        variantService.deleteVariant(variantId);
    }

}
