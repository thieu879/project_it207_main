package com.data.backend.service.category;

import com.data.backend.model.dto.request.CategoryRequest;
import com.data.backend.model.dto.response.CategoryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CategoryService {
    Page<CategoryResponse> findAll(Pageable pageable);
    CategoryResponse findById(Long id);
    CategoryResponse findByName(String name);
    CategoryResponse findByCategoryUrl(String categoryUrl);
    CategoryResponse create(CategoryRequest request);
    CategoryResponse update(Long id, CategoryRequest request);
    void delete(Long id);
}
