import { legalSquares } from '../drag.js';
import { isSquareOccupied } from './utils.js';

export function getPawnMoves(startSquareId, color) {
    diagonalPawnCaptures(startSquareId, color);
    forwardPawnMoves(startSquareId, color);
}

function diagonalPawnCaptures(startSquareId, pieceColor) {
    const file = startSquareId.charAt(0);
    const rank = startSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor === "white" ? 1 : -1;
    const newRank = rankNumber + direction;

    for (let i = -1; i <= 1; i += 2) {
        const newFile = String.fromCharCode(file.charCodeAt(0) + i);
        if (newFile >= "a" && newFile <= "h") {
            const newSquareId = newFile + newRank;
            const newSquare = document.getElementById(newSquareId);
            const squareContent = isSquareOccupied(newSquare);

            if (squareContent !== "empty" && squareContent !== pieceColor) {
                legalSquares.push(newSquareId);
            }
        }
    }
}

function forwardPawnMoves(startSquareId, pieceColor) {
    const file = startSquareId.charAt(0);
    const rank = startSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor === "white" ? 1 : -1;
    let newRank = rankNumber + direction;

    let newSquareId = file + newRank;
    let newSquare = document.getElementById(newSquareId);
    let squareContent = isSquareOccupied(newSquare);
    
    if (squareContent === "empty") {
        legalSquares.push(newSquareId);

        // Check for double move from starting position
        if ((pieceColor === "white" && rankNumber === 2) || (pieceColor === "black" && rankNumber === 7)) {
            newRank += direction;
            newSquareId = file + newRank;
            newSquare = document.getElementById(newSquareId);
            squareContent = isSquareOccupied(newSquare);

            if (squareContent === "empty") {
                legalSquares.push(newSquareId);
            }
        }
    }
}
