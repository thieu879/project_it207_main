package com.data.backend.service.wish;

import com.data.backend.model.dto.response.ProductResponse;
import com.data.backend.model.dto.response.WishlistResponse;
import com.data.backend.model.entity.Product;
import com.data.backend.model.entity.User;
import com.data.backend.model.entity.Wishlist;
import com.data.backend.repository.ProductRepository;
import com.data.backend.repository.WishlistRepository;
import com.data.backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {
    @Autowired private WishlistRepository wishlistRepository;
    @Autowired private UserService userService;
    @Autowired private ProductRepository productRepository;

    @Override
    public List<WishlistResponse> getWishlist(String username) {
        User user = userService.findUserByUsername(username);
        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void addProductToWishlist(String username, Long productId) {
        User user = userService.findUserByUsername(username);
        Product product = productRepository.findById(productId).orElseThrow(() -> new EntityNotFoundException("Product not found"));


        if (wishlistRepository.findByUserIdAndProductId(user.getId(), productId).isPresent()) {
            throw new IllegalStateException("Product is already in the wishlist.");
        }

        Wishlist wishlistItem = new Wishlist();
        wishlistItem.setUser(user);
        wishlistItem.setProduct(product);
        wishlistRepository.save(wishlistItem);
    }

    @Override
    public void removeProductFromWishlist(String username, Long productId) {
        User user = userService.findUserByUsername(username);

        if (!wishlistRepository.findByUserIdAndProductId(user.getId(), productId).isPresent()) {
            throw new EntityNotFoundException("Product not found in wishlist.");
        }
        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private WishlistResponse mapToResponse(Wishlist wishlist) {
        Product p = wishlist.getProduct();
        ProductResponse productResponse = ProductResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .price(p.getPrice())
                .imageUrl(p.getImageUrl())
                .build();

        return WishlistResponse.builder()
                .wishlistId(wishlist.getId())
                .product(productResponse)
                .build();
    }
}
