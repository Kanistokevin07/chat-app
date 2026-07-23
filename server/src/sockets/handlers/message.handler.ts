import { Socket, Server } from "socket.io";
import {createMessage} from "@/modules/message/message.service.js";
import { isConversationMember } from "@/modules/conversation/conversation.service.js";
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

}