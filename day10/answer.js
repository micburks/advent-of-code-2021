import fs from 'fs';

const input = fs.readFileSync(process.argv[2], 'utf-8').trim().split('\n');

const corruptPoints = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};
const autocompletePoints = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};
const open = new Set(['(', '[', '{', '<']);
const match = new Map([
  ['(', ')'],
  ['[', ']'],
  ['{', '}'],
  ['<', '>'],
]);

function analyzeLine(line) {
  let stack = [];
  for (const char of line) {
    if (open.has(char)) {
      stack.push(char);
    } else {
      const expected = match.get(stack[stack.length - 1]);
      if (expected === char) {
        stack.pop();
      } else {
        return {isCorrupt: true, corruptChar: char, stack};
      }
    }
  }
  return {isCorrupt: false, corruptChar: null, stack};
}

const corrupt = [];
const autocomplete = [];
for (const line of input) {
  const {stack, isCorrupt, corruptChar} = analyzeLine(line);
  if (isCorrupt) {
    corrupt.push(corruptChar);
  } else {
    autocomplete.push(stack.reverse().map((char) => match.get(char)));
  }
}

const pointsForCorrupt = corrupt
  .map((c) => corruptPoints[c])
  .reduce((a, b) => a + b, 0);

const autocompleteScores = autocomplete
  .map((charSequence) => {
    return charSequence
      .map((char) => autocompletePoints[char])
      .reduce((acc, curr) => acc * 5 + curr, 0);
  })
  .sort((a, b) => b - a);
const pointsForAutocomplete =
  autocompleteScores[Math.floor(autocompleteScores.length / 2)];

console.log(`
Results (${input.length} lines):
  Corrupt lines: ${corrupt.length}
  Points for corrupt: ${pointsForCorrupt}
  Autocomplete lines: ${autocomplete.length}
  Points for autocopmlete: ${pointsForAutocomplete}
`);
