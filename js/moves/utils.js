export function isSquareOccupied(square) {
    const piece = square.querySelector(".piece");
    return piece ? piece.getAttribute("color") : "empty";
}

export function isWithinBounds(id) {
    const rank = parseInt(id[1]);
    const file = id.charCodeAt(0);
    return rank >= 1 && rank <= 8 && file >= 97 && file <= 104;
}
