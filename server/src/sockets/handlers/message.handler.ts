import { Socket, Server } from "socket.io";
import {createMessage} from "@/modules/message/message.service.js";
import { updateMessageStatus } from "@/modules/message/message.service.js";
import { SOCKET_EVENTS } from "../events.js";

export function registerMessageHandlers(
    io: Server,
    socket: Socket
){

    socket.on(SOCKET_EVENTS.SEND_MESSAGE, async(data)=>{
            const userId = socket.data.user.id;
            const message = await createMessage(
                data.conversationId,
                userId,
                data.content
            );
            
            io.to(data.conversationId).emit(SOCKET_EVENTS.NEW_MESSAGE, message);
        }
    );

    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, async(data)=>{
        const {messageId, conversationID} = data;
        const message = await updateMessageStatus(messageId, socket.data.user.id, "DELIVERED");

        io.to(conversationID).emit(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, {
            messageId: message.id,
            status: message.status
        });
    });


    socket.on(SOCKET_EVENTS.MESSAGE_READ, async(data)=>{
        const {messageId, conversationID} = data;
        const message = await updateMessageStatus(messageId, socket.data.user.id, "READ");

        io.to(conversationID).emit(SOCKET_EVENTS.MESSAGE_STATUS_UPDATED, {
            messageId: message.id,
            status: message.status
        });
    });

}