process.stdin.resume();
process.stdin.setEncoding("utf8");

var lines = [];
var rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (line) => {
  lines.push(line);
});
rl.on("close", () => {
  const n = parseInt(lines[0], 10);

  // Mapで都市名と時差の対応を保持
  const timezones = new Map();
  for (let i = 0; i < n; i++) {
    const [city, diff] = lines[i + 1].split(" ");
    timezones.set(city, parseInt(diff, 10));
  }

  const [q, time_str] = lines[n + 1].split(" ");
  const [t_hour, t_minute] = time_str.split(":").map(Number);

  // 投稿元の時差を取得
  const s_q = timezones.get(q);

  // 各都市に対する表示時刻を計算
  for (const [p_i, s_i] of timezones.entries()) {
    // 投稿元qから都市iへの相対時差を計算: s_i - s_q
    const relative_diff = s_i - s_q;

    // 新しい時間 = 元の時間 + 相対時差
    let new_hour = t_hour + relative_diff;

    // 24時間制の範囲に収める（正負両方に対応するモジュロ演算）
    // 1. 24で割ったあまりを計算
    new_hour = new_hour % 24;
    // 2. 結果が負の場合、24を足して正の範囲に戻す
    if (new_hour < 0) new_hour += 24;

    // 時刻のゼロ埋め処理
    const hh = String(new_hour).padStart(2, "0");
    const mm = String(t_minute).padStart(2, "0");

    console.log(`${hh}:${mm}`);
  }
});
