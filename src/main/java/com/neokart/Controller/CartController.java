package com.neokart.Controller;
	
import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.Entity.Cart;
import com.neokart.Services.CartService;

import lombok.RequiredArgsConstructor;
	
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = {
	    "http://localhost:3000",
	    "https://live-neo-kart.vercel.app"
	})	
public class CartController {
		
		@Autowired
		 private  CartService cartService;
	
//	    public CartController(CartService cartService) {
//	        this.cartService = cartService;
//	    }
	
		    // ✅ Add product to cart
		    @PostMapping("/add")
		    @PreAuthorize("hasRole('USER')")
		    public ResponseEntity<Cart> addToCart(
		            @RequestParam Long productId,
		            @RequestParam(defaultValue = "1") int quantity,
		            Principal principal) {
	
		        String email = principal.getName(); // get logged-in user from JWT
		        Cart updatedCart = cartService.addToCartByEmail(email, productId, quantity);
		        return ResponseEntity.ok(updatedCart);
		    }
	
		    // ✅ Get current user's cart
		    @GetMapping("/me")
		    @PreAuthorize("hasRole('USER')")
		    public ResponseEntity<Cart> getCart(Principal principal) {
		        String email = principal.getName();
		        Cart cart = cartService.getCartByEmail(email);
		        return ResponseEntity.ok(cart);
		    }
	
		    // ✅ Update cart item quantity
		    @PutMapping("/update/{productId}")
		    @PreAuthorize("hasRole('USER')")
		    public ResponseEntity<Cart> updateItem(
		            @PathVariable Long productId,
		            @RequestParam int quantity,
		            Principal principal) {
	
		        String email = principal.getName();
		        Cart cart = cartService.updateCartItem(email, productId, quantity);
		        return ResponseEntity.ok(cart);
		    }
	
		    // ✅ Remove item
		    @DeleteMapping("/remove/{productId}")
		    @PreAuthorize("hasRole('USER')")
		    public ResponseEntity<Cart> removeItem(
		            @PathVariable Long productId,
		            Principal principal) {
	
		        String email = principal.getName();
		        Cart cart = cartService.removeItem(email, productId);
		        return ResponseEntity.ok(cart);
		    }
	
		    // ✅ Clear cart
		    @DeleteMapping("/clear")
		    @PreAuthorize("hasRole('USER')")
		    public ResponseEntity<Cart> clearCart(Principal principal) {
		        String email = principal.getName();
		        Cart cart = cartService.clearCart(email);
		        return ResponseEntity.ok(cart);
		    }
	
	
	
	
	}
