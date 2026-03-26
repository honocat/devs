import { Client } from "@notionhq/client";
import { requireEnv } from "../utils/dotenv.js";

export const notion = new Client({
  auth: requireEnv("NOTION_API_KEY"),
});

async function assertNotionConnection() {
  await notion.users.me({});
}

export { assertNotionConnection, requireEnv };
