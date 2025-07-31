import { getPossibleMoves } from './moves/allMoves.js';

export let legalSquares = [];
export let isWhiteTurn = true;

export function allowDrop(ev) {
    ev.preventDefault();
}

export function drag(ev) {
    const piece = ev.target;
    const pieceColor = piece.getAttribute("color");
    if ((isWhiteTurn && pieceColor === "white") || (!isWhiteTurn && pieceColor === "black")) {
        ev.dataTransfer.setData("text", piece.id);
        const startSquareId = piece.parentNode.id;
        getPossibleMoves(startSquareId, piece);
    }
}

export function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = ev.currentTarget;
    const destId = destinationSquare.id;

    if (legalSquares.includes(destId)) {
        if (destinationSquare.firstChild) destinationSquare.innerHTML = "";
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn;
    }
    legalSquares.length = 0;
}
