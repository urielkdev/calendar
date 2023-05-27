import { DataSource, DataSourceOptions } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

import utils from "../utils/utils";
import { SeederOptions } from "typeorm-extension";

const entitiesPath = utils.isProduction()
  ? "dist/src/app/entities/*.js"
  : "src/app/entities/*.ts";

const migrationsPath = utils.isProduction()
  ? "dist/src/database/migrations/*.js"
  : "src/database/migrations/*.ts";

const seedsPath = utils.isProduction()
  ? "dist/src/database/seeds/*.js"
  : "src/database/seeds/*.ts";

export const dbOptions: DataSourceOptions & SeederOptions = {
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
  seeds: [seedsPath],
  subscribers: [],
  // dropSchema: true,
  migrationsRun: true,
  timezone: "UTC",
};

export const dbConnection = new DataSource(dbOptions);
