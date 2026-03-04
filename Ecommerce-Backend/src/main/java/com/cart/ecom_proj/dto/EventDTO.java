package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.model.Event;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventDTO {
    private int id;
    private String name;
    private String description;
    private Event.EventType eventType;
    private BigDecimal basePrice;
    private String imageUrl;
    private boolean active;

    public static EventDTO fromEntity(Event event) {
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setEventType(event.getEventType());
        dto.setBasePrice(event.getBasePrice());
        dto.setImageUrl(event.getImageUrl());
        dto.setActive(event.isActive());
        return dto;
    }

    public Event toEntity() {
        Event event = new Event();
        event.setId(this.id);
        event.setName(this.name);
        event.setDescription(this.description);
        event.setEventType(this.eventType);
        event.setBasePrice(this.basePrice);
        event.setImageUrl(this.imageUrl);
        event.setActive(this.active);
        return event;
    }
}

