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
  const first = lines[0].split(" ");
  const n = first[0];
  let l = parseInt(first[1], 10);

  for (let i = 0; i < n; i++) {
    if (l > lines[1 + i]) {
      const up = parseInt(lines[i + 1] / 2, 10);
      l += up;
    } else if (l < lines[1 + i]) {
      l /= 2;
      l = parseInt(l, 10);
    }
  }

  console.log(l);
});
