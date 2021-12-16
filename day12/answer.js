import fs from 'fs';

let connections = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .map((p) => {
    const split = p.split('-');
    return {from: split[0], to: split[1]};
  });

connections = connections.concat(
  connections.map(({from, to}) => ({to: from, from: to}))
);

function getConnections(cave) {
  return connections.filter((c) => c.from === cave);
}

function isBig(s) {
  return s.toUpperCase() === s;
}

function isSmall(s) {
  return !isTerminal(s) && s.toLowerCase() === s;
}

function isTerminal(s) {
  return s === 'end' || s === 'start';
}

function printPaths({segments}) {
  let str = segments[0].from + '->';
  str += segments.map(({to}) => to).join('->');
  console.log(str);
}

let paths = getConnections('start').map((p) => ({
  segments: [p],
  visited: new Set([p.from, p.to]),
  hasEnded: p.to === 'end',
  hasRevisitedSmallCave: false,
}));

let hasNewConnections;
do {
  hasNewConnections = false;
  let newPaths = [];
  for (const path of paths) {
    if (path.hasEnded) {
      newPaths.push(path);
      continue;
    }
    const lastSeg = path.segments[path.segments.length - 1];
    const canConnectTo = getConnections(lastSeg.to).filter(
      (c) =>
        isBig(c.to) ||
        (isSmall(c.to) && !path.hasRevisitedSmallCave) ||
        (isSmall(c.to) &&
          path.hasRevisitedSmallCave &&
          !path.visited.has(c.to)) ||
        c.to === 'end'
    );
    if (canConnectTo.length) {
      hasNewConnections = true;
    }
    for (const cxn of canConnectTo) {
      newPaths.push({
        segments: [...path.segments, cxn],
        visited: new Set([...path.visited.keys(), cxn.to]),
        hasEnded: cxn.to === 'end',
        hasRevisitedSmallCave:
          path.hasRevisitedSmallCave ||
          (isSmall(cxn.to) && path.visited.has(cxn.to)),
      });
    }
  }
  if (hasNewConnections) {
    paths = newPaths;
  }
} while (hasNewConnections);

const completePaths = paths.filter(
  ({segments}) =>
    segments[0].from === 'start' && segments[segments.length - 1].to === 'end'
);

// completePaths.forEach(printPaths);

console.log(`
Results (${connections.length} connections):
  Possible paths: ${completePaths.length}
`);
