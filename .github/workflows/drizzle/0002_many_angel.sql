CREATE TABLE `bonos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`descripcion` text,
	`precio` decimal(10,2) NOT NULL,
	`creditos` int NOT NULL,
	`tipo` enum('minutos','consultas') NOT NULL DEFAULT 'minutos',
	`activo` enum('si','no') NOT NULL DEFAULT 'si',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `bonos_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `clientes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefono` varchar(30),
	`saldo` decimal(10,2) NOT NULL DEFAULT '0.00',
	`notas` text,
	`estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clientes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `recargas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`clienteId` int,
	`clienteNombre` varchar(255) NOT NULL,
	`clienteEmail` varchar(320) NOT NULL,
	`clienteTelefono` varchar(30),
	`bonoId` int,
	`bonoNombre` varchar(255) NOT NULL,
	`importe` decimal(10,2) NOT NULL,
	`creditos` int NOT NULL,
	`metodo` enum('transferencia','bizum','paypal','efectivo') NOT NULL DEFAULT 'bizum',
	`estado` enum('pendiente','confirmada','rechazada') NOT NULL DEFAULT 'pendiente',
	`notas` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `recargas_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `solicitudes_trabajo` (
	`id` int AUTO_INCREMENT NOT NULL,
	`nombre` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`telefono` varchar(30),
	`especialidad` varchar(255) NOT NULL,
	`experiencia` text NOT NULL,
	`presentacion` text NOT NULL,
	`redesSociales` varchar(500),
	`estado` enum('pendiente','revisada','aceptada','rechazada') NOT NULL DEFAULT 'pendiente',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `solicitudes_trabajo_id` PRIMARY KEY(`id`)
);
