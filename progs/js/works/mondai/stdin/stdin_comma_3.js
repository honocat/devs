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
  const string = lines[0].split(",");

  console.log(string[0]);
  console.log(string[1]);
  console.log(string[2]);
});
