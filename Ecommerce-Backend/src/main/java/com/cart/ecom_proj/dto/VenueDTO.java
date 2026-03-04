package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.model.Venue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenueDTO {
    private int id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private int capacity;
    private BigDecimal pricePerHour;
    private String imageUrl;
    private boolean active;
    private String description;

    public static VenueDTO fromEntity(Venue venue) {
        VenueDTO dto = new VenueDTO();
        dto.setId(venue.getId());
        dto.setName(venue.getName());
        dto.setAddress(venue.getAddress());
        dto.setLatitude(venue.getLatitude());
        dto.setLongitude(venue.getLongitude());
        dto.setCapacity(venue.getCapacity());
        dto.setPricePerHour(venue.getPricePerHour());
        dto.setImageUrl(venue.getImageUrl());
        dto.setActive(venue.isActive());
        dto.setDescription(venue.getDescription());
        return dto;
    }

    public Venue toEntity() {
        Venue venue = new Venue();
        venue.setId(this.id);
        venue.setName(this.name);
        venue.setAddress(this.address);
        venue.setLatitude(this.latitude);
        venue.setLongitude(this.longitude);
        venue.setCapacity(this.capacity);
        venue.setPricePerHour(this.pricePerHour);
        venue.setImageUrl(this.imageUrl);
        venue.setActive(this.active);
        venue.setDescription(this.description);
        return venue;
    }
}

