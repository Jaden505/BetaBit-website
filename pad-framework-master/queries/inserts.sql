-- -----------------------------------------------------
-- Data for table `pad_bbi_8_dev`.`transport`
-- -----------------------------------------------------
START TRANSACTION;
USE `pad_bbi_8_dev`;
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (1, 'lopen', 0);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (2, 'fiets', 0);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (3, 'trein', 0);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (4, 'metro', 0);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (5, 'tram', 0);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (6, 'elektrische fiets', 3);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (7, 'elektrische scooter', 23);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (8, 'benzine scooter', 56);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (9, 'elektrische auto', 85);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (10, 'bus', 103);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (11, 'hybride auto', 128);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (12, 'diesel auto', 180);
INSERT INTO `pad_bbi_8_dev`.`transport` (`id`, `name`, `emissions`) VALUES (13, 'bezine auto', 204);

COMMIT;

-- -----------------------------------------------------
-- Data for table `pad_bbi_8_dev`.`dayTypes`
-- -----------------------------------------------------
INSERT INTO `dayTypes` (name) VALUES ('On location');
INSERT INTO `dayTypes` (name) VALUES ('Absent');
INSERT INTO `dayTypes` (name) VALUES ('Online');
INSERT INTO `dayTypes` (name) VALUES ('Free');

-- -----------------------------------------------------
-- Data for table `pad_bbi_8_dev`.`defaultSchedule`
-- -----------------------------------------------------
INSERT INTO `defaultSchedules` VALUES ('test@gmail.com', 'Monday', 1, '08:00:00', '17:30:00',  6, 12);
INSERT INTO `defaultSchedules` VALUES ('test@gmail.com', 'Tuesday', 1, '08:00:00', '17:30:00',  6, 12);
INSERT INTO `defaultSchedules` VALUES ('test@gmail.com', 'Wednesday', 1, '08:00:00', '17:30:00',  6, 10);
INSERT INTO `defaultSchedules` VALUES ('test@gmail.com', 'Thurdsay', 1, '08:00:00', '17:30:00',  6, 3);
INSERT INTO `defaultSchedules` VALUES ('test@gmail.com', 'Friday', 1, '08:00:00', '17:30:00',  6, 4);
INSERT INTO `defaultSchedules` (user_email, day, type) VALUES ('test@gmail.com', 'Saturday', 4);
INSERT INTO `defaultSchedules` (user_email, day, type) VALUES ('test@gmail.com', 'Sunday', 4);

-- -----------------------------------------------------
-- Data for table `pad_bbi_8_dev`.`schedules`
-- -----------------------------------------------------
INSERT INTO `schedules` VALUES ('test@gmail.com', '2022-03-18', 1, '08:00:00', '19:30:00', 12.02, 6, 12);