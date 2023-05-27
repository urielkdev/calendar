- [About](#about)
- [Functionalities](#functionalities)
- [Technologies](#technologies)
- [How to use](#how-to-use)
- [Postman file](#postman-file)
- [OpenAPI Docs](#openapi-docs)

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

  - [x] Can view his/her schedule for any period of time (up to 1 year)
  - [x] Can see his/her coworker schedules

- ### **Admin**
  - [x] Can edit/delete all users
  - [x] Can create/edit/delete schedule for users
  - [x] Can order users list by accumulated work hours per arbitrary period (up to 1 year)

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

File: `.env`

```text
NODE_ENV=environment that you are running the application (prod for production environment)
SERVER_PORT=add a port or run on 3000 by default
DB_HOST=database host
DB_PORT=database port
DB_USERNAME=database username
DB_PASSWORD=database password
PASSWORD_SALT=number used to encrypt the password with bcrypt
JWT_SECRET=strong secret to be used by JWT
JWT_EXPIRES_IN=set how long the token should be valid
TZ=UTC  (timezone, keep it as "UTC" fow now so the server doesn't break database date conversions)
```

- Configure `src/database/db-connection.json` to connect the database. Default values as below:

- Docker Compose:
  - Prerequisites
    - Copy `prod.example.env` file, rename to `.env` and fill the variables
    - Docker and docker-compose
  - Run:

```sh
  # Run docker-compose up.
  $ docker-compose up
```

- Without Docker:
  - Prerequisites
    - Copy `dev.example.env` file, rename to `.env` and fill the variables
    - nodejs
    - npm or yarn
    - MYSQL and create a database called "calendar_dev" (can be created with `docker-compose up -d db`)
  - Run:

```sh
  # Install dependencies.
  $ yarn install

  # Start the API
  $ yarn dev
```

- Test
  - Prerequisites
    - Copy `dev.example.env` file, rename to `.env` and fill the variables
    - nodejs
    - npm or yarn
    - MYSQL and create a database called "calendar_test" (can be created with `docker-compose up -d db`)
  - Run:

```sh
  # Install dependencies.
  $ yarn install

  # Start the API
  $ yarn test
```

<a id="postman-file"></a>

## Postman File

- [Collection v2.1 in root directory](https://github.com/urielkdev/calendar/blob/main/Calendar.postman_collection.json) `Calendar.postman_collection.json`

<a id="openapi-docs"></a>

## OpenAPI Docs

- localhost:${SERVER_PORT}/docs
