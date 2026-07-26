import { prisma } from "@/lib/prisma.js";
import { isUserOnline } from "@/modules/presence/presence.service.js";

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
                    { 
                        userId,
                        lastReadAt:new Date(),
                        lastSeenAt:new Date()
                    },
                    { 
                        userId: otherUserId,
                        lastReadAt:new Date(),
                        lastSeenAt:new Date()
                    }
                ]
            }
        },
        include: {
            members: true
        }
    });

    return conversation;
}

export async function getUserConversations(
    userId:string
){

    const conversations =
        await prisma.conversation.findMany({

            where:{
                members:{
                    some:{
                        userId
                    }
                }
            },

            include:{
                members:{
                    include:{
                        user:{
                            select:{
                                id:true,
                                username:true,
                                email:true,
                                lastSeenAt:true
                            }
                        }
                    }
                },

                messages:{
                    orderBy:{
                        createdAt:"desc"
                    },

                    take:1
                }
            },

            orderBy:{
                updatedAt:"desc"
            }
        });


    const result =
        await Promise.all(

            conversations.map(
                async(conversation)=>{

                    const myMember =
                        conversation.members.find(
                            member =>
                                member.userId === userId
                        );

                    const otherMember =
                        conversation.members.find(
                            member =>
                                member.userId !== userId
                        );

                    let status = null;

                    if(conversation.type === "PRIVATE" && otherMember){

                        const online = await isUserOnline(otherMember.userId);

                        status = {
                            online,
                            lastSeenAt: otherMember.user.lastSeenAt
                        };
                    }

                    return {

                        id:conversation.id,
                        type:conversation.type,
                        name:conversation.name,

                        user:
                            conversation.type === "PRIVATE"
                            ?
                            otherMember?.user ?? null
                            :
                            null,


                        members:
                            conversation.type === "GROUP"
                            ?
                            conversation.members.map(
                                member => member.user
                            )
                            :
                            undefined,

                        lastMessage: conversation.messages[0] ?? null,
                        unreadCount: myMember?.unreadCount ?? 0,
                        status,
                        updatedAt: conversation.updatedAt
                    };
                }
            )
        );
    return result;
}

export async function isConversationMember(
    conversationId: string,
    userId: string
) {

    const member =
        await prisma.conversationMember.findFirst({
            where:{
                conversationId,
                userId
            }
        });


    return !!member;
}