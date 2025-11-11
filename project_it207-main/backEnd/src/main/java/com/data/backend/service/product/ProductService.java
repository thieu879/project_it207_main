package com.data.backend.service.product;

import com.data.backend.model.dto.request.ProductRequest;
import com.data.backend.model.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface ProductService {
    Page<Product> findAll(Pageable pageable, String search);
    Product findById(Long id);
    Product save(ProductRequest request, MultipartFile imageFile) throws IOException;
}
