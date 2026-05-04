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
  for (let i = 1; i <= 100; i++) {
    let str;
    if (i % 3 === 0 && i % 5 === 0) {
      str = "FizzBuzz";
    } else if (i % 3 === 0) {
      str = "Fizz";
    } else if (i % 5 === 0) {
      str = "Buzz";
    } else {
      str = i;
    }
    console.log(str);
  }
});
