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
  // digit contains n segments
  function length(n) {
    return (d) => d.length === n;
  }
  // digit includes all segments from digit n
  function includesAllSegments(n) {
    const num = digitMap.get(n);
    return (d) => num.every((s) => d.includes(s));
  }
  // digit does not include all segments from digit n
  function notIncludesAllSegments(n) {
    const num = digitMap.get(n);
    return (d) => !num.every((s) => d.includes(s));
  }
  // remove digit n segments from digit
  function removeSegments(n) {
    const num = digitMap.get(n);
    return (d) => d.filter((s) => !num.includes(s));
  }
  // digit n includes all segments
  function hasSegments(n) {
    const num = digitMap.get(n);
    return (d) => d.every((s) => num.includes(s));
  }
  // digit is not digit n1 or digit n2
  function notDigits(n1, n2) {
    return (d) => {
      const notDigit1 = includesAllSegments(n1);
      const notDigit2 = includesAllSegments(n2);
      return !(notDigit1(d) || notDigit2(d));
    };
  }

  const digitMap = new Map();
  digitMap.set(1, input.find(length(2)));
  digitMap.set(4, input.find(length(4)));
  digitMap.set(7, input.find(length(3)));
  digitMap.set(8, input.find(length(7)));

  const fiveLengths = input.filter(length(5)); // [2,3,5]
  const sixLengths = input.filter(length(6)); // [6,9,0]

  // 3 is only 5-digit that contains all of 1
  digitMap.set(3, fiveLengths.find(includesAllSegments(1)));

  // 9 is only 6-digit that contains all of 3
  digitMap.set(9, sixLengths.find(includesAllSegments(3)));

  // 6 is only 6-digit that does not contain all of 1
  digitMap.set(6, sixLengths.find(notIncludesAllSegments(1)));

  // 0 is only remaining 6-digit
  digitMap.set(0, sixLengths.find(notDigits(6, 9)));

  // removing segments of 3 from 5 leaves a single segment found in 9 but not 2
  const uniqueFiveSegment = fiveLengths
    .map(removeSegments(3))
    .filter((d) => d.length !== 0)
    .find(hasSegments(9));

  // find this unique segment in 5
  digitMap.set(
    5,
    fiveLengths.find((d) => d.includes(uniqueFiveSegment[0]))
  );

  // 2 is only remaining 5-digit
  digitMap.set(2, fiveLengths.find(notDigits(3, 5)));

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
