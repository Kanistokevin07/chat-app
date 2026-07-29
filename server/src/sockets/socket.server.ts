import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "./socket.auth.js";
import { addOnlineUser, removeOnlineUser, updateLastSeen } from "@/modules/presence/presence.service.js";
import { registerMessageHandlers } from "./handlers/message.handler.js";
import { registerConversationHandlers } from "./handlers/conversation.handler.js";
import { registerTypingHandlers } from "./handlers/typing.handler.js";
import { registerPresenceHandlers } from "./handlers/presence.handler.js";
import { registerGroupHandlers } from "./handlers/group.handler.js";
import { setupSocketRedisAdapter } from "./socket.redis.js";
import { SOCKET_EVENTS } from "./events.js";
import { logger } from "@/config/logger.js";
import { setIO } from "./socket.js";

const log = logger.child({
    module: "socket-server"
});

export async function createSocketServer(
    server: HttpServer
){

    const io = new Server(
        server,
        {
            cors:{
                origin:"http://localhost:5173",
                credentials:true
            },
            pingInterval:5000,
            pingTimeout:5000,
            
        }
    );

    setIO(io);

    //await setupSocketRedisAdapter(io);

    io.use(socketAuthMiddleware);
    io.use((socket, next) => {
        log.info({
            socketId: socket.id,
            userId: socket.data.user?.id
        }, "NEW SOCKET");

        next();
    });

    io.on("connection", async (socket)=>{

            const userId = socket.data.user.id;
            await addOnlineUser(userId, socket.id);
            await updateLastSeen(userId);

            socket.join(userId);
            logger.info({
                userId,
                socketId:socket.id
            },"USER JOINED PERSONAL ROOM");

            log.info({
                socketId: socket.id,
                userId: socket.data.user.id
            }, "User connected");

            log.info({
                userId: socket.data.user.id,
                socketId: socket.id
            }, "CONNECTED USER");

            socket.onAny((event, ...args) => {
                log.info({
                    socketId: socket.id,
                    userId: socket.data.user.id,
                    rooms: [...socket.rooms],
                    event,
                    args
                }, "EVENT");
            });

            registerConversationHandlers(io, socket);
            registerMessageHandlers(io, socket);
            registerTypingHandlers(io, socket);
            registerPresenceHandlers(io, socket);
            registerGroupHandlers(io, socket);
            

            io.emit(SOCKET_EVENTS.USER_ONLINE, { userId });

            socket.on("disconnect", async()=>{
                    log.info({
                        socketId: socket.id,
                        userId: socket.data.user.id
                    }, "Disconnect fired");
                    const stillOnline =await removeOnlineUser(userId, socket.id);

                    log.info({
                        socketId: socket.id,
                        userId: socket.data.user.id,
                        stillOnline
                    }, "Still online");

                    if(!stillOnline){
                        log.info({
                            socketId: socket.id,
                            userId: socket.data.user.id
                        }, "EMITTING USER_OFFLINE");

                        await updateLastSeen(userId);
                        io.emit(SOCKET_EVENTS.USER_OFFLINE, { userId });
                    }
                    log.info({
                        socketId: socket.id,
                        userId: socket.data.user.id
                    }, "User disconnected");
                }
            );
        }
    );


    return io;

}