package com.cart.ecom_proj.repo;

import com.cart.ecom_proj.model.Booking;
import com.cart.ecom_proj.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByUser(User user);
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    @Query("SELECT COUNT(b) FROM Booking b")
    long countAllBookings();
    
    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.status = 'CONFIRMED'")
    BigDecimal getTotalRevenue();
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.status = 'CONFIRMED'")
    long countConfirmedBookings();
}

