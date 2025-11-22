export function isSquareOccupied(squareId, game) {
    const pieceChar = game.getPiece(squareId);
    if (!pieceChar) return "empty";
    return pieceChar === pieceChar.toUpperCase() ? "white" : "black";
}

export function isWithinBounds(id) {
    const rank = parseInt(id[1]);
    const file = id.charCodeAt(0);
    return rank >= 1 && rank <= 8 && file >= 97 && file <= 104;
}
