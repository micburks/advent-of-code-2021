import fs from 'fs';

const map = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((line) =>
    line
      .trim()
      .split('')
      .map((val) => parseInt(val))
  );

const lowPoints = [];
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (x !== 0 && map[y][x - 1] <= map[y][x]) {
      continue;
    }
    if (x !== map[y].length - 1 && map[y][x + 1] <= map[y][x]) {
      continue;
    }
    if (y !== 0 && map[y - 1][x] <= map[y][x]) {
      continue;
    }
    if (y !== map.length - 1 && map[y + 1][x] <= map[y][x]) {
      continue;
    }
    lowPoints.push([y, x]);
  }
}

const riskSums = lowPoints.map(([y, x]) => map[y][x] + 1).reduce(sum, 0);

function sum(a, b) {
  return a + b;
}

console.log(`
Results (${map.length} X ${map[0].length}):
  Low points: ${lowPoints.length}
  Risk sums: ${riskSums}
`);

function getBasin([y, x]) {
  const pointSet = new Set();
  pointSet.add(`${x},${y}`);

  function getNewNeighbors() {
    const newPoints = [];
    for (const pointStr of pointSet.keys()) {
      const split = pointStr.split(',');
      const point = {
        x: parseInt(split[0]),
        y: parseInt(split[1]),
      };
      const potentialPoints = [];
      if (point.x !== 0) {
        potentialPoints.push({x: point.x - 1, y: point.y});
      }
      if (point.x !== map[point.y].length - 1) {
        potentialPoints.push({x: point.x + 1, y: point.y});
      }
      if (point.y !== 0) {
        potentialPoints.push({x: point.x, y: point.y - 1});
      }
      if (point.y !== map.length - 1) {
        potentialPoints.push({x: point.x, y: point.y + 1});
      }
      for (const pt of potentialPoints) {
        if (map[pt.y][pt.x] < 9) {
          if (!pointSet.has(`${pt.x},${pt.y}`)) {
            newPoints.push(pt);
          }
        }
      }
    }
    return newPoints;
  }

  let neighbors = getNewNeighbors();
  do {
    for (const point of neighbors) {
      pointSet.add(`${point.x},${point.y}`);
    }
    neighbors = getNewNeighbors();
  } while (neighbors.length);

  return {
    size: pointSet.size,
    points: pointSet.keys(),
  };
}

let basins = [];
for (const point of lowPoints) {
  const basin = getBasin(point);
  basins.push(basin);
}
basins = basins.sort((bA, bB) => bB.size - bA.size);

console.log(`
Results (${map.length} X ${map[0].length}):
  Basins multiplied: ${basins
    .slice(0, 3)
    .reduce((acc, curr) => acc * curr.size, 1)}
`);
