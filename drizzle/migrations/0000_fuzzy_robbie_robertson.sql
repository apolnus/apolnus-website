CREATE TABLE `authorizedDealers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` text NOT NULL,
	`businessHours` text,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `authorizedDealers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `authorizedServiceCenters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`address` text NOT NULL,
	`businessHours` text,
	`services` text,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `authorizedServiceCenters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`category` varchar(100) NOT NULL,
	`relatedProducts` json,
	`question` json NOT NULL,
	`answer` json NOT NULL,
	`order` int NOT NULL DEFAULT 0,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `faqs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` varchar(50) NOT NULL,
	`title` varchar(200) NOT NULL,
	`department` varchar(100) NOT NULL,
	`location` varchar(100) NOT NULL,
	`country` varchar(10) NOT NULL,
	`description` text NOT NULL,
	`requirements` text,
	`attachments` text,
	`isActive` int NOT NULL DEFAULT 1,
	`postedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `jobs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `onlineStores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `partners` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyName` varchar(200) NOT NULL,
	`contactName` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20),
	`message` text,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `partners_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `productModels` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`slug` varchar(100),
	`isActive` int NOT NULL DEFAULT 1,
	`order` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `productModels_id` PRIMARY KEY(`id`),
	CONSTRAINT `productModels_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `seoSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`page` varchar(100) NOT NULL,
	`language` varchar(10) NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`keywords` text,
	CONSTRAINT `seoSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_page_lang` UNIQUE(`page`,`language`)
);
--> statement-breakpoint
CREATE TABLE `serviceCenters` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(200) NOT NULL,
	`address` text NOT NULL,
	`phone` varchar(20) NOT NULL,
	`businessHours` text,
	`services` text,
	`latitude` varchar(50),
	`longitude` varchar(50),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `serviceCenters_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `siteSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(100) NOT NULL,
	`value` text,
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `siteSettings_id` PRIMARY KEY(`id`),
	CONSTRAINT `siteSettings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `socialLinks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`locale` varchar(10) NOT NULL,
	`platform` varchar(50) NOT NULL,
	`url` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`displayOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialLinks_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_social_locale_platform` UNIQUE(`locale`,`platform`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`subscribedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `supportTickets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`contactName` varchar(100) NOT NULL,
	`contactPhone` varchar(20) NOT NULL,
	`contactAddress` text NOT NULL,
	`productModel` varchar(100) NOT NULL,
	`serialNumber` varchar(100),
	`purchaseDate` timestamp,
	`purchaseChannel` varchar(100),
	`issueTitle` varchar(200) NOT NULL,
	`issueDescription` text NOT NULL,
	`status` varchar(20) NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `supportTickets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ticketReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ticketId` int NOT NULL,
	`userId` int,
	`isAdmin` int NOT NULL DEFAULT 0,
	`isReadByUser` int NOT NULL DEFAULT 0,
	`isReadByAdmin` int NOT NULL DEFAULT 0,
	`message` text NOT NULL,
	`attachments` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ticketReplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `translations` (
	`key` varchar(255) NOT NULL,
	`lang` varchar(10) NOT NULL,
	`value` text,
	`namespace` varchar(50) NOT NULL DEFAULT 'translation'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`avatar` text,
	`phone` text,
	`address` text,
	`loginMethod` varchar(64),
	`role` varchar(10) NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()),
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE TABLE `warrantyRegistrations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`productModel` varchar(100) NOT NULL,
	`serialNumber` varchar(100) NOT NULL,
	`purchaseDate` timestamp NOT NULL,
	`purchaseChannel` varchar(100),
	`notes` text,
	`registeredAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `warrantyRegistrations_id` PRIMARY KEY(`id`)
);
