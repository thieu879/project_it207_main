package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.response.WishlistResponse;
import com.data.backend.service.wish.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlist")
public class WishlistController {
    @Autowired private WishlistService wishlistService;
    @GetMapping
    public ResponseEntity<APIResponse<List<WishlistResponse>>> getMyWishlist(Authentication authentication) {
        List<WishlistResponse> wishlist = wishlistService.getWishlist(authentication.getName());
        return new ResponseEntity<>(APIResponse.<List<WishlistResponse>>builder().success(true).message("Wishlist fetched successfully.").data(wishlist).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PostMapping("/product/{productId}")
    public ResponseEntity<APIResponse<Void>> addProductToWishlist(Authentication authentication, @PathVariable Long productId) {
        wishlistService.addProductToWishlist(authentication.getName(), productId);
        return new ResponseEntity<>(APIResponse.<Void>builder().success(true).message("Product added to wishlist.").status(HttpStatus.CREATED).build(), HttpStatus.CREATED);
    }
    @DeleteMapping("/product/{productId}")
    public ResponseEntity<APIResponse<Void>> removeProductFromWishlist(Authentication authentication, @PathVariable Long productId) {
        wishlistService.removeProductFromWishlist(authentication.getName(), productId);
        return new ResponseEntity<>(APIResponse.<Void>builder().success(true).message("Product removed from wishlist.").status(HttpStatus.OK).build(), HttpStatus.OK);
    }
}
