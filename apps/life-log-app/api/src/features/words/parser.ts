function parseFrontmatter(md: string) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {
      data: {},
      content: md,
    };
  }

  const yaml = match[1];
  const content = md.slice(match[0].length);

  const data: Record<string, any> = {};
  yaml.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key) return;
    const value = rest.join(":").trim();
    if (value.startsWith("[")) {
      data[key.trim()] = JSON.parse(value);
    } else if (value.startsWith('"') && value.endsWith('"')) {
      data[key.trim()] = value.slice(1, -1);
    } else {
      data[key.trim()] = value;
    }
  });
  return { data, content };
}

function extractSection(content: string, title: string) {
  const regex = new RegExp(`##\\s*${title}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, "m");
  const match = content.match(regex);
  if (!match) return "";
  return match[1].trim();
}

export function parseWord(md: string, fileName: string) {
  const { data, content } = parseFrontmatter(md);
  return {
    id: fileName.replace(".md", ""),
    title: data.title ?? "",
    description: extractSection(content, "説明"),
    remarks: extractSection(content, "備考"),
    genres: data.genres ?? [],
    date: data.updated_at ?? null,
    status: data.status === "done" ? "done" : "todo",
    done: data.status === "done",
  };
}
