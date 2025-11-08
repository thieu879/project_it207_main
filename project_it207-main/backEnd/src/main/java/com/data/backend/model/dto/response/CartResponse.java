package com.data.backend.model.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.time.LocalDateTime;

@Getter
@Setter
@Data
public class CartResponse {
    private Long cartId;
    private List<CartItemResponse> items;
    private double totalPrice;
}
