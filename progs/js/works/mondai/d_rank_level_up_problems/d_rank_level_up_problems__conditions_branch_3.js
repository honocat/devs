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
  const [a, b, c] = lines[0].split(" ").map(Number);
  console.log(a * b <= c ? "YES" : "NO");
});
