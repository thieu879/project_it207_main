package com.data.backend.repository;

import com.data.backend.model.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
}