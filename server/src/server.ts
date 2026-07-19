import app from "./app.js";
import { env } from "@/config/env.js";
import { logger } from "./config/logger.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());

app.listen(
    env.PORT,
    ()=>{

        logger.info(
            `Server running on port ${env.PORT}`
        );

    }
);