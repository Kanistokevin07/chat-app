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
            },

            deliveryReceipts: {
                select: {
                    userId: true,
                    deliveredAt: true
                }
            },

            readReceipts: {
                select: {
                    userId: true,
                    readAt: true
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

export async function canAccessMessage(
    messageId: string,
    userId: string
) {

    const message =
        await prisma.message.findFirst({
            where:{
                id: messageId,

                conversation:{
                    members:{
                        some:{
                            userId
                        }
                    }
                }
            }
        });

    return !!message;
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

    return prisma.$transaction(async (tx) => {

        const message = await tx.message.create({
            data: {
                conversationId,
                senderId,
                content,
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

        await tx.conversationMember.updateMany({
            where: {
                conversationId,
                userId: {
                    not: senderId
                }
            },
            data: {
                unreadCount: {
                    increment: 1
                }
            }
        });

        await tx.conversation.update({
            where: {
                id: conversationId
            },
            data: {
                updatedAt: new Date()
            }
        });

        return message;

    });
}

export async function createDeliveryReceipt(
    messageId: string,
    userId: string
) {

    const message = await prisma.message.findFirst({
        where: {
            id: messageId,
            conversation: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        }
    });

    if (!message) {
        throw new AppError(
            "Message not found",
            404,
            "NOT_FOUND"
        );
    }

    return prisma.messageDeliveryReceipt.upsert({
        where: {
            messageId_userId: {
                messageId,
                userId
            }
        },

        create: {
            messageId,
            userId
        },

        update: {}
    });
}

export async function createReadReceipt(
    messageId: string,
    userId: string
) {

    const message = await prisma.message.findFirst({
        where: {
            id: messageId,
            conversation: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        },
        select: {
            id: true,
            conversationId: true
        }
    });

    if (!message) {
        throw new AppError(
            "Message not found",
            404,
            "NOT_FOUND"
        );
    }

    const receipt = await prisma.$transaction(async (tx) => {

        const readReceipt = await tx.messageReadReceipt.upsert({
            where: {
                messageId_userId: {
                    messageId,
                    userId
                }
            },

            create: {
                messageId,
                userId
            },

            update: {}
        });

        await tx.conversationMember.update({
            where: {
                conversationId_userId: {
                    conversationId: message.conversationId,
                    userId
                }
            },

            data: {
                unreadCount: 0
            }
        });
        return readReceipt;
    });

    return receipt;

}

export async function markConversationRead(
    conversationId: string,
    userId: string
) {

    // Verify membership
    const member = await prisma.conversationMember.findFirst({
        where:{
            conversationId,
            userId
        }
    });

    if(!member){
        throw new AppError(
            "You are not part of this conversation",
            403,
            "FORBIDDEN"
        );
    }

    const unreadMessages =
        await prisma.message.findMany({
            where: {
                conversationId,
                senderId: {
                    not: userId
                },
                readReceipts: {
                    none: {
                        userId
                    }
                }
            },

            select: {
                id: true
            }
        });

    await prisma.$transaction(async (tx) => {

        await tx.messageReadReceipt.createMany({
            data: unreadMessages.map(message => ({
                messageId: message.id,
                userId
            })),
            skipDuplicates: true
        });

        await tx.conversationMember.update({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId
                }
            },

            data: {
                unreadCount: 0,
                lastReadAt: new Date()
            }
        });

    });

    return {
        success: true
    };
}

export async function editMessage(
    messageId:string,
    userId:string,
    content:string
){

    const message =
        await prisma.message.findUnique({
            where:{
                id:messageId
            }
        });


    if(!message){
        throw new AppError(
            "Message not found",
            404,
            "NOT_FOUND"
        );
    }


    if(message.senderId !== userId){
        throw new AppError(
            "You cannot edit this message",
            403,
            "FORBIDDEN"
        );
    }


    return prisma.message.update({

        where:{
            id:messageId
        },

        data:{
            content,
            editedAt:new Date()
        },

        include:{
            sender:{
                select:{
                    id:true,
                    username:true
                }
            }
        }
    });
}

export async function deleteMessage(
    messageId:string,
    userId:string
){

    const message =
        await prisma.message.findUnique({
            where:{
                id:messageId
            }
        });


    if(!message){
        throw new AppError(
            "Message not found",
            404,
            "NOT_FOUND"
        );
    }


    if(message.senderId !== userId){
        throw new AppError(
            "You cannot delete this message",
            403,
            "FORBIDDEN"
        );
    }


    return prisma.message.update({

        where:{
            id:messageId
        },

        data:{
            deletedAt: new Date(),
            content:""
        }
    });
}