-- AlterTable
ALTER TABLE "conversation_members" ADD COLUMN     "lastReadAt" TIMESTAMP(3),
ADD COLUMN     "lastSeenAt" TIMESTAMP(3);
