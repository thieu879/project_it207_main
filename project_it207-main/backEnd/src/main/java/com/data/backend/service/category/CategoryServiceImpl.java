package com.data.backend.service.category;

import com.data.backend.model.dto.request.CategoryRequest;
import com.data.backend.model.dto.response.CategoryResponse;
import com.data.backend.model.entity.Category;
import com.data.backend.repository.CategoryRepository;
import com.data.backend.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<CategoryResponse> findAll(Pageable pageable) {
        return categoryRepository.findAll(pageable)
                .map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));
        return toResponse(c);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse findByName(String name) {
        Category c = categoryRepository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with name: " + name));
        return toResponse(c);
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryResponse findByCategoryUrl(String categoryUrl) {
        Category c = categoryRepository.findByCategoryUrl(categoryUrl)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with url: " + categoryUrl));
        return toResponse(c);
    }

    @Override
    public CategoryResponse create(CategoryRequest request) {
        if (categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        if (request.getCategoryUrl() != null && !request.getCategoryUrl().isBlank()
                && categoryRepository.existsByCategoryUrl(request.getCategoryUrl())) {
            throw new IllegalArgumentException("Category URL already exists");
        }
        Category c = new Category();
        c.setName(request.getName());
        c.setCategoryUrl(request.getCategoryUrl());
        return toResponse(categoryRepository.save(c));
    }

    @Override
    public CategoryResponse update(Long id, CategoryRequest request) {
        Category c = categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + id));

        if (!c.getName().equalsIgnoreCase(request.getName())
                && categoryRepository.existsByNameIgnoreCase(request.getName())) {
            throw new IllegalArgumentException("Category name already exists");
        }
        if (request.getCategoryUrl() != null && !request.getCategoryUrl().isBlank()
                && (c.getCategoryUrl() == null || !c.getCategoryUrl().equals(request.getCategoryUrl()))
                && categoryRepository.existsByCategoryUrl(request.getCategoryUrl())) {
            throw new IllegalArgumentException("Category URL already exists");
        }

        c.setName(request.getName());
        c.setCategoryUrl(request.getCategoryUrl());
        return toResponse(categoryRepository.save(c));
    }

    @Override
    public void delete(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new EntityNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryResponse toResponse(Category c) {
        long count = productRepository.countByCategory_Id(c.getId());
        return CategoryResponse.builder()
                .id(c.getId())
                .name(c.getName())
                .categoryUrl(c.getCategoryUrl())
                .productCount(count)
                .build();
    }
}
