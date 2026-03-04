package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.VenueDTO;
import com.cart.ecom_proj.model.Venue;
import com.cart.ecom_proj.repo.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class VenueService {

    @Autowired
    private VenueRepository venueRepository;

    public List<VenueDTO> getAllVenues() {
        return venueRepository.findAll().stream()
                .map(VenueDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<VenueDTO> getActiveVenues() {
        return venueRepository.findByActiveTrue().stream()
                .map(VenueDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public VenueDTO getVenueById(int id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        return VenueDTO.fromEntity(venue);
    }

    public VenueDTO createVenue(VenueDTO venueDTO) {
        Venue venue = venueDTO.toEntity();
        venue.setActive(true);
        Venue savedVenue = venueRepository.save(venue);
        return VenueDTO.fromEntity(savedVenue);
    }

    public VenueDTO updateVenue(int id, VenueDTO venueDTO) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));

        venue.setName(venueDTO.getName());
        venue.setAddress(venueDTO.getAddress());
        venue.setLatitude(venueDTO.getLatitude());
        venue.setLongitude(venueDTO.getLongitude());
        venue.setCapacity(venueDTO.getCapacity());
        venue.setPricePerHour(venueDTO.getPricePerHour());
        venue.setImageUrl(venueDTO.getImageUrl());
        venue.setDescription(venueDTO.getDescription());

        Venue updatedVenue = venueRepository.save(venue);
        return VenueDTO.fromEntity(updatedVenue);
    }

    public void deleteVenue(int id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found with id: " + id));
        venue.setActive(false);
        venueRepository.save(venue);
    }
}

