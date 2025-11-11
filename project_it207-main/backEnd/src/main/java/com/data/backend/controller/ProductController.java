package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.ProductRequest;
import com.data.backend.model.dto.response.ProductResponse;
import com.data.backend.model.entity.Product;
import com.data.backend.service.product.ProductService;
import com.data.backend.service.product.ProductServiceImpl;
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
    
    @Autowired
    private ProductServiceImpl productServiceImpl;

    @GetMapping
    public ResponseEntity<APIResponse<Page<ProductResponse>>> getProducts(
            Pageable pageable,
            @RequestParam(required = false) String search) {
        Page<ProductResponse> products = productServiceImpl.findAllAsResponse(pageable, search);
        return new ResponseEntity<>(APIResponse.<Page<ProductResponse>>builder().success(true).message("Products fetched.").data(products).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<ProductResponse>> getProductDetails(@PathVariable Long id) {
        ProductResponse product = productServiceImpl.findByIdAsResponse(id);
        return new ResponseEntity<>(APIResponse.<ProductResponse>builder().success(true).message("Product details fetched.").data(product).status(HttpStatus.OK).build(), HttpStatus.OK);
    }
    @PostMapping(consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<ProductResponse>> createProduct(@Valid @RequestPart("product") ProductRequest productRequest, @RequestPart("image") MultipartFile imageFile) throws IOException {
        Product savedProduct = productService.save(productRequest, imageFile);
        ProductResponse productResponse = productServiceImpl.toProductResponse(savedProduct);
        return new ResponseEntity<>(APIResponse.<ProductResponse>builder().success(true).message("Product created.").data(productResponse).status(HttpStatus.CREATED).build(), HttpStatus.CREATED);
    }
}
