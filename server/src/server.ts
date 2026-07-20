import app from "./app.js";
import { env } from "@/config/env.js";
import { logger } from "./config/logger.js";
import http from "http";

import {startSessionCleanupJob} from "./jobs/cleanup-expired-sessions.js";
import { createSocketServer } from "./sockets/socket.server.js";

const server = http.createServer(app);
startSessionCleanupJob();

createSocketServer(server);

server.listen(
    env.PORT,
    ()=>{
        logger.info(
            `Server running on port ${env.PORT}`
        );

    }
);