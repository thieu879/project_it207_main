package com.data.backend.service.address;

import com.data.backend.model.dto.request.AddressRequest;
import com.data.backend.model.dto.response.AddressResponse;

import java.util.List;

public interface AddressService {
    List<AddressResponse> getUserAddresses(String username);
    AddressResponse getAddressById(String username, Long addressId);
    AddressResponse createAddress(String username, AddressRequest request);
    AddressResponse updateAddress(String username, Long addressId, AddressRequest request);
    void deleteAddress(String username, Long addressId);
    AddressResponse setDefaultAddress(String username, Long addressId);
}

