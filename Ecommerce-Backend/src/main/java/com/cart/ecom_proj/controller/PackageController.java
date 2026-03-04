package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.dto.PackageDTO;
import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    @GetMapping
    public ResponseEntity<List<PackageDTO>> getAllPackages() {
        List<PackageDTO> packages = packageService.getAllPackages();
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PackageDTO>> getActivePackages() {
        List<PackageDTO> packages = packageService.getActivePackages();
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PackageDTO> getPackageById(@PathVariable int id) {
        PackageDTO pkg = packageService.getPackageById(id);
        return new ResponseEntity<>(pkg, HttpStatus.OK);
    }

    @GetMapping("/event/{eventType}")
    public ResponseEntity<List<PackageDTO>> getPackagesByEventType(@PathVariable Event.EventType eventType) {
        List<PackageDTO> packages = packageService.getPackagesByEventType(eventType);
        return new ResponseEntity<>(packages, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackageDTO> createPackage(@RequestBody PackageDTO packageDTO) {
        PackageDTO createdPackage = packageService.createPackage(packageDTO);
        return new ResponseEntity<>(createdPackage, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PackageDTO> updatePackage(@PathVariable int id, @RequestBody PackageDTO packageDTO) {
        PackageDTO updatedPackage = packageService.updatePackage(id, packageDTO);
        return new ResponseEntity<>(updatedPackage, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deletePackage(@PathVariable int id) {
        packageService.deletePackage(id);
        return new ResponseEntity<>("Package deleted successfully", HttpStatus.OK);
    }
}
