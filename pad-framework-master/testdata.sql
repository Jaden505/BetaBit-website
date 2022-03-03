USE `VUL JE SCHEMA HIER IN`;

CREATE TABLE IF NOT EXISTS `users`
(
    `id`       INT          NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45)  NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`id`)
);

CREATE UNIQUE INDEX `username_UNIQUE` ON `users`
    (`username` ASC);

CREATE TABLE IF NOT EXISTS `rooms_example`
(
    `id`      INT NOT NULL,
    `surface` INT NULL,
    PRIMARY KEY (`id`)
);

INSERT INTO `users` (`username`, `password`) VALUES ('test', 'test');
INSERT INTO rooms_example(`id`, `surface`) VALUES (1256, 200);