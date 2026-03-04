package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.EventDTO;
import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.repo.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<EventDTO> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<EventDTO> getActiveEvents() {
        return eventRepository.findByActiveTrue().stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(int id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        return EventDTO.fromEntity(event);
    }

    public List<EventDTO> getEventsByType(Event.EventType eventType) {
        return eventRepository.findByEventTypeAndActiveTrue(eventType).stream()
                .map(EventDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public EventDTO createEvent(EventDTO eventDTO) {
        Event event = eventDTO.toEntity();
        event.setActive(true);
        Event savedEvent = eventRepository.save(event);
        return EventDTO.fromEntity(savedEvent);
    }

    public EventDTO updateEvent(int id, EventDTO eventDTO) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        
        event.setName(eventDTO.getName());
        event.setDescription(eventDTO.getDescription());
        event.setEventType(eventDTO.getEventType());
        event.setBasePrice(eventDTO.getBasePrice());
        event.setImageUrl(eventDTO.getImageUrl());
        
        Event updatedEvent = eventRepository.save(event);
        return EventDTO.fromEntity(updatedEvent);
    }

    public void deleteEvent(int id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found with id: " + id));
        event.setActive(false);
        eventRepository.save(event);
    }
}
