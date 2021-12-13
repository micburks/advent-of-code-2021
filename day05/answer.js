import fs from 'fs';

const pairs = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((line) => {
    const [from, to] = line.trim().split(' -> ');
    const [fromX, fromY] = from.split(',').map((v) => parseInt(v));
    const [toX, toY] = to.split(',').map((v) => parseInt(v));
    return {
      from: {x: fromX, y: fromY},
      to: {x: toX, y: toY},
    };
  });

const singleDirectionLines = pairs.filter(
  (pair) => pair.from.x === pair.to.x || pair.from.y === pair.to.y
);
const singleDirMap = createMap(singleDirectionLines);
const totalMap = createMap(pairs);

// printMap(singleDirMap);
// printMap(totalMap);

console.log(`
Results (single direction):
  Numer of overlaps (single-direction): ${singleDirMap.overlaps}
  Numer of overlaps: ${totalMap.overlaps}
`);

function createMap(lines) {
  const xVals = new Map();

  function incrementPoint({x, y}) {
    if (!xVals.has(x)) {
      xVals.set(x, new Map());
    }
    const yVals = xVals.get(x);
    if (yVals.has(y)) {
      yVals.set(y, yVals.get(y) + 1);
    } else {
      yVals.set(y, 1);
    }
  }

  function createPoints(coords) {
    const points = [];
    let length;
    let increment;
    let minPoint;
    if (coords.from.x === coords.to.x) {
      length = Math.abs(coords.from.y - coords.to.y);
      increment = {x: 0, y: 1};
      minPoint = {
        x: coords.from.x,
        y: Math.min(coords.from.y, coords.to.y),
      };
    } else if (coords.from.y === coords.to.y) {
      length = Math.abs(coords.from.x - coords.to.x);
      increment = {x: 1, y: 0};
      minPoint = {
        x: Math.min(coords.from.x, coords.to.x),
        y: coords.from.y,
      };
    } else {
      // diagonal
      length = Math.abs(coords.from.x - coords.to.x);
      increment = {
        x: (coords.from.x - coords.to.x) / length,
        y: (coords.from.y - coords.to.y) / length,
      };
      minPoint = {...coords.to};
    }
    for (let i = 0; i <= length; i++) {
      points.push({
        x: minPoint.x + increment.x * i,
        y: minPoint.y + increment.y * i,
      });
    }
    return points;
  }

  for (const coords of lines) {
    const points = createPoints(coords);
    for (const point of points) {
      incrementPoint(point);
    }
  }

  let overlaps = 0;
  for (const [, xMap] of xVals) {
    for (const [, visits] of xMap) {
      if (visits > 1) {
        overlaps++;
      }
    }
  }

  return {
    map: xVals,
    overlaps,
  };
}

function printMap(map) {
  let str = '';
  const xMax = Math.max(...map.map.keys());
  let yMax = 0;
  for (const [, xVals] of map.map) {
    yMax = Math.max(yMax, ...Array.from(xVals.keys()));
  }
  const max = Math.max(xMax, yMax);

  for (let j = 0; j <= max; j++) {
    for (let i = 0; i <= max; i++) {
      if (map.map.has(i)) {
        if (map.map.get(i).has(j)) {
          str += map.map.get(i).get(j);
        } else {
          str += '.';
        }
      } else {
        str += '.';
      }
    }
    str += '\n';
  }
  console.log(str);
}
