-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN "coverType" TEXT NOT NULL DEFAULT 'image';
ALTER TABLE "BlogPost" ADD COLUMN "coverVideoUrl" TEXT;