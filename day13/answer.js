import fs from 'fs';

let [input, commands] = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n\n');

input = input
  .trim()
  .split('\n')
  .map((l) => {
    const coords = l.trim().split(',');
    return {
      x: parseInt(coords[0]),
      y: parseInt(coords[1]),
    };
  });

commands = commands
  .trim()
  .split('\n')
  .map((l) => {
    const com = l.replace('fold along ', '').trim().split('=');
    return {
      axis: com[0],
      value: parseInt(com[1]),
    };
  });

function printMap(map) {
  let str = '';
  for (const y of map) {
    for (const x of y) {
      str += x ? '#' : '.';
    }
    str += '\n';
  }
  console.log(str);
}

let maxX = Math.max(...input.map((c) => c.x)) + 1;
let maxY = Math.max(...input.map((c) => c.y)) + 1;
let map = Array.from({length: maxY}).map(() => new Array(maxX).fill(false));

for (const point of input) {
  console.log(point);
  map[point.y][point.x] = true;
}

// printMap(map);

for (const command of commands) {
  console.log(command);
  if (command.axis === 'y') {
    for (let i = 1; i <= command.value; i++) {
      for (let x = 0; x < map[i].length; x++) {
        map[command.value - i][x] =
          map[command.value - i][x] || map[command.value + i][x];
      }
    }
    map = map.slice(0, command.value);
  } else {
    for (let y = 0; y < map.length; y++) {
      for (let i = 1; i <= command.value; i++) {
        map[y][command.value - i] =
          map[y][command.value - i] || map[y][command.value + i];
      }
    }
    map = map.map((l) => l.slice(0, command.value));
  }
}

printMap(map);

const visiblePoints = map
  .map((l) => l.reduce((acc, curr) => acc + (curr ? 1 : 0), 0))
  .reduce((a, b) => a + b, 0);

console.log(`
Results (${input.length} coords and ${commands.length} commands):
  Visible points: ${visiblePoints}
`);
