package com.neokart.Controller;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.annotation.AuthenticationPrincipal;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.neokart.DTO.PageResponse;
import com.neokart.DTO.ProductWithRatingDTO;
import com.neokart.DTO.RatingRequest;
import com.neokart.DTO.RatingResponse;
import com.neokart.Entity.Product;
import com.neokart.Entity.ProductRating;
import com.neokart.Entity.User;
import com.neokart.Repository.ProductRatingRepository;
import com.neokart.Repository.ProductRepository;
import com.neokart.Services.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")

public class ProductConroller {
	

	@Autowired
	ProductService productService;
	@Autowired 
	
	ProductRatingRepository ratingRepository;
	
	@Autowired
    private  ProductRepository productRepository;
	
    @Value("${file.upload-dir:uploads}")
    private String uploadDir;


	
	@GetMapping("/{id}")
	public ResponseEntity<Product> getProductById(@PathVariable Long id) {
	    Product product = productService.getProductById(id);
	    if (product == null) {
	        return ResponseEntity.notFound().build();
	    }
	    return ResponseEntity.ok(product);
	}

	
	  // ✅ Simple get-all-products endpoint
    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProductsList() {
    	return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String categoryName) {
        System.out.println("Searching for category: " + categoryName);
        List<Product> products = productRepository.findByCategoryIgnoreCase(categoryName);
        System.out.println("Found products count: " + products.size());
        return ResponseEntity.ok(products);
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> addProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,   // still accept Double from request
            @RequestParam Integer stock,
            @RequestParam String sku,
            @RequestParam String category,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price)); // ✅ convert Double -> BigDecimal
        product.setStock(stock);
        product.setSku(sku);
        product.setCategory(category);

        return ResponseEntity.ok(productService.addProduct(product, image));
    }


    @PutMapping("/update/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer stock,
            @RequestParam String sku,
            @RequestParam String category,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {

        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price)); // ✅ fixed
        product.setStock(stock);
        product.setSku(sku);
        product.setCategory(category);

        return ResponseEntity.ok(productService.updateProduct(id, product, image));
    }

	    // Admin - Delete product
	    @DeleteMapping("/delete/{id}")
	    @PreAuthorize("hasRole('ADMIN')")
	    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
	        productService.deleteProduct(id);
	        return ResponseEntity.ok("Product deleted successfully");
	    }

	
	    @GetMapping
	    public ResponseEntity<PageResponse<ProductWithRatingDTO>> getAllProducts(
	            @RequestParam(required = false) String category,
	            @RequestParam(required = false, defaultValue = "rating_desc") String sortBy,
	            @RequestParam(required = false, defaultValue = "0") int page,
	            @RequestParam(required = false, defaultValue = "12") int size
	    ) {
	        Page<ProductWithRatingDTO> productsPage = productService.getFilteredAndSortedProducts(category, sortBy, page, size);
	        
	        PageResponse<ProductWithRatingDTO> response = new PageResponse<>(
	            productsPage.getContent(),
	            productsPage.getNumber(),
	            productsPage.getSize(),
	            productsPage.getTotalElements(),
	            productsPage.getTotalPages(),
	            productsPage.isLast()
	        );

	        return ResponseEntity.ok(response);
	    }
	    

	   

	    @GetMapping("/{productId}/ratings")
	    public ResponseEntity<?> getRatings(@PathVariable Long productId) {
	        Product product = productRepository.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product not found"));
	        List<?> ratings = productService.getRatingsByProduct(product).stream()
	                .map(r -> new RatingResponse(r.getUser().getName(), r.getStars(), r.getComment()))
	                .collect(Collectors.toList());
	        return ResponseEntity.ok(ratings);
	    }

	    // Add rating & comment
	    @PostMapping
	    public ResponseEntity<?> addRating(
	            @PathVariable Long productId,
	            @RequestBody RatingRequest request,
	            @AuthenticationPrincipal User user // Spring Security gives logged-in user
	    ) {
	        if (user == null) {
	            return ResponseEntity.status(401).body("Please login to rate the product");
	        }

	        Product product = productRepository.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product not found"));

	        ProductRating rating = productService.addRating(product, user, request.getStars(), request.getComment());
	        return ResponseEntity.ok(new RatingResponse(user.getName(), rating.getStars(), rating.getComment()));
	    }


}
