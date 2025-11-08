package com.data.backend.service.cart;

import com.data.backend.model.dto.request.CartRequest;
import com.data.backend.model.dto.response.CartResponse;

public interface CartService {
    CartResponse getCartForUser(String username);
    CartResponse addProductToCart(String username, CartRequest cartRequest);
    CartResponse updateProductInCart(String username, Long productId, int quantity);
    void removeProductFromCart(String username, Long productId);
    void clearCart(String username);
}
