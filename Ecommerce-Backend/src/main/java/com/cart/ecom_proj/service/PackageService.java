package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.PackageDTO;
import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.model.Package;
import com.cart.ecom_proj.repo.PackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PackageService {

    @Autowired
    private PackageRepository packageRepository;

    public List<PackageDTO> getAllPackages() {
        return packageRepository.findAll().stream()
                .map(PackageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<PackageDTO> getActivePackages() {
        return packageRepository.findByActiveTrue().stream()
                .map(PackageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public PackageDTO getPackageById(int id) {
        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
        return PackageDTO.fromEntity(pkg);
    }

    public List<PackageDTO> getPackagesByEventType(Event.EventType eventType) {
        return packageRepository.findByEventTypeAndActiveTrue(eventType).stream()
                .map(PackageDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public PackageDTO createPackage(PackageDTO packageDTO) {
        Package pkg = packageDTO.toEntity();
        pkg.setActive(true);
        Package savedPackage = packageRepository.save(pkg);
        return PackageDTO.fromEntity(savedPackage);
    }

    public PackageDTO updatePackage(int id, PackageDTO packageDTO) {
        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
        
        pkg.setName(packageDTO.getName());
        pkg.setDescription(packageDTO.getDescription());
        pkg.setEventType(packageDTO.getEventType());
        pkg.setPrice(packageDTO.getPrice());
        pkg.setFeatures(packageDTO.getFeatures());
        pkg.setImageUrl(packageDTO.getImageUrl());
        
        Package updatedPackage = packageRepository.save(pkg);
        return PackageDTO.fromEntity(updatedPackage);
    }

    public void deletePackage(int id) {
        Package pkg = packageRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Package not found with id: " + id));
        pkg.setActive(false);
        packageRepository.save(pkg);
    }
}
