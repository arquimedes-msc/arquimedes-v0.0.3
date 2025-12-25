ALTER TABLE `standalone_exercises` MODIFY COLUMN `options` json;--> statement-breakpoint
ALTER TABLE `standalone_exercises` MODIFY COLUMN `correctAnswer` text;--> statement-breakpoint
ALTER TABLE `standalone_exercises` ADD `uniqueId` varchar(50);--> statement-breakpoint
ALTER TABLE `standalone_exercises` ADD `exerciseType` enum('multiple_choice','fill_blanks','slider','matching') DEFAULT 'multiple_choice' NOT NULL;--> statement-breakpoint
ALTER TABLE `standalone_exercises` ADD `stepByStepExplanation` text;--> statement-breakpoint
ALTER TABLE `standalone_exercises` ADD `hint` text;--> statement-breakpoint
ALTER TABLE `standalone_exercises` ADD CONSTRAINT `standalone_exercises_uniqueId_unique` UNIQUE(`uniqueId`);