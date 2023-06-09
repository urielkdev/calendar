import "express-async-errors";
import "reflect-metadata";

import dotenv from "dotenv";
dotenv.config();

import { dbConnection, dbOptions } from "./database/dbConnection";
import { createDatabase, runSeeders } from "typeorm-extension";
import server from "./server";
import swaggerDocs from "../swagger";

const start = async () => {
  await createDatabase({ options: dbOptions });

  await dbConnection
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized successfully.");
    })
    .catch((err) => {
      console.error("Error during Data Source initialization:", err);
    });
  runSeeders(dbConnection);

  const port = process.env.SERVER_PORT || 3000;
  const httpServer = server.listen(port, () => {
    console.log(`Server started on port ${port}`);

    swaggerDocs(server);
  });

  process.on("SIGINT", () => stopAll(httpServer));
  process.on("SIGTERM", () => stopAll(httpServer));
};

const stopAll = async (server: any) => {
  server.close();
  await dbConnection.destroy();
};

start();
