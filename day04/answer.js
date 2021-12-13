import fs from 'fs';

let [draws, ...boards] = fs
  .readFileSync(process.argv[2], 'utf-8')
  .trim()
  .split('\n\n');

draws = draws
  .trim()
  .split(',')
  .map((val) => parseInt(val));

boards = boards.map((board) => ({
  hasWon: false,
  winningNumber: null,
  winningValue: null,
  winningScore: null,
  board: board.split('\n').map((row) =>
    row
      .trim()
      .split(/ +/)
      .map((val) => parseInt(val.trim()))
  ),
}));

const winners = [];
const drawSet = new Set();
for (const draw of draws) {
  drawSet.add(draw);
  for (const board of boards) {
    if (!board.hasWon) {
      if (hasWinner(board.board)) {
        board.hasWon = true;
        board.winningNumber = draw;
        board.winningValue = getBoardValue(board.board);
        board.winningScore = board.winningNumber * board.winningValue;
        winners.push(board);
      }
    }
  }
}

function hasWinner(board) {
  if (board.some(laneHasBeenDrawn)) {
    return true;
  }
  for (let i = 0; i < board[0].length; i++) {
    if (laneHasBeenDrawn(board.map((lane) => lane[i]))) {
      return true;
    }
  }
  return false;
}

function laneHasBeenDrawn(lane) {
  return lane.every((val) => drawSet.has(val));
}

function getBoardValue(board) {
  const unDrawnValues = [].concat(...board).filter((val) => !drawSet.has(val));
  const boardValue = unDrawnValues.reduce((a, c) => a + c, 0);
  return boardValue;
}

const firstWinner = winners.shift();
const lastWinner = winners.pop();
console.log(`
Results (first winner):
  Winning number: ${firstWinner.winningNumber}
  Winning board value: ${firstWinner.winningValue}
  Multiplied: ${firstWinner.winningScore}

Results (last winner):
  Winning number: ${lastWinner.winningNumber}
  Winning board value: ${lastWinner.winningValue}
  Multiplied: ${lastWinner.winningScore}
`);
