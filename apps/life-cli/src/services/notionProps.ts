export function buildTaskProperties(title: string, tag: string) {
  return {
    名前: {
      title: [{ text: { content: title } }],
    },
    タグ: {
      multi_select: [{ name: tag }],
    },
    作成日時: {
      date: { start: new Date().toISOString() },
    },
    ステータス: {
      status: { name: "未着手" },
    },
  };
}

export function buildBalanceProperties(item: string, amount: number) {
  return {
    品目: {
      title: [{ text: { content: item } }],
    },
    金額: {
      number: amount,
    },
    作成日時: {
      date: { start: new Date().toISOString() },
    },
  };
}

