import { prisma } from "@/lib/prisma.js";

export async function createPrivateConversation(
    userId: string,
    otherUserId: string
) {
    if (userId === otherUserId) {
        throw new Error("Cannot create conversation with yourself");
    }

    const existingConversation = await prisma.conversation.findFirst({
        where: {
            type: "PRIVATE",
            members: {
                every: {
                    userId: {
                        in: [userId, otherUserId]
                    }
                }
            }
        },
        include: {
            members: true
        }
    });

    if (existingConversation) {
        return existingConversation;
    }

    const conversation = await prisma.conversation.create({
        data: {
            type: "PRIVATE",
            members: {
                create: [
                    { userId },
                    { userId: otherUserId }
                ]
            }
        },
        include: {
            members: true
        }
    });

    return conversation;
}