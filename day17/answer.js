import fs from 'fs';

const [xStr, yStr] = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .replace('target area: ', '')
  .split(',');

const [xLow, xHigh] = xStr
  .trim()
  .replace('x=', '')
  .split('..')
  .map((s) => parseInt(s));

const [yLow, yHigh] = yStr
  .trim()
  .replace('y=', '')
  .split('..')
  .map((s) => parseInt(s));

const target = {
  x: {low: xLow, high: xHigh},
  y: {low: yLow, high: yHigh},
};

const hits = [];
for (let y = -1000; y < 1000; y++) {
  // while (!failure.yTooHigh) {
  for (let x = 1; x < 10000; x++) {
    // while (!failure.xTooHigh) {
    let probe = {pos: {x: 0, y: 0}, velocity: {x, y}};
    let counter = 0;
    let maxHeight = 0;
    while (probe.pos.x < xHigh && probe.pos.y > yLow) {
      counter += 1;

      probe.pos.x += probe.velocity.x;
      probe.pos.y += probe.velocity.y;
      if (probe.velocity.x > 0) {
        probe.velocity.x -= 1;
      } else if (probe.velocity.x < 0) {
        probe.velocity.x += 1;
      }
      probe.velocity.y -= 1;

      maxHeight = Math.max(maxHeight, probe.pos.y);

      if (
        probe.pos.x >= target.x.low &&
        probe.pos.x <= target.x.high &&
        probe.pos.y >= target.y.low &&
        probe.pos.y <= target.y.high
      ) {
        hits.push({x, y, counter, maxHeight});
      }
    }
  }
}

const highest = hits.sort((a, b) => b.maxHeight - a.maxHeight)[0];

const hitSet = new Set();
for (const hit of hits) {
  hitSet.add(`${hit.x},${hit.y}`);
}

console.log(`
Results:
    Highest: (${highest.x}, ${highest.y}) -> ${highest.maxHeight}
    All possible: ${hitSet.size}
`);
