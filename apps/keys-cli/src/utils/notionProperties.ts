// export properties

export function Title(content: string) {
  return { title: [{ text: { content: content } }] };
}

export function MultiSelect(name: string) {
  return { multi_select: [{ name: name }] };
}

export function DateProp(start: string) {
  return { date: { start: start } };
}

export function Status(name: string) {
  return { status: { name: name } };
}

export function Text(content: string) {
  return { rich_text: [{ type: "text" as const, text: { content: content } }] };
}
