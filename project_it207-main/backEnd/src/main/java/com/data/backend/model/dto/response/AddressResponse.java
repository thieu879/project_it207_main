package com.data.backend.model.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AddressResponse {
    private Long id;
    private String label;
    private String fullAddress;
    private String addressType;
    private Boolean isDefault;
}

