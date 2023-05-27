import "express-async-errors";
import express from "express";

import errorMiddleware from "./app/middlewares/errorMiddleware";
import routes from "./routes/routes";

const server = express();

server.use(express.json());
server.use(routes);
server.use(errorMiddleware);

export default server;
