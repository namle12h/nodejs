// my-data-source.ts
import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { env } from "../helpers/env.helper";

function getDataSourceOptions(): DataSourceOptions {
  if (env.DB_TYPE === "mssql") {
    return {
      type: "mssql",
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: ["src/entities/*.entity{.ts,.js}"],
      synchronize: env.DB_SYNCHRONIZE,
      logging: env.DB_LOGGING,
      extra: {
        encrypt: env.DB_ENCRYPT,
      },
    };
  }

  if (env.DB_TYPE === "mysql" || env.DB_TYPE === "mariadb") {
    return {
      type: env.DB_TYPE,
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: ["entities/**/*.entity{.ts,.js}"],
      synchronize: env.DB_SYNCHRONIZE,
      logging: env.DB_LOGGING,
    };
  }

  if (env.DB_TYPE === "postgres") {
    return {
      type: "postgres",
      host: env.DB_HOST,
      port: env.DB_PORT,
      username: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      entities: ["entities/**/*.entity{.ts,.js}"],
      synchronize: env.DB_SYNCHRONIZE,
      logging: env.DB_LOGGING,
    };
  }

  // fallback cuối cùng (ít dùng)
  return {
    type: env.DB_TYPE as any, // fallback
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: ["entities/**/*.entity{.ts,.js}"],
    synchronize: env.DB_SYNCHRONIZE,
    logging: env.DB_LOGGING,
  } as DataSourceOptions;
}

export const myDataSource = new DataSource(getDataSourceOptions());
