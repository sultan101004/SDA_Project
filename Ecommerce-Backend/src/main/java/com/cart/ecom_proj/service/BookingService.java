package com.cart.ecom_proj.service;

import com.cart.ecom_proj.dto.BookingDTO;
import com.cart.ecom_proj.dto.BookingRequestDTO;
import com.cart.ecom_proj.model.Booking;
import com.cart.ecom_proj.model.Event;
import com.cart.ecom_proj.model.Package;
import com.cart.ecom_proj.model.User;
import com.cart.ecom_proj.model.Venue;
import com.cart.ecom_proj.repo.BookingRepository;
import com.cart.ecom_proj.repo.EventRepository;
import com.cart.ecom_proj.repo.PackageRepository;
import com.cart.ecom_proj.repo.UserRepository;
import com.cart.ecom_proj.repo.VenueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private VenueRepository venueRepository;

    @Autowired
    private PackageRepository packageRepository;

    public List<BookingDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(BookingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByUser(int userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser(user).stream()
                .map(BookingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<BookingDTO> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepository.findByStatus(status).stream()
                .map(BookingDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public BookingDTO getBookingById(int id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        return BookingDTO.fromEntity(booking);
    }

    public BookingDTO createBooking(int userId, BookingRequestDTO requestDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Event event = eventRepository.findById(requestDTO.getEventId())
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Venue venue = null;
        if (requestDTO.getVenueId() != null) {
            venue = venueRepository.findById(requestDTO.getVenueId())
                    .orElseThrow(() -> new RuntimeException("Venue not found"));
        }

        Package eventPackage = null;
        if (requestDTO.getPackageId() != null) {
            eventPackage = packageRepository.findById(requestDTO.getPackageId())
                    .orElseThrow(() -> new RuntimeException("Package not found"));
        }

        // Calculate total price
        BigDecimal totalPrice = event.getBasePrice();
        if (venue != null) {
            totalPrice = totalPrice.add(venue.getPricePerHour().multiply(BigDecimal.valueOf(4))); // Assume 4 hours
        }
        if (eventPackage != null) {
            totalPrice = totalPrice.add(eventPackage.getPrice());
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setEvent(event);
        booking.setVenue(venue);
        booking.setEventPackage(eventPackage);
        booking.setEventDate(requestDTO.getEventDate());
        booking.setGuestCount(requestDTO.getGuestCount());
        booking.setTotalPrice(totalPrice);
        booking.setStatus(Booking.BookingStatus.PENDING);
        booking.setSpecialRequests(requestDTO.getSpecialRequests());
        booking.setCustomerName(requestDTO.getCustomerName());
        booking.setCustomerEmail(requestDTO.getCustomerEmail());
        booking.setCustomerPhone(requestDTO.getCustomerPhone());

        Booking savedBooking = bookingRepository.save(booking);
        return BookingDTO.fromEntity(savedBooking);
    }

    public BookingDTO updateBookingStatus(int id, Booking.BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        
        booking.setStatus(status);
        Booking updatedBooking = bookingRepository.save(booking);
        return BookingDTO.fromEntity(updatedBooking);
    }

    public void deleteBooking(int id) {
        bookingRepository.deleteById(id);
    }

    // Admin analytics
    public long getTotalBookings() {
        return bookingRepository.countAllBookings();
    }

    public BigDecimal getTotalRevenue() {
        BigDecimal revenue = bookingRepository.getTotalRevenue();
        return revenue != null ? revenue : BigDecimal.ZERO;
    }

    public long getConfirmedBookings() {
        return bookingRepository.countConfirmedBookings();
    }
}
