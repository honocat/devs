const DEFAULT_MAX_RICH_TEXT_CHARS = 1800;

function splitToChunks(text: string, maxChars: number) {
  const chunks: string[] = [];
  let rest = text;

  while (rest.length > maxChars) {
    chunks.push(rest.slice(0, maxChars));
    rest = rest.slice(maxChars);
  }

  if (rest.length > 0) {
    chunks.push(rest);
  }

  return chunks;
}

function normalizeText(value: string) {
  return value.replace(/\r\n/g, "\n").trim();
}

export function heading2(text: string) {
  return {
    object: "block" as const,
    type: "heading_2" as const,
    heading_2: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
}

export function heading3(text: string) {
  return {
    object: "block" as const,
    type: "heading_3" as const,
    heading_3: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
}

export function paragraph(text: string) {
  return {
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
}

export function paragraphsFromLongText(text: string, maxChars?: number) {
  const normalized = normalizeText(text);
  if (normalized.length === 0) {
    return [];
  }

  const limit = maxChars ?? DEFAULT_MAX_RICH_TEXT_CHARS;
  const blocks: any[] = [];

  const paragraphs = normalized.split(/\n{2,}/g);
  for (const p of paragraphs) {
    const trimmed = p.trim();
    if (trimmed.length === 0) {
      continue;
    }

    for (const chunk of splitToChunks(trimmed, limit)) {
      blocks.push(paragraph(chunk));
    }
  }

  return blocks;
}

export function bulletsFromLines(lines: string[], maxChars?: number) {
  const limit = maxChars ?? DEFAULT_MAX_RICH_TEXT_CHARS;
  const blocks: any[] = [];

  for (const line of lines) {
    const normalized = normalizeText(line);
    if (normalized.length === 0) {
      continue;
    }

    for (const chunk of splitToChunks(normalized, limit)) {
      blocks.push({
        object: "block" as const,
        type: "bulleted_list_item" as const,
        bulleted_list_item: {
          rich_text: [{ type: "text" as const, text: { content: chunk } }],
        },
      });
    }
  }

  return blocks;
}

export function section(title: string, body: string) {
  return [heading3(title), paragraph(normalizeText(body))];
}
