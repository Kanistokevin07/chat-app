import { AppError } from "@/common/errors/app-error.js";
import { prisma } from "@/lib/prisma.js";

export async function getMessages(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit = 30
) {
    const MAX_LIMIT = 100;

    const isMember = await prisma.conversationMember.findFirst({
        where: {
            conversationId,
            userId
        }
    });

    if (!isMember) {
        throw new Error("User is not part of this conversation");
    }

    const messages = await prisma.message.findMany({
        where: {
            conversationId
        },

        orderBy: {
            createdAt: "desc"
        },

        take: Math.min(limit, MAX_LIMIT),

        ...(cursor && {
            cursor: {
                id: cursor
            },
            skip: 1
        }),

        include: {
            sender: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });

    return {
        messages,
        nextCursor:
            messages.length === limit
                ? messages[messages.length - 1].id
                : null
    };
}

export async function createMessage(
    conversationId: string,
    senderId: string,
    content: string
) {
    // Verify the sender belongs to the conversation
    const member = await prisma.conversationMember.findFirst({
        where: {
            conversationId,
            userId: senderId
        }
    });

    if (!member) {
        throw new AppError(
            "You are not a member of this conversation",
            403,
            "FORBIDDEN"
        );
    }

    const message = await prisma.message.create({
        data: {
            conversationId,
            senderId,
            content
        },
        include: {
            sender: {
                select: {
                    id: true,
                    username: true
                }
            }
        }
    });

    // Update conversation's updatedAt so it appears at the top
    await prisma.conversation.update({
        where: {
            id: conversationId
        },
        data: {
            updatedAt: new Date()
        }
    });

    return message;
}