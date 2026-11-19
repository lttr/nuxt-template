CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`body` text NOT NULL,
	`createdAt` integer NOT NULL
);
