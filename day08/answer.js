import fs from 'fs';

const entries = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((line) => {
    const [input, output] = line.trim().split(' | ');
    return {
      input: input.split(' ').map((digit) => digit.split('')),
      output: output.split(' ').map((digit) => digit.split('')),
    };
  });

let uniqueLengthOutputsCount = 0;
for (const {output} of entries) {
  for (const digit of output) {
    switch (digit.length) {
      case 2:
      case 3:
      case 4:
      case 7:
        uniqueLengthOutputsCount++;
    }
  }
}

// part 1
console.log(`
Results (${entries.length}):
  Unique length outputs count: ${uniqueLengthOutputsCount}
`);

// part 2
function getOutputValue({input, output}) {
  const digitMap = new Map();
  digitMap.set(
    1,
    input.find((d) => d.length === 2)
  );
  digitMap.set(
    4,
    input.find((d) => d.length === 4)
  );
  digitMap.set(
    7,
    input.find((d) => d.length === 3)
  );
  digitMap.set(
    8,
    input.find((d) => d.length === 7)
  );

  const fiveLengths = input.filter((d) => d.length === 5);
  const sixLengths = input.filter((d) => d.length === 6);

  digitMap.set(
    3,
    fiveLengths.find((d) =>
      digitMap.get(1).every((segment) => d.includes(segment))
    )
  );

  digitMap.set(
    6,
    sixLengths.find(
      (d) => !digitMap.get(1).every((segment) => d.includes(segment))
    )
  );

  digitMap.set(
    9,
    sixLengths.find((d) =>
      digitMap.get(3).every((segment) => d.includes(segment))
    )
  );

  digitMap.set(
    0,
    sixLengths.find(
      (d) =>
        !(
          digitMap.get(6).every((segment) => d.includes(segment)) ||
          digitMap.get(9).every((segment) => d.includes(segment))
        )
    )
  );

  const uniqueFiveSegment = fiveLengths
    .map((d) => d.filter((segment) => !digitMap.get(3).includes(segment)))
    .find(
      (d) =>
        d.length !== 0 &&
        d.every((segment) => digitMap.get(9).includes(segment))
    );

  digitMap.set(
    5,
    fiveLengths.find((d) => d.includes(uniqueFiveSegment[0]))
  );

  digitMap.set(
    2,
    fiveLengths.find(
      (d) =>
        !(
          digitMap.get(3).every((segment) => d.includes(segment)) ||
          digitMap.get(5).every((segment) => d.includes(segment))
        )
    )
  );

  const value = output
    .map((digit) =>
      Array.from(digitMap.entries()).find(
        ([, segments]) =>
          segments.length === digit.length &&
          segments.every((segment) => digit.includes(segment))
      )
    )
    .map(([val]) => val.toString())
    .join('');

  return parseInt(value);
}

const outputSum = entries.map(getOutputValue).reduce(sum, 0);

function sum(a, b) {
  return a + b;
}

console.log(`
Results (${entries.length}):
  Output values: ${outputSum}
`);
