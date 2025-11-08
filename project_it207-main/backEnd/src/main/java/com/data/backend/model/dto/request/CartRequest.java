package com.data.backend.model.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CartRequest {
    @NotNull private Long productId;
    @NotNull @Min(1) private int quantity;
}
