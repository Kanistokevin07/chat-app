/*
  Warnings:

  - You are about to drop the `MessageDeliveryReceipt` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MessageReadReceipt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MessageDeliveryReceipt" DROP CONSTRAINT "MessageDeliveryReceipt_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageDeliveryReceipt" DROP CONSTRAINT "MessageDeliveryReceipt_userId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReadReceipt" DROP CONSTRAINT "MessageReadReceipt_messageId_fkey";

-- DropForeignKey
ALTER TABLE "MessageReadReceipt" DROP CONSTRAINT "MessageReadReceipt_userId_fkey";

-- DropTable
DROP TABLE "MessageDeliveryReceipt";

-- DropTable
DROP TABLE "MessageReadReceipt";

-- CreateTable
CREATE TABLE "message_read_receipts" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_read_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_delivery_receipts" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deliveredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "message_delivery_receipts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "message_read_receipts_userId_idx" ON "message_read_receipts"("userId");

-- CreateIndex
CREATE INDEX "message_read_receipts_messageId_idx" ON "message_read_receipts"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "message_read_receipts_messageId_userId_key" ON "message_read_receipts"("messageId", "userId");

-- CreateIndex
CREATE INDEX "message_delivery_receipts_userId_idx" ON "message_delivery_receipts"("userId");

-- CreateIndex
CREATE INDEX "message_delivery_receipts_messageId_idx" ON "message_delivery_receipts"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "message_delivery_receipts_messageId_userId_key" ON "message_delivery_receipts"("messageId", "userId");

-- CreateIndex
CREATE INDEX "conversation_members_userId_idx" ON "conversation_members"("userId");

-- CreateIndex
CREATE INDEX "conversation_members_conversationId_idx" ON "conversation_members"("conversationId");

-- CreateIndex
CREATE INDEX "messages_conversationId_createdAt_idx" ON "messages"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- AddForeignKey
ALTER TABLE "message_read_receipts" ADD CONSTRAINT "message_read_receipts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_read_receipts" ADD CONSTRAINT "message_read_receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_delivery_receipts" ADD CONSTRAINT "message_delivery_receipts_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_delivery_receipts" ADD CONSTRAINT "message_delivery_receipts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
