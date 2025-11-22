import { getPossibleMoves } from './moves/allMoves.js';
import { renderBoard, highlightMoves, clearHighlights } from './board.js';

export let legalSquares = [];

export function allowDrop(ev) {
    ev.preventDefault();
}

export function drag(ev) {
    // Set data to the piece's ID
    ev.dataTransfer.setData("text", ev.target.id);

    const pieceElement = ev.target;
    const startSquareId = pieceElement.parentElement.id;

    // Highlight legal moves
    // We need to get the game instance. It's on window.game
    const game = window.game;
    const validMoves = game.getValidMoves(startSquareId);
    highlightMoves(validMoves);
}

export function drop(ev, game) {
    ev.preventDefault();
    clearHighlights();

    const data = ev.dataTransfer.getData("text");
    const pieceElement = document.getElementById(data);

    if (!pieceElement) return; // Safety check

    const startSquareId = pieceElement.parentElement.id;
    const destinationSquare = ev.currentTarget;
    const destId = destinationSquare.id;

    // Attempt to make the move
    // game.makeMove returns true if move was valid and made
    if (game.makeMove(startSquareId, destId)) {
        renderBoard(game, drag); // Pass drag function to renderBoard

        // Re-attach listeners is handled by main.js calling setupEventListeners 
        // or we can do it here if we had access to setupEventListeners.
        // But main.js re-renders board on drop? 
        // Actually main.js calls drop(ev, game) then checks turn.
        // renderBoard(game) is called in main.js after bot move, but for player move?

        // Let's look at main.js again.
        // main.js:
        // drop(ev, game);
        // if (game.turn === 'b') ...

        // If drop() calls renderBoard, then main.js doesn't need to for player move.
        // But main.js doesn't call renderBoard for player move explicitly in handleDrop.
        // So drop() MUST call renderBoard.
    }
}
