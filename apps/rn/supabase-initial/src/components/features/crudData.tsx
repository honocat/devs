import { supabase } from "@/src/lib/supabase";

export type MyNumberRows = {
  id: number;
  created_at: string;
  number: number;
};

export async function fetchMyNumberRows(): Promise<MyNumberRows[]> {
  const { data, error } = await supabase
    .from("my-number-table")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Error happened in supabase: ${error}`);
  return data;
}

export function formatDate(date: string) {
  return new Date(date).toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function insertNumber(count: number) {
  const { data, error } = await supabase
    .from("my-number-table")
    .insert({ number: count })
    .select("*")
    .single();

  if (error) throw new Error(`Error happened in supabase: ${error}`);
  if (!data) return;
}
