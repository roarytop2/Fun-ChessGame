import { isSquareOccupied, isWithinBounds } from './utils.js';

export function getBishopMoves(startingSquareId, pieceColor, game, moves) {
    const directions = [{ deltaFile: 1, deltaRank: 1 }, { deltaFile: 1, deltaRank: -1 }, { deltaFile: -1, deltaRank: 1 }, { deltaFile: -1, deltaRank: -1 }];
    const startFile = startingSquareId.charAt(0);
    const startRank = parseInt(startingSquareId.charAt(1));

    for (const direction of directions) {
        let currentFile = startFile.charCodeAt(0);
        let currentRank = startRank;

        while (true) {
            currentFile += direction.deltaFile;
            currentRank += direction.deltaRank;
            const tempSquareId = String.fromCharCode(currentFile) + currentRank;

            if (!isWithinBounds(tempSquareId)) { break; }

            const newFile = String.fromCharCode(currentFile);
            const newSquareId = newFile + currentRank;

            const squareContent = isSquareOccupied(newSquareId, game);

            if (squareContent == "empty") {
                moves.push(newSquareId);
            }
            else if (squareContent != pieceColor) {
                moves.push(newSquareId);
                break;
            }
            else { break; }

        }
    }
}
