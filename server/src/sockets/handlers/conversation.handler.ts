import { Server, Socket } from "socket.io";
import { isConversationMember } from "@/modules/conversation/conversation.service.js";
import { SOCKET_EVENTS } from "../events.js";
import { logger } from "@/config/logger.js";

const log = logger.child({
    module: "message-handler"
});


export function registerConversationHandlers(
    io: Server,
    socket: Socket
){

    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async (conversationId:string)=>{

        console.log(
        "JOIN FROM",
        socket.data.user.id,
        socket.id
    );

        console.log(
            "JOIN REQUEST",
            conversationId
        );

        const allowed = await isConversationMember(
            conversationId,
            socket.data.user.id
        );

        console.log(
            "ALLOWED",
            allowed
        );

        if(!allowed){
            socket.emit("error", "You are not a member of this conversation");
            return;
        }

        socket.join(conversationId);
        log.info({
    socketId: socket.id,
    rooms: [...socket.rooms]
}, "JOIN SUCCESS");

        console.log(
            `User ${socket.data.user.id} joined ${conversationId}`
        );


        const room =
                io.sockets.adapter.rooms.get(
                    conversationId
                );


            console.log(
                "ROOM MEMBERS COUNT",
                room?.size
            );


            console.log(
                "ROOM MEMBERS",
                room
            );

            console.log(
            "ALL ROOMS"
        );


        for(const [roomId, sockets] of io.sockets.adapter.rooms){

            console.log(
                roomId,
                sockets.size
            );

        }
    });

    socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId:string)=>{
        socket.leave(conversationId);   
        console.log(
            `User ${socket.data.user.id} left ${conversationId}`
        );
    });

}