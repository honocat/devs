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
  let p = [];
  let s = [];

  for (let i = 0; i < n; i++) {
    let ps = lines[i + 1].split(" ");

    p[i] = ps[0];
    s[i] = parseInt(ps[1], 10);
  }

  const user = lines[n + 1].split(" ");
  const q = user[0];
  const time = user[1].split(":");
  let t = [];
  t[0] = parseInt(time[0], 10);
  t[1] = parseInt(time[1], 10);
  if (t[1] < 10) t[1] = "0" + String(t[1]);

  let qt;
  for (let i = 0; i < n; i++) {
    if (q === p[i]) {
      qt = s[i];
      break;
    }
  }

  for (let i = 0; i < n; i++) {
    const pq = s[i] + qt;
    let ans = t[0] + pq;

    if (ans < 0) {
      ans -= 10;
      if (ans < 10) {
        console.log("0" + ans + ":" + t[1]);
      } else {
        console.log(ans + ":" + t[1]);
      }
    } else if (ans >= 24) {
      ans -= 24;
      if (ans < 10) {
        console.log("0" + ans + ":" + t[1]);
      } else {
        console.log(ans + ":" + t[1]);
      }
    } else {
      if (ans < 10) {
        console.log("0" + ans + ":" + t[1]);
      } else {
        console.log(ans + ":" + t[1]);
      }
    }
  }
});
