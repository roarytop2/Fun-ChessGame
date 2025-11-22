import { Game } from './js/game.js';

const game = new Game();
console.log("Testing Game Logic...");

// 1. Test isSquareAttacked
// White Pawn at e2. Attacks d3 and f3.
// game.board is initialized with pawns at rank 2 (row 6).
// e2 is row 6, col 4.
// Attacks: row 5, col 3 (d3) and row 5, col 5 (f3).

console.log("Testing Pawn Attack:");
const isAttacked = game.isSquareAttacked('d3', 'white');
console.log(`d3 attacked by white? ${isAttacked} (Expected: true)`);

const isAttacked2 = game.isSquareAttacked('d4', 'white');
console.log(`d4 attacked by white? ${isAttacked2} (Expected: false)`);

// 2. Test Castling Logic
// Clear path for white kingside castling
// Remove Bishop f1, Knight g1.
game.board[7][5] = null; // f1
game.board[7][6] = null; // g1

// Ensure e1 King and h1 Rook are present
// game.board[7][4] is King
// game.board[7][7] is Rook

console.log("Testing Castling Availability:");
const kingSquare = 'e1';
const validMoves = game.getValidMoves(kingSquare);
console.log(`Valid moves for King at e1: ${validMoves.join(', ')}`);
const canCastle = validMoves.includes('g1');
console.log(`Can castle to g1? ${canCastle} (Expected: true)`);

// 3. Test Castling Blocked by Attack
// Place a Black Rook at f8 (row 0, col 5). It attacks f-file.
// f1 is in the path of castling.
game.board[0][5] = 'r';
// Verify f1 is attacked by black
const f1Attacked = game.isSquareAttacked('f1', 'black');
console.log(`f1 attacked by black? ${f1Attacked} (Expected: true)`);

const validMovesBlocked = game.getValidMoves(kingSquare);
console.log(`Valid moves for King at e1 (blocked): ${validMovesBlocked.join(', ')}`);
const canCastleBlocked = validMovesBlocked.includes('g1');
console.log(`Can castle to g1 (blocked)? ${canCastleBlocked} (Expected: false)`);

// 4. Test Checkmate Detection
// Fool's Mate setup? Or simple checkmate.
// King at e8. White Rook at e1.
// Clear board for simplicity.
for (let r = 0; r < 8; r++) for (let c = 0; c < 8; c++) game.board[r][c] = null;
game.board[0][4] = 'k'; // Black King e8
game.board[7][4] = 'R'; // White Rook e1
game.turn = 'b';

console.log("Testing Checkmate:");
const inCheck = game.inCheck('black');
console.log(`Black in check? ${inCheck} (Expected: true)`);

const moves = game.getValidMoves('e8');
console.log(`Black King moves: ${moves.join(', ')}`);
// King can move to d8, f8, d7, e7, f7.
// Rook at e1 attacks e-file.
// So e7 is attacked.
// d8, f8, d7, f7 are safe (unless attacked by others).
// So not checkmate yet.

// Add White Rook at a8 and h8 to cover rank 8?
game.board[0][0] = 'R'; // a8
game.board[0][7] = 'R'; // h8
// Now rank 8 is covered.
// King can move to d7, f7.
// Add Rook at a7.
game.board[1][0] = 'R'; // a7 covers rank 7.

const isMate = game.isCheckmate('black');
console.log(`Is Checkmate? ${isMate} (Expected: true)`);
