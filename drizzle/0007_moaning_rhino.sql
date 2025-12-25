CREATE TABLE `standalone_exercise_attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`exerciseId` int NOT NULL,
	`isCorrect` boolean NOT NULL,
	`attemptedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `standalone_exercise_attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standalone_exercises` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`question` text NOT NULL,
	`options` json NOT NULL,
	`correctAnswer` int NOT NULL,
	`difficulty` enum('easy','moderate','hard') NOT NULL,
	`points` int NOT NULL,
	`disciplineId` int,
	`moduleId` int,
	`pageId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `standalone_exercises_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standalone_video_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoId` int NOT NULL,
	`watchedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `standalone_video_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `standalone_videos` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`youtubeId` varchar(20) NOT NULL,
	`duration` varchar(20),
	`description` text,
	`disciplineId` int,
	`moduleId` int,
	`pageId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `standalone_videos_id` PRIMARY KEY(`id`)
);
