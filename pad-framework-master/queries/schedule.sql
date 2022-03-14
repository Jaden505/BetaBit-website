USE `pad_bbi_8_dev`;

CREATE TABLE IF NOT EXISTS `schedules`
(
    `day`       VARCHAR(30) NOT NULL,
    `start_at`  TIME(0),
    `end_at`    TIME(0),
    `distance`  INT(10),
    `transport` VARCHAR(30),
    `absence`   BIT(1),

    PRIMARY KEY (`day`)
    );

CREATE TABLE IF NOT EXISTS `defaultSchedules`
(
    `day`       VARCHAR(30) NOT NULL,
    `start_at`  TIME(0),
    `end_at`    TIME(0),
    `distance`  INT(10),
    `transport` VARCHAR(30),
    `absence`   BIT(1),

    PRIMARY KEY (`day`)
);

SELECT * FROM defaultSchedules;

DROP TABLE schedules;
DROP TABLE defaultSchedules;

# INSERT INTO `schedules` VALUES ("Monday", "08:30:00", "18:00:00",  6, "Car", 0);
# INSERT INTO `defaultSchedules` VALUES ("Monday", "08:00:00", "17:30:00",  6, "Car", 0);
# INSERT INTO `defaultSchedules` VALUES ("Tuesday", "08:00:00", "17:30:00",  6, "Car", 0);
# INSERT INTO `defaultSchedules` VALUES ("Wednesday", "08:00:00", "17:30:00",  6, "Car", 0);
# INSERT INTO `defaultSchedules` VALUES ("Thurdsay", "08:00:00", "17:30:00",  6, "Car", 0);
# INSERT INTO `defaultSchedules` VALUES ("Friday", "08:00:00", "17:30:00",  6, "Car", 0);
# INSERT INTO `defaultSchedules` (day, absence) VALUES ("Saturday", 1);
# INSERT INTO `defaultSchedules` (day, absence) VALUES ("Sunday", 1);
