import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { requireEnv } from "./env.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  debug: false,
  quiet: true,
});

const notionApiKey = requireEnv(
  "NOTION_API_KEY",
  "NOTION_API_KEY が設定されていません。",
);

export const notion = new Client({
  auth: notionApiKey,
});
