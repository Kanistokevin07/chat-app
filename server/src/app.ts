import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import routes from "@/routes.js";

import {notFoundMiddleware} from "@/common/middleware/not-found.middleware.js";

import {errorMiddleware} from "@/common/middleware/error.middleware.js";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(routes);

app.use(notFoundMiddleware);

app.use(errorMiddleware);

export default app;