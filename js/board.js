import { drag } from "./drag.js";

export function boardSetUp() {
    const boardSquares = document.getElementsByClassName("square");
    for (let i = 0; i < boardSquares.length; i++) {
        let row = 8 - Math.floor(i / 8);
        let column = String.fromCharCode(97 + (i % 8));
        boardSquares[i].id = column + row;
    }
}

export function piecesSetUp() {
    const pieces = document.getElementsByClassName("piece");
    const piecesImages = document.getElementsByTagName("img");

    for (let piece of pieces) {
        piece.addEventListener("dragstart", drag);
        piece.setAttribute("draggable", true);
        piece.id = piece.className.split(" ")[1] + piece.parentElement.id;
    }

    for (let img of piecesImages) {
        img.setAttribute("draggable", false);
    }
}
