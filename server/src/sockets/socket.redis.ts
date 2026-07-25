import { createClient } from "redis";
import { createAdapter } from "@socket.io/redis-adapter";
import { Server } from "socket.io";
import { env } from "@/config/env.js";


export async function setupSocketRedisAdapter(
    io: Server
){

    const pubClient = createClient({
        url: env.REDIS_URL
    });

    const subClient = pubClient.duplicate();

    pubClient.on(
        "error",
        (error)=>{
            console.error(
                "Redis Pub Error:",
                error
            );
        }
    );

    subClient.on(
        "error",
        (error)=>{
            console.error(
                "Redis Sub Error:",
                error
            );
        }
    );

    await Promise.all([
        pubClient.connect(),
        subClient.connect()
    ]);


    io.adapter(
        createAdapter(
            pubClient,
            subClient
        )
    );

    console.log(
        "Socket.IO Redis adapter connected"
    );
}