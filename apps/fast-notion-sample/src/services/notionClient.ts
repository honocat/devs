import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
  quiet: true,
});

export const notion = new Client({
  auth: requiredEnv("NOTION_API_KEY"),
});

export { requiredEnv };
