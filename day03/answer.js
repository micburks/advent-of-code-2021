import fs from 'fs';

const debug = false;

const input = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line.split('').map((v) => parseInt(v)));

function sum(total, current) {
  return total + current;
}

const delta = [];
for (let i = 0; i < input[0].length; i++) {
  const avg = input.map((pos) => pos[i]).reduce(sum, 0) / input.length;
  delta.push(Math.round(avg));
}
const epsilon = delta.map((val) => 1 - val);
const deltaHex = parseInt(delta.join(''), 2);
const epsilonHex = parseInt(epsilon.join(''), 2);

console.log(`
Results (${input.length} total lines):
  Delta: ${delta} - ${deltaHex}
  Epsilon: ${epsilon} - ${epsilonHex}
  Multiplied: ${deltaHex * epsilonHex}
`);

// oxy - mostCommon
let oxy = input;
let oxyRating;
const mostCommon = [];
// car - leastCommon
let car = input;
let carRating;
const leastCommon = [];

const avg = input.map((val) => val[0]).reduce(sum, 0) / input.length;
if (avg >= 0.5) {
  mostCommon.push(1);
  leastCommon.push(0);
} else {
  mostCommon.push(0);
  leastCommon.push(1);
}

debug && console.log(input);
for (let i = 0; i < input[0].length; i++) {
  if (oxy.length !== 1) {
    oxy = oxy.filter((val) => val[i] === mostCommon[i]);
    if (i !== input[0].length - 1) {
      const oxyAvg = oxy.map((val) => val[i + 1]).reduce(sum, 0) / oxy.length;
      debug && console.log({oxyAvg});
      if (oxyAvg >= 0.5) {
        mostCommon.push(1);
      } else {
        mostCommon.push(0);
      }
    }
  }

  if (car.length !== 1) {
    car = car.filter((val) => val[i] === leastCommon[i]);
    if (i !== input[0].length - 1) {
      const carAvg = car.map((val) => val[i + 1]).reduce(sum, 0) / car.length;
      debug && console.log({carAvg});
      if (carAvg >= 0.5) {
        leastCommon.push(0);
      } else {
        leastCommon.push(1);
      }
    }
  }
}

debug && console.log('done');
debug && console.log({oxy});
debug && console.log({car});
oxyRating = parseInt(oxy[0].join(''), 2);
carRating = parseInt(car[0].join(''), 2);

console.log(`
Result (${input.length} total)
  Oxy rating: ${oxyRating}
  CO2 rating: ${carRating}
  Multipled: ${oxyRating * carRating}
`);
