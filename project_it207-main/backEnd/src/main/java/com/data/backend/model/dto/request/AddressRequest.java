package com.data.backend.model.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    @NotBlank(message = "Label is required")
    private String label;

    @NotBlank(message = "Full address is required")
    private String fullAddress;

    private String addressType; // "home", "office", etc.

    private Boolean isDefault = false;
}

