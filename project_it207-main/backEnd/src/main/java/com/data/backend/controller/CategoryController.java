package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.CategoryRequest;
import com.data.backend.model.dto.response.CategoryResponse;
import com.data.backend.service.category.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<APIResponse<Page<CategoryResponse>>> list(Pageable pageable) {
        Page<CategoryResponse> data = categoryService.findAll(pageable);
        return ResponseEntity.ok(APIResponse.<Page<CategoryResponse>>builder()
                .success(true).message("Categories fetched").data(data).status(HttpStatus.OK).build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<CategoryResponse>> get(@PathVariable Long id) {
        CategoryResponse data = categoryService.findById(id);
        return ResponseEntity.ok(APIResponse.<CategoryResponse>builder()
                .success(true).message("Category fetched").data(data).status(HttpStatus.OK).build());
    }

    @GetMapping("/url")
    public ResponseEntity<APIResponse<CategoryResponse>> getByUrl(@RequestParam String categoryUrl) {
        CategoryResponse data = categoryService.findByCategoryUrl(categoryUrl);
        return ResponseEntity.ok(APIResponse.<CategoryResponse>builder()
                .success(true).message("Category fetched").data(data).status(HttpStatus.OK).build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<CategoryResponse>> create(@Valid @RequestBody CategoryRequest request) {
        CategoryResponse data = categoryService.create(request);
        return new ResponseEntity<>(APIResponse.<CategoryResponse>builder()
                .success(true).message("Category created").data(data).status(HttpStatus.CREATED).build(), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<CategoryResponse>> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        CategoryResponse data = categoryService.update(id, request);
        return ResponseEntity.ok(APIResponse.<CategoryResponse>builder()
                .success(true).message("Category updated").data(data).status(HttpStatus.OK).build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<APIResponse<Void>> delete(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseEntity.ok(APIResponse.<Void>builder()
                .success(true).message("Category deleted").status(HttpStatus.OK).build());
    }
}
