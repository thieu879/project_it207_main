package com.data.backend.service.wish;

import com.data.backend.model.dto.response.WishlistResponse;
import java.util.List;

public interface WishlistService {
    List<WishlistResponse> getWishlist(String username);
    void addProductToWishlist(String username, Long productId);
    void removeProductFromWishlist(String username, Long productId);
}
