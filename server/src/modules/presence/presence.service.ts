import { prisma } from "@/config/db.js";
import { redis } from "@/lib/redis.js";


export async function addOnlineUser(
    userId:string,
    socketId:string
){
    await redis.sadd(`online:${userId}`, socketId);
}


export async function removeOnlineUser(
    userId:string,
    socketId:string
){

    await redis.srem(
        `online:${userId}`,
        socketId
    );


    const remaining =
        await redis.scard(
            `online:${userId}`
        );

    console.log("Remaining sockets:", remaining);
    if(remaining === 0){

        await redis.del(
            `online:${userId}`
        );

        return false;
    }

    return true;
}


export async function isUserOnline(
    userId:string
){
    const count = await redis.scard(`online:${userId}`);
    return count > 0;
}

export async function getOnlineUsers(
    userIds:string[]
){
    const result:any = {};

    for(const userId of userIds){
        result[userId] = await isUserOnline(userId);
    }

    return result;
}

export async function updateLastSeen(
    userId:string
){

    await prisma.conversationMember.updateMany({
        where:{
            userId
        },
        data:{
            lastSeenAt:new Date()
        }
    });
}

