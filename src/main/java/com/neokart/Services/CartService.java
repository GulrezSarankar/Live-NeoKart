package com.neokart.Services;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.DTO.AddToCart;
import com.neokart.DTO.CartItemDto;
import com.neokart.DTO.CartResponseDto;
import com.neokart.DTO.UpdateCartItemRequest;
import com.neokart.Entity.Cart;
import com.neokart.Entity.CartItem;
import com.neokart.Entity.Product;
import com.neokart.Entity.User;
import com.neokart.Repository.CartItemRepository;
import com.neokart.Repository.CartRepository;
import com.neokart.Repository.ProductRepository;
import com.neokart.Repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class CartService {
	
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private CartItemRepository cartItemRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;

    // Get or create a cart
    private Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ✅ Pass userId, not User object
        return cartRepository.findByUser_Id(user.getId())
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    @Transactional
    public CartResponseDto addToCart(Long userId, AddToCart request) {
        Cart cart = getOrCreateCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(product.getId()))
                .findFirst();

        CartItem item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
            item.setLineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        } else {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setQuantity(request.getQuantity());
            item.setUnitPrice(product.getPrice());
            item.setLineTotal(product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
            cart.getItems().add(item);
        }

        cartItemRepository.save(item);
        recomputeTotals(cart);
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDto updateCartItem(Long userId, Long productId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        item.setQuantity(request.getQuantity());
        item.setLineTotal(item.getUnitPrice().multiply(BigDecimal.valueOf(request.getQuantity())));
        cartItemRepository.save(item);

        recomputeTotals(cart);
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDto removeItem(Long userId, Long productId) {
        Cart cart = getOrCreateCart(userId);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Item not found in cart"));

        cart.getItems().remove(item);
        cartItemRepository.delete(item);

        recomputeTotals(cart);
        return toDto(cartRepository.save(cart));
    }

    @Transactional
    public CartResponseDto clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();

        recomputeTotals(cart);
        return toDto(cartRepository.save(cart));
    }

    public CartResponseDto getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return toDto(cart);
    }

    private void recomputeTotals(Cart cart) {
        BigDecimal subtotal = cart.getItems().stream()
                .map(CartItem::getLineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setSubtotal(subtotal);
        cart.setShipping(BigDecimal.ZERO);
        cart.setTotal(subtotal.add(cart.getShipping()));
    }

    private CartResponseDto toDto(Cart cart) {
        return CartResponseDto.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getId())
                .subtotal(cart.getSubtotal())
                .shipping(cart.getShipping())
                .total(cart.getTotal())
                .items(cart.getItems().stream().map(i ->
                        CartItemDto.builder()
                                .itemId(i.getId())
                                .productId(i.getProduct().getId())
                                .name(i.getProduct().getName())
                                .imageUrl(i.getProduct().getImageUrl())
                                .unitPrice(i.getUnitPrice())
                                .quantity(i.getQuantity())
                                .lineTotal(i.getLineTotal())
                                .build()
                ).collect(Collectors.toList()))
                .build();
    }
    
    public CartResponseDto getCartByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return getCart(user.getId());
    }

}
