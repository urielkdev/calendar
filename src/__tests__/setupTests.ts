import { createDatabase } from "typeorm-extension";
import { dbOptions } from "../database/dbConnection";

export default async () => {
  console.error("INIT TESTS");
  await createDatabase({ options: dbOptions });
};
