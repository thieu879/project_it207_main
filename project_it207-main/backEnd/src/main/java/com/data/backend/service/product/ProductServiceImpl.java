package com.data.backend.service.product;

import com.data.backend.model.dto.request.ProductRequest;
import com.data.backend.model.entity.Category;
import com.data.backend.model.entity.Product;
import com.data.backend.repository.CategoryRepository;
import com.data.backend.repository.ProductRepository;
import com.data.backend.service.CloudinaryService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
@Service
public class ProductServiceImpl implements ProductService {
    @Autowired private ProductRepository productRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private CloudinaryService cloudinaryService;
    @Override public Page<Product> findAll(Pageable pageable) { return productRepository.findAll(pageable); }
    @Override public Product findById(Long id) { return productRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id)); }
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
