import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "./socket.auth.js";
import { addOnlineUser, removeOnlineUser } from "@/modules/presence/presence.service.js";

export function createSocketServer(
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

    io.use(socketAuthMiddleware);

    io.on("connection", async (socket)=>{

            const userId = socket.data.user.id;
            await addOnlineUser(userId, socket.id);

            console.log("User connected", socket.id);

            socket.on("disconnect", async()=>{
                    await removeOnlineUser(userId, socket.id);
                    console.log("User disconnected", socket.id);
                }
            );
        }
    );


    return io;

}