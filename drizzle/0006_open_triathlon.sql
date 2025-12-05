CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` varchar(50) NOT NULL,
	`title` varchar(200) NOT NULL,
	`department` varchar(100) NOT NULL,
	`location` varchar(100) NOT NULL,
	`country` varchar(10) NOT NULL,
	`description` text NOT NULL,
	`requirements` text,
	`isActive` int NOT NULL DEFAULT 1,
	`postedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
