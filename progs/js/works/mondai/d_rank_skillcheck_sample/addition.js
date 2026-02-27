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
  const nums = lines[0].split(" ");
  const a = Number(nums[0]);
  const b = Number(nums[1]);

  console.log(a + b);
});
