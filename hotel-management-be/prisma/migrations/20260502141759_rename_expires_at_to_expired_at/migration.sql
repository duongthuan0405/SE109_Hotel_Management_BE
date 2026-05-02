/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `ResetPasswordOTP` table. All the data in the column will be lost.
  - Added the required column `expiredAt` to the `ResetPasswordOTP` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResetPasswordOTP" DROP COLUMN "expiresAt",
ADD COLUMN     "expiredAt" TIMESTAMP(3) NOT NULL;
