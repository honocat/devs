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
  for (let i = 1; i <= n; i++) console.log(i);
});
