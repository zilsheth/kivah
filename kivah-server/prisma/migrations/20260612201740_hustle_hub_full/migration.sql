/*
  Warnings:

  - You are about to drop the column `pitchId` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the `Pitch` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Pitch" DROP CONSTRAINT "Pitch_hustleId_fkey";

-- DropForeignKey
ALTER TABLE "Pitch" DROP CONSTRAINT "Pitch_userId_fkey";

-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_pitchId_fkey";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "pitchId";

-- DropTable
DROP TABLE "Pitch";

-- CreateTable
CREATE TABLE "TrackerField" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fieldType" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "options" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hustleId" TEXT NOT NULL,

    CONSTRAINT "TrackerField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackerEntry" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hustleId" TEXT NOT NULL,
    "trackerFieldId" TEXT NOT NULL,

    CONSTRAINT "TrackerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Income" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT,
    "paymentMethod" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hustleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hustleId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Note_hustleId_key" ON "Note"("hustleId");

-- AddForeignKey
ALTER TABLE "TrackerField" ADD CONSTRAINT "TrackerField_hustleId_fkey" FOREIGN KEY ("hustleId") REFERENCES "Hustle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackerEntry" ADD CONSTRAINT "TrackerEntry_hustleId_fkey" FOREIGN KEY ("hustleId") REFERENCES "Hustle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackerEntry" ADD CONSTRAINT "TrackerEntry_trackerFieldId_fkey" FOREIGN KEY ("trackerFieldId") REFERENCES "TrackerField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_hustleId_fkey" FOREIGN KEY ("hustleId") REFERENCES "Hustle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Income" ADD CONSTRAINT "Income_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_hustleId_fkey" FOREIGN KEY ("hustleId") REFERENCES "Hustle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
