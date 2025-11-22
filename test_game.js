import { Game } from './js/game.js';

const game = new Game();
console.log("Initial Board Setup:");
console.log(game.board);

// Test 1: Pawn move
console.log("\nTest 1: White Pawn e2 -> e4");
game.makeMove('e2', 'e4');
console.log("Turn:", game.turn); // Should be 'b'

// Test 2: Black Pawn e7 -> e5
console.log("\nTest 2: Black Pawn e7 -> e5");
game.makeMove('e7', 'e5');

// Test 3: Fool's Mate attempt
// White: g2 -> g4
console.log("\nTest 3: White g2 -> g4");
game.makeMove('g2', 'g4');

// Black: Qh4 (Checkmate?) - Wait, need setup
// Let's reset and do Fool's Mate properly.
// 1. f3 e5
// 2. g4 Qh4#

console.log("\n--- Resetting for Fool's Mate ---");
const game2 = new Game();
game2.makeMove('f2', 'f3');
game2.makeMove('e7', 'e5');
game2.makeMove('g2', 'g4');

console.log("Black moving Qh4...");
const validMoves = game2.getValidMoves('d8'); // Queen
console.log("Queen moves from d8:", validMoves);

if (validMoves.includes('h4')) {
    console.log("Moving Qh4...");
    game2.makeMove('d8', 'h4');
    console.log("Game Over?", game2.isGameOver);
    console.log("Winner:", game2.winner);

    if (!game2.isGameOver) {
        console.log("DEBUG: White pieces valid moves:");
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const p = game2.board[r][c];
                if (p && p === p.toUpperCase()) { // White piece
                    const sq = game2.coordsToSquare(r, c);
                    const moves = game2.getValidMoves(sq);
                    if (moves.length > 0) {
                        console.log(`${p} at ${sq}:`, moves);
                    }
                }
            }
        }
    }
} else {
    console.log("Error: Qh4 not valid?");
}

console.log("\n--- Test 4: En Passant ---");
const game3 = new Game();
// 1. e4 a6
game3.makeMove('e2', 'e4');
game3.makeMove('a7', 'a6'); // Dummy move
// 2. e5 d5
game3.makeMove('e4', 'e5');
game3.makeMove('d7', 'd5'); // Double move, creates en passant target d6? No, target is d6.
// White pawn at e5 captures d5 en passant?
// Target is d6. White pawn at e5 attacks d6 (diagonal).
// Move is e5 -> d6.
console.log("En Passant Target:", game3.enPassantTarget); // Should be 'd6'
const epMoves = game3.getValidMoves('e5');
console.log("Moves for Pawn at e5:", epMoves);

if (epMoves.includes('d6')) {
    console.log("Executing En Passant e5 -> d6");
    game3.makeMove('e5', 'd6');
    console.log("Piece at d6:", game3.getPiece('d6')); // Should be 'P'
    console.log("Piece at d5:", game3.getPiece('d5')); // Should be null (captured)
} else {
    console.log("Error: En Passant move not found");
}
