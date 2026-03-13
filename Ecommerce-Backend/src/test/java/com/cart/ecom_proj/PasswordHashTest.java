package com.cart.ecom_proj;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordHashTest {

    @Test
    void printHashes() {
        PasswordEncoder encoder = new BCryptPasswordEncoder();
        System.out.println("admin123=" + encoder.encode("admin123"));
        System.out.println("user123=" + encoder.encode("user123"));
    }
}

