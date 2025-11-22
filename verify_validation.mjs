import { Game } from './js/game.js';

const game = new Game();
console.log("Testing Move Validation...");

// 1. Test Illegal Pawn Move (Backwards)
// White pawn at a2 (row 6, col 0).
// Try to move to a1 (row 7, col 0).
console.log("Test 1: Illegal Pawn Move (Backwards)");
const move1 = game.makeMove('a2', 'a1');
console.log(`Move a2 -> a1 allowed? ${move1} (Expected: false)`);

// 2. Test Illegal Knight Move (Like Rook)
// White Knight at b1 (row 7, col 1).
// Try to move to b3 (row 5, col 1) - Valid L-shape? No, b1 to b3 is 2 squares forward. Knight moves 2+1.
// b1 (7,1) -> (5,2) c3 or (5,0) a3.
// b3 is (5,1).
console.log("Test 2: Illegal Knight Move (Straight)");
const move2 = game.makeMove('b1', 'b3');
console.log(`Move b1 -> b3 allowed? ${move2} (Expected: false)`);

// 3. Test Valid Knight Move
console.log("Test 3: Valid Knight Move");
const move3 = game.makeMove('b1', 'c3');
console.log(`Move b1 -> c3 allowed? ${move3} (Expected: true)`);

// 4. Test Moving Into Check (Illegal)
// Setup: White King e1, Black Rook e8 (clear path)
// Clear board
for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) game.board[r][c] = null;
game.board[7][4] = 'K'; // White King e1
game.board[0][4] = 'r'; // Black Rook e8
game.turn = 'w';

// King at e1. e-file is attacked.
// Try to move King to e2 (still in check).
console.log("Test 4: Moving King along attacked file");
const move4 = game.makeMove('e1', 'e2');
console.log(`Move e1 -> e2 allowed? ${move4} (Expected: false)`);

// Try to move King to d1 (safe).
console.log("Test 5: Moving King to safe square");
const move5 = game.makeMove('e1', 'd1');
console.log(`Move e1 -> d1 allowed? ${move5} (Expected: true)`);
