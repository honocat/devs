1 + 2;

let num = 1;
num++;
++num;

const value = "string" + "connect";
console.log(value);

console.log(2 ** 4);
console.log(Math.pow(2, 4));

console.log(+"1");
const test = +"1";
console.log(typeof test); // number

let x = 1;
console.log(x++); // 1
console.log(x); // 2

let y = 1;
console.log(++y); // 2
console.log(y); // 2

// ===
console.log(1 === 1);

const objA = {};
const objB = {};
console.log(objA === objB); // false
console.log(objA === objA); // true

// ==
console.log(1 == 1); //true
console.log(objA == objB); // false
console.log(objA == objA); // true
console.log(1 == "1"); // true
const val = undefined;
if (val === null || val === undefined)
  console.log("`val` が `null` または `undefined` である場合の処理");
if (val == null)
  console.log("`val` が `null` または `undefined` である場合の処理");

// !=
console.log(1 != 1); // false
console.log(objA != objB); // true
console.log(objA != objA); // false

// bit operant
// &, |, ^, ~, <<, >>, >>>

// Destructuring assignment
const array = [1, 2];
const [a, b] = array;
console.log("a", a, "b", b);

const obj = { key: "value" };
const { key } = obj;
console.log(key); // value

// &&
console.log(true && "right value"); // right value
console.log(false && "right value"); // false

true && console.log("this `console.log` can work.");
false && console.log("this `console.log` cannot work.");
// false, undefined, null, 0, 0n, NaN, etc...

// ||
console.log(true || "right value"); // true
console.log(false || "right value"); // rignt value

true || console.log("this `console.log` cannot work.");
false || console.log("this `console.log` can work.");

// !
console.log(!true); // false
const str = "";
console.log(!!str); // false -> true -> false
console.log(str.length > 0); // false

// nullish -> null or undefined
console.log(null ?? "right value"); // right value
console.log(undefined ?? "right value"); // right value
console.log(true ?? "right vlaue"); // true
console.log(0 ?? "right vlaue"); // 0

const inputValue = false; // falsy
const v = inputValue || 42; // v = 42
const inputValue2 = 0; // 0
const v2 = inputValue2 || 42; // v = 42
const v3 = inputValue2 ?? 42; // v = 0
console.log("v:", v, "v2:", v2, "v3:", v3);

// ? :
