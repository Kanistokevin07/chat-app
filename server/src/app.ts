import express from "express";
import cookieParser from "cookie-parser";

import healthRoute from "@/modules/health/health.route.js";
import authRoute from "@/modules/auth/auth.route.js";

import {notFoundMiddleware} from "@/common/middleware/not-found.middleware.js";

import {errorMiddleware} from "@/common/middleware/error.middleware.js";


const app=express();

app.use(express.json());
app.use(cookieParser());

app.use(
    "/health",
    healthRoute
);

app.use("/api/auth", authRoute);

app.use(
    notFoundMiddleware
);

app.use(
    errorMiddleware
);



export default app;