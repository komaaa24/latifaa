import "reflect-metadata";
import { DataSource } from "typeorm";
import { Anecdote } from "../entities/Anecdote.js";
import { Payment } from "../entities/Payment.js";
import { User } from "../entities/User.js";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "anecdotes_db",
    synchronize: true, // Auto-sync schema (dev only)
    logging: process.env.NODE_ENV === "development",
    entities: [Anecdote, Payment, User],
    subscribers: [],
    migrations: [],
});
