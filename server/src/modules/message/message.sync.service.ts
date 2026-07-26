import { prisma } from "@/lib/prisma.js";


export async function getMissedMessages(
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
            "User not in conversation"
        );
    }


    const messages =
        await prisma.message.findMany({

            where:{
                conversationId,

                ...(member.lastReadAt && {
                    createdAt:{
                        gt:member.lastReadAt
                    }
                })
            },


            orderBy:{
                createdAt:"asc"
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


    return messages;

}