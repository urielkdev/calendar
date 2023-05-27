- [About](#about)
- [Functionalities](#functionalities)
- [Technologies](#technologies)
- [How to use](#how-to-use)
- [Postman file](#postman-file)

<a id="about"></a>

## About

TODO:

<a id="functionalities"></a>

## Functionalities

(note that the user can only access routes that he has permission according to his role)

- ### **Anyone**

  - [x] Anyone can Register
  - [x] Can Login

- ### **Staff**

  - [] Can view his/her schedule for any period of time (up to 1 year)
  - [] Can see his/her coworker schedules

- ### **Admin**
  - [x] Can edit/delete all users
  - [] Can create/edit/delete schedule for users
  - [] Can order users list by accumulated work hours per arbitrary period (up to 1 year)

<a id="technologies"></a>

## Technologies

The project is made with:

- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/#/)
- [Express](https://expressjs.com/)
- [Bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [Nodemon](https://nodemon.io/)
- [Dotenv](https://www.npmjs.com/package/dotenv)

<a id="how-to-use"></a>

## How to use

TODO: pre-requisites

n. Add variables on `.env` file:

File: `.env`

```text
NODE_ENV = environment that you are running the application (prod for production environment)
PORT = add a port or run on 3000 by default
PASSWORD_SALT = string salt to be used encrypt the password, generate with this: bcrypt.genSaltSync()
JWT_SECRET = strong salt to be used by JWT
JWT_EXPIRES_IN = set how long the token should be valid
```

n. Configure `src/database/db-connection.json` to connect the database. Default values as below:

n. Run:

development:

```sh
  # Install dependencies.
  $ yarn install

  # After create the database, run the migrations using TypeORM
  $ yarn db-migrate

  # Start the API
  $ yarn dev
```

production:
TODO:

```sh
  # Install dependencies.
  $ docker-compose up
```

<a id="postman-file"></a>

## Postman File
