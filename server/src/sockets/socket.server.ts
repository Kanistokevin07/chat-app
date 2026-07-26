import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "./socket.auth.js";
import { addOnlineUser, removeOnlineUser, updateLastSeen } from "@/modules/presence/presence.service.js";
import { registerMessageHandlers } from "./handlers/message.handler.js";
import { registerConversationHandlers } from "./handlers/conversation.handler.js";
import { registerTypingHandlers } from "./handlers/typing.handler.js";
import { registerPresenceHandlers } from "./handlers/presence.handler.js";
import { setupSocketRedisAdapter } from "./socket.redis.js";
import { SOCKET_EVENTS } from "./events.js";

export async function createSocketServer(
    server: HttpServer
){

    const io = new Server(
        server,
        {
            cors:{
                origin:"http://localhost:5173",
                credentials:true
            }
        }
    );

    await setupSocketRedisAdapter(io);

    io.use(socketAuthMiddleware);

    io.on("connection", async (socket)=>{

            const userId = socket.data.user.id;
            await addOnlineUser(userId, socket.id);
            await updateLastSeen(userId);

            console.log("User connected", socket.id);

            registerConversationHandlers(io, socket);
            registerMessageHandlers(io, socket);
            registerTypingHandlers(io, socket);
            registerPresenceHandlers(io, socket);

            io.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

            socket.on("disconnect", async()=>{
                    const stillOnline =await removeOnlineUser(userId, socket.id);

                    if(!stillOnline){
                        io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
                    }
                    console.log("User disconnected", socket.id);
                }
            );
        }
    );


    return io;

}