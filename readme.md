# Sharea

A tool designed for real-time collaborative information sharing developed in [Scala](https://www.scala-lang.org/) and [React](https://reactjs.org/).

This project is being developed for the INFOM451 class (Conception d'applications mobiles) at UNamur (BE).

## Getting started

### With Docker
Prerequisites:

1. Have [docker](https://docs.docker.com/engine/install/) installed;
2. Have [docker-compose](https://docs.docker.com/compose/install/) installed.

When the prerequisites are satisfied, run:
```bash
docker-compose up -d
```
And you're done! After a little while (when the backend and frontend compilation processes are over), head to localhost:8000! The migrations, backend and frontend logs can be found in the `logs/` folder.

### Without Docker
Prerequisites:

1. Have a Java Runtime Environment version 8 or superior;
2. Have SBT installed;
3. Have NodeJS and NPM installed;
4. Have a MySQL or MariaDB server available.

#### Running the migrations
When the prerequisites are satisfied, you may run the migrations with the following command:

```bash
cd ${PROJECT_ROOT}/backend
sbt "run migrate \
    --database-host $DB_HOST \
    --database-port $DB_PORT \
    --database-schema $DB_SCHEMA \
    --database-user $DB_USER \
    --database-password $DB_PASSWORD
"
```

Where variables are replaced with the chosen installation details.

#### Running the development server

```bash
cd ${PROJECT_ROOT}/backend
sbt run
```

#### Compiling frontend assets

Executing the following

```bash
cd ${PROJECT_ROOT}/frontend
npm ci
npm run build
```

will compile frontend assets and output the result to the `public/static` directory. If you wish to recompile on every change, you may replace npm run build by npm run dev. When the assets have been prepared, we need to add the resulting files to the backend resources folder for server delivery:

```bash
mkdir backend/target/scala-2.12/assets
cp -R frontend/public/. backend/target/scala-2.12/assets
```

If you wish to automate the process you may either use a watcher such as inotify, the `scripts/entrypoint.py` python watcher or simply link the two folders.