package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.response.OrderDetailResponse;
import com.data.backend.service.order.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    @Autowired private OrderService orderService;
    @PostMapping
    public ResponseEntity<APIResponse<OrderDetailResponse>> createOrder(Authentication authentication) {
        OrderDetailResponse order = orderService.createOrderFromCart(authentication.getName());
        return new ResponseEntity<>(APIResponse.<OrderDetailResponse>builder().success(true).message("Order created successfully.").data(order).status(HttpStatus.CREATED).build(), HttpStatus.CREATED);
    }
    @GetMapping
    public ResponseEntity<APIResponse<List<OrderDetailResponse>>> getMyOrders(Authentication authentication) {
        List<OrderDetailResponse> orders = orderService.getOrdersForUser(authentication.getName());
        return new ResponseEntity<>(APIResponse.<List<OrderDetailResponse>>builder().success(true).message("Orders fetched successfully.").data(orders).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @GetMapping("/{orderId}")
    public ResponseEntity<APIResponse<OrderDetailResponse>> getOrderDetails(Authentication authentication, @PathVariable Long orderId) {
        OrderDetailResponse orderDetails = orderService.getOrderDetails(authentication.getName(), orderId);
        return new ResponseEntity<>(APIResponse.<OrderDetailResponse>builder().success(true).message("Order details fetched successfully.").data(orderDetails).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<APIResponse<Void>> cancelOrder(Authentication authentication, @PathVariable Long orderId) {
        orderService.cancelOrder(authentication.getName(), orderId);
        return new ResponseEntity<>(APIResponse.<Void>builder().success(true).message("Order cancelled successfully.").status(HttpStatus.OK).build(), HttpStatus.OK);
    }
}
