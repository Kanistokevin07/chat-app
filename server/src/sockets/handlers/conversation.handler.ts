import { Server, Socket } from "socket.io";
import { isConversationMember } from "@/modules/conversation/conversation.service.js";
import { SOCKET_EVENTS } from "../events.js";


export function registerConversationHandlers(
    io: Server,
    socket: Socket
){

    socket.on(SOCKET_EVENTS.JOIN_CONVERSATION, (conversationId:string)=>{

        const allowed = isConversationMember(
            conversationId,
            socket.data.user.id
        );

        if(!allowed){
            socket.emit("error", "You are not a member of this conversation");
            return;
        }

        socket.join(conversationId);

        console.log(
            `User ${socket.data.user.id} joined ${conversationId}`
        );
    });

    socket.on(SOCKET_EVENTS.LEAVE_CONVERSATION, (conversationId:string)=>{
        socket.leave(conversationId);   
        console.log(
            `User ${socket.data.user.id} left ${conversationId}`
        );
    });

}