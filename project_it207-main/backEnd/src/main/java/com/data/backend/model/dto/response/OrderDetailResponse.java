package com.data.backend.model.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderDetailResponse {
    private Long id;
    private String username;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private List<CartItemResponse> orderItems;
    private List<OrderTrackingResponse> trackingHistory;
}
