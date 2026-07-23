import { Server, Socket } from "socket.io";
import { isUserOnline } from "@/modules/presence/presence.service.js";

export function registerPresenceHandlers(
    io: Server,
    socket: Socket
){
    socket.on("check_online_status", async(userId: string)=>{
        const isOnline = await isUserOnline(userId);
        socket.emit("online_status", { userId, isOnline });

        socket.emit("online_status", { userId, isOnline });
    });

}