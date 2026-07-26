import { Server, Socket } from "socket.io";
import { isConversationMember } from "@/modules/conversation/conversation.service.js";
import { SOCKET_EVENTS } from "../events.js";


export function registerConversationHandlers(
    io: Server,
    socket: Socket
){

    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, async (conversationId:string)=>{

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

        console.log(
            `User ${socket.data.user.id} joined ${conversationId}`
        );


        console.log(
            "ROOM MEMBERS",
            io.sockets.adapter.rooms.get(conversationId)
        );
    });

    socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId:string)=>{
        socket.leave(conversationId);   
        console.log(
            `User ${socket.data.user.id} left ${conversationId}`
        );
    });

}