package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Integer> {
    List<Venue> findByActiveTrue();
    List<Venue> findByCapacityGreaterThanEqual(int capacity);
}

