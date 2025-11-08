package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.ProductRequest;
import com.data.backend.model.entity.Product;
import com.data.backend.service.product.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {
    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<APIResponse<Page<Product>>> getProducts(Pageable pageable) {
        Page<Product> products = productService.findAll(pageable);
        return new ResponseEntity<>(APIResponse.<Page<Product>>builder().success(true).message("Products fetched.").data(products).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<Product>> getProductDetails(@PathVariable Long id) {
        Product product = productService.findById(id);
        return new ResponseEntity<>(APIResponse.<Product>builder().success(true).message("Product details fetched.").data(product).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<Product>> createProduct(@Valid @RequestPart("product") ProductRequest productRequest, @RequestPart("image") MultipartFile imageFile) throws IOException {
        Product savedProduct = productService.save(productRequest, imageFile);
        return new ResponseEntity<>(APIResponse.<Product>builder().success(true).message("Product created.").data(savedProduct).status(HttpStatus.CREATED).build(), HttpStatus.CREATED);
    }
}
