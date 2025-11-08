package com.data.backend.model.dto.response;
import lombok.*;

@Data
@Builder
public class WishlistResponse {
    private Long wishlistId;
    private ProductResponse product;
}
