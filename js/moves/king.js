import { isSquareOccupied, isWithinBounds } from './utils.js';

export function getKingMoves(startingSquareId, pieceColor, game, moves) {
    const directions = [{ deltaFile: 1, deltaRank: 1 }, { deltaFile: -1, deltaRank: -1 },
    { deltaFile: 1, deltaRank: 0 }, { deltaFile: -1, deltaRank: 0 },
    { deltaFile: 0, deltaRank: 1 }, { deltaFile: 0, deltaRank: -1 },
    { deltaFile: -1, deltaRank: 1 }, { deltaFile: 1, deltaRank: -1 }
    ];

    const startFile = startingSquareId.charAt(0);
    const startRank = parseInt(startingSquareId.charAt(1));

    for (const direction of directions) {

        const currentFile = startFile.charCodeAt(0) + direction.deltaFile;
        const currentRank = startRank + direction.deltaRank;

        const newSquareId = String.fromCharCode(currentFile) + currentRank;

        if (!isWithinBounds(newSquareId)) { continue; }

        const squareContent = isSquareOccupied(newSquareId, game);

        if (squareContent == "empty" || squareContent != pieceColor) {
            moves.push(newSquareId);
        }
    }

    // Castling Logic
    const castlingRights = game.castling[pieceColor === 'white' ? 'w' : 'b'];
    if (castlingRights && !game.inCheck(pieceColor)) {
        const rank = pieceColor === 'white' ? '1' : '8';

        // Kingside Castling
        if (castlingRights.k) {
            if (isSquareOccupied('f' + rank, game) === 'empty' &&
                isSquareOccupied('g' + rank, game) === 'empty') {
                if (!game.isSquareAttacked('f' + rank, pieceColor === 'white' ? 'black' : 'white') &&
                    !game.isSquareAttacked('g' + rank, pieceColor === 'white' ? 'black' : 'white')) {
                    moves.push('g' + rank);
                }
            }
        }

        // Queenside Castling
        if (castlingRights.q) {
            if (isSquareOccupied('b' + rank, game) === 'empty' &&
                isSquareOccupied('c' + rank, game) === 'empty' &&
                isSquareOccupied('d' + rank, game) === 'empty') {
                if (!game.isSquareAttacked('d' + rank, pieceColor === 'white' ? 'black' : 'white') &&
                    !game.isSquareAttacked('c' + rank, pieceColor === 'white' ? 'black' : 'white')) {
                    moves.push('c' + rank);
                }
            }
        }
    }
}