import "express-async-errors";
import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
dotenv.config();

import dbConnection from "./database/dbConnection";
import errorMiddleware from "./app/middlewares/errorMiddleware";
import routes from "./routes/routes";

dbConnection
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");

    const port = process.env.SERVER_PORT || 3000;
    const app = express();

    app.use(express.json());
    app.use(routes);

    app.use(errorMiddleware);

    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
