package com.cart.ecom_proj.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

public class AIDTO {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BudgetRequest {
        private String eventType;
        private int guestCount;
        private String venueType;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class BudgetResponse {
        private BigDecimal estimatedBudget;
        private String breakdown;
        private String suggestion;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestCountRequest {
        private String eventType;
        private String venueSize;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class GuestCountResponse {
        private int recommendedMin;
        private int recommendedMax;
        private String reason;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ThemeRequest {
        private String eventType;
        private String budget;
        private String season;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ThemeResponse {
        private String themeName;
        private String description;
        private String colorPalette;
        private String[] decorations;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatRequest {
        private String message;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ChatResponse {
        private String response;
        private String[] suggestedActions;
    }
}

