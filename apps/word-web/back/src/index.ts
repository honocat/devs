import { Hono } from "hono";

type Bindings = {
  GITHUB_API_TOKEN: string;
  OWNER: string;
  REPO: string;
};

const app = new Hono<{ Bindings: Bindings }>();

function parseFrontmatter(md: string) {
  const match = md.match(/^---\n([\s\S]*?)\n---/);

  if (!match) return { data: {}, content: md };

  const yaml = match[1];
  const content = md.slice(match[0].length);

  const data: any = {};

  yaml.split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (!key) return;

    const value = rest.join(":").trim();

    // 配列
    if (value.startsWith("[")) {
      data[key.trim()] = JSON.parse(value);
    }
    // 文字列（""付き）
    else if (value.startsWith('"') && value.endsWith('"')) {
      data[key.trim()] = value.slice(1, -1);
    }
    // 空文字
    else if (value === '""') {
      data[key.trim()] = "";
    }
    // その他（そのまま）
    else {
      data[key.trim()] = value;
    }
  });

  return { data, content };
}

function extraSection(content: string, title: string) {
  const regex = new RegExp(`##\\s*${title}\\s*\\n([\\s\\S]*?)(?=\\n##|$)`, "m");
  const match = content.match(regex);
  if (!match) return "";
  return match[1].trim();
}

function parseWord(md: string, fileName: string) {
  const { data, content } = parseFrontmatter(md);
  console.log(data, content);
  const description = extraSection(content, "説明");
  const remarks = extraSection(content, "備考");
  return {
    id: fileName.replace(".md", ""),
    title: data.title ?? "",
    description,
    remarks,
    genres: data.genres ?? [],
    date: data.updated_at ?? null,
    status: data.status === "done" ? "done" : "todo",
    done: data.status === "done",
  };
}

async function fetchData(token: string, owner: string, repo: string) {
  const rootDir = "words";
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${rootDir}/data`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "word-web",
    },
  });

  if (res.status === 404) return [];
  if (!res.ok) throw new Error("fetch failed.");

  const files = await res.json();
  const mdFiles = files.filter((f: any) => f.name.endsWith(".md"));

  return await Promise.all(
    mdFiles.map(async (file: any) => {
      console.log("ok");
      const text = await fetch(file.download_url).then((r) => r.text());
      console.log(text);
      return parseWord(text, file.name);
    }),
  );
}

app.get("/", async (c) => {
  const token = c.env.GITHUB_API_TOKEN;
  const owner = c.env.OWNER;
  const repo = c.env.REPO;

  const words = await fetchData(token, owner, repo);

  return c.json(words);
});

export default app;
