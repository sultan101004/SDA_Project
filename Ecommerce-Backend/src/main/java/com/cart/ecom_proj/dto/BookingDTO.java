package com.cart.ecom_proj.dto;

import com.cart.ecom_proj.model.Booking;
import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.model.Package;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.model.Venue;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDTO {
    private int id;
    private int userId;
    private String userName;
    private int eventId;
    private String eventName;
    private Integer venueId;
    private String venueName;
    private Integer packageId;
    private String packageName;
    private Date eventDate;
    private int guestCount;
    private BigDecimal totalPrice;
    private Booking.BookingStatus status;
    private String specialRequests;
    private String customerName;
    private String customerEmail;
    private String customerPhone;
    private Date createdAt;

    public static BookingDTO fromEntity(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUser() != null ? booking.getUser().getId() : 0);
        dto.setUserName(booking.getUser() != null ? booking.getUser().getName() : "");
        dto.setEventId(booking.getEvent() != null ? booking.getEvent().getId() : 0);
        dto.setEventName(booking.getEvent() != null ? booking.getEvent().getName() : "");
        dto.setVenueId(booking.getVenue() != null ? booking.getVenue().getId() : null);
        dto.setVenueName(booking.getVenue() != null ? booking.getVenue().getName() : null);
        dto.setPackageId(booking.getEventPackage() != null ? booking.getEventPackage().getId() : null);
        dto.setPackageName(booking.getEventPackage() != null ? booking.getEventPackage().getName() : null);
        dto.setEventDate(booking.getEventDate());
        dto.setGuestCount(booking.getGuestCount());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setStatus(booking.getStatus());
        dto.setSpecialRequests(booking.getSpecialRequests());
        dto.setCustomerName(booking.getCustomerName());
        dto.setCustomerEmail(booking.getCustomerEmail());
        dto.setCustomerPhone(booking.getCustomerPhone());
        dto.setCreatedAt(booking.getCreatedAt());
        return dto;
    }
}

