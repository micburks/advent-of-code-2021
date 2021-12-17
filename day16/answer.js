import fs from 'fs';

const transmissions = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n')
  .filter((line) => !line.startsWith('#'));

const operationMap = {
  0: (...args) => args.reduce((a, b) => a + b, 0), // sum
  1: (...args) => args.reduce((a, b) => a * b, 1), // product
  2: (...args) => Math.min(...args), // min
  3: (...args) => Math.max(...args), // max
  4: (i) => i, // literal (identity)
  5: (a, b) => (a > b ? 1 : 0), // gt
  6: (a, b) => (a < b ? 1 : 0), // lt
  7: (a, b) => (a === b ? 1 : 0), // eq
};

function toBin(h) {
  const bin = (parseInt(h, 16) >>> 0).toString(2);
  return '0'.repeat(4 - bin.length) + bin;
}

function toNum(b) {
  return parseInt(b, 2);
}

function readPackets(binary, start) {
  const parentPackets = [];
  const subPackets = [];
  let cont = true;
  let counter = start;
  let value = null;

  do {
    const packet = readPacket(binary, counter);
    parentPackets.push(packet.contents);
    if (packet.subPackets) {
      subPackets.push(...packet.subPackets);
    }
    counter = packet.stop;

    if (binary[counter] === '0' || counter === binary.length) {
      cont = false;
    }
  } while (cont);
  if (parentPackets.length === 1) {
    value = parentPackets[0].val;
  }
  return {packets: [...parentPackets, ...subPackets], value};
}

function readPacket(binary, start) {
  let counter = start;

  const headers = readHeaders(binary, counter);
  counter = headers.stop;
  const {version, typeId} = headers;

  switch (typeId) {
    case 4: {
      const {stop, val} = readLiteralPacket(binary, counter);
      return {
        contents: {version, typeId, val},
        stop,
      };
    }
    default: {
      const lengthTypeId = binary[counter];
      counter += 1;
      if (lengthTypeId === '0') {
        const {stop, val, subPackets} = readOperatorPacketLength(
          binary,
          counter,
          headers
        );
        return {
          contents: {version, typeId, val},
          subPackets,
          stop,
        };
      } else {
        const {stop, val, subPackets} = readOperatorPacketNum(
          binary,
          counter,
          headers
        );
        return {
          contents: {version, typeId, val},
          subPackets,
          stop,
        };
      }
    }
  }
}

function readHeaders(binary, start) {
  const version = toNum(binary.substring(start, start + 3));
  const typeId = toNum(binary.substring(start + 3, start + 6));
  return {version, typeId, stop: start + 6};
}

function readLiteralPacket(binary, start) {
  let valStr = '';
  for (let i = start; i < binary.length; i += 5) {
    const prefix = binary[i];
    const val = binary.substring(i + 1, i + 5);
    valStr += val;
    if (prefix === '0') {
      return {
        val: toNum(valStr),
        stop: i + 5,
      };
    }
  }
}

function readOperatorPacketLength(binary, start, headers) {
  const length = toNum(binary.substring(start, start + 15));
  const parentPackets = [];
  const subPackets = [];
  let counter = start + 15;
  const end = start + 15 + length;

  while (counter !== end) {
    const packet = readPacket(binary, counter);
    counter = packet.stop;
    parentPackets.push(packet.contents);
    if (packet.subPackets) {
      subPackets.push(...packet.subPackets);
    }
  }

  const val = operationMap[headers.typeId](...parentPackets.map((p) => p.val));
  return {
    stop: counter,
    subPackets: [...parentPackets, ...subPackets],
    val,
  };
}

function readOperatorPacketNum(binary, start, headers) {
  const num = toNum(binary.substring(start, start + 11));
  const parentPackets = [];
  const subPackets = [];
  let counter = start + 11;

  for (let i = 0; i < num; i++) {
    const packet = readPacket(binary, counter);
    counter = packet.stop;
    parentPackets.push(packet.contents);
    if (packet.subPackets) {
      subPackets.push(...packet.subPackets);
    }
  }

  const val = operationMap[headers.typeId](...parentPackets.map((p) => p.val));
  return {
    stop: counter,
    subPackets: [...parentPackets, ...subPackets],
    val,
  };
}

for (const transmission of transmissions) {
  const binary = transmission.split('').map(toBin).join('');
  const {packets, value} = readPackets(binary, 0);
  const summedVersions = packets.reduce((acc, curr) => acc + curr.version, 0);

  console.log(`
Result (${transmission.length} length of ${transmission.substring(0, 6)})
  Packet versions summed: ${summedVersions}
  Transmission value: ${value}
`);
}
