import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import { Bot } from "grammy";
import {
    handleStart,
    handleShowSections,
    handleSectionSelect,
    handleNext,
    handlePayment,
    handleCheckPayment,
    syncAnecdotesFromAPI
} from "./handlers/bot-simple.handlers.js";

// Environment variables validation  
const BOT_TOKEN = process.env.BOT_TOKEN;
if (!BOT_TOKEN) {
    console.error("❌ BOT_TOKEN is required in .env file");
    process.exit(1);
}

const PORT = Number(process.env.PORT) || 3000;

// Initialize bot
const bot = new Bot(BOT_TOKEN);

// Error handling
bot.catch((err) => {
    console.error("❌ Bot error:", err);
});

/**
 * Bot command handlers
 */
bot.command("start", handleStart);

/**
 * Callback query handlers
 */
bot.on("callback_query:data", async (ctx) => {
    const data = ctx.callbackQuery.data;

    try {
        if (data === "show_sections") {
            await handleShowSections(ctx);
        } else if (data === "back_to_start") {
            await handleStart(ctx);
        } else if (data.startsWith("section:")) {
            const section = data.replace("section:", "");
            await handleSectionSelect(ctx, section);
        } else if (data.startsWith("next:")) {
            const index = parseInt(data.replace("next:", ""));
            await handleNext(ctx, index);
        } else if (data === "payment") {
            await handlePayment(ctx);
        } else if (data.startsWith("check_payment:")) {
            const paymentId = parseInt(data.replace("check_payment:", ""));
            await handleCheckPayment(ctx, paymentId);
        } else if (data === "cancel_payment") {
            await ctx.editMessageText(
                "❌ To'lov bekor qilindi.\n\nQayta urinish uchun /start buyrug'ini bering."
            );
            await ctx.answerCallbackQuery();
        } else {
            await ctx.answerCallbackQuery();
        }
    } catch (error) {
        console.error("Callback query error:", error);
        await ctx.answerCallbackQuery({
            text: "❌ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.",
            show_alert: true
        });
    }
});

/**
 * Express server for webhooks
 */
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/health", (req: Request, res: Response) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

/**
 * Initialize application
 */
async function main() {
    try {
        console.log("🚀 Starting Anecdote Bot...");

        // Sync anecdotes on startup
        console.log("🔄 Syncing anecdotes from API...");
        await syncAnecdotesFromAPI();
        console.log("✅ Anecdotes synced");

        // Start Express server
        app.listen(PORT, () => {
            console.log(`🌐 Webhook server running on port ${PORT}`);
        });

        // Start bot
        console.log("🤖 Starting bot...");
        await bot.start({
            onStart: (botInfo) => {
                console.log(`✅ Bot @${botInfo.username} started successfully!`);
                console.log("=".repeat(50));
            }
        });

    } catch (error) {
        console.error("❌ Failed to start application:", error);
        process.exit(1);
    }
}

// Handle shutdown
process.on("SIGINT", async () => {
    console.log("\n⏹ Shutting down gracefully...");
    await bot.stop();
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("\n⏹ Shutting down gracefully...");
    await bot.stop();
    process.exit(0);
});

// Start application
main();
