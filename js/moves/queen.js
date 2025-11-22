import { getBishopMoves } from './bishop.js';
import { getRookMoves } from './rook.js';

export function getQueenMoves(startingSquareId, pieceColor, game, moves) {
        getBishopMoves(startingSquareId, pieceColor, game, moves);
        getRookMoves(startingSquareId, pieceColor, game, moves);
}