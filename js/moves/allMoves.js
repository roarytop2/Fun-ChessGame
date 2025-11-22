import { getPawnMoves } from './pawn.js';
import { getRookMoves } from './rook.js';
import { getKnightMoves } from './knight.js';
import { getBishopMoves } from './bishop.js';
import { getQueenMoves } from './queen.js';
import { getKingMoves } from './king.js';


export function getPossibleMoves(startId, pieceType, color, game, moves = []) {
    if (pieceType === "pawn") getPawnMoves(startId, color, game, moves);
    else if (pieceType === "rook") getRookMoves(startId, color, game, moves);
    else if (pieceType === "knight") getKnightMoves(startId, color, game, moves);
    else if (pieceType === "bishop") getBishopMoves(startId, color, game, moves);
    else if (pieceType === "queen") getQueenMoves(startId, color, game, moves);
    else if (pieceType === "king") getKingMoves(startId, color, game, moves);
    return moves;
}
