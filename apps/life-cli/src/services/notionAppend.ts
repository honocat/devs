import { notion } from "./notionClient.js";

export async function appendChildrenInChunks(options: {
  blockId: string;
  children: any[];
  chunkSize?: number;
}) {
  const chunkSize = options.chunkSize ?? 50;
  if (!Array.isArray(options.children) || options.children.length === 0) {
    return;
  }

  for (let i = 0; i < options.children.length; i += chunkSize) {
    await notion.blocks.children.append({
      block_id: options.blockId,
      children: options.children.slice(i, i + chunkSize),
    });
  }
}

