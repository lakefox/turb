import { Turb } from "./index";

let turb0 = new Turb({
    shard: "main",
});

let turb0LongFunction = turb0.register(longFunction);
// , {
//    expires: 1000,
//}
// tests //

console.time();
let bigStr1 = await longFunction("test");
console.timeEnd();

console.time();
let bigStr2 = await turb0LongFunction("test");
console.timeEnd();

console.time();
let bigStr3 = await turb0LongFunction("test");
console.timeEnd();

console.log(bigStr1, bigStr2, bigStr3);

async function longFunction(str) {
    await Bun.sleep(1000);
    return str;
}
