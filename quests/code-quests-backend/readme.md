# code-quests

> Code-quests is a platform that helps business publish projects (called Quests) and ask a community of developers and designers to compete to build the best, highest quality implementation or design.

## About

This project uses [Feathers](http://feathersjs.com). An open source framework for building APIs and real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. add a .env file containing next 2 lines

   ```
   FEATHERS_SECRET="vUONKp3MeaBCNyV/Y9XNvCB2/JnsQdaZ"
   DB_CONNECTION="postgres://codeQuestsUser:CQc&e@nY1#0s23$@localhost:5432/code-quests"

4. Install your dependencies

    ```
    cd path/to/code-quests
    npm install

5. Create DB 

    ```
    sudo -u postgres psql
    CREATE USER codeQuestsUser WITH PASSWORD 'CQc&e@nY1#0s23$' CREATEDB;
    CREATE DATABASE "code-quests";

    ```


6. Start your app

    ```
    npm run compile # Compile TypeScript source
    npm run migrate # Run migrations to set up the database
    npm start
    Open `http://localhost:3030/docs/`

    ```

## Testing

Create Testing DB `code-quests-testing` then Run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

This app comes with a powerful command line interface for Feathers. Here are a few things it can do:

```
$ npx feathers help                           # Show all commands
$ npx feathers generate service               # Generate a new Service
```

## Help

For more information on all the things you can do with Feathers visit [docs.feathersjs.com](http://docs.feathersjs.com).

## Important Decisions

### Database Schema

* TypeBox and knex are used
* All passwords are hashed before getting stored in the database
* Any date in the database schema is assumed to be a date-time in ISO format
* IPs stored in the database are in IPv6 format
* Foriegn keys are implemented with normal integer columns that holds IDs because Type.ref is giving this error:
```
can't resolve reference User from id #
```
* I followed the [example](https://feathersjs.com/guides/basics/schemas.html#handling-messages) in the docs but still didn't work
* I found [this](https://github.com/feathersjs/feathers/issues/2675) but still can't figure out how to solve the problem
* A user can't claim to be an admin
* The only way to add admins is by manually inserting a new row in the database (there is no seeding)

### Logging

* Logging is done in 4 files info, warn, error, and combined (each log level is filtered and separated in a separate file)
* The info, warn, and error are logged in Json format with timestamps
* The combined is simple format
* You can set the LOG_LEVEL environment variable to control the log level in the combined file

### Environment Variables

* dotenv library is used to get environment variables from .env file
* There is the .env.example file specifiyng what to put in the .env file

### Other

* Some functionalities are not yet completed as it requires more time than specified

## New Updates

* Added relations and it's population to orgs and quests (solved the previous error)
* Added tests for users, categories, orgs, quests (the code doesn't pass all the tests right now)
* Supported multiple .env files depending on NODE_ENV environment variable (e.g. if I set NODE_ENV = test, .env.test will be used instead of .env) 
* Added testUtilities file that contains the dummy data and frequently used helper functions to be used in all tests (to prevent redundant code)
* testing database is cleared before and after each testcase
