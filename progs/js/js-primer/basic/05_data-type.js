console.log(typeof true);
console.log(typeof 42);
console.log(typeof 11111111111111111111n);
console.log(typeof "JavaScript");
console.log(typeof Symbol("Symbol"));
console.log(typeof undefined);
console.log(typeof null);
console.log(typeof ["array"]);
console.log(typeof { key: "value" });
console.log(typeof function () {});

// boolean
true;
false;

// number
console.log(1);
console.log(10);

console.log(0b1111);
console.log(0b10000000000);

console.log(0o644);
console.log(0o777);

console.log(0xff);
console.log(0x30a2);

// BigInt
console.log(Number.MAX_SAFE_INTEGER);
console.log(1n);

// Numeric Separators
console.log(1_000_000_000_000);

// String
console.log("String");

console.log("8 o'clock.");
console.log("wanna insert\nmultiple\nline");
console.log(`
wanna insert
multiple
line`);

const str = "string";
console.log(`this is ${str}.`);

// null
const foo = null;
console.log(foo);

// object
const obj = {
  key: "value",
};
console.log(obj.key);
console.log(obj["key"]);
