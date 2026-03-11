import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  debug: false,
  quiet: true,
});

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});
