package com.neokart.Controller;
import java.io.IOException;
import java.math.BigDecimal;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
import com.neokart.Services.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:3000")

public class ProductConroller {
	
    @Autowired
    private ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        if (product == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(product);
    }

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        return ResponseEntity.ok(productService.getAllCategories());
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }

    @GetMapping
    public ResponseEntity<PageResponse<ProductWithRatingDTO>> getFilteredProducts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "rating_desc") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
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
    public ResponseEntity<List<RatingResponse>> getProductRatings(@PathVariable Long productId) {
        Product product = productService.getProductById(productId);
        if (product == null) return ResponseEntity.notFound().build();

        List<RatingResponse> ratings = productService.getRatingsByProduct(product).stream()
                .map(r -> new RatingResponse(r.getUser().getName(), r.getStars(), r.getComment()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(ratings);
    }

    // ===================== POST =====================
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> addProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam Double price,
            @RequestParam Integer stock,
            @RequestParam String sku,
            @RequestParam String category,
            @RequestParam String subCategory,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStock(stock);
        product.setSku(sku);
        product.setCategory(category);
        product.setSubCategory(subCategory);

        return ResponseEntity.status(HttpStatus.CREATED).body(productService.addProduct(product, images));
    }

    @PostMapping("/{productId}/rate")
    public ResponseEntity<?> addRating(
            @PathVariable Long productId,
            @RequestBody RatingRequest request,
            Principal principal
    ) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Please login to rate the product");
        }

        String email = principal.getName();
        User user = productService.getUserByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }

        Product product = productService.getProductById(productId);
        if (product == null) return ResponseEntity.notFound().build();

        ProductRating rating = productService.addRating(product, user, request.getStars(), request.getComment());

        return ResponseEntity.ok(new RatingResponse(user.getName(), rating.getStars(), rating.getComment()));
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
            @RequestParam(required = false) String subCategory,
            @RequestParam(value = "images", required = false) List<MultipartFile> images
    ) throws IOException {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(BigDecimal.valueOf(price));
        product.setStock(stock);
        product.setSku(sku);
        product.setCategory(category);
        product.setSubCategory(subCategory);

        return ResponseEntity.ok(productService.updateProduct(id, product, images));
    }
    
//    Delete

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.ok(Map.of("message", "✅ Product deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    //  CATEGORIES & SUB 
    @GetMapping("/categories-with-subcategories")
    public ResponseEntity<List<Map<String, Object>>> getCategoriesWithSubCategories() {
        return ResponseEntity.ok(productService.getCategoriesWithSubCategories());
    }

    @GetMapping("/category/{category}/{subcategory}")
    public ResponseEntity<List<Product>> getProductsByCategoryAndSubcategory(
            @PathVariable String category,
            @PathVariable String subcategory
    ) {
        return ResponseEntity.ok(productService.getProductsByCategoryAndSubcategory(category, subcategory));
    }

// Search
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(List.of());
        }
        return ResponseEntity.ok(productService.searchProducts(q.trim()));
    }

//// Bulk Add 
//    @PostMapping("/bulk-upload")
//    @PreAuthorize("hasRole('ADMIN')")
//    public ResponseEntity<?> uploadBulkProducts(@RequestParam("file") MultipartFile file) {
//        try {
//            int savedCount = productService.saveProductsFromCsv(file);
//            return ResponseEntity.ok(Map.of("message", "✅ " + savedCount + " products uploaded successfully"));
//        } catch (IOException e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body(Map.of("error", "❌ Failed to process file: " + e.getMessage()));
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//                    .body(Map.of("error", "⚠️ " + e.getMessage()));
//        }
//    }
 // ✅ Bulk Upload from CSV
    @PostMapping("/bulk-upload")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> uploadBulkProducts(@RequestParam("file") MultipartFile file) {
        try {
            int savedCount = productService.saveProductsFromCsv(file);
            return ResponseEntity.ok(Map.of("message", "✅ " + savedCount + " products uploaded successfully"));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "❌ Failed to process file: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "⚠️ " + e.getMessage()));
        }
    }
    
    @GetMapping("/related/{category}/{productId}")
    public ResponseEntity<List<ProductWithRatingDTO>> getRelatedWithRating(
            @PathVariable String category,
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(productService.getRelatedWithRating(category, productId));
    }


	
}
