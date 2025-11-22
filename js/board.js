
export function renderBoard(game, dragHandler) {
    const boardElement = document.querySelector(".chess_board");
    boardElement.innerHTML = ""; // Clear existing board

    const boardState = game.board;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const square = document.createElement("div");
            const isLight = (row + col) % 2 === 0;
            square.className = `square ${isLight ? "light" : "dark"}`;
            square.id = game.coordsToSquare(row, col);

            // Add coordinates
            if (col === 0) {
                const rankCoord = document.createElement("div");
                rankCoord.className = `coordinate rank ${isLight ? "darkText" : "lightText"}`;
                rankCoord.innerText = 8 - row;
                square.appendChild(rankCoord);
            }
            if (row === 7) {
                const fileCoord = document.createElement("div");
                fileCoord.className = `coordinate ${isLight ? "darkText" : "lightText"}`;
                fileCoord.innerText = String.fromCharCode(97 + col);
                square.appendChild(fileCoord);
            }

            const pieceChar = boardState[row][col];
            if (pieceChar) {
                const piece = document.createElement("div");
                const color = pieceChar === pieceChar.toUpperCase() ? "white" : "black";
                const typeMap = {
                    'p': 'pawn', 'r': 'rook', 'n': 'knight', 'b': 'bishop', 'q': 'queen', 'k': 'king'
                };
                const type = typeMap[pieceChar.toLowerCase()];

                piece.className = `piece ${type}`;
                piece.setAttribute("color", color);
                piece.setAttribute("draggable", true);
                piece.id = `${type}-${color}-${square.id}`; // Unique ID
                if (dragHandler) {
                    piece.addEventListener("dragstart", dragHandler);
                }

                const img = document.createElement("img");
                img.src = `assets/images/${type}-${color.charAt(0)}.svg`;
                img.alt = type;
                img.setAttribute("draggable", false);

                piece.appendChild(img);
                square.appendChild(piece);
            }

            boardElement.appendChild(square);
        }
    }

    // Highlight King in Check
    if (game.inCheck(game.turn === 'w' ? 'white' : 'black')) {
        const kingChar = game.turn === 'w' ? 'K' : 'k';
        // Find King square
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (game.board[r][c] === kingChar) {
                    const kingSquareId = game.coordsToSquare(r, c);
                    const kingSquare = document.getElementById(kingSquareId);
                    if (kingSquare) kingSquare.classList.add('in-check');
                }
            }
        }
    }
}

export function highlightMoves(squares) {
    squares.forEach(id => {
        const square = document.getElementById(id);
        if (square) {
            square.classList.add('legal-move');
            if (square.querySelector('.piece')) {
                square.classList.add('piece-capture');
            }
        }
    });
}

export function clearHighlights() {
    const squares = document.querySelectorAll('.legal-move');
    squares.forEach(sq => {
        sq.classList.remove('legal-move');
        sq.classList.remove('piece-capture');
    });
}
