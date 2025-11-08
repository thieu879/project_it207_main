package com.data.backend.model.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Data
public class CartItemResponse {
    private Long productId;
    private String productName;
    private int quantity;
    private double price;
    private String imageUrl;
}
