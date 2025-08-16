package com.neokart.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.neokart.DTO.AddToCart;
import com.neokart.DTO.CartResponseDto;
import com.neokart.DTO.UpdateCartItemRequest;
import com.neokart.Services.CartService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")

public class CartController {
	
	
    @Autowired
    private CartService cartService;

    
    @GetMapping("/me")
    public ResponseEntity<CartResponseDto> getMyCart(Authentication authentication) {
        String email = authentication.getName(); // JWT gives username/email
        return ResponseEntity.ok(cartService.getCartByEmail(email));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<CartResponseDto> getCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.getCart(userId));
    }

    // ---------------- Add To Cart ----------------
    @PostMapping("/{userId}/add")
    public ResponseEntity<CartResponseDto> addToCart(@PathVariable Long userId,
                                                     @RequestBody AddToCart request) {
        return ResponseEntity.ok(cartService.addToCart(userId, request));
    }

    // ---------------- Update Cart Item ----------------
    @PutMapping("/{userId}/update/{productId}")
    public ResponseEntity<CartResponseDto> updateCartItem(@PathVariable Long userId,
                                                          @PathVariable Long productId,
                                                          @RequestBody UpdateCartItemRequest request) {
        return ResponseEntity.ok(cartService.updateCartItem(userId, productId, request));
    }

    // ---------------- Remove Item ----------------
    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<CartResponseDto> removeItem(@PathVariable Long userId,
                                                      @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(userId, productId));
    }

    // ---------------- Clear Cart ----------------
    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<CartResponseDto> clearCart(@PathVariable Long userId) {
        return ResponseEntity.ok(cartService.clearCart(userId));
    }
  
	
}
