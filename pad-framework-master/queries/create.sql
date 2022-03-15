-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema pad_bbi_8_dev
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema pad_bbi_8_dev
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `pad_bbi_8_dev` DEFAULT CHARACTER SET utf8 ;
USE `pad_bbi_8_dev` ;

-- -----------------------------------------------------
-- Table `pad_bbi_8_dev`.`roles`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pad_bbi_8_dev`.`roles` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pad_bbi_8_dev`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pad_bbi_8_dev`.`users` (
  `email` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` INT NOT NULL,
  PRIMARY KEY (`email`),
  INDEX `user_role_idx` (`role` ASC) VISIBLE,
  CONSTRAINT `user_role`
    FOREIGN KEY (`role`)
    REFERENCES `pad_bbi_8_dev`.`roles` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pad_bbi_8_dev`.`dayTypes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pad_bbi_8_dev`.`dayTypes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pad_bbi_8_dev`.`transport`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `pad_bbi_8_dev`.`transport` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `emissions` INT(11) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pad_bbi_8_dev`.`defaultSchedules`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pad_bbi_8_dev`.`defaultSchedules` ;

CREATE TABLE IF NOT EXISTS `pad_bbi_8_dev`.`defaultSchedules` (
  `user_email` VARCHAR(255) NOT NULL,
  `day` VARCHAR(45) NOT NULL,
  `type` INT NOT NULL,
  `start_time` TIME NULL,
  `end_time` TIME NULL,
  `travel_distance` DOUBLE NULL,
  `transport` INT NULL,
  INDEX `default_types_idx` (`type` ASC) VISIBLE,
  INDEX `default_transport_idx` (`transport` ASC) VISIBLE,
  INDEX `defaultSchedule_user_email_idx` (`user_email` ASC) VISIBLE,
  PRIMARY KEY (`user_email`, `day`),
  CONSTRAINT `defaultSchedule_dayType`
      FOREIGN KEY (`type`)
          REFERENCES `pad_bbi_8_dev`.`dayTypes` (`id`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
  CONSTRAINT `defaultSchedule_transport`
      FOREIGN KEY (`transport`)
          REFERENCES `pad_bbi_8_dev`.`transport` (`id`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION,
  CONSTRAINT `defaultSchedule_user_email`
      FOREIGN KEY (`user_email`)
          REFERENCES `pad_bbi_8_dev`.`users` (`email`)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `pad_bbi_8_dev`.`schedules`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `pad_bbi_8_dev`.`schedules` ;

CREATE TABLE IF NOT EXISTS `pad_bbi_8_dev`.`schedules` (
   `user_email` VARCHAR(255) NOT NULL,
   `date` DATE NOT NULL,
   `type` INT NOT NULL,
   `start_time` TIME NULL,
   `end_time` TIME NULL,
   `travel_distance` DOUBLE NULL,
   `transport` INT NULL,
   INDEX `schedule_dayType_idx` (`type` ASC) VISIBLE,
   INDEX `schedule_transport_idx` (`transport` ASC) VISIBLE,
   INDEX `schedule_user_email_idx` (`user_email` ASC) VISIBLE,
   PRIMARY KEY (`user_email`, `date`),
   CONSTRAINT `schedule_dayType`
       FOREIGN KEY (`type`)
           REFERENCES `pad_bbi_8_dev`.`dayTypes` (`id`)
           ON DELETE NO ACTION
           ON UPDATE NO ACTION,
   CONSTRAINT `schedule_transport`
       FOREIGN KEY (`transport`)
           REFERENCES `pad_bbi_8_dev`.`transport` (`id`)
           ON DELETE NO ACTION
           ON UPDATE NO ACTION,
   CONSTRAINT `schedule_user_email`
       FOREIGN KEY (`user_email`)
           REFERENCES `pad_bbi_8_dev`.`users` (`email`)
           ON DELETE NO ACTION
           ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `pad_bbi_8_dev`.`roles`
-- -----------------------------------------------------
START TRANSACTION;
USE `pad_bbi_8_dev`;
INSERT INTO `pad_bbi_8_dev`.`roles` (`id`, `name`) VALUES (1, 'admin');
INSERT INTO `pad_bbi_8_dev`.`roles` (`id`, `name`) VALUES (2, 'user');

COMMIT;


-- -----------------------------------------------------
-- Data for table `pad_bbi_8_dev`.`users`
-- -----------------------------------------------------
START TRANSACTION;
USE `pad_bbi_8_dev`;
INSERT INTO `pad_bbi_8_dev`.`users` (`email`, `name`, `password`, `role`) VALUES ('test@gmail.com', 'test', 'test', 2);

COMMIT;
