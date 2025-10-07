	package com.neokart.Services;
	
	import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Cart;
import com.neokart.Entity.CartItem;
import com.neokart.Entity.Product;
import com.neokart.Entity.User;
import com.neokart.Repository.CartRepository;
import com.neokart.Repository.ProductRepository;
import com.neokart.Repository.UserRepository;

import jakarta.transaction.Transactional;
	
	@Service
	@Transactional
	public class CartService {
	
	
		
		@Autowired
	    private  CartRepository cartRepository;
		
		@Autowired
	    private  UserRepository userRepository;
		
		@Autowired
	    private  ProductRepository productRepository;
	
	    public CartService(CartRepository cartRepository, UserRepository userRepository, ProductRepository productRepository) {
	        this.cartRepository = cartRepository;
	        this.userRepository = userRepository;
	        this.productRepository = productRepository;
	    }
	
	    // ✅ Add product to cart by email (JWT)
	    public Cart addToCartByEmail(String email, Long productId, int quantity) {
	        User user = userRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	
	        Product product = productRepository.findById(productId)
	                .orElseThrow(() -> new RuntimeException("Product not found"));
	
	        Cart cart = cartRepository.findByUser(user)
	                .orElse(Cart.builder().user(user).totalPrice(BigDecimal.ZERO).build());
	
	        // Check if product already exists
	        CartItem existingItem = cart.getItems().stream()
	                .filter(i -> i.getProduct().getId().equals(productId))
	                .findFirst()
	                .orElse(null);
	
	        if (existingItem != null) {
	            existingItem.setQuantity(existingItem.getQuantity() + quantity);
	            if (existingItem.getPrice() == null) existingItem.setPrice(product.getPrice());
	        } else {
	            CartItem newItem = CartItem.builder()
	                    .product(product)
	                    .quantity(quantity)
	                    .price(product.getPrice())
	                    .cart(cart)
	                    .build();
	            cart.addItem(newItem);
	        }
	
	        cart.recalcTotal();
	        return cartRepository.save(cart);
	    }
	
	    // ✅ Fetch cart by email
	    public Cart getCartByEmail(String email) {
	        User user = userRepository.findByEmail(email)
	                .orElseThrow(() -> new RuntimeException("User not found"));
	        return cartRepository.findByUser(user).orElse(Cart.builder().user(user).totalPrice(BigDecimal.ZERO).build());
	    }
	
	    // ✅ Update item
	    public Cart updateCartItem(String email, Long productId, int quantity) {
	        Cart cart = getCartByEmail(email);
	        CartItem item = cart.getItems().stream()
	                .filter(i -> i.getProduct().getId().equals(productId))
	                .findFirst()
	                .orElseThrow(() -> new RuntimeException("Item not found"));
	
	        item.setQuantity(quantity);
	        cart.recalcTotal();
	        return cartRepository.save(cart);
	    }
	
	    // ✅ Remove item
	    public Cart removeItem(String email, Long productId) {
	        Cart cart = getCartByEmail(email);
	        cart.getItems().removeIf(i -> i.getProduct().getId().equals(productId));
	        cart.recalcTotal();
	        return cartRepository.save(cart);
	    }
	
	    // ✅ Clear cart
	    public Cart clearCart(String email) {
	        Cart cart = getCartByEmail(email);
	        cart.getItems().clear();
	        cart.recalcTotal();
	        return cartRepository.save(cart);
	    }
	    
//	    public CartResponseDto convertToDto(Cart cart) {
//	        List<CartItemDto> items = cart.getItems().stream()
//	            .map(i -> CartItemDto.builder()
//	                .productId(i.getProduct().getId())
//	                .productName(i.getProduct().getName())
//	                .quantity(i.getQuantity())
//	                .price(i.getPrice())
//	                .totalPrice(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
//	                .imageUrl(i.getProduct().getImageUrl()) // ✅ include product image
//	                .build())
//	            .collect(Collectors.toList());
//
//	        return CartResponseDto.builder()
//	            .cartId(cart.getId())
//	            .userId(cart.getUser().getId())
//	            .subtotal(cart.getTotalPrice())
//	            .shipping(BigDecimal.valueOf(50)) // optional
//	            .total(cart.getTotalPrice().add(BigDecimal.valueOf(50)))
//	            .items(items)
//	            .build();
//	    }

	    
	    
	}
