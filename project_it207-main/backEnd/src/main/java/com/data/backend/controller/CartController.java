package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.CartRequest;
import com.data.backend.model.dto.response.CartResponse;
import com.data.backend.service.cart.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/v1/cart")
public class CartController {
    @Autowired private CartService cartService;
    @GetMapping
    public ResponseEntity<APIResponse<CartResponse>> getMyCart(Authentication authentication) {
        CartResponse cart = cartService.getCartForUser(authentication.getName());
        return new ResponseEntity<>(APIResponse.<CartResponse>builder().success(true).message("Cart fetched.").data(cart).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PostMapping
    public ResponseEntity<APIResponse<CartResponse>> addProductToMyCart(Authentication authentication, @Valid @RequestBody CartRequest request) {
        CartResponse cart = cartService.addProductToCart(authentication.getName(), request);
        return new ResponseEntity<>(APIResponse.<CartResponse>builder().success(true).message("Product added to cart.").data(cart).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PutMapping("/products/{productId}")
    public ResponseEntity<APIResponse<CartResponse>> updateProductInCart(Authentication authentication, @PathVariable Long productId, @RequestParam int quantity) {
        CartResponse cart = cartService.updateProductInCart(authentication.getName(), productId, quantity);
        return new ResponseEntity<>(APIResponse.<CartResponse>builder().success(true).message("Cart updated.").data(cart).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<APIResponse<Void>> removeProductFromCart(Authentication authentication, @PathVariable Long productId) {
        cartService.removeProductFromCart(authentication.getName(), productId);
        return new ResponseEntity<>(APIResponse.<Void>builder().success(true).message("Product removed.").status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @DeleteMapping
    public ResponseEntity<APIResponse<Void>> clearMyCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return new ResponseEntity<>(APIResponse.<Void>builder().success(true).message("Cart cleared.").status(HttpStatus.OK).build(), HttpStatus.OK);
    }
}
