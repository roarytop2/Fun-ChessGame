import { isSquareOccupied } from './utils.js';

export function getPawnMoves(startSquareId, color, game, moves) {
    diagonalPawnCaptures(startSquareId, color, game, moves);
    forwardPawnMoves(startSquareId, color, game, moves);
}

function diagonalPawnCaptures(startSquareId, pieceColor, game, moves) {
    const file = startSquareId.charAt(0);
    const rank = startSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor === "white" ? 1 : -1;
    const newRank = rankNumber + direction;

    for (let i = -1; i <= 1; i += 2) {
        const newFile = String.fromCharCode(file.charCodeAt(0) + i);
        if (newFile >= "a" && newFile <= "h") {
            const newSquareId = newFile + newRank;
            // Check bounds for rank
            if (newRank >= 1 && newRank <= 8) {
                const squareContent = isSquareOccupied(newSquareId, game);

                if (squareContent !== "empty" && squareContent !== pieceColor) {
                    moves.push(newSquareId);
                }

                // En Passant
                if (game.enPassantTarget === newSquareId) {
                    moves.push(newSquareId);
                }
            }
        }
    }
}

function forwardPawnMoves(startSquareId, pieceColor, game, moves) {
    const file = startSquareId.charAt(0);
    const rank = startSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor === "white" ? 1 : -1;
    let newRank = rankNumber + direction;

    if (newRank < 1 || newRank > 8) return;

    let newSquareId = file + newRank;
    let squareContent = isSquareOccupied(newSquareId, game);

    if (squareContent === "empty") {
        moves.push(newSquareId);

        // Check for double move from starting position
        if ((pieceColor === "white" && rankNumber === 2) || (pieceColor === "black" && rankNumber === 7)) {
            newRank += direction;
            newSquareId = file + newRank;
            squareContent = isSquareOccupied(newSquareId, game);

            if (squareContent === "empty") {
                moves.push(newSquareId);
            }
        }
    }
}
