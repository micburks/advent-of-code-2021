import fs from 'fs';

const input = fs
  .readFileSync(process.argv[2], 'utf-8')
  .split(',')
  .map((v) => parseInt(v));

const min = Math.min(...input);
const max = Math.max(...input);

let lowest = Infinity;
for (let i = min; i <= max; i++) {
  let sum = 0;
  for (const pos of input) {
    sum += getFuelUsage(Math.abs(pos - i));
  }
  if (sum < lowest) {
    lowest = sum;
  }
}

function getFuelUsage(distance) {
  let sum = 0;
  for (let i = 1; i <= distance; i++) {
    sum += i;
  }
  return sum;
}

console.log(`
Results (${input.length} input values):
  Lowest fuel usage: ${lowest}
`);
