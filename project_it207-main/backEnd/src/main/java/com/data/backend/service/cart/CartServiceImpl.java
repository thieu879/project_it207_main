package com.data.backend.service.cart;

import com.data.backend.model.dto.request.CartRequest;
import com.data.backend.model.dto.response.CartItemResponse;
import com.data.backend.model.dto.response.CartResponse;
import com.data.backend.model.entity.*;
import com.data.backend.repository.*;
import com.data.backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl implements CartService {
    @Autowired private UserService userService;
    @Autowired private CartRepository cartRepository;
    @Autowired private ProductRepository productRepository;
    @Override public CartResponse getCartForUser(String username) { return mapCartToCartResponse(getOrCreateCart(userService.findUserByUsername(username))); }
    @Override
    public CartResponse addProductToCart(String username, CartRequest cartRequest) {
        User user = userService.findUserByUsername(username);
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(cartRequest.getProductId()).orElseThrow(() -> new EntityNotFoundException("Product not found"));
        CartItem cartItem = cart.getItems().stream().filter(item -> item.getProduct().getId().equals(product.getId())).findFirst().orElse(new CartItem());
        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cart.getItems().add(cartItem);
        }
        cartItem.setQuantity(cartItem.getQuantity() + cartRequest.getQuantity());
        return mapCartToCartResponse(cartRepository.save(cart));
    }
    @Override
    public CartResponse updateProductInCart(String username, Long productId, int quantity) {
        Cart cart = getOrCreateCart(userService.findUserByUsername(username));
        if (quantity <= 0) {
            cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        } else {
            CartItem itemToUpdate = cart.getItems().stream().filter(item -> item.getProduct().getId().equals(productId)).findFirst().orElseThrow(() -> new EntityNotFoundException("Product not in cart"));
            itemToUpdate.setQuantity(quantity);
        }
        return mapCartToCartResponse(cartRepository.save(cart));
    }
    @Override public void removeProductFromCart(String username, Long productId) {
        Cart cart = getOrCreateCart(userService.findUserByUsername(username));
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        cartRepository.save(cart);
    }
    @Override public void clearCart(String username) {
        Cart cart = getOrCreateCart(userService.findUserByUsername(username));
        cart.getItems().clear();
        cartRepository.save(cart);
    }
    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUserId(user.getId()).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUser(user);
            newCart.setItems(new ArrayList<>());
            user.setCart(newCart);
            return cartRepository.save(newCart);
        });
    }
    private CartResponse mapCartToCartResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setCartId(cart.getId());
        response.setItems(cart.getItems().stream().map(this::mapCartItemToResponse).collect(Collectors.toList()));
        response.setTotalPrice(cart.getItems().stream().mapToDouble(item -> item.getProduct().getPrice() * item.getQuantity()).sum());
        return response;
    }
    private CartItemResponse mapCartItemToResponse(CartItem item) {
        CartItemResponse res = new CartItemResponse();
        res.setProductId(item.getProduct().getId());
        res.setProductName(item.getProduct().getName());
        res.setPrice(item.getProduct().getPrice());
        res.setQuantity(item.getQuantity());
        res.setImageUrl(item.getProduct().getImageUrl());
        return res;
    }
}
