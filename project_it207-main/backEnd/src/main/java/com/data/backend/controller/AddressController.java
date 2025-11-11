package com.data.backend.controller;

import com.data.backend.model.dto.APIResponse;
import com.data.backend.model.dto.request.AddressRequest;
import com.data.backend.model.dto.response.AddressResponse;
import com.data.backend.service.address.AddressService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/addresses")
public class AddressController {
    @Autowired
    private AddressService addressService;

    @GetMapping
    public ResponseEntity<APIResponse<List<AddressResponse>>> getUserAddresses(
            Authentication authentication) {
        String username = authentication.getName();
        List<AddressResponse> addresses = addressService.getUserAddresses(username);
        return new ResponseEntity<>(
                APIResponse.<List<AddressResponse>>builder()
                        .success(true)
                        .message("Addresses fetched successfully")
                        .data(addresses)
                        .status(HttpStatus.OK)
                        .build(),
                HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<APIResponse<AddressResponse>> getAddressById(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        AddressResponse address = addressService.getAddressById(username, id);
        return new ResponseEntity<>(
                APIResponse.<AddressResponse>builder()
                        .success(true)
                        .message("Address fetched successfully")
                        .data(address)
                        .status(HttpStatus.OK)
                        .build(),
                HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<APIResponse<AddressResponse>> createAddress(
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        AddressResponse address = addressService.createAddress(username, request);
        return new ResponseEntity<>(
                APIResponse.<AddressResponse>builder()
                        .success(true)
                        .message("Address created successfully")
                        .data(address)
                        .status(HttpStatus.CREATED)
                        .build(),
                HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<APIResponse<AddressResponse>> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        AddressResponse address = addressService.updateAddress(username, id, request);
        return new ResponseEntity<>(
                APIResponse.<AddressResponse>builder()
                        .success(true)
                        .message("Address updated successfully")
                        .data(address)
                        .status(HttpStatus.OK)
                        .build(),
                HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<APIResponse<Void>> deleteAddress(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        addressService.deleteAddress(username, id);
        return new ResponseEntity<>(
                APIResponse.<Void>builder()
                        .success(true)
                        .message("Address deleted successfully")
                        .status(HttpStatus.OK)
                        .build(),
                HttpStatus.OK);
    }

    @PutMapping("/{id}/set-default")
    public ResponseEntity<APIResponse<AddressResponse>> setDefaultAddress(
            @PathVariable Long id,
            Authentication authentication) {
        String username = authentication.getName();
        AddressResponse address = addressService.setDefaultAddress(username, id);
        return new ResponseEntity<>(
                APIResponse.<AddressResponse>builder()
                        .success(true)
                        .message("Default address set successfully")
                        .data(address)
                        .status(HttpStatus.OK)
                        .build(),
                HttpStatus.OK);
    }
}

