import fs from 'fs/promises';

const [inputPath, debugStr] = process.argv.slice(2);

const debug = /debug=true/.test(debugStr);
function findDepthChanges(input) {
  let increased = 0;
  let decreased = 0;
  let stayed = 0;
  for (let i = 1; i < input.length; i++) {
    if (input[i] < input[i - 1]) {
      debug && console.log(`${input[i - 1]} -> ${input[i]} (decreased)`);
      decreased++;
    } else if (input[i] > input[i - 1]) {
      debug && console.log(`${input[i - 1]} -> ${input[i]} (increased)`);
      increased++;
    } else {
      debug && console.log(`${input[i - 1]} -> ${input[i]} (stayed)`);
      stayed++;
    }
  }
  console.log(`
Individual Results (${input.length} total):
  Increased: ${increased}
  Decreased: ${decreased}
  Stayed: ${stayed}`);
}

function findGroupedDepthChanges(input) {
  let increased = 0;
  let decreased = 0;
  let stayed = 0;
  for (let i = 3; i < input.length; i++) {
    const groupA = [input[i - 1], input[i - 2], input[i - 3]];
    const groupB = [input[i], input[i - 1], input[i - 2]];
    const groupASum = groupA.reduce(sum, 0);
    const groupBSum = groupB.reduce(sum, 0);
    if (groupBSum < groupASum) {
      debug && console.log(`${groupA} -> ${groupB} (decreased)`);
      decreased++;
    } else if (groupBSum > groupASum) {
      debug && console.log(`${groupA} -> ${groupB} (increased)`);
      increased++;
    } else {
      debug && console.log(`${groupA} -> ${groupB} (stayed)`);
      stayed++;
    }
  }
  console.log(`
Group Results (${input.length} total):
  Increased: ${increased}
  Decreased: ${decreased}
  Stayed: ${stayed}`);
}

function sum(total, current) {
  return total + current;
}

(async () => {
  const input = (await fs.readFile(inputPath, 'utf-8'))
    .trim()
    .split('\n')
    .map((l) => parseInt(l));

  // part 1
  findDepthChanges(input);

  // part 2
  findGroupedDepthChanges(input);
})();
