import { Socket, Server } from "socket.io";
import { SOCKET_EVENTS } from "../events.js";

export function registerTypingHandlers(
    io: Server,
    socket: Socket
){
    socket.on(SOCKET_EVENTS.TYPING_START, (conversationId: string)=>{
        socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_START, {
            userId: socket.data.user.id,
            conversationId
        });
    });
};