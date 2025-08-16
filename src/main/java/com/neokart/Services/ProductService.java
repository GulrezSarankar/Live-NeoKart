package com.neokart.Services;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Comparator;
import java.util.List;
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
import com.neokart.Entity.ProductRating;
import com.neokart.Entity.User;
import com.neokart.Repository.ProductRatingRepository;
import com.neokart.Repository.ProductRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProductService {
	@Autowired
	
	private ProductRatingRepository ratingRepository; // You'll create this
	@Autowired
	private ProductRepository productrepository;


	

	    @Value("${file.upload-dir}")
	    private String uploadDir;
	    
	    public Product getProductById(Long id) {
	        return productrepository.findById(id).orElse(null);
	    }


//	    public ProductService(ProductRepository productRepository) {
//	        this.productRepository = productRepository;
//	    }
// Only admin can add The Products
	    public Product addProduct(Product product, MultipartFile image) throws IOException {
	        if (image != null && !image.isEmpty()) {
	            // Create unique file name
	            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

	            // Ensure folder exists
	            Path filePath = Paths.get(uploadDir, fileName);
	            Files.createDirectories(filePath.getParent());

	            // Save file to disk
	            Files.write(filePath, image.getBytes());

	            // Store relative URL for frontend
	            product.setImageUrl("/uploads/" + fileName);
	        }

	        return productrepository.save(product);
	    }
	

	    public Product updateProduct(Long id, Product updatedProduct, MultipartFile image) throws IOException {
	        Product existing = productrepository.findById(id)
	                .orElseThrow(() -> new RuntimeException("Product not found"));

	        existing.setName(updatedProduct.getName());
	        existing.setDescription(updatedProduct.getDescription());
	        existing.setPrice(updatedProduct.getPrice());
	        existing.setStock(updatedProduct.getStock());
	        existing.setSku(updatedProduct.getSku());
	        existing.setCategory(updatedProduct.getCategory());

	        if (image != null && !image.isEmpty()) {
	            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
	            Path filePath = Paths.get(uploadDir, fileName);
	            Files.createDirectories(filePath.getParent());
	            Files.write(filePath, image.getBytes());
	            existing.setImageUrl("/uploads/" + fileName);
	        }

	        return productrepository.save(existing);
	    }

	    public void deleteProduct(Long id) {
	        productrepository.deleteById(id);
	    }

	    public List<Product> getAllProducts() {
	        return productrepository.findAll();
	    }
	    

	    public Page<ProductWithRatingDTO> getFilteredAndSortedProducts(String category, String sortBy, int page, int size) {
	        PageRequest pageRequest = PageRequest.of(page, size);

	        Page<Product> productPage;

	        if (category != null && !category.equalsIgnoreCase("all") && !category.isBlank()) {
	            productPage = productrepository.findByCategoryIgnoreCase(category, pageRequest);
	        } else {
	            productPage = productrepository.findAll(pageRequest);
	        }

	        List<ProductWithRatingDTO> dtoList = productPage.getContent().stream()
	            .map(product -> {
	                Double avgRating = ratingRepository.findAverageRatingByProductId(product.getId());
	                if (avgRating == null) avgRating = 0.0;
	                return new ProductWithRatingDTO(product, avgRating);
	            }).collect(Collectors.toList());

	        // Sort DTO list manually based on sortBy param
	        switch (sortBy.toLowerCase()) {
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

	    
//	    Ratings
	    

	    public ProductRating addRating(Product product, User user, int stars, String comment) {
	        if(ratingRepository.existsByProductAndUser(product, user)){
	            throw new RuntimeException("You have already rated this product");
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

	   
	    // Other service methods like addProduct, updateProduct, deleteProduct etc.
	}

