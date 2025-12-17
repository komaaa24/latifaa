import "reflect-metadata";
import { DataSource } from "typeorm";
import { Anecdote } from "./entities/Anecdote.js";
import { Payment } from "./entities/Payment.js";
import dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true, // dev: true. Prod: use migrations.
  logging: false,
  entities: [Anecdote, Payment],
});
