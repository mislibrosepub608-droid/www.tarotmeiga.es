CREATE TABLE `chat_conversaciones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(128) NOT NULL,
	`tarotistId` varchar(64) NOT NULL,
	`pregunta` text NOT NULL,
	`respuesta` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_conversaciones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`email` varchar(320),
	`tipoConsulta` enum('amor','trabajo','salud','general') NOT NULL,
	`metodoContacto` enum('whatsapp','audio','email','llamada') NOT NULL,
	`mensaje` text,
	`telefono` varchar(30),
	`estado` enum('pendiente','confirmada','completada','cancelada') NOT NULL DEFAULT 'pendiente',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reservas_id` PRIMARY KEY(`id`)
);
