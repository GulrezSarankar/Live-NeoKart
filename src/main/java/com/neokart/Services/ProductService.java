package com.neokart.Services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.neokart.DTO.ProductWithRatingDTO;
import com.neokart.Entity.Product;
import com.neokart.Entity.ProductImage;
import com.neokart.Entity.ProductRating;
import com.neokart.Entity.User;
import com.neokart.Repository.ProductImageRepo;
import com.neokart.Repository.ProductRatingRepository;
import com.neokart.Repository.ProductRepository;
import com.neokart.Repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	
	
    @Autowired
    private final ProductRepository productRepository;

    @Autowired
    private final ProductImageRepo productImageRepository;

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final ProductRatingRepository ratingRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;



    // Get product by ID
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    // Add product (supports multiple images)
    @Transactional
    public Product addProduct(Product product, List<MultipartFile> images) throws IOException {
        if (product.getImages() == null) product.setImages(new ArrayList<>());
        handleMultipleImageUpload(product, images);
        return productRepository.save(product);
    }

    // Update product (replace images if provided)
    @Transactional
    public Product updateProduct(Long id, Product updatedProduct, List<MultipartFile> images) throws IOException {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Product not found"));

        // Update basic details
        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setStock(updatedProduct.getStock());
        existing.setSku(updatedProduct.getSku());
        existing.setCategory(updatedProduct.getCategory());
        existing.setSubCategory(updatedProduct.getSubCategory());

        // If new images provided -> clear old images + upload new
        if (images != null && !images.isEmpty()) {
            deleteImageFilesForProduct(existing);
            existing.getImages().clear(); // orphanRemoval will delete from DB
            handleMultipleImageUpload(existing, images);
        } else if (existing.getImages() == null || existing.getImages().isEmpty()) {
            // If no images exist, add default
            handleMultipleImageUpload(existing, null);
        }

        return productRepository.save(existing);
    }

    // Delete product + all associated images
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("❌ Product not found"));

        deleteImageFilesForProduct(product); // delete from disk
        productRepository.delete(product);   // cascade deletes images
    }

    // ===============================
    // 🔹 Image Handling
    // ===============================

    private void handleMultipleImageUpload(Product product, List<MultipartFile> images) throws IOException {
        List<ProductImage> uploadedImages = new ArrayList<>();

        if (images != null && !images.isEmpty()) {
            for (int i = 0; i < images.size(); i++) {
                MultipartFile image = images.get(i);
                if (image != null && !image.isEmpty()) {
                    String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                    Path filePath = Paths.get(uploadDir, fileName);
                    Files.createDirectories(filePath.getParent());
                    Files.write(filePath, image.getBytes());

                    uploadedImages.add(
                        ProductImage.builder()
                                .imageUrl("/uploads/" + fileName)
                                .isPrimary(i == 0) // first image is main
                                .product(product)
                                .build()
                    );
                }
            }
        }

        // Default image if none uploaded
        if (uploadedImages.isEmpty()) {
            uploadedImages.add(
                ProductImage.builder()
                        .imageUrl("/uploads/default-product.png")
                        .isPrimary(true)
                        .product(product)
                        .build()
            );
        }

        product.getImages().addAll(uploadedImages);
    }

    // Delete product images from disk
    private void deleteImageFilesForProduct(Product product) {
        if (product.getImages() == null) return;
        for (ProductImage img : product.getImages()) {
            if (img.getImageUrl() != null && !img.getImageUrl().isBlank()) {
                String filePathStr = img.getImageUrl().replace("/uploads/", "");
                Path filePath = Paths.get(uploadDir, filePathStr);
                try {
                    if (Files.exists(filePath)) Files.delete(filePath);
                } catch (IOException e) {
                    System.err.println("⚠️ Failed to delete image file: " + filePath + " -> " + e.getMessage());
                }
            }
        }
    }



    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<String> getAllCategories() {
        return productRepository.findAll()
                .stream()
                .map(Product::getCategory)
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getCategoriesWithSubCategories() {
        List<Product> products = productRepository.findAll();
        Map<String, Set<String>> categoryMap = new HashMap<>();

        for (Product p : products) {
            categoryMap.computeIfAbsent(p.getCategory(), k -> new HashSet<>())
                       .add(p.getSubCategory());
        }

        return categoryMap.entrySet().stream()
                .map(entry -> Map.of(
                        "category", entry.getKey(),
                        "subCategories", entry.getValue()
                ))
                .collect(Collectors.toList());
    }

    public List<Product> getProductsByCategoryAndSubcategory(String category, String subCategory) {
        return productRepository.findByCategoryIgnoreCaseAndSubCategoryIgnoreCase(category, subCategory);
    }

    public List<Product> searchProducts(String query) {
        return productRepository.findByNameContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrSubCategoryContainingIgnoreCase(
                query, query, query
        );
    }

    // ===============================
    // 🔹 Filtering & Sorting
    // ===============================

    public Page<ProductWithRatingDTO> getFilteredAndSortedProducts(String category, String sortBy, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        Page<Product> productPage;

        if (category != null && !category.equalsIgnoreCase("all") && !category.isBlank()) {
            productPage = productRepository.findByCategoryIgnoreCase(category, pageRequest);
        } else {
            productPage = productRepository.findAll(pageRequest);
        }

        List<ProductWithRatingDTO> dtoList = productPage.getContent().stream()
                .map(product -> {
                    Double avgRating = ratingRepository.findAverageRatingByProductId(product.getId());
                    return new ProductWithRatingDTO(product, avgRating == null ? 0.0 : avgRating);
                }).collect(Collectors.toList());

        switch ((sortBy == null ? "" : sortBy).toLowerCase()) {
            case "price_asc":
                dtoList.sort(Comparator.comparing(p -> p.getProduct().getPrice()));
                break;
            case "price_desc":
                dtoList.sort(Comparator.comparing((ProductWithRatingDTO p) -> p.getProduct().getPrice()).reversed());
                break;
            case "rating_asc":
                dtoList.sort(Comparator.comparing(ProductWithRatingDTO::getAverageRating));
                break;
            case "rating_desc":
            default:
                dtoList.sort(Comparator.comparing(ProductWithRatingDTO::getAverageRating).reversed());
                break;
        }

        return new PageImpl<>(dtoList, pageRequest, productPage.getTotalElements());
    }

    // ===============================
    // 🔹 Ratings
    // ===============================

    public ProductRating addRating(Product product, User user, int stars, String comment) {
        if (ratingRepository.existsByProductAndUser(product, user)) {
            throw new RuntimeException("⚠️ You have already rated this product");
        }
        ProductRating rating = new ProductRating();
        rating.setProduct(product);
        rating.setUser(user);
        rating.setStars(stars);
        rating.setComment(comment);
        return ratingRepository.save(rating);
    }

    public List<ProductRating> getRatingsByProduct(Product product) {
        return ratingRepository.findByProduct(product);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email).orElse(null);
    }
   
 
}


