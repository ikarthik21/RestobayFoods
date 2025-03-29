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
            'PARTIALLY_REFUNDED'
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
            "COMPLETED"
        ) DEFAULT 'ACTIVE',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP NULL,
        FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
        INDEX (order_id),
        INDEX (item_id)
    );