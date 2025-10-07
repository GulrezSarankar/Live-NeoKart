//package com.neokart.Controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.neokart.DTO.WishListDto;
//import com.neokart.DTO.WishListMapper;
//import com.neokart.Entity.User;
//import com.neokart.Entity.WishList;
//import com.neokart.Repository.UserRepository;
//import com.neokart.Services.WishListService;
//@RestController
//@RequestMapping("/api/wishlist")
//@CrossOrigin(origins = "http://localhost:3000")
//public class WishListController {
//	
//	
//    @Autowired
//    private WishListService wishlistService;
//
//    @Autowired
//    private UserRepository userRepo;
//
//    private Long getCurrentUserId() {
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
//            throw new RuntimeException("Unauthorized");
//        }
//
//        Object principal = authentication.getPrincipal();
//
//        String email = null;
//
//        if (principal instanceof UserDetails) {
//            email = ((UserDetails) principal).getUsername();
//        } else if (principal instanceof String) {
//            email = (String) principal;
//        }
//
//        if (email == null) {
//            throw new RuntimeException("Unauthorized");
//        }
//
//        User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
//        return user.getId();
//    }
//
//    @PostMapping("/add")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<WishListDto> addToWishlist(@RequestParam Long productId) {
//        Long userId = getCurrentUserId();
//        WishList wishlist = wishlistService.addProductToWishlist(userId, productId);
//        return ResponseEntity.ok(WishListMapper.toDTO(wishlist));
//    }
//
//    @DeleteMapping("/remove")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<WishListDto> removeFromWishlist(@RequestParam Long productId) {
//        Long userId = getCurrentUserId();
//        WishList wishlist = wishlistService.removeProductFromWishlist(userId, productId);
//        return ResponseEntity.ok(WishListMapper.toDTO(wishlist));
//    }
//
//    @GetMapping("/me")
//    @PreAuthorize("isAuthenticated()")
//    public ResponseEntity<WishListDto> getMyWishlist() {
//        Long userId = getCurrentUserId();
//        WishList wishlist = wishlistService.getWishlistByUser(userId);
//        return ResponseEntity.ok(WishListMapper.toDTO(wishlist));
//    }
//
//}
