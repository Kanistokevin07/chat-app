import { Socket } from "socket.io";
import { verifyAccessToken } from "@/modules/auth/services/jwt.service.js";


export function socketAuthMiddleware(
    socket: Socket,
    next: (err?: Error) => void
){

    try{
        const token = socket.handshake.auth.token;

        if(!token){
            return next(
                new Error("Authentication token missing")
            );
        }

        const payload = verifyAccessToken(token);

        socket.data.user = {
            id:(payload as any).sub
        };

        next();

    }catch(error){
        next(
            new Error("Invalid token")
        );
    }
}