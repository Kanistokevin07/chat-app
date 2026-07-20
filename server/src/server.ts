import app from "./app.js";
import { env } from "@/config/env.js";
import { logger } from "./config/logger.js";
import {startSessionCleanupJob} from "./jobs/cleanup-expired-sessions.js";


startSessionCleanupJob();

app.listen(
    env.PORT,
    ()=>{

        logger.info(
            `Server running on port ${env.PORT}`
        );

    }
);