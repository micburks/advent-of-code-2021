import fs from 'fs';

let map = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((line) =>
    line
      .trim()
      .split('')
      .map((c) => parseInt(c))
  );

function printMap(m) {
  let str = '';
  for (const line of m) {
    for (const char of line) {
      str += char;
    }
    str += '\n';
  }
  console.log(str);
}

printMap(map);
let flashCounter = 0;

function step() {
  map = map.map((line) => line.map((val) => val + 1));
}

function flash(flashedSet) {
  let flashed = false;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] > 9) {
        if (flashedSet.has(`${y},${x}`)) {
          continue;
        }
        // up
        if (y > 0) {
          map[y - 1][x] += 1;
        }
        // down
        if (y < map.length - 1) {
          map[y + 1][x] += 1;
        }
        // left
        if (x > 0) {
          map[y][x - 1] += 1;
        }
        // right
        if (x < map[y].length - 1) {
          map[y][x + 1] += 1;
        }
        // up-left
        if (y > 0 && x > 0) {
          map[y - 1][x - 1] += 1;
        }
        // up-right
        if (y > 0 && x < map[y].length - 1) {
          map[y - 1][x + 1] += 1;
        }
        // down-left
        if (y < map.length - 1 && x > 0) {
          map[y + 1][x - 1] += 1;
        }
        // down-right
        if (y < map.length - 1 && x < map[y].length - 1) {
          map[y + 1][x + 1] += 1;
        }
        flashedSet.add(`${y},${x}`);
        flashed = true;
        flashCounter += 1;
      }
    }
  }
  return flashed;
}

function resetFlashed() {
  map = map.map((line) => line.map((val) => (val > 9 ? 0 : val)));
}

const steps = 100;
let stepCounter = 0;
let totalFlashes = 0;
let isSynchronous = false;
const totalNum = map.length * map[0].length;
do {
  step();

  let flashed;
  const flashedSet = new Set();
  do {
    flashed = flash(flashedSet);
  } while (flashed);

  resetFlashed();

  if (stepCounter === steps) {
    totalFlashes = flashCounter;
    printMap(map);
  }

  stepCounter += 1;
  isSynchronous = flashedSet.size === totalNum;
} while (!isSynchronous);
printMap(map);

console.log(`
Results (${map.length} lines):
  Steps: ${steps}
  Flashes: ${totalFlashes}
  First synchronous flashing step: ${stepCounter}
`);
