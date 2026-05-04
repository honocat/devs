process.stdin.resume();
process.stdin.setEncoding("utf8");

var lines = [];
var reader = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

reader.on("line", (line) => {
  lines.push(line);
});

reader.on("close", () => {
  const string = lines[0];
  const elements = string.split(" ");

  console.log(elements[0]);
  console.log(elements[1]);
  console.log(elements[2]);
});
