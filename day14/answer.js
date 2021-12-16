import fs from 'fs';

let [template, rules] = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n\n');

template = template.trim();

rules = new Map(
  rules
    .trim()
    .split('\n')
    .map((l) => l.trim().split(' -> '))
);

let polymerMap = new Map();
for (let curs = 0; curs < template.length - 1; curs++) {
  const element = template.substring(curs, curs + 2);
  polymerMap.set(
    element,
    polymerMap.has(element) ? polymerMap.get(element) + 1 : 1
  );
}

const steps = 40;
for (let i = 0; i < steps; i++) {
  let newPolymerMap = new Map();
  for (const [template, n] of polymerMap.entries()) {
    const insert = rules.get(template);
    const [one, two] = [template[0] + insert, insert + template[1]];
    newPolymerMap.set(
      one,
      newPolymerMap.has(one) ? newPolymerMap.get(one) + n : n
    );
    newPolymerMap.set(
      two,
      newPolymerMap.has(two) ? newPolymerMap.get(two) + n : n
    );
  }
  polymerMap = newPolymerMap;
}

const elementCount = new Map();
for (const [pair, n] of polymerMap.entries()) {
  const els = pair.split('');
  for (const el of els) {
    elementCount.set(el, elementCount.has(el) ? elementCount.get(el) + n : n);
  }
}

// all character counts get doubled in this method except for first and last
// characters of original template
// add these back so we can divide final count in half
const firstChar = template[0];
elementCount.set(
  firstChar,
  elementCount.has(firstChar) ? elementCount.get(firstChar) + 1 : 1
);

const lastChar = template[template.length - 1];
elementCount.set(
  lastChar,
  elementCount.has(lastChar) ? elementCount.get(lastChar) + 1 : 1
);

const sorted = Array.from(elementCount.entries())
  .map(([t, n]) => [t, n / 2])
  .sort(([, count], [, count2]) => count2 - count);

console.log(`
Results (${template.length} template, ${rules.size} rules)
  Steps: ${steps}
  Length: ${template.length}
  Subtracted: ${sorted[0][1] - sorted[sorted.length - 1][1]}
`);
