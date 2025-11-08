package com.data.backend.service.order;

import com.data.backend.model.constants.ERole;
import com.data.backend.model.dto.response.CartItemResponse;
import com.data.backend.model.dto.response.OrderDetailResponse;
import com.data.backend.model.dto.response.OrderTrackingResponse;
import com.data.backend.model.entity.*;
import com.data.backend.repository.*;
import com.data.backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {
    @Autowired private UserService userService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private CartRepository cartRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private OrderTrackingRepository orderTrackingRepository;

    @Override
    public OrderDetailResponse createOrderFromCart(String username) {
        User user = userService.findUserByUsername(username);
        Cart cart = cartRepository.findByUserId(user.getId()).orElseThrow(() -> new IllegalStateException("User's cart is empty or does not exist."));
        if (cart.getItems().isEmpty()) {
            throw new IllegalStateException("Cannot create an order from an empty cart.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setOrderItems(new ArrayList<>());
        order.setTrackingHistory(new ArrayList<>());

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = cart.getItems().stream().map(cartItem -> {
            Product product = productRepository.findById(cartItem.getProduct().getId()).orElseThrow(() -> new EntityNotFoundException("Product not found"));
            if (product.getQuantity() < cartItem.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + product.getName());
            }
            product.setQuantity(product.getQuantity() - cartItem.getQuantity());

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPricePerUnit(product.getPrice());
            return orderItem;
        }).collect(Collectors.toList());

        savedOrder.setOrderItems(orderItems);
        savedOrder.setTotalAmount(orderItems.stream().mapToDouble(item -> item.getPricePerUnit() * item.getQuantity()).sum());

        OrderTracking initialStatus = new OrderTracking();
        initialStatus.setOrder(savedOrder);
        initialStatus.setStatus("PENDING");
        initialStatus.setLocation("Warehouse");
        orderTrackingRepository.save(initialStatus);
        savedOrder.getTrackingHistory().add(initialStatus);
        cart.getItems().clear();
        cartRepository.save(cart);
        return mapOrderToDetailResponse(savedOrder);
    }

    @Override
    public List<OrderDetailResponse> getOrdersForUser(String username) {
        User user = userService.findUserByUsername(username);
        return orderRepository.findByUserId(user.getId()).stream().map(this::mapOrderToDetailResponse).collect(Collectors.toList());
    }

    @Override
    public OrderDetailResponse getOrderDetails(String username, Long orderId) {
        User user = userService.findUserByUsername(username);
        Order order = findOrderByIdAndCheckOwnership(orderId, user);
        return mapOrderToDetailResponse(order);
    }

    @Override
    public void cancelOrder(String username, Long orderId) {
        User user = userService.findUserByUsername(username);
        Order order = findOrderByIdAndCheckOwnership(orderId, user);

        OrderTracking latestStatus = order.getTrackingHistory().stream()
                .max((t1, t2) -> t1.getTimestamp().compareTo(t2.getTimestamp()))
                .orElseThrow(() -> new IllegalStateException("Order has no tracking history."));

        if (!"PENDING".equalsIgnoreCase(latestStatus.getStatus())) {
            throw new IllegalStateException("Order cannot be cancelled as it is already being processed.");
        }

        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
        }

        OrderTracking cancelledStatus = new OrderTracking();
        cancelledStatus.setOrder(order);
        cancelledStatus.setStatus("CANCELLED");
        cancelledStatus.setLocation("Customer Request");
        orderTrackingRepository.save(cancelledStatus); // LƯU TƯỜNG MINH

        order.getTrackingHistory().add(cancelledStatus);
    }

    private Order findOrderByIdAndCheckOwnership(Long orderId, User user) {
        Order order = orderRepository.findById(orderId).orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + orderId));
        boolean isAdmin = user.getRoles().stream().anyMatch(r -> r.getRoleName() == ERole.ROLE_ADMIN);
        if (!order.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new SecurityException("User does not have permission to access this order.");
        }
        return order;
    }

    private OrderDetailResponse mapOrderToDetailResponse(Order order) {
        return OrderDetailResponse.builder()
                .id(order.getId())
                .username(order.getUser().getUsername())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .orderItems(order.getOrderItems().stream().map(item -> {
                    CartItemResponse res = new CartItemResponse();
                    res.setProductId(item.getProduct().getId());
                    res.setProductName(item.getProduct().getName());
                    res.setPrice(item.getPricePerUnit());
                    res.setQuantity(item.getQuantity());
                    res.setImageUrl(item.getProduct().getImageUrl());
                    return res;
                }).collect(Collectors.toList()))
                .trackingHistory(order.getTrackingHistory().stream().map(track -> {
                    OrderTrackingResponse res = new OrderTrackingResponse();
                    res.setStatus(track.getStatus());
                    res.setLocation(track.getLocation());
                    res.setTimestamp(track.getTimestamp());
                    return res;
                }).collect(Collectors.toList()))
                .build();
    }
}
