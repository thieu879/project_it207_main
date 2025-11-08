package com.data.backend.service.order;

import com.data.backend.model.dto.response.OrderDetailResponse;
import java.util.List;

public interface OrderService {
    OrderDetailResponse createOrderFromCart(String username);
    List<OrderDetailResponse> getOrdersForUser(String username);
    OrderDetailResponse getOrderDetails(String username, Long orderId);
    void cancelOrder(String username, Long orderId);
}