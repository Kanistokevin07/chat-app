import { Socket, Server } from "socket.io";
import {createMessage} from "@/modules/message/message.service.js";

export function registerMessageHandlers(
    io: Server,
    socket: Socket
){
    socket.on("join_conversation", (conversationId:string)=>{

            socket.join(conversationId);

            console.log(
                `User ${socket.data.user.id} joined ${conversationId}`
            );
        }
    );

    socket.on("send_message", async(data)=>{
            const userId = socket.data.user.id;
            const message = await createMessage(
                data.conversationId,
                userId,
                data.content
            );
            
            io.to(data.conversationId).emit("new_message", message);
        }
    );

}