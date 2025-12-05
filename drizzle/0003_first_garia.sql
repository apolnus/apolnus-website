ALTER TABLE `productModels` ADD `slug` varchar(100);--> statement-breakpoint
ALTER TABLE `productModels` ADD `updatedAt` timestamp DEFAULT (now()) NOT NULL ON UPDATE CURRENT_TIMESTAMP;