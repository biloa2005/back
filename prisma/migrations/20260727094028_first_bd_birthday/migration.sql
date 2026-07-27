-- CreateTable
CREATE TABLE `Birth` (
    `id` VARCHAR(191) NOT NULL,
    `actNumber` VARCHAR(191) NOT NULL,
    `childFirstname` VARCHAR(191) NOT NULL,
    `childLastname` VARCHAR(191) NOT NULL,
    `birthDate` DATETIME(3) NOT NULL,
    `birthPlace` VARCHAR(191) NOT NULL,
    `sex` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `centerId` VARCHAR(191) NOT NULL,
    `createdBy` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Birth_actNumber_key`(`actNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BirthParent` (
    `id` VARCHAR(191) NOT NULL,
    `birthId` VARCHAR(191) NOT NULL,
    `fatherName` VARCHAR(191) NOT NULL,
    `motherName` VARCHAR(191) NOT NULL,
    `fatherJob` VARCHAR(191) NULL,
    `motherJob` VARCHAR(191) NULL,

    INDEX `BirthParent_birthId_idx`(`birthId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BirthAttachment` (
    `id` VARCHAR(191) NOT NULL,
    `birthId` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,
    `filePath` VARCHAR(191) NOT NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BirthAttachment_birthId_idx`(`birthId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BirthHistory` (
    `id` VARCHAR(191) NOT NULL,
    `birthId` VARCHAR(191) NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `BirthHistory_birthId_idx`(`birthId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BirthParent` ADD CONSTRAINT `BirthParent_birthId_fkey` FOREIGN KEY (`birthId`) REFERENCES `Birth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BirthAttachment` ADD CONSTRAINT `BirthAttachment_birthId_fkey` FOREIGN KEY (`birthId`) REFERENCES `Birth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BirthHistory` ADD CONSTRAINT `BirthHistory_birthId_fkey` FOREIGN KEY (`birthId`) REFERENCES `Birth`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
