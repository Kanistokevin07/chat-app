import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { socketAuthMiddleware } from "./socket.auth.js";

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

    io.on(
        "connection",
        (socket)=>{
            console.log(
                "User connected",
                socket.id
            );

            socket.on(
                "disconnect",
                ()=>{
                    console.log(
                        "User disconnected",
                        socket.id
                    );
                }
            );

        }
    );


    return io;

}