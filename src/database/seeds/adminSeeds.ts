import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { DataSource } from "typeorm";
import userService from "../../app/services/userService";

export default class UserSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const userToCreate = {
      name: "Adam",
      email: "admin@admin.com",
      password: "123",
      role: "admin",
    };

    const userExists = await userService
      .getRepository()
      .findOneBy({ email: userToCreate.email });

    if (!userExists) {
      const user = userService.getRepository().create(userToCreate);
      await userService.getRepository().save(user);
    }
  }
}
