package com.neokart.Services;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
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
import org.springframework.transaction.annotation.Transactional;
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
   
    
////    Bulk Add Products 
//    @Transactional
//    public int saveProductsFromCsv(MultipartFile file) throws IOException {
//        if (file.isEmpty()) {
//            throw new RuntimeException("CSV file is empty or missing");
//        }
//
//        List<Product> products = new ArrayList<>();
//
//        // Read directly from file input stream
//        List<String> lines = new BufferedReader(
//                new InputStreamReader(file.getInputStream()))
//                .lines()
//                .collect(Collectors.toList());
//
//        if (lines.isEmpty()) {
//            throw new RuntimeException("CSV file has no content");
//        }
//
//        // Skip header line
//        for (int i = 1; i < lines.size(); i++) {
//            String[] data = lines.get(i).split(",");
//
//            if (data.length < 7) {
//                throw new RuntimeException("Invalid CSV format at line " + (i + 1));
//            }
//
//            Product product = new Product();
//            product.setName(data[0].trim());
//            product.setDescription(data[1].trim());
//            product.setPrice(new BigDecimal(data[2].trim()));
//            product.setStock(Integer.parseInt(data[3].trim()));
//            product.setSku(data[4].trim());
//            product.setCategory(data[5].trim());
//            product.setSubCategory(data[6].trim());
//            product.setImages(new ArrayList<>());
//
//            products.add(product);
//        }
//
//        productRepository.saveAll(products);
//        return products.size();
//    }
    
    public int saveProductsFromCsv(MultipartFile file) throws IOException {
        List<Product> products = new ArrayList<>();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String header = reader.readLine(); // Skip header
            if (header == null) throw new IOException("Empty CSV file");

            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (line.trim().isEmpty()) continue;

                String[] data = line.split(",", -1); // keep empty cells

                if (data.length < 8) {
                    System.err.println("⚠️ Skipping line " + lineNumber + " - insufficient columns");
                    continue;
                }

                try {
                    Product product = new Product();
                    product.setName(data[0].trim());
                    product.setDescription(data[1].trim());

                    // 🧮 Safe numeric parsing
                    String priceStr = data[2].replaceAll("[^0-9.]", "").trim();
                    String stockStr = data[3].replaceAll("[^0-9]", "").trim();
                    product.setPrice(new BigDecimal(priceStr.isEmpty() ? "0" : priceStr));
                    product.setStock(Integer.parseInt(stockStr.isEmpty() ? "0" : stockStr));

                    product.setSku(data[4].trim());
                    product.setCategory(data[5].trim());
                    product.setSubCategory(data[6].trim());

                    // 🖼️ Multiple image URLs
                    String imageUrls = data[7].trim();
                    List<ProductImage> imageList = new ArrayList<>();

                    if (!imageUrls.isEmpty()) {
                        String[] urls = imageUrls.split("[;,]"); // both , and ; accepted
                        for (int i = 0; i < urls.length; i++) {
                            String url = urls[i].trim();
                            if (!url.isEmpty()) {
                                ProductImage image = ProductImage.builder()
                                        .imageUrl(url)
                                        .isPrimary(i == 0) // first image = main
                                        .product(product)
                                        .build();
                                imageList.add(image);
                            }
                        }
                    }

                    product.setImages(imageList);
                    products.add(product);

                } catch (Exception e) {
                    System.err.println("⚠️ Skipping invalid line " + lineNumber + ": " + e.getMessage());
                }
            }
        }

        // 💾 Save all products (images cascade automatically)
        productRepository.saveAll(products);
        return products.size();
    }


 
}


