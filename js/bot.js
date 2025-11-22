import { getPossibleMoves } from './moves/allMoves.js';
import { legalSquares } from './drag.js';

export class Bot {
    constructor(game, color) {
        this.game = game;
        this.color = color;
        this.searchDepth = 5;

        this.pieceValues = {
            'p': 100,
            'n': 320,
            'b': 330,
            'r': 500,
            'q': 900,
            'k': 20000
        };

        this.centerSquares = ['d4', 'd5', 'e4', 'e5'];
        this.extendedCenter = ['c3', 'c4', 'c5', 'c6', 'd3', 'd6', 'e3', 'e6', 'f3', 'f4', 'f5', 'f6'];
    }

    makeMove() {
        console.log("Bot thinking...");
        const startTime = Date.now();

        const possibleMoves = this.getAllPossibleMovesForColor(this.color);
        if (possibleMoves.length === 0) {
            console.log("Bot has no moves");
            return false;
        }

        let bestMove = null;
        let bestScore = -Infinity;

        const orderedMoves = this.orderMoves(possibleMoves);

        for (const move of orderedMoves) {
            this.makeTemporaryMove(move);
            const score = -this.minimax(this.searchDepth - 1, -Infinity, Infinity, false);
            this.undoTemporaryMove(move);

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        const endTime = Date.now();
        console.log(`Bot found move in ${endTime - startTime}ms with score ${bestScore}`);

        if (bestMove) {
            this.game.makeMove(bestMove.start, bestMove.end);
            return true;
        }

        return false;
    }

    minimax(depth, alpha, beta, maximizingPlayer) {
        if (depth === 0) {
            return this.evaluatePosition();
        }

        const currentColor = this.game.turn === 'w' ? 'white' : 'black';
        const moves = this.getAllPossibleMovesForColor(currentColor);

        if (moves.length === 0) {
            if (this.isInCheck(currentColor)) {
                return -20000 + (this.searchDepth - depth);
            } else {
                return 0; // Stalemate
            }
        }

        if (maximizingPlayer) {
            let maxScore = -Infinity;
            const orderedMoves = this.orderMoves(moves);

            for (const move of orderedMoves) {
                this.makeTemporaryMove(move);
                const score = this.minimax(depth - 1, alpha, beta, false);
                this.undoTemporaryMove(move);

                maxScore = Math.max(maxScore, score);
                alpha = Math.max(alpha, score);

                if (beta <= alpha) break;
            }
            return maxScore;
        } else {
            let minScore = Infinity;
            const orderedMoves = this.orderMoves(moves);

            for (const move of orderedMoves) {
                this.makeTemporaryMove(move);
                const score = this.minimax(depth - 1, alpha, beta, true);
                this.undoTemporaryMove(move);

                minScore = Math.min(minScore, score);
                beta = Math.min(beta, score);

                if (beta <= alpha) break;
            }
            return minScore;
        }
    }

    getAllPossibleMovesForColor(color) {
        const moves = [];
        const board = this.game.board;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pieceChar = board[row][col];
                if (!pieceChar) continue;

                const pieceColor = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
                if (pieceColor !== color) continue;

                const square = this.game.coordsToSquare(row, col);
                const validMoves = this.getValidMovesForPiece(square);

                validMoves.forEach(dest => {
                    moves.push({ start: square, end: dest });
                });
            }
        }
        return moves;
    }

    getValidMovesForPiece(square) {
        const coords = this.game.squareToCoords(square);
        const pieceChar = this.game.board[coords.row][coords.col];
        if (!pieceChar) return [];

        const pieceColor = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
        const typeMap = { 'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king' };
        const type = typeMap[pieceChar.toLowerCase()];

        const possibleMoves = [];
        getPossibleMoves(square, type, pieceColor, this.game, possibleMoves);

        // Filter moves that leave king in check
        const validMoves = possibleMoves.filter(endSquare => {
            this.makeTemporaryMove({ start: square, end: endSquare });
            const isCheck = this.isInCheck(pieceColor);
            this.undoTemporaryMove({ start: square, end: endSquare });
            return !isCheck;
        });

        return validMoves;
    }

    isInCheck(color) {
        let kingSquare = null;
        const kingChar = color === 'white' ? 'K' : 'k';
        const board = this.game.board;

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col] === kingChar) {
                    kingSquare = this.game.coordsToSquare(row, col);
                    break;
                }
            }
            if (kingSquare) break;
        }

        if (!kingSquare) return false;
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareAttackedBy(kingSquare, opponentColor);
    }

    isSquareAttackedBy(square, attackingColor) {
        const board = this.game.board;
        const targetCoords = this.game.squareToCoords(square);

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pieceChar = board[row][col];
                if (!pieceChar) continue;

                const pieceColor = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
                if (pieceColor !== attackingColor) continue;

                const startSquare = this.game.coordsToSquare(row, col);
                const type = pieceChar.toLowerCase();

                if (type === 'p') {
                    const direction = pieceColor === 'white' ? -1 : 1;
                    const attackRow = row + direction;
                    if (targetCoords.row === attackRow && Math.abs(targetCoords.col - col) === 1) {
                        return true;
                    }
                } else if (type === 'k') {
                    const rowDiff = Math.abs(targetCoords.row - row);
                    const colDiff = Math.abs(targetCoords.col - col);
                    if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)) {
                        return true;
                    }
                } else {
                    const moves = [];
                    const typeMap = { 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen' };
                    if (typeMap[type]) {
                        getPossibleMoves(startSquare, typeMap[type], pieceColor, this.game, moves);
                        if (moves.includes(square)) return true;
                    }
                }
            }
        }
        return false;
    }

    makeTemporaryMove(move) {
        const startCoords = this.game.squareToCoords(move.start);
        const endCoords = this.game.squareToCoords(move.end);

        move.piece = this.game.board[startCoords.row][startCoords.col];
        move.capturedPiece = this.game.board[endCoords.row][endCoords.col];
        move.previousTurn = this.game.turn;
        move.previousEnPassant = this.game.enPassantTarget;
        move.previousCastling = JSON.parse(JSON.stringify(this.game.castling));

        this.game.board[endCoords.row][endCoords.col] = move.piece;
        this.game.board[startCoords.row][startCoords.col] = null;
        this.game.switchTurn();
    }

    undoTemporaryMove(move) {
        const startCoords = this.game.squareToCoords(move.start);
        const endCoords = this.game.squareToCoords(move.end);

        this.game.board[startCoords.row][startCoords.col] = move.piece;
        this.game.board[endCoords.row][endCoords.col] = move.capturedPiece;
        this.game.turn = move.previousTurn;
        this.game.enPassantTarget = move.previousEnPassant;
        this.game.castling = move.previousCastling;
    }

    orderMoves(moves) {
        return moves.sort((a, b) => {
            const scoreA = this.getMoveOrderScore(a);
            const scoreB = this.getMoveOrderScore(b);
            return scoreB - scoreA;
        });
    }

    getMoveOrderScore(move) {
        let score = 0;
        const targetPiece = this.game.board[this.game.squareToCoords(move.end).row][this.game.squareToCoords(move.end).col];
        const movingPiece = this.game.board[this.game.squareToCoords(move.start).row][this.game.squareToCoords(move.start).col];

        if (targetPiece) {
            const targetValue = this.pieceValues[targetPiece.toLowerCase()] || 0;
            const movingValue = this.pieceValues[movingPiece.toLowerCase()] || 0;
            score += targetValue - movingValue / 10;
        }

        if (this.centerSquares.includes(move.end)) {
            score += 50;
        }

        return score;
    }

    evaluatePosition() {
        let score = 0;
        const board = this.game.board;
        const botColor = this.color;

        // Material and positional evaluation
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board[row][col];
                if (!piece) continue;

                const pieceValue = this.pieceValues[piece.toLowerCase()] || 0;
                const isWhite = piece === piece.toUpperCase();
                const pieceColor = isWhite ? 'white' : 'black';
                const square = this.game.coordsToSquare(row, col);

                let pieceScore = pieceValue;

                // Positional bonuses
                if (this.centerSquares.includes(square)) {
                    pieceScore += 30;
                } else if (this.extendedCenter.includes(square)) {
                    pieceScore += 10;
                }

                // Piece safety - check if piece is hanging
                const isAttacked = this.isSquareAttackedBy(square, pieceColor === 'white' ? 'black' : 'white');
                const isDefended = this.isSquareAttackedBy(square, pieceColor);

                if (isAttacked && !isDefended && piece.toLowerCase() !== 'k') {
                    pieceScore -= pieceValue * 0.9; // Heavy penalty for hanging pieces
                } else if (isAttacked && isDefended) {
                    pieceScore -= pieceValue * 0.1; // Small penalty for pieces under attack even if defended
                }

                // Add/subtract based on whose piece it is
                if (pieceColor === botColor) {
                    score += pieceScore;
                } else {
                    score -= pieceScore;
                }
            }
        }

        return score;
    }
}
