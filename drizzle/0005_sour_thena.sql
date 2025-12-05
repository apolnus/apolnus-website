CREATE TABLE `onlineStores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`country` varchar(10) NOT NULL,
	`type` varchar(20) NOT NULL DEFAULT 'platform',
	`name` varchar(100) NOT NULL,
	`url` text,
	`logo` text,
	`isActive` int NOT NULL DEFAULT 1,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onlineStores_id` PRIMARY KEY(`id`)
);
