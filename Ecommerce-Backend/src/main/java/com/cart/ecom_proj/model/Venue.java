package com.cart.ecom_proj.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "venues")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String address;

    private Double latitude;

    private Double longitude;

    private int capacity;

    @Column(nullable = false)
    private BigDecimal pricePerHour;

    private String imageUrl;

    private boolean active = true;

    private String description;
}

