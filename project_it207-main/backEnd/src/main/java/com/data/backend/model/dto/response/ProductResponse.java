package com.data.backend.model.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Integer quantity;
    private String categoryName;
    private String imageUrl;
    private LocalDateTime createdAt;
}
