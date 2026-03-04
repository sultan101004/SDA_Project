package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.model.Package;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PackageDTO {
    private int id;
    private String name;
    private String description;
    private Event.EventType eventType;
    private BigDecimal price;
    private String features;
    private String imageUrl;
    private boolean active;

    public static PackageDTO fromEntity(Package pkg) {
        PackageDTO dto = new PackageDTO();
        dto.setId(pkg.getId());
        dto.setName(pkg.getName());
        dto.setDescription(pkg.getDescription());
        dto.setEventType(pkg.getEventType());
        dto.setPrice(pkg.getPrice());
        dto.setFeatures(pkg.getFeatures());
        dto.setImageUrl(pkg.getImageUrl());
        dto.setActive(pkg.isActive());
        return dto;
    }

    public Package toEntity() {
        Package pkg = new Package();
        pkg.setId(this.id);
        pkg.setName(this.name);
        pkg.setDescription(this.description);
        pkg.setEventType(this.eventType);
        pkg.setPrice(this.price);
        pkg.setFeatures(this.features);
        pkg.setImageUrl(this.imageUrl);
        pkg.setActive(this.active);
        return pkg;
    }
}

