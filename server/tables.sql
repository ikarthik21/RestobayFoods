CREATE TABLE
    users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(20) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        verified BOOLEAN DEFAULT 0, -- User is not verified by default
        role ENUM ('customer', 'admin', 'staff') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create carts table
CREATE TABLE
    carts (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Create cart_items table
CREATE TABLE
    cart_items (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        cart_id BIGINT NOT NULL,
        item_id INT NOT NULL,
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES carts (id),
        CONSTRAINT unique_product_in_cart UNIQUE (cart_id, item_id)
    );

-- Orders Table
CREATE TABLE
    orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL, -- Must match users.id
        total_amount DECIMAL(10, 2) NOT NULL,
        status ENUM (
            'PENDING',
            'PAYMENT_PENDING',
            'PAYMENT_FAILED',
            'PROCESSING',
            'CANCELLED',
            'REFUNDED',
            'PARTIALLY_REFUNDED',
            'COMPLETED'
        ) DEFAULT 'PENDING',
        payment_status ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        payment_completed_at TIMESTAMP NULL,
        deleted_at TIMESTAMP NULL,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

CREATE TABLE
    order_items (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL,
        item_id INT NOT NULL, -- Matches with cart_items.item_id
        quantity INT NOT NULL DEFAULT 1,
        price DECIMAL(10, 2) NOT NULL,
        status ENUM (
            'ACTIVE',
            'CANCELLED',
            'REFUNDED',
            'PARTIALLY_REFUNDED',
            'COMPLETED'
        ) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
        INDEX (order_id),
        INDEX (item_id)
    );

-- Tables table to store restaurant tables
CREATE TABLE
    `tables` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `table_number` VARCHAR(10) NOT NULL,
        `capacity` INT NOT NULL,
        `location` VARCHAR(50) NOT NULL,
        `status` ENUM ('active', 'inactive', 'maintenance') NOT NULL DEFAULT 'active',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

-- Bookings table to store reservations
CREATE TABLE
    `table_bookings` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `table_id` INT NOT NULL,
        `table_number` VARCHAR(10) NOT NULL,
        `booking_date` DATE NOT NULL,
        `start_time` TIME NOT NULL,
        `end_time` TIME NOT NULL,
        `number_of_people` INT NOT NULL,
        `user_id` BIGINT UNSIGNED NOT NULL,
        `status` ENUM ('CONFIRMED', 'CANCELLED', 'PENDING', 'FREE') NOT NULL DEFAULT 'PENDING',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`),
        FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    );

-- Create a separate table for booking payments
CREATE TABLE
    `table_booking_payments` (
        `id` INT PRIMARY KEY AUTO_INCREMENT,
        `booking_id` INT NOT NULL,
        `user_id` BIGINT UNSIGNED NOT NULL,
        `amount` DECIMAL(10, 2) NOT NULL,
        `currency` VARCHAR(5) NOT NULL DEFAULT 'INR',
        `transaction_id` VARCHAR(100),
        `payment_status` ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
        `payment_method` VARCHAR(50),
        `payment_date` TIMESTAMP NULL,
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (`booking_id`) REFERENCES `table_bookings` (`id`) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    );

-- Indexes for faster querying
CREATE INDEX idx_bookings_date_time ON table_bookings (booking_date, start_time, end_time);

CREATE INDEX idx_booking_payments ON table_booking_payments (booking_id, payment_status);

CREATE INDEX idx_user_payments ON table_booking_payments (user_id, payment_status);

CREATE INDEX idx_tables_capacity ON tables (capacity);

-- Sample data for tables
INSERT INTO
    `tables` (`table_number`, `capacity`, `location`, `status`)
VALUES
    ('A1', 2, 'Window', 'active'),
    ('A2', 2, 'Window', 'active'),
    ('A3', 4, 'Window', 'active'),
    ('B1', 4, 'Center', 'active'),
    ('B2', 4, 'Center', 'active'),
    ('B3', 6, 'Center', 'active'),
    ('C1', 6, 'Bar', 'active'),
    ('C2', 8, 'Bar', 'active'),
    ('D1', 10, 'Private Room', 'active'),
    ('D2', 12, 'Private Room', 'active'),
    ('E1', 4, 'Patio', 'active'),
    ('E2', 4, 'Patio', 'active'),
    ('E3', 6, 'Patio', 'maintenance');

-- Sample data for table_bookings
INSERT INTO
    `table_bookings` (
        `table_id`,
        `booking_date`,
        `start_time`,
        `end_time`,
        `number_of_people`,
        `user_id`,
        `status`
    )
VALUES
    (
        1,
        '2025-04-01',
        '18:00:00',
        '20:00:00',
        2,
        1,
        'confirmed'
    ),
    (
        3,
        '2025-04-01',
        '19:00:00',
        '21:00:00',
        4,
        4,
        'confirmed'
    ),
    (
        5,
        '2025-04-01',
        '20:00:00',
        '22:00:00',
        4,
        7,
        'confirmed'
    ),
    (
        8,
        '2025-04-01',
        '19:30:00',
        '21:30:00',
        8,
        10,
        'confirmed'
    ),
    (
        9,
        '2025-04-02',
        '17:00:00',
        '19:00:00',
        10,
        13,
        'confirmed'
    ),
    (
        10,
        '2025-04-02',
        '19:30:00',
        '22:30:00',
        12,
        16,
        'confirmed'
    ),
    (
        2,
        '2025-04-02',
        '18:00:00',
        '20:00:00',
        2,
        19,
        'confirmed'
    ),
    (
        4,
        '2025-04-02',
        '18:30:00',
        '20:30:00',
        4,
        22,
        'confirmed'
    ),
    (
        6,
        '2025-04-03',
        '19:00:00',
        '21:00:00',
        6,
        5,
        'confirmed'
    ),
    (
        11,
        '2025-04-03',
        '18:00:00',
        '20:00:00',
        4,
        8,
        'confirmed'
    ),
    (
        12,
        '2025-04-03',
        '20:00:00',
        '22:00:00',
        4,
        11,
        'confirmed'
    ),
    (
        7,
        '2025-04-03',
        '19:30:00',
        '21:30:00',
        6,
        14,
        'confirmed'
    ),
    (
        1,
        '2025-04-04',
        '17:00:00',
        '19:00:00',
        2,
        17,
        'confirmed'
    ),
    (
        3,
        '2025-04-04',
        '19:00:00',
        '21:00:00',
        4,
        20,
        'confirmed'
    ),
    (
        5,
        '2025-04-04',
        '20:30:00',
        '22:30:00',
        4,
        3,
        'confirmed'
    ),
    (
        9,
        '2025-04-05',
        '18:00:00',
        '21:00:00',
        10,
        6,
        'confirmed'
    ),
    (
        11,
        '2025-04-05',
        '19:00:00',
        '21:00:00',
        4,
        9,
        'confirmed'
    ),
    (
        2,
        '2025-04-05',
        '17:30:00',
        '19:30:00',
        2,
        12,
        'confirmed'
    ),
    (
        4,
        '2025-04-05',
        '20:00:00',
        '22:00:00',
        4,
        15,
        'confirmed'
    ),
    (
        6,
        '2025-04-06',
        '18:00:00',
        '20:00:00',
        6,
        18,
        'confirmed'
    ),
    (
        10,
        '2025-04-06',
        '19:00:00',
        '22:00:00',
        12,
        21,
        'confirmed'
    ),
    (
        1,
        '2025-04-01',
        '12:00:00',
        '14:00:00',
        2,
        5,
        'completed'
    ),
    (
        2,
        '2025-04-01',
        '13:00:00',
        '15:00:00',
        2,
        9,
        'completed'
    ),
    (
        3,
        '2025-03-31',
        '19:00:00',
        '21:00:00',
        4,
        1,
        'completed'
    );