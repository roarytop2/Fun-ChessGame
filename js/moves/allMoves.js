import { getPawnMoves } from './pawn.js';
import { getRookMoves } from './rook.js';
import { getKnightMoves } from './knight.js';
import { getBishopMoves } from './bishop.js';
import { getQueenMoves } from './queen.js';
import { getKingMoves } from './king.js';
import { legalSquares } from '../drag.js';

export function getPossibleMoves(startId, piece) {
    const color = piece.getAttribute("color");

    if (piece.classList.contains("pawn")) getPawnMoves(startId, color);
    else if (piece.classList.contains("rook")) getRookMoves(startId, color);
    else if (piece.classList.contains("knight")) getKnightMoves(startId, color);
    else if (piece.classList.contains("bishop")) getBishopMoves(startId, color);
    else if (piece.classList.contains("queen")) getQueenMoves(startId, color);
    else if (piece.classList.contains("king")) getKingMoves(startId, color);
}
