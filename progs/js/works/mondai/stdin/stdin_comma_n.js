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
  const n = lines[0];
  const elements = lines[1].split(",");

  for (let i = 0; i < n; i++) {
    console.log(elements[i]);
  }
});
