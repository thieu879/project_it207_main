package com.data.backend.service.address;

import com.data.backend.model.dto.request.AddressRequest;
import com.data.backend.model.dto.response.AddressResponse;
import com.data.backend.model.entity.Address;
import com.data.backend.model.entity.User;
import com.data.backend.repository.AddressRepository;
import com.data.backend.service.user.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {
    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserService userService;

    @Override
    public List<AddressResponse> getUserAddresses(String username) {
        User user = userService.findUserByUsername(username);
        return addressRepository.findByUserId(user.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public AddressResponse getAddressById(String username, Long addressId) {
        User user = userService.findUserByUsername(username);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
        return mapToResponse(address);
    }

    @Override
    public AddressResponse createAddress(String username, AddressRequest request) {
        User user = userService.findUserByUsername(username);

        // If this is set as default, unset other default addresses
        if (request.getIsDefault() != null && request.getIsDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(existingDefault -> {
                        existingDefault.setIsDefault(false);
                        addressRepository.save(existingDefault);
                    });
        }

        Address address = new Address();
        address.setLabel(request.getLabel());
        address.setFullAddress(request.getFullAddress());
        address.setAddressType(request.getAddressType());
        address.setIsDefault(request.getIsDefault() != null ? request.getIsDefault() : false);
        address.setUser(user);

        Address savedAddress = addressRepository.save(address);
        return mapToResponse(savedAddress);
    }

    @Override
    public AddressResponse updateAddress(String username, Long addressId, AddressRequest request) {
        User user = userService.findUserByUsername(username);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        // If setting as default, unset other defaults
        if (request.getIsDefault() != null && request.getIsDefault() && !address.getIsDefault()) {
            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                    .ifPresent(existingDefault -> {
                        existingDefault.setIsDefault(false);
                        addressRepository.save(existingDefault);
                    });
        }

        address.setLabel(request.getLabel());
        address.setFullAddress(request.getFullAddress());
        if (request.getAddressType() != null) {
            address.setAddressType(request.getAddressType());
        }
        if (request.getIsDefault() != null) {
            address.setIsDefault(request.getIsDefault());
        }

        Address updatedAddress = addressRepository.save(address);
        return mapToResponse(updatedAddress);
    }

    @Override
    public void deleteAddress(String username, Long addressId) {
        User user = userService.findUserByUsername(username);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));
        addressRepository.delete(address);
    }

    @Override
    public AddressResponse setDefaultAddress(String username, Long addressId) {
        User user = userService.findUserByUsername(username);
        Address address = addressRepository.findByIdAndUserId(addressId, user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Address not found"));

        // Unset other default addresses
        addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(existingDefault -> {
                    existingDefault.setIsDefault(false);
                    addressRepository.save(existingDefault);
                });

        address.setIsDefault(true);
        Address updatedAddress = addressRepository.save(address);
        return mapToResponse(updatedAddress);
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .label(address.getLabel())
                .fullAddress(address.getFullAddress())
                .addressType(address.getAddressType())
                .isDefault(address.getIsDefault())
                .build();
    }
}

