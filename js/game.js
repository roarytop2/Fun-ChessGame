import { getPossibleMoves } from './moves/allMoves.js';
import { playMove, playCapture, playCheck, playPromotion } from './sounds.js';

export const PIECES = {
    w: { p: 'P', r: 'R', n: 'N', b: 'B', q: 'Q', k: 'K' },
    b: { p: 'p', r: 'r', n: 'n', b: 'b', q: 'q', k: 'k' }
};

export class Game {
    constructor() {
        this.board = this.initializeBoard();
        this.turn = 'w'; // 'w' or 'b'
        this.castling = { w: { k: true, q: true }, b: { k: true, q: true } };
        this.enPassantTarget = null; // square like 'e3'
        this.halfMoveClock = 0;
        this.fullMoveNumber = 1;
        this.history = [];
        this.isGameOver = false;
        this.winner = null;
        this.pendingPromotion = null; // { square: 'e8', color: 'white' }
    }

    initializeBoard() {
        // 8x8 board, null for empty
        // Lowercase for black, Uppercase for white
        const board = [
            ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'], // 8 (index 0)
            ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'], // 7
            [null, null, null, null, null, null, null, null], // 6
            [null, null, null, null, null, null, null, null], // 5
            [null, null, null, null, null, null, null, null], // 4
            [null, null, null, null, null, null, null, null], // 3
            ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'], // 2
            ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']  // 1 (index 7)
        ];
        return board;
    }

    getPiece(square) {
        const { row, col } = this.squareToCoords(square);
        return this.board[row][col];
    }

    squareToCoords(square) {
        const col = square.charCodeAt(0) - 97; // 'a' -> 0
        const row = 8 - parseInt(square[1]);   // '8' -> 0
        return { row, col };
    }

    coordsToSquare(row, col) {
        const file = String.fromCharCode(col + 97);
        const rank = 8 - row;
        return `${file}${rank}`;
    }

    switchTurn() {
        this.turn = this.turn === 'w' ? 'b' : 'w';
    }

    isSquareAttacked(square, attackingColor) {
        const board = this.board;
        const targetCoords = this.squareToCoords(square);

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pieceChar = board[row][col];
                if (pieceChar) {
                    const pieceColor = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
                    if (pieceColor === attackingColor) {
                        const startSquare = this.coordsToSquare(row, col);
                        const type = pieceChar.toLowerCase();

                        if (type === 'p') {
                            // Pawns attack diagonally
                            const attackRow = row + (pieceColor === 'white' ? -1 : 1);
                            if (targetCoords.row === attackRow) {
                                if (Math.abs(targetCoords.col - col) === 1) {
                                    return true;
                                }
                            }
                        } else if (type === 'k') {
                            // King attacks adjacent
                            const rowDiff = Math.abs(targetCoords.row - row);
                            const colDiff = Math.abs(targetCoords.col - col);
                            if (rowDiff <= 1 && colDiff <= 1 && (rowDiff + colDiff > 0)) {
                                return true;
                            }
                        } else {
                            // Other pieces: use getPossibleMoves
                            const moves = [];
                            const typeMap = { 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen' };
                            if (typeMap[type]) {
                                getPossibleMoves(startSquare, typeMap[type], pieceColor, this, moves);
                                if (moves.includes(square)) return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    inCheck(color) {
        let kingSquare = null;
        const kingChar = color === 'white' ? 'K' : 'k';

        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (this.board[row][col] === kingChar) {
                    kingSquare = this.coordsToSquare(row, col);
                    break;
                }
            }
            if (kingSquare) break;
        }

        if (!kingSquare) return false; // Should not happen in a valid game state
        const opponentColor = color === 'white' ? 'black' : 'white';
        return this.isSquareAttacked(kingSquare, opponentColor);
    }

    getValidMoves(square) {
        const { row, col } = this.squareToCoords(square);
        const pieceChar = this.board[row][col];
        if (!pieceChar) return [];

        const pieceColor = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
        const typeMap = { 'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king' };
        const type = typeMap[pieceChar.toLowerCase()];

        const moves = [];
        getPossibleMoves(square, type, pieceColor, this, moves);

        // Filter moves that leave king in check
        const validMoves = moves.filter(endSquare => {
            // Simulate move
            const startCoords = this.squareToCoords(square);
            const endCoords = this.squareToCoords(endSquare);
            const capturedPiece = this.board[endCoords.row][endCoords.col];

            this.board[endCoords.row][endCoords.col] = pieceChar;
            this.board[startCoords.row][startCoords.col] = null;

            const isCheck = this.inCheck(pieceColor);

            // Undo move
            this.board[startCoords.row][startCoords.col] = pieceChar;
            this.board[endCoords.row][endCoords.col] = capturedPiece;

            return !isCheck;
        });

        return validMoves;
    }

    makeMove(start, end) {
        const validMoves = this.getValidMoves(start);
        if (!validMoves.includes(end)) {
            console.log(`Invalid move: ${start} to ${end}`);
            return false;
        }

        const startCoords = this.squareToCoords(start);
        const endCoords = this.squareToCoords(end);
        const piece = this.board[startCoords.row][startCoords.col];
        const pieceType = piece ? piece.toLowerCase() : null;
        const pieceColor = piece === piece.toUpperCase() ? 'w' : 'b';

        // Handle Castling Move (King moves 2 squares)
        if (pieceType === 'k' && Math.abs(startCoords.col - endCoords.col) === 2) {
            const row = pieceColor === 'w' ? 7 : 0;

            if (endCoords.col > startCoords.col) { // Kingside (g-file)
                // Move Rook from h to f
                const rook = this.board[row][7];
                this.board[row][5] = rook; // f-file
                this.board[row][7] = null;
            } else { // Queenside (c-file)
                // Move Rook from a to d
                const rook = this.board[row][0];
                this.board[row][3] = rook; // d-file
                this.board[row][0] = null;
            }
        }

        // Update Castling Rights
        if (pieceType === 'k') {
            this.castling[pieceColor].k = false;
            this.castling[pieceColor].q = false;
        } else if (pieceType === 'r') {
            if (startCoords.col === 0) this.castling[pieceColor].q = false; // Queenside rook
            if (startCoords.col === 7) this.castling[pieceColor].k = false; // Kingside rook
        }
        // Also if Rook is captured
        const capturedPiece = this.board[endCoords.row][endCoords.col];
        if (capturedPiece) {
            const capturedType = capturedPiece.toLowerCase();
            const capturedColor = capturedPiece === capturedPiece.toUpperCase() ? 'w' : 'b';
            if (capturedType === 'r') {
                if (endCoords.col === 0) this.castling[capturedColor].q = false;
                if (endCoords.col === 7) this.castling[capturedColor].k = false;
            }
        }

        // Handle En Passant Capture
        if (pieceType === 'p' && end === this.enPassantTarget) {
            const captureRow = endCoords.row + (pieceColor === 'w' ? 1 : -1);
            this.board[captureRow][endCoords.col] = null;
        }

        // Update En Passant Target
        if (pieceType === 'p' && Math.abs(startCoords.row - endCoords.row) === 2) {
            const middleRow = (startCoords.row + endCoords.row) / 2;
            this.enPassantTarget = this.coordsToSquare(middleRow, startCoords.col);
        } else {
            this.enPassantTarget = null;
        }

        // Move the piece
        this.board[endCoords.row][endCoords.col] = piece;
        this.board[startCoords.row][startCoords.col] = null;

        // Check for pawn promotion
        if (pieceType === 'p') {
            const promotionRank = pieceColor === 'w' ? 0 : 7; // Rank 8 for white (row 0), Rank 1 for black (row 7)
            if (endCoords.row === promotionRank) {
                // Set pending promotion and don't switch turn yet
                const colorName = pieceColor === 'w' ? 'white' : 'black';
                this.pendingPromotion = { square: end, color: colorName };
                return true; // Move succeeded but promotion is pending
            }
        }

        this.switchTurn();

        // Check game over
        const opponentColor = this.turn === 'w' ? 'white' : 'black';
        if (this.inCheck(opponentColor)) {
            console.log("Check!");
            playCheck(); // Play check sound
            if (this.isCheckmate(opponentColor)) {
                console.log("Checkmate! " + (this.turn === 'w' ? "Black" : "White") + " wins!");
                this.isGameOver = true;
                this.winner = this.turn === 'w' ? 'black' : 'white'; // Previous turn moved
            }
        } else {
            if (this.isCheckmate(opponentColor)) { // Actually stalemate check
                console.log("Stalemate!");
                this.isGameOver = true;
            } else {
                // Regular move or capture sound
                if (capturedPiece) {
                    playCapture();
                } else {
                    playMove();
                }
            }
        }

        return true;
    }

    isCheckmate(color) {
        // Check if any piece has any valid move
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const pieceChar = this.board[row][col];
                if (pieceChar) {
                    const pieceColor = pieceChar === pieceChar.toUpperCase() ? 'white' : 'black';
                    if (pieceColor === color) {
                        const square = this.coordsToSquare(row, col);
                        const validMoves = this.getValidMoves(square);
                        if (validMoves.length > 0) return false;
                    }
                }
            }
        }
        return true;
    }

    promotePawn(square, pieceType) {
        // pieceType: 'q', 'r', 'b', 'n'
        const coords = this.squareToCoords(square);
        const color = this.pendingPromotion.color;
        const pieceChar = color === 'white' ? pieceType.toUpperCase() : pieceType.toLowerCase();

        // Replace pawn with promoted piece
        this.board[coords.row][coords.col] = pieceChar;

        // Clear pending promotion
        this.pendingPromotion = null;

        // Play promotion sound
        playPromotion();

        // Now switch turn
        this.switchTurn();

        // Check game over
        const opponentColor = this.turn === 'w' ? 'white' : 'black';
        if (this.inCheck(opponentColor)) {
            console.log("Check!");
            if (this.isCheckmate(opponentColor)) {
                console.log("Checkmate! " + (this.turn === 'w' ? "Black" : "White") + " wins!");
                this.isGameOver = true;
                this.winner = this.turn === 'w' ? 'black' : 'white';
            }
        } else {
            if (this.isCheckmate(opponentColor)) {
                console.log("Stalemate!");
                this.isGameOver = true;
            }
        }
    }

    getGameState() {
        if (this.isGameOver) {
            if (this.winner) {
                return 'checkmate';
            } else {
                return 'stalemate';
            }
        }
        return 'playing';
    }
}
