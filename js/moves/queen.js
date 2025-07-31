import { getBishopMoves } from './bishop.js';
import { getRookMoves } from './rook.js';

export function getQueenMoves(startingSquareId, pieceColor){
        getBishopMoves(startingSquareId, pieceColor);
        getRookMoves(startingSquareId, pieceColor);
}