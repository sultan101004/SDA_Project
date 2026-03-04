package com.cart.ecom_proj.controller;

import com.cart.ecom_proj.dto.BookingDTO;
import com.cart.ecom_proj.dto.BookingRequestDTO;
import com.cart.ecom_proj.model.Booking;
import com.cart.ecom_proj.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<BookingDTO>> getAllBookings() {
        List<BookingDTO> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingDTO>> getBookingsByUser(@PathVariable int userId) {
        List<BookingDTO> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingDTO>> getBookingsByStatus(@PathVariable Booking.BookingStatus status) {
        List<BookingDTO> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> getBookingById(@PathVariable int id) {
        BookingDTO booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(booking);
    }

    @PostMapping
    public ResponseEntity<BookingDTO> createBooking(@RequestBody BookingRequestDTO bookingRequest) {
        // For now, use a default user ID (1) or get from auth
        // In production, this would come from the authenticated user
        int userId = 1; // Default user for demo
        BookingDTO createdBooking = bookingService.createBooking(userId, bookingRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BookingDTO> updateBookingStatus(
            @PathVariable int id, 
            @RequestParam Booking.BookingStatus status) {
        BookingDTO updatedBooking = bookingService.updateBookingStatus(id, status);
        return ResponseEntity.ok(updatedBooking);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable int id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }

    // Admin endpoints
    @GetMapping("/admin/total")
    public ResponseEntity<Long> getTotalBookings() {
        long total = bookingService.getTotalBookings();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/admin/revenue")
    public ResponseEntity<java.math.BigDecimal> getTotalRevenue() {
        java.math.BigDecimal revenue = bookingService.getTotalRevenue();
        return ResponseEntity.ok(revenue);
    }

    @GetMapping("/admin/confirmed")
    public ResponseEntity<Long> getConfirmedBookings() {
        long confirmed = bookingService.getConfirmedBookings();
        return ResponseEntity.ok(confirmed);
    }
}

