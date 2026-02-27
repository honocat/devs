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
  const nums = [];
  for (let i = 0; i < 5; i++) {
    nums.push(lines[i]);
  }

  console.log(Math.min(...nums));
});
