-- ==========================================================
-- UPRSA OFFICIAL STATE PORTAL — MYSQL 8.0+ DATABASE SCHEMA
-- Hostinger & cPanel Ready Migration Script
-- ==========================================================

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `verification_logs`;
DROP TABLE IF EXISTS `chat_messages`;
DROP TABLE IF EXISTS `gallery`;
DROP TABLE IF EXISTS `announcements`;
DROP TABLE IF EXISTS `hero_slides`;
DROP TABLE IF EXISTS `payment_settings`;
DROP TABLE IF EXISTS `payments`;
DROP TABLE IF EXISTS `certificate_template_settings`;
DROP TABLE IF EXISTS `certificates`;
DROP TABLE IF EXISTS `results`;
DROP TABLE IF EXISTS `race_participants`;
DROP TABLE IF EXISTS `race_heats`;
DROP TABLE IF EXISTS `races`;
DROP TABLE IF EXISTS `tournament_registrations`;
DROP TABLE IF EXISTS `tournament_events`;
DROP TABLE IF EXISTS `tournaments`;
DROP TABLE IF EXISTS `clubs`;
DROP TABLE IF EXISTS `districts`;
DROP TABLE IF EXISTS `skaters`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `role` ENUM('admin', 'skater', 'district_admin', 'club_admin', 'scoring_operator') NOT NULL DEFAULT 'skater',
  `skater_id` VARCHAR(64) DEFAULT NULL,
  `district` VARCHAR(100) DEFAULT NULL,
  `club` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_users_role` (`role`),
  KEY `idx_users_skater_id` (`skater_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `districts` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `zone` ENUM('Western', 'Central', 'Eastern', 'Southern') NOT NULL DEFAULT 'Central',
  `secretary_name` VARCHAR(191) NOT NULL,
  `secretary_phone` VARCHAR(32) NOT NULL,
  `secretary_email` VARCHAR(191) NOT NULL,
  `office_address` TEXT DEFAULT NULL,
  `affiliated_year` INT DEFAULT 1988,
  `status` ENUM('Active', 'Pending') NOT NULL DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `clubs` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `head_coach` VARCHAR(191) NOT NULL,
  `coach_phone` VARCHAR(32) NOT NULL,
  `coach_email` VARCHAR(191) NOT NULL,
  `venue` TEXT NOT NULL,
  `disciplines` JSON DEFAULT NULL,
  `established_year` INT DEFAULT 2010,
  `status` ENUM('Active', 'Pending') NOT NULL DEFAULT 'Active',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_clubs_district` (`district`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `skaters` (
  `id` VARCHAR(64) NOT NULL,
  `registration_number` VARCHAR(64) NOT NULL UNIQUE,
  `user_id` VARCHAR(64) DEFAULT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `father_name` VARCHAR(191) NOT NULL,
  `mother_name` VARCHAR(191) DEFAULT NULL,
  `date_of_birth` DATE NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `blood_group` VARCHAR(10) DEFAULT NULL,
  `aadhaar_number_masked` VARCHAR(32) DEFAULT NULL,
  `email` VARCHAR(191) NOT NULL,
  `phone` VARCHAR(32) NOT NULL,
  `emergency_phone` VARCHAR(32) DEFAULT NULL,
  `address` TEXT DEFAULT NULL,
  `district` VARCHAR(100) NOT NULL,
  `club` VARCHAR(191) NOT NULL,
  `coach_name` VARCHAR(191) DEFAULT NULL,
  `discipline` VARCHAR(100) NOT NULL,
  `age_category` VARCHAR(100) NOT NULL,
  `skate_model` VARCHAR(191) DEFAULT NULL,
  `wheel_size` VARCHAR(50) DEFAULT NULL,
  `photo_url` TEXT DEFAULT NULL,
  `medical_cert_url` TEXT DEFAULT NULL,
  `dob_proof_url` TEXT DEFAULT NULL,
  `aadhaar_doc_url` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'verified', 'approved', 'rejected', 'active') NOT NULL DEFAULT 'pending',
  `rejection_reason` TEXT DEFAULT NULL,
  `annual_fee_paid` TINYINT(1) NOT NULL DEFAULT 0,
  `annual_fee_payment_date` DATE DEFAULT NULL,
  `annual_fee_utr` VARCHAR(100) DEFAULT NULL,
  `valid_until` DATE DEFAULT '2026-12-31',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_skaters_district` (`district`),
  KEY `idx_skaters_reg_no` (`registration_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tournaments` (
  `id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `edition` VARCHAR(191) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `venue` TEXT NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `state` VARCHAR(100) DEFAULT 'Uttar Pradesh',
  `start_date` DATE NOT NULL,
  `end_date` DATE NOT NULL,
  `registration_deadline` DATE NOT NULL,
  `status` ENUM('upcoming', 'open', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'open',
  `banner_url` TEXT DEFAULT NULL,
  `prospectus_url` TEXT DEFAULT NULL,
  `rules_pdf_url` TEXT DEFAULT NULL,
  `organizer` VARCHAR(255) NOT NULL,
  `contact_person` VARCHAR(191) DEFAULT NULL,
  `contact_phone` VARCHAR(32) DEFAULT NULL,
  `entry_fee_base` DECIMAL(10,2) DEFAULT 1000.00,
  `is_published` TINYINT(1) DEFAULT 1,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tournament_events` (
  `id` VARCHAR(64) NOT NULL,
  `tournament_id` VARCHAR(64) NOT NULL,
  `discipline` VARCHAR(100) NOT NULL,
  `age_category` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `event_name` VARCHAR(191) NOT NULL,
  `distance` VARCHAR(100) DEFAULT NULL,
  `entry_fee` DECIMAL(10,2) NOT NULL DEFAULT 400.00,
  `max_participants` INT DEFAULT 100,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_events_tournament` (`tournament_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tournament_registrations` (
  `id` VARCHAR(64) NOT NULL,
  `tournament_id` VARCHAR(64) NOT NULL,
  `tournament_title` VARCHAR(255) NOT NULL,
  `skater_id` VARCHAR(64) NOT NULL,
  `skater_name` VARCHAR(191) NOT NULL,
  `skater_reg_no` VARCHAR(64) NOT NULL,
  `district` VARCHAR(100) NOT NULL,
  `club` VARCHAR(191) NOT NULL,
  `age_category` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `discipline` VARCHAR(100) NOT NULL,
  `selected_events` JSON NOT NULL,
  `bib_number` VARCHAR(32) DEFAULT NULL,
  `total_fee` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `payment_status` ENUM('pending', 'submitted', 'verified', 'failed') NOT NULL DEFAULT 'pending',
  `payment_utr` VARCHAR(100) DEFAULT NULL,
  `payment_receipt_url` TEXT DEFAULT NULL,
  `status` ENUM('pending', 'confirmed', 'rejected', 'withdrawn') NOT NULL DEFAULT 'pending',
  `remarks` TEXT DEFAULT NULL,
  `registered_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_treg_tournament` (`tournament_id`),
  KEY `idx_treg_skater` (`skater_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `certificates` (
  `id` VARCHAR(64) NOT NULL,
  `certificate_number` VARCHAR(100) NOT NULL UNIQUE,
  `verification_code` VARCHAR(64) NOT NULL UNIQUE,
  `type` ENUM('Merit', 'Participation', 'Official', 'Coach', 'AnnualRegistration') NOT NULL,
  `recipient_name` VARCHAR(191) NOT NULL,
  `recipient_reg_no` VARCHAR(100) DEFAULT NULL,
  `father_name` VARCHAR(191) DEFAULT NULL,
  `district` VARCHAR(100) NOT NULL,
  `club` VARCHAR(191) DEFAULT NULL,
  `tournament_name` VARCHAR(255) DEFAULT NULL,
  `event_name` VARCHAR(191) DEFAULT NULL,
  `discipline` VARCHAR(100) DEFAULT NULL,
  `age_category` VARCHAR(100) DEFAULT NULL,
  `gender` ENUM('Male', 'Female', 'Other') DEFAULT NULL,
  `position` VARCHAR(191) DEFAULT NULL,
  `issue_date` DATE NOT NULL,
  `status` ENUM('valid', 'revoked') NOT NULL DEFAULT 'valid',
  `qr_verification_url` VARCHAR(255) NOT NULL,
  `signatory_president` VARCHAR(191) DEFAULT NULL,
  `signatory_secretary` VARCHAR(191) DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cert_code` (`verification_code`),
  KEY `idx_cert_reg_no` (`recipient_reg_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `results` (
  `id` VARCHAR(64) NOT NULL,
  `tournament_id` VARCHAR(64) NOT NULL,
  `tournament_name` VARCHAR(255) NOT NULL,
  `event_id` VARCHAR(64) NOT NULL,
  `event_name` VARCHAR(191) NOT NULL,
  `discipline` VARCHAR(100) NOT NULL,
  `age_category` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
  `position` INT NOT NULL,
  `medal` ENUM('Gold', 'Silver', 'Bronze') DEFAULT NULL,
  `points` INT NOT NULL DEFAULT 0,
  `skater_id` VARCHAR(64) NOT NULL,
  `skater_name` VARCHAR(191) NOT NULL,
  `skater_reg_no` VARCHAR(100) DEFAULT NULL,
  `district` VARCHAR(100) NOT NULL,
  `club` VARCHAR(191) NOT NULL,
  `time_record` VARCHAR(64) DEFAULT NULL,
  `published_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_results_skater` (`skater_id`),
  KEY `idx_results_district` (`district`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payments` (
  `id` VARCHAR(64) NOT NULL,
  `payment_type` ENUM('annual_registration', 'tournament_entry', 'club_affiliation') NOT NULL,
  `skater_id` VARCHAR(64) DEFAULT NULL,
  `skater_name` VARCHAR(191) DEFAULT NULL,
  `tournament_id` VARCHAR(64) DEFAULT NULL,
  `tournament_title` VARCHAR(255) DEFAULT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `utr_number` VARCHAR(100) NOT NULL,
  `payer_name` VARCHAR(191) NOT NULL,
  `payer_phone` VARCHAR(32) NOT NULL,
  `payer_email` VARCHAR(191) DEFAULT NULL,
  `status` ENUM('pending', 'verified', 'rejected') NOT NULL DEFAULT 'pending',
  `payment_date` DATE NOT NULL,
  `verified_at` DATETIME DEFAULT NULL,
  `verified_by` VARCHAR(191) DEFAULT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payments_utr` (`utr_number`),
  KEY `idx_payments_skater` (`skater_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
