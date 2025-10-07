package com.neokart.Services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.neokart.Entity.Product;
import com.neokart.Entity.User;
import com.neokart.Entity.WishList;
import com.neokart.Repository.ProductRepository;
import com.neokart.Repository.UserRepository;
import com.neokart.Repository.WishListRepository;

@Service
public class WishListService {
	

    @Autowired
    private WishListRepository wishlistRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ProductRepository productRepo;

    public WishList getOrCreateWishlist(User user) {
        return wishlistRepo.findByUser(user).orElseGet(() -> {
            WishList wishlist = new WishList();
            wishlist.setUser(user);
            return wishlistRepo.save(wishlist);
        });
    }

    public WishList addProductToWishlist(Long userId, Long productId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        Product product = productRepo.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        WishList wishlist = getOrCreateWishlist(user);
        wishlist.getProducts().add(product);
        return wishlistRepo.save(wishlist);
    }

    public WishList removeProductFromWishlist(Long userId, Long productId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        WishList wishlist = getOrCreateWishlist(user);
        wishlist.getProducts().removeIf(p -> p.getId().equals(productId));
        return wishlistRepo.save(wishlist);
    }

    public WishList getWishlistByUser(Long userId) {
        User user = userRepo.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return getOrCreateWishlist(user);
    }

}
