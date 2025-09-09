// load file env leen
import dotenv from 'dotenv';
dotenv.config();
console.log("Loaded ENV DB_HOST:", process.env.DB_HOST);
console.log("Loaded ENV DB_PORT:", process.env.DB_PORT);


// Định nghĩa một kiểu dữ liệu tùy chỉnh cho các loại database
// để TypeScript có thể kiểm tra
type DbType =
  | "mssql"
  | "mysql"
  | "mariadb"
  | "postgres"
  | "cockroachdb"
  | "sqlite"
  | "sap"
  | "oracle"
  | "cordova"
  | "nativescript"
  | "react-native"
  | "sqljs"
  | "mongodb"
  | "aurora-mysql"
  | "aurora-postgres"
  | "spanner"
  | "expo"
  | "better-sqlite3";

export const env = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  DB_NAME: process.env.DB_NAME,
  DB_HOST: process.env.DB_HOST,
  // Chuyển đổi DB_PORT từ chuỗi sang số
  DB_PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  // Ép kiểu cho DB_TYPE để TypeORM nhận đúng
  DB_TYPE: (process.env.DB_TYPE || 'mssql') as DbType,
  // Chuyển đổi chuỗi 'true'/'false' thành giá trị boolean
  DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE === 'true',
  DB_LOGGING: process.env.DB_LOGGING === 'true',
  DB_ENCRYPT: process.env.DB_ENCRYPT === 'true',
};