import { boardSetUp, piecesSetUp } from './board.js';
import { allowDrop, drop } from './drag.js';

window.onload = () => {
    boardSetUp();
    piecesSetUp();

    const boardSquares = document.getElementsByClassName("square");
    for (let square of boardSquares) {
        square.addEventListener("dragover", allowDrop);
        square.addEventListener("drop", drop);
    }
};
