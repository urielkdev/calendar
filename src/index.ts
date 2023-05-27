import "express-async-errors";
import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import dbConnection from "./database/dbConnection";
import server from "./server";

dbConnection
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized successfully.");

    const port = process.env.SERVER_PORT || 3000;

    server.listen(port, () => console.log(`Server started on port ${port}`));
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
