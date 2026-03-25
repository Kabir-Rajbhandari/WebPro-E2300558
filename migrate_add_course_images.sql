-- EduSkill Database Migration
-- Add image_path column to courses table
-- Run this if you already have the database created

ALTER TABLE `courses` ADD COLUMN `image_path` VARCHAR(500) DEFAULT NULL AFTER `available_seats`;

-- Optional: Update course listings to ensure they work
-- No data migration needed as image_path defaults to NULL
