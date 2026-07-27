import { prisma } from "@/lib/prisma.js";


export async function getConversationMember(
    conversationId:string,
    userId:string
){

    return prisma.conversationMember.findUnique({
        where:{
            conversationId_userId:{
                conversationId,
                userId
            }
        }
    });

}



export async function isConversationAdmin(
    conversationId:string,
    userId:string
){

    const member =
        await getConversationMember(
            conversationId,
            userId
        );


    return member?.role === "ADMIN";

}