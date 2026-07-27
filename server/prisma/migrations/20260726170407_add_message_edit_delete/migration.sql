-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "editedAt" TIMESTAMP(3),
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastSeenAt" TIMESTAMP(3);
