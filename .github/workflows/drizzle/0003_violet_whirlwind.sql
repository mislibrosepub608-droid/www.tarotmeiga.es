CREATE TABLE `resenas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`email` varchar(320),
	`texto` text NOT NULL,
	`puntuacion` int NOT NULL DEFAULT 5,
	`tarotistaNombre` varchar(255),
	`visible` enum('si','no') NOT NULL DEFAULT 'no',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `resenas_id` PRIMARY KEY(`id`)
);
