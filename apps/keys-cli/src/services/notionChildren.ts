// export { heading2, numbered_list_item }

export function paragraph(text: string) {
  return {
    object: "block" as const,
    type: "paragraph" as const,
    paragraph: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
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

export function bulletedList(text: string) {
  return {
    object: "block" as const,
    type: "bulleted_list_item" as const,
    bulleted_list_item: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
    },
  };
}

export function section(text: string, item: string) {
  return {
    object: "block" as const,
    type: "numbered_list_item" as const,
    numbered_list_item: {
      rich_text: [{ type: "text" as const, text: { content: text } }],
      children: [paragraph(item)],
    },
  };
}
