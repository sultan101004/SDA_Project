-- Admin User (password: admin123)
INSERT INTO users (name, email, password, phone, role, enabled, created_at) 
VALUES ('Admin', 'admin@evento.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.aS5m0q3W4YLjA3ZqAi', '9876543210', 'ADMIN', true, NOW());

-- Regular User (password: user123)
INSERT INTO users (name, email, password, phone, role, enabled, created_at) 
VALUES ('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.aS5m0q3W4YLjA3ZqAi', '9876543211', 'USER', true, NOW());

-- Events
INSERT INTO events (name, description, event_type, base_price, image_url, active) VALUES 
('Royal Wedding', 'A grand wedding celebration with traditional and modern elements', 'WEDDING', 500000, 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', true),
('Garden Wedding', 'Beautiful outdoor garden wedding with natural decorations', 'WEDDING', 350000, 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800', true),
('Kids Birthday', 'Fun-filled birthday party for children with games and activities', 'BIRTHDAY', 50000, 'https://images.unsplash.com/photo-1530103862676-de3c9a59af38?w=800', true),
('Adult Birthday', 'Elegant birthday celebration for adults', 'BIRTHDAY', 75000, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800', true),
('Corporate Conference', 'Professional conference for business meetings', 'CORPORATE', 150000, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', true),
('Team Building', 'Interactive team building activities for corporate teams', 'CORPORATE', 100000, 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', true),
('Anniversary Celebration', 'Special celebration for wedding anniversaries', 'ANNIVERSARY', 100000, 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', true),
('Social Gathering', 'Casual get-together for friends and family', 'SOCIAL_GATHERING', 50000, 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true);

-- Venues
INSERT INTO venues (name, address, latitude, longitude, capacity, price_per_hour, image_url, active, description) VALUES 
('Grand Ballroom', 'Mumbai, Maharashtra', 19.0760, 72.8777, 500, 50000, 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', true, 'Luxurious ballroom with crystal chandeliers'),
('Garden Paradise', 'Pune, Maharashtra', 18.5204, 73.8567, 200, 25000, 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800', true, 'Beautiful garden venue with natural flowers'),
('Rooftop Lounge', 'Delhi, Delhi', 28.6139, 77.2090, 100, 35000, 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=800', true, 'Modern rooftop with city views'),
('Conference Hall', 'Bangalore, Karnataka', 12.9716, 77.5946, 300, 40000, 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800', true, 'Fully equipped conference hall'),
('Beach Resort', 'Goa, Goa', 15.2993, 74.1240, 150, 30000, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', true, 'Beachside venue with sunset views');

-- Packages
INSERT INTO packages (name, description, price, event_type, features) VALUES 
('Gold Package', 'Complete wedding package with all amenities', 500000, 'WEDDING', 'Venue, Catering, Decoration, Photography, Music, Florist'),
('Silver Package', 'Basic wedding package', 300000, 'WEDDING', 'Venue, Catering, Basic Decoration'),
('Kids Special', 'Birthday package for children', 25000, 'BIRTHDAY', 'Games, Magic Show, Catering, Decorations, Return Gifts'),
('Adult Elegant', 'Birthday package for adults', 50000, 'BIRTHDAY', 'Catering, DJ, Decorations, Cake'),
('Corporate Basic', 'Essential corporate event package', 80000, 'CORPORATE', 'Venue, Projector, Sound System, Catering'),
('Corporate Premium', 'Full corporate event package', 150000, 'CORPORATE', 'Venue, Full AV Equipment, Catering, Photography, Welcome Kit'),
('Anniversary Special', 'Romantic anniversary package', 75000, 'ANNIVERSARY', 'Venue, Decoration, Cake, Dinner, Music'),
('Social Plus', 'Social gathering package', 35000, 'SOCIAL_GATHERING', 'Venue, Catering, Basic Decoration, Music');

-- Feedback
INSERT INTO feedback (name, event_type, rating, comment, created_at) VALUES 
('Priya Sharma', 'WEDDING', 5, 'Absolutely magical wedding! The team was professional and made our day special.', NOW()),
('Rahul Verma', 'BIRTHDAY', 5, 'My son had the best birthday ever! The kids loved the games.', NOW()),
('Sneha Patel', 'CORPORATE', 4, 'Great conference arrangement. Will definitely book again.', NOW()),
('Amit Kumar', 'ANNIVERSARY', 5, 'Wonderful anniversary celebration. Very romantic setup.', NOW()),
('Meera Singh', 'WEDDING', 5, 'Royal treatment from start to finish. Highly recommended!', NOW());

-- Sample Bookings
INSERT INTO bookings (event_id, venue_id, package_id, customer_name, customer_email, customer_phone, event_date, guest_count, total_price, status, created_at) VALUES 
(1, 1, 1, 'Rahul Mehta', 'rahul.mehta@email.com', '9988776655', '2024-12-15', 250, 550000, 'PENDING', NOW()),
(3, 2, 3, 'Sunita Rao', 'sunita.rao@email.com', '9876543210', '2024-11-20', 30, 30000, 'APPROVED', NOW()),
(5, 4, 5, 'Corporate Solutions', 'events@corporate.com', '9123456789', '2024-10-25', 150, 95000, 'COMPLETED', NOW());
