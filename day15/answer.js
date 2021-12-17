import fs from 'fs';

let map = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((line) =>
    line
      .trim()
      .split('')
      .map((val) => parseInt(val))
  );

// part 2
map = map.map((line) => {
  return [
    ...line,
    ...line.map((v) => incrementAndWrap(v, 1)),
    ...line.map((v) => incrementAndWrap(v, 2)),
    ...line.map((v) => incrementAndWrap(v, 3)),
    ...line.map((v) => incrementAndWrap(v, 4)),
  ];
});

map = [
  ...map,
  ...map.map((line) => line.map((v) => incrementAndWrap(v, 1))),
  ...map.map((line) => line.map((v) => incrementAndWrap(v, 2))),
  ...map.map((line) => line.map((v) => incrementAndWrap(v, 3))),
  ...map.map((line) => line.map((v) => incrementAndWrap(v, 4))),
];

// printMap(map);

function printMap(map) {
  console.log(map.map((line) => line.join('')).join('\n'));
}

function incrementAndWrap(v, n) {
  let i = v + n;
  return i > 9 ? i - 9 : i;
}

function posIdent(p) {
  return `${p[0]},${p[1]}`;
}

function deIdent(p) {
  const s = p.split(',');
  return [parseInt(s[0]), parseInt(s[1])];
}

let start = [0, 0];
let visits = new Map([[posIdent(start), 0]]);
let lowRisk = [start];
let counter = 0;

while (lowRisk.length) {
  counter++;
  let newLowRisk = new Set();
  for (const position of lowRisk) {
    const risk = visits.get(posIdent(position));
    const newPositions = [
      [position[0], position[1] - 1],
      [position[0], position[1] + 1],
      [position[0] - 1, position[1]],
      [position[0] + 1, position[1]],
    ].filter(
      ([y, x]) => x >= 0 && y >= 0 && y < map.length && x < map[y].length
    );

    for (const newPos of newPositions) {
      const newRisk = risk + map[newPos[0]][newPos[1]];
      const ident = posIdent(newPos);
      if (!visits.has(ident) || visits.get(ident) > newRisk) {
        newLowRisk.add(ident);
        visits.set(ident, newRisk);
      }
    }
  }
  if (newLowRisk.size) {
    lowRisk = Array.from(newLowRisk.values()).map(deIdent);
  } else {
    lowRisk = [];
  }
}

const endRisk = visits.get(posIdent([map.length - 1, map[0].length - 1]));

console.log(`
Results (${map.length} x ${map[0].length}):
  Loops: ${counter}
  Lowest risk: ${endRisk}
`);
