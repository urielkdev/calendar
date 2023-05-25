import express from "express";
import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import dbConnection from "./database/db-connection";
import routes from "./routes";

dbConnection
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");

    const port = process.env.SERVER_PORT || 3000;
    const app = express();

    app.use(express.json());
    app.use(routes);

    app.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
