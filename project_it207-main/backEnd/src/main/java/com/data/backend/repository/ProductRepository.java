package com.data.backend.repository;

import com.data.backend.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {
    long countByCategory_Id(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> findByNameContainingIgnoreCase(@Param("search") String search, Pageable pageable);
}