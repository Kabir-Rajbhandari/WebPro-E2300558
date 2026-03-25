-- ============================================================
-- EduSkill Marketplace System - Database Setup
-- File: eduskill_db.sql
-- Run: mysql -u root -p < eduskill_db.sql
-- ============================================================

CREATE DATABASE IF NOT EXISTS `eduskill_db`
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `eduskill_db`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`         INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `name`       VARCHAR(150)    NOT NULL,
  `email`      VARCHAR(200)    NOT NULL UNIQUE,
  `password`   VARCHAR(255)    NOT NULL,
  `role`       ENUM('learner','provider','officer') NOT NULL DEFAULT 'learner',
  `phone`      VARCHAR(20)     DEFAULT NULL,
  `created_at` TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role`  (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `providers` (
  `providerID`    INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `userID`        INT UNSIGNED NOT NULL,
  `org_name`      VARCHAR(200) NOT NULL,
  `org_profile`   TEXT         DEFAULT NULL,
  `status`        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `document_path` VARCHAR(500) DEFAULT NULL,
  `created_at`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`providerID`),
  CONSTRAINT `fk_prov_user` FOREIGN KEY (`userID`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `courses` (
  `courseID`        INT UNSIGNED   NOT NULL AUTO_INCREMENT,
  `providerID`      INT UNSIGNED   NOT NULL,
  `title`           VARCHAR(300)   NOT NULL,
  `description`     TEXT           NOT NULL,
  `fee`             DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  `category`        VARCHAR(100)   DEFAULT 'General',
  `startDate`       DATE           DEFAULT NULL,
  `endDate`         DATE           DEFAULT NULL,
  `available_seats` INT UNSIGNED   NOT NULL DEFAULT 30,
  `image_path`      VARCHAR(500)   DEFAULT NULL,
  `status`          ENUM('active','inactive') NOT NULL DEFAULT 'active',
  `created_at`      TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`courseID`),
  CONSTRAINT `fk_course_prov` FOREIGN KEY (`providerID`) REFERENCES `providers`(`providerID`) ON DELETE CASCADE,
  INDEX `idx_category` (`category`),
  INDEX `idx_course_status` (`status`),
  FULLTEXT INDEX `ft_course_search` (`title`, `description`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `enrollments` (
  `enrollID`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `learnerID`     INT UNSIGNED NOT NULL,
  `courseID`      INT UNSIGNED NOT NULL,
  `paymentStatus` ENUM('pending','paid','refunded') NOT NULL DEFAULT 'pending',
  `enrollDate`    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ic_number`     VARCHAR(20)  DEFAULT NULL,
  `address`       TEXT         DEFAULT NULL,
  `phone`         VARCHAR(20)  DEFAULT NULL,
  `employer`      VARCHAR(200) DEFAULT NULL,
  `receiptPath`   VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (`enrollID`),
  CONSTRAINT `fk_enr_learner` FOREIGN KEY (`learnerID`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enr_course`  FOREIGN KEY (`courseID`)  REFERENCES `courses`(`courseID`) ON DELETE CASCADE,
  UNIQUE KEY `uk_learner_course` (`learnerID`, `courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `reviews` (
  `reviewID`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `learnerID`  INT UNSIGNED NOT NULL,
  `courseID`   INT UNSIGNED NOT NULL,
  `rating`     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `feedback`   TEXT         NOT NULL,
  `created_at` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`reviewID`),
  CONSTRAINT `fk_rev_learner` FOREIGN KEY (`learnerID`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_course`  FOREIGN KEY (`courseID`)  REFERENCES `courses`(`courseID`) ON DELETE CASCADE,
  UNIQUE KEY `uk_learner_review` (`learnerID`, `courseID`),
  CHECK (`rating` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `documents` (
  `docID`      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `providerID` INT UNSIGNED NOT NULL,
  `fileName`   VARCHAR(300) NOT NULL,
  `filePath`   VARCHAR(500) NOT NULL,
  `uploadedAt` TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`docID`),
  CONSTRAINT `fk_doc_prov` FOREIGN KEY (`providerID`) REFERENCES `providers`(`providerID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `analytics` (
  `analyticsID` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `courseID`    INT UNSIGNED NOT NULL,
  `views`       INT UNSIGNED NOT NULL DEFAULT 0,
  `enrollCount` INT UNSIGNED NOT NULL DEFAULT 0,
  `updatedAt`   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`analyticsID`),
  CONSTRAINT `fk_anal_course` FOREIGN KEY (`courseID`) REFERENCES `courses`(`courseID`) ON DELETE CASCADE,
  UNIQUE KEY `uk_course_analytics` (`courseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Officer account (password: officer@123)
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`) VALUES
('Ministry Officer', 'eduskill@officer.my', 'officer@123', 'officer', '0123456789');

-- ============================================================
-- Working Account:
-- Email: eduskillofficer@gmail.com
-- Password: officer@123
-- Role: Officer
-- ============================================================
