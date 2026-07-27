import { prisma } from "@/lib/prisma.js";


export async function getMissedMessages(
    conversationId:string,
    userId:string,
    limit:number = 50
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
            "User not in conversation"
        );
    }


    const messages =
        await prisma.message.findMany({

            where:{
                conversationId,

                ...(member.lastSeenAt && {
                    createdAt:{
                        gt:member.lastSeenAt
                    }
                })
            },


            orderBy:{
                createdAt:"asc"
            },

            take:limit,

            include:{
                sender:{
                    select:{
                        id:true,
                        username:true
                    }
                },
                deliveryReceipts:{
                    select:{
                        userId:true,
                        deliveredAt:true
                    }
                },

                readReceipts:{
                    select:{
                        userId:true,
                        readAt:true
                    }
                }
            }

        });


    return messages;

}