import { DataSource } from "typeorm";

import utils from "../utils/utils";

const entitiesPath = utils.isProduction()
  ? "dist/app/entities/*.js"
  : "src/app/entities/*.ts";

const migrationsPath = utils.isProduction()
  ? "dist/database/migrations/*.js"
  : "src/database/migrations/*.ts";

export default new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  // TODO: change this to a secret manager or .env
  password: "password",
  database: "calendar",
  synchronize: false,
  logging: false,
  entities: [entitiesPath],
  migrations: [migrationsPath],
  subscribers: [],
  migrationsRun: true,
});
