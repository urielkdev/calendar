import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

import utils from "../utils/utils";

const entitiesPath = utils.isProduction()
  ? "dist/src/app/entities/*.js"
  : "src/app/entities/*.ts";

const migrationsPath = utils.isProduction()
  ? "dist/src/database/migrations/*.js"
  : "src/database/migrations/*.ts";

export default new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  username: process.env.DB_USERNAME,
  // TODO: change this to a secret manager or .env
  password: process.env.DB_PASSWORD,
  database: `calendar${
    !utils.isProduction() ? "_" + process.env.NODE_ENV : ""
  }`,
  synchronize: false,
  logging: false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [],
  // dropSchema: true,
  migrationsRun: true,
  timezone: "UTC",
});
