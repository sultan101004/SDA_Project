package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Integer> {
    List<Event> findByEventType(Event.EventType eventType);
    List<Event> findByActiveTrue();
    List<Event> findByEventTypeAndActiveTrue(Event.EventType eventType);
}

