import { prisma } from "@/lib/prisma.js";
import { isUserOnline } from "@/modules/presence/presence.service.js";
import { isConversationAdmin } from "./conversation.permission.service.js";
import { AppError } from "@/common/errors/app-error.js";

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

export async function createGroupConversation(
    creatorId:string,
    name:string,
    memberIds:string[]
){

    const uniqueMembers =
        [...new Set([
            creatorId,
            ...memberIds
        ])];

    const conversation = await prisma.conversation.create({
        data:{
            type:"GROUP",
            name,
            members:{
                create:
                uniqueMembers.map(userId=>({
                    userId,
                    role: userId === creatorId?"ADMIN":"MEMBER",
                    lastReadAt:new Date(),
                    lastSeenAt:new Date()

                }))
            }
        },

        include:{
            members:true
        }
    });
    return conversation;
}

export async function addGroupMember(
    conversationId: string,
    requesterId: string,
    newUserId: string
){
    const admin = await isConversationAdmin(conversationId, requesterId);

    if(!admin){
        throw new Error("ONly ADmin can add members");
    }

    const conversation = await prisma.conversation.findUnique(
        {
            where:{
                id: conversationId
            }
        }
    );

    if(!conversation){
        throw new Error("Convo not found");
    }

    if(conversation.type !== "GROUP"){
        throw new Error("Cant add members to private chat");
    }

    return prisma.conversationMember.create({
        data:{
            conversationId,
            userId:newUserId,
            role:"MEMBER",
            lastReadAt:new Date(),
            lastSeenAt:new Date()
        }
    })
}

export async function removeGroupMember(
    conversationId:string,
    requesterId:string,
    removeUserId:string
){

    const admin = await isConversationAdmin(
        conversationId,
        requesterId
    );

    if(!admin){
        throw new Error(
            "Only admin can remove members"
        );
    }

    if(requesterId === removeUserId){
        throw new Error(
            "Admin cannot remove himself, use leave"
        );
    }

    return prisma.conversationMember.delete({
        where:{
            conversationId_userId:{
            conversationId,
            userId:removeUserId
            }
        }
    });
}

export async function leaveGroup(
    conversationId:string,
    userId:string
){

    const member =
        await prisma.conversationMember.findUnique({
            where:{
                conversationId_userId:{
                    conversationId,
                    userId
                }
            }
        });


    if(!member){
        throw new Error(
            "User is not a member of this group"
        );
    }


    return prisma.conversationMember.delete({
        where:{
            conversationId_userId:{
                conversationId,
                userId
            }
        }
    });

}

export async function promoteMember(
    conversationId:string,
    requesterId:string,
    userId:string
){

    const admin =
        await isConversationAdmin(
            conversationId,
            requesterId
        );


    if(!admin){
        throw new Error(
            "Only admin can promote members"
        );
    }


    return prisma.conversationMember.update({

        where:{
            conversationId_userId:{
                conversationId,
                userId
            }
        },

        data:{
            role:"ADMIN"
        }

    });

}

export async function demoteMember(
    conversationId:string,
    requesterId:string,
    userId:string
){

    const admin =
        await isConversationAdmin(
            conversationId,
            requesterId
        );


    if(!admin){
        throw new Error(
            "Only admin can demote members"
        );
    }


    if(requesterId === userId){
        throw new Error(
            "Admin cannot demote himself"
        );
    }


    return prisma.conversationMember.update({

        where:{
            conversationId_userId:{
                conversationId,
                userId
            }
        },

        data:{
            role:"MEMBER"
        }

    });

}