package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.model.Feedback;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FeedbackDTO {
    private int id;
    private String name;
    private Event.EventType eventType;
    private int rating;
    private String comment;
    private Date createdAt;

    public static FeedbackDTO fromEntity(Feedback feedback) {
        FeedbackDTO dto = new FeedbackDTO();
        dto.setId(feedback.getId());
        dto.setName(feedback.getName());
        dto.setEventType(feedback.getEventType());
        dto.setRating(feedback.getRating());
        dto.setComment(feedback.getComment());
        dto.setCreatedAt(feedback.getCreatedAt());
        return dto;
    }

    public Feedback toEntity() {
        Feedback feedback = new Feedback();
        feedback.setId(this.id);
        feedback.setName(this.name);
        feedback.setEventType(this.eventType);
        feedback.setRating(this.rating);
        feedback.setComment(this.comment);
        return feedback;
    }
}

