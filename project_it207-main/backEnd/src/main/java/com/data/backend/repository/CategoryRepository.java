package com.data.backend.repository;

import com.data.backend.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNameIgnoreCase(String name);
    Optional<Category> findByNameIgnoreCase(String name);
    boolean existsByCategoryUrl(String categoryUrl);
    Optional<Category> findByCategoryUrl(String categoryUrl);
}
