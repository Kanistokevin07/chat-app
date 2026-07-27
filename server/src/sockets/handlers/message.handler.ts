import { Socket, Server } from "socket.io";
import { createDeliveryReceipt, createMessage, createReadReceipt,
    markConversationRead, editMessage, deleteMessage
} from "@/modules/message/message.service.js";
import { SOCKET_EVENTS } from "../events.js";

import { logger } from "@/config/logger.js";

const log = logger.child({
    module: "message-handler"
});

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

            console.log(
                "EMITTING TO ROOM",
                data.conversationId
            );

            console.log(
                io.sockets.adapter.rooms.get(
                    data.conversationId
                )
            );
            
            io.to(data.conversationId).emit(SOCKET_EVENTS.NEW_MESSAGE, message);
        }
    );

    socket.on(SOCKET_EVENTS.MESSAGE_DELIVERED, async (data) => {

            const { messageId, conversationId } = data;
            const receipt = await createDeliveryReceipt(messageId, socket.data.user.id);

            io.to(conversationId).emit(
                SOCKET_EVENTS.MESSAGE_DELIVERED,
                receipt
            );

        }
    );


    socket.on(SOCKET_EVENTS.MESSAGE_READ, async(data)=>{
        const {messageId, conversationId} = data;
        const receipt = await createReadReceipt(messageId, socket.data.user.id);

        io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_READ, 
            receipt
        );
    });

    socket.on(SOCKET_EVENTS.CONVERSATION_READ, async(conversationId: string)=>{
        await markConversationRead(conversationId, socket.data.user.id);

        io.to(conversationId).emit(SOCKET_EVENTS.CONVERSATION_READ, {  
            conversationId,
            userId: socket.data.user.id 
        });
    });

    socket.on(SOCKET_EVENTS.MESSAGE_EDITED, async(data)=>{
        log.info({
            socketId: socket.id,
            userId: socket.data.user.id,
            data
        }, "EDIT_MESSAGE received");
        const {messageId, content, conversationId} = data;
        const message = await editMessage(messageId, socket.data.user.id, content);

        log.info({
                messageId: message.id
            }, "Database updated");

            const room = io.sockets.adapter.rooms.get(data.conversationId);

log.info({
    room: data.conversationId,
    members: room ? [...room] : [],
    memberCount: room?.size ?? 0,
}, "BEFORE EMIT");

        io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_EDITED, message);

                    log.info({
                room: data.conversationId
            }, "MESSAGE_EDITED emitted");
    });

    socket.on(SOCKET_EVENTS.MESSAGE_DELETED, async(data)=>{
        
        const userId = socket.data.user.id;
        const {messageId, conversationId} = data;
        const message = await deleteMessage(messageId, userId);

        const room = io.sockets.adapter.rooms.get(data.conversationId);

log.info({
    room: data.conversationId,
    members: room ? [...room] : [],
    memberCount: room?.size ?? 0,
}, "BEFORE EMIT");

        io.to(conversationId).emit(SOCKET_EVENTS.MESSAGE_DELETED, message);
    });
}