-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "description" TEXT DEFAULT '',
ADD COLUMN     "noteVersion" INTEGER NOT NULL DEFAULT 1;
