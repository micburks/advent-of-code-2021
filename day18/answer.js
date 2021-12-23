import fs from 'fs';

const numbers = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .filter((line) => !line.startsWith('#'))
  .map((number) => JSON.parse(number.trim()));

function getNumbers(index = null) {
  if (index === null) {
    return JSON.parse(JSON.stringify(numbers));
  } else {
    return getNumbers()[index];
  }
}

function findDepths(number) {
  return [
    Array.isArray(number[0]) ? Math.max(...findDepths(number[0])) + 1 : 1,
    Array.isArray(number[1]) ? Math.max(...findDepths(number[1])) + 1 : 1,
  ];
}

function findLargest(number) {
  return [
    Array.isArray(number[0]) ? Math.max(...findLargest(number[0])) : number[0],
    Array.isArray(number[1]) ? Math.max(...findLargest(number[1])) : number[1],
  ];
}

function deref(number, path) {
  let v = number;
  for (const index of path) {
    v = v[index];
  }
  return v;
}

function setDeref(number, path, val) {
  let v = number;
  for (let i = 0; i < path.length; i++) {
    let index = path[i];
    if (i === path.length - 1) {
      v[index] = typeof val === 'function' ? val(v[index]) : val;
    } else {
      v = v[index];
    }
  }
}

// extend path to the left- or right-most number
function findPathTo(number, path, side) {
  if (typeof deref(number, path) === 'number') {
    return path;
  }
  if (typeof deref(number, path)[side] === 'number') {
    return [...path, side];
  }
  return findPathTo(number, [...path, side], side);
}

function explodeNestedPair(number) {
  const depths = findDepths(number);
  const path = [depths[0] > 4 ? 0 : 1];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const ref = deref(number, path);
    if (!Array.isArray(ref[0]) && !Array.isArray(ref[1])) {
      break;
    }
    const [lL, lR] = findDepths(ref);
    if (lL === 0 && lR === 0) {
      // error
    }
    path.push(lL >= lR ? 0 : 1);
  }

  const exploded = deref(number, path);
  const explodedSide = path[path.length - 1];
  setDeref(number, path, 0);

  let leftSidePath, rightSidePath;
  if (explodedSide === 0) {
    const leftSideIndex = path.lastIndexOf(1);
    if (leftSideIndex !== -1) {
      leftSidePath = path.slice(0, leftSideIndex);
      leftSidePath.push(0);
    }

    rightSidePath = path.map((i) => i);
    rightSidePath[rightSidePath.length - 1] = 1; // switch last index
  } else {
    const rightSideIndex = path.lastIndexOf(0);
    if (rightSideIndex !== -1) {
      rightSidePath = path.slice(0, rightSideIndex);
      rightSidePath.push(1);
    }

    leftSidePath = path.map((i) => i);
    leftSidePath[leftSidePath.length - 1] = 0; // switch last index
  }

  if (leftSidePath) {
    setDeref(
      number,
      findPathTo(number, leftSidePath, 1),
      (v) => v + exploded[0]
    );
  }
  if (rightSidePath) {
    setDeref(
      number,
      findPathTo(number, rightSidePath, 0),
      (v) => v + exploded[1]
    );
  }
}

function splitNumber(number) {
  let largest = findLargest(number);
  const path = [largest[0] >= 10 ? 0 : 1]; // depth 1
  let currentPath;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    currentPath = deref(number, path);
    if (!Array.isArray(currentPath)) {
      break;
    }
    largest = findLargest(currentPath);
    path.push(largest[0] >= 10 ? 0 : 1);
  }
  const val = deref(number, path);
  const half = Math.floor(val / 2);
  setDeref(number, path, [half, val - half]);
}

// part 1
let [number, ...queue] = getNumbers();
do {
  let done = false;
  number = [number, queue.shift()];
  do {
    const depths = findDepths(number);
    if (Math.max(...depths) > 4) {
      explodeNestedPair(number);
      continue;
    }
    const largest = findLargest(number);
    if (Math.max(...largest) > 9) {
      splitNumber(number);
      continue;
    }
    done = true;
  } while (!done);
} while (queue.length);

const magnitude = calculateMagnitude(...number);

console.log(`
Results (${numbers.length} numbers):
  Magnitude: ${magnitude}
`);

let combinations = [];
for (let i = 0; i < numbers.length; i++) {
  for (let j = 0; j < numbers.length; j++) {
    if (i !== j) {
      combinations.push([i, j]);
    }
  }
}

combinations = combinations
  .map((c) => ({
    indices: c,
    sum: calculateSum(getNumbers([c[0]]), getNumbers([c[1]])),
  }))
  .sort((a, b) => b.sum - a.sum);

function calculateSum(a, b) {
  let num = [a, b];
  let done = false;
  do {
    const depths = findDepths(num);
    if (Math.max(...depths) > 4) {
      explodeNestedPair(num);
      continue;
    }
    const largest = findLargest(num);
    if (Math.max(...largest) > 9) {
      splitNumber(num);
      continue;
    }
    done = true;
  } while (!done);
  return calculateMagnitude(...num);
}

function calculateMagnitude(l, r) {
  const left = Array.isArray(l) ? calculateMagnitude(...l) : l;
  const right = Array.isArray(r) ? calculateMagnitude(...r) : r;
  return left * 3 + right * 2;
}

console.log(`
Results (${combinations.length} combinations):
  Largest addition: ${JSON.stringify(
    getNumbers()[combinations[0].indices[0]]
  )} + ${JSON.stringify(getNumbers()[combinations[0].indices[1]])}
  Sum: ${combinations[0].sum}
`);
