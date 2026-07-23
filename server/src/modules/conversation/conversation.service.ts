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

export async function getUserConversations(
    userId:string
){

    const conversations = await prisma.conversation.findMany({

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
                            email:true
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

    return conversations.map((conversation)=>{
        
        const otherMember =
            conversation.members.find(
                member =>
                    member.userId !== userId
            );

        return {
            id: conversation.id,
            user: otherMember?.user ?? null,
            lastMessage:
                conversation.messages[0] ?? null,
            updatedAt:
                conversation.updatedAt
        };
    });
}