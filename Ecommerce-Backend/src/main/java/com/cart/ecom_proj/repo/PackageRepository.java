package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.model.Package;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PackageRepository extends JpaRepository<Package, Integer> {
    List<Package> findByActiveTrue();
    List<Package> findByEventType(Event.EventType eventType);
    List<Package> findByEventTypeAndActiveTrue(Event.EventType eventType);
}

