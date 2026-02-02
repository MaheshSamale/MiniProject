-- DROP & RECREATE (BACKUP FIRST!)
DROP DATABASE IF EXISTS food_coupon_system;
CREATE DATABASE food_coupon_system;
USE food_coupon_system;

-- USERS (Companies, Employees, Vendors)
CREATE TABLE users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('COMPANY','EMPLOYEE','VENDOR') NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  pin_code VARCHAR(10) NULL,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- COMPANIES
CREATE TABLE companies (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNIQUE,
  company_name VARCHAR(255) NOT NULL,
  address TEXT,
  logo VARCHAR(255) NULL,
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- EMPLOYEES
CREATE TABLE employees (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNIQUE,
  company_id BIGINT NOT NULL,
  employee_code VARCHAR(50),
  department VARCHAR(100),
  designation VARCHAR(100),
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- VENDORS
CREATE TABLE vendors (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNIQUE,
  company_id BIGINT NOT NULL,
  vendor_name VARCHAR(255),
  phone VARCHAR(20),
  qr_code_url VARCHAR(255),
  location VARCHAR(255),
  status TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- COUPON MASTER (Lunch ₹50, Breakfast ₹45)
CREATE TABLE coupon_master (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  company_id BIGINT NOT NULL,
  coupon_name VARCHAR(100) NOT NULL,
  monthly_limit INT DEFAULT 22,
  coupon_value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- EMPLOYEE COUPON ALLOCATIONS
CREATE TABLE employee_coupons (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT NOT NULL,
  coupon_master_id BIGINT NOT NULL,
  month_year VARCHAR(7) NOT NULL, -- '2026-01'
  allocated INT DEFAULT 0,
  used INT DEFAULT 0,
  remaining INT GENERATED ALWAYS AS (allocated - used) STORED,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_allocation (employee_id, coupon_master_id, month_year),
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (coupon_master_id) REFERENCES coupon_master(id)
);

-- COUPON TRANSACTIONS
CREATE TABLE coupon_transactions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  employee_id BIGINT NOT NULL,
  vendor_id BIGINT NOT NULL,
  company_id BIGINT NOT NULL,
  coupon_master_id BIGINT NOT NULL,
  coupons_used INT NOT NULL,
  redeemed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(id),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  FOREIGN KEY (company_id) REFERENCES companies(id),
  FOREIGN KEY (coupon_master_id) REFERENCES coupon_master(id)
);

-- VENDOR SETTLEMENTS
CREATE TABLE vendor_settlements (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  vendor_id BIGINT NOT NULL,
  company_id BIGINT NOT NULL,
  total_coupons INT,
  total_amount DECIMAL(10,2),
  status ENUM('PENDING','APPROVED','PAID') DEFAULT 'PENDING',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP NULL,
  paid_at TIMESTAMP NULL,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  FOREIGN KEY (company_id) REFERENCES companies(id)
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_employee_company ON employees(company_id);
CREATE INDEX idx_vendor_company ON vendors(company_id);
CREATE INDEX idx_txn_vendor ON coupon_transactions(vendor_id);
CREATE INDEX idx_txn_employee ON coupon_transactions(employee_id);
CREATE INDEX idx_settlement_vendor ON vendor_settlements(vendor_id);




ALTER TABLE vendors MODIFY COLUMN qr_code_url LONGTEXT;