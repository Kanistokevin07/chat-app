import { Socket, Server } from "socket.io";
import { SOCKET_EVENTS } from "../events.js";

export function registerTypingHandlers(
    io: Server,
    socket: Socket
){
    socket.on(SOCKET_EVENTS.TYPING_START, (data)=>{
        const { conversationId } = data;
        socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_START, {
            userId: socket.data.user.id,
            conversationId
        });
    });

    socket.on(SOCKET_EVENTS.TYPING_STOP, (data)=>{
        const { conversationId } = data;
        socket.to(conversationId).emit(SOCKET_EVENTS.TYPING_STOP, {
            userId: socket.data.user.id,
            conversationId
        });
    });
};