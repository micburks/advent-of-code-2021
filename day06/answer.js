import fs from 'fs';

const fish = fs
  .readFileSync(process.argv[2], 'utf-8')
  .split(',')
  .map((v) => parseInt(v));

let fishMap = new Map();
for (let i = 0; i <= 8; i++) {
  fishMap.set(i, 0);
}
for (const f of fish) {
  fishMap.set(f, fishMap.get(f) + 1);
}

function tickDay() {
  const newMap = new Map();
  for (const [daysLeft, n] of fishMap.entries()) {
    if (daysLeft === 0) {
      newMap.set(8, n);
      if (newMap.has(6)) {
        newMap.set(6, newMap.get(6) + n);
      } else {
        newMap.set(6, n);
      }
    } else {
      let days = daysLeft - 1;
      if (newMap.has(days)) {
        newMap.set(days, newMap.get(days) + n);
      } else {
        newMap.set(days, n);
      }
    }
  }
  fishMap = newMap;
}

const days = 256;
for (let i = 0; i < days; i++) {
  tickDay();
}

const total = Array.from(fishMap.values()).reduce(sum, 0);

function sum(a, b) {
  return a + b;
}

console.log(`
Results (${days} days);
  Number fish: ${total}
`);
