package com.data.backend.service.product;

import com.data.backend.model.dto.request.ProductRequest;
import com.data.backend.model.dto.response.CategoryResponse;
import com.data.backend.model.dto.response.ProductResponse;
import com.data.backend.model.entity.Category;
import com.data.backend.model.entity.Product;
import com.data.backend.repository.CategoryRepository;
import com.data.backend.repository.ProductRepository;
import com.data.backend.service.CloudinaryService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private CloudinaryService cloudinaryService;
    
    public ProductResponse toProductResponse(Product product) {
        CategoryResponse categoryResponse = null;
        if (product.getCategory() != null) {
            categoryResponse = CategoryResponse.builder()
                    .id(product.getCategory().getId())
                    .name(product.getCategory().getName())
                    .categoryUrl(product.getCategory().getCategoryUrl())
                    .build();
        }
        
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .quantity(product.getQuantity())
                .category(categoryResponse)
                .imageUrl(product.getImageUrl())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
    
    @Override 
    public Page<Product> findAll(Pageable pageable, String search) { 
        if (search != null && !search.trim().isEmpty()) {
            return productRepository.findByNameContainingIgnoreCase(search.trim(), pageable);
        }
        return productRepository.findAll(pageable); 
    }
    
    public Page<ProductResponse> findAllAsResponse(Pageable pageable, String search) {
        Page<Product> productPage = findAll(pageable, search);
        return new PageImpl<>(
                productPage.getContent().stream()
                        .map(this::toProductResponse)
                        .collect(Collectors.toList()),
                pageable,
                productPage.getTotalElements()
        );
    }
    
    @Override 
    public Product findById(Long id) { 
        return productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id)); 
    }
    
    public ProductResponse findByIdAsResponse(Long id) {
        Product product = findById(id);
        return toProductResponse(product);
    }
    
    @Override
    public Product save(ProductRequest request, MultipartFile imageFile) throws IOException {
        String imageUrl = cloudinaryService.uploadFile(imageFile);
        Category category = categoryRepository.findById(request.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found with id: " + request.getCategoryId()));
        Product newProduct = new Product();
        newProduct.setName(request.getName());
        newProduct.setDescription(request.getDescription());
        newProduct.setPrice(request.getPrice());
        newProduct.setQuantity(request.getQuantity());
        newProduct.setCategory(category);
        newProduct.setImageUrl(imageUrl);
        return productRepository.save(newProduct);
    }
}
