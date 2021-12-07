import fs from 'fs';

const input = fs.readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map(line => {
    const [command, value] = line.split(' ');
    return [command, parseInt(value)];
  });

// part 1
const pos1 = {position: 0, depth: 0};
for (const [command, value] of input) {
  switch (command) {
  case 'forward':
    pos1.position += value;
    break;
  case 'up':
    pos1.depth -= value;
    break;
  case 'down':
    pos1.depth += value;
    break;
  default: 
    console.log('bad input', command, value);
    process.exit(1);
  }
}

console.log(`
Results (${input.length} total commands):
  Position: ${pos1.position}
  Depth: ${pos1.depth}
  Multiplied: ${pos1.position * pos1.depth}
`);

const pos2 = {position: 0, depth: 0, aim: 0};
for (const [command, value] of input) {
  switch (command) {
  case 'forward':
    pos2.position += value;
    pos2.depth += (pos2.aim * value);
    break;
  case 'up':
    pos2.aim -= value;
    break;
  case 'down':
    pos2.aim += value;
    break;
  default: 
    console.log('bad input', command, value);
    process.exit(1);
  }
}

console.log(`
Results (${input.length} total commands):
  Position: ${pos2.position}
  Depth: ${pos2.depth}
  Aim: ${pos2.aim}
  Multiplied: ${pos2.position * pos2.depth}
`);
