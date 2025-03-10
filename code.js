let legalSquares = [];
let isWhiteTurn = true;
const boardSquares = document.getElementsByClassName("square");
const pieces = document.getElementsByClassName("piece");
const piecesImages = document.getElementsByTagName("img");

// The board setup function sets up the event listeners and IDs for all the squares on the board
boardSetUp();
piecesSetUp();

function boardSetUp() {
    for (let i = 0; i < boardSquares.length; i++) {
        // The above two lines add the drag-and-drop functionality to the game. Allows piece movement
        boardSquares[i].addEventListener("dragover", allowDrop);
        boardSquares[i].addEventListener("drop", drop);

        // Assigns an ID of letter + number to each square on the board (e.g., "a1", "h8")
        let row = 8 - Math.floor(i / 8); // Calculate the row (1-8) from the square index
        let column = String.fromCharCode(97 + (i % 8)); // Calculate the column (a-h) from the index
        let square = boardSquares[i];
        square.id = column + row;
    }
}

// The pieces setup function sets up the drag-and-drop functionality on the pieces
function piecesSetUp() {
    for (let i = 0; i < pieces.length; i++) {
        // Enables dragging functionality for each piece
        pieces[i].addEventListener("dragstart", drag);
        pieces[i].setAttribute("draggable", true);

        // Assigns each piece a unique ID based on its class and current position (e.g., "rooka1")
        pieces[i].id = pieces[i].className.split(" ")[1] + pieces[i].parentElement.id;
    }
    for (let i = 0; i < piecesImages.length; i++) {
        // Prevents the images from being dragged themselves
        piecesImages[i].setAttribute("draggable", false);
    }
}

// allowDrop prevents the default behavior, which is that an image cannot be dropped on top of another image
function allowDrop(ev) {
    ev.preventDefault();
}

// drag allows a piece to be dragged and sets the piece ID for transfer
function drag(ev) {
    const piece = ev.target; // Get the piece being dragged
    const pieceColor = piece.getAttribute("color");
    if ((isWhiteTurn && pieceColor === "white") || (!isWhiteTurn && pieceColor === "black")) {
        ev.dataTransfer.setData("text", piece.id); // Save the ID for later use
        const startSquareId = piece.parentNode.id;
        getPossibleMoves(startSquareId, piece);
    }
}

// Moves piece to destination square and handles capturing
function drop(ev) {
    ev.preventDefault();
    let data = ev.dataTransfer.getData("text");
    const piece = document.getElementById(data);
    const destinationSquare = ev.currentTarget;
    const destinationSquareId = destinationSquare.id;

    if (legalSquares.includes(destinationSquareId)) {
        if (isSquareOccupied(destinationSquare) !== "empty") {
            while (destinationSquare.firstChild) {
                destinationSquare.removeChild(destinationSquare.firstChild); // Capture the piece
            }
        }
        destinationSquare.appendChild(piece);
        isWhiteTurn = !isWhiteTurn; // Switch turns
    }
    legalSquares.length = 0; // Clear legal squares after move
}

// Checks if a square is occupied
function isSquareOccupied(square) {
    return square.querySelector(".piece") 
        ? square.querySelector(".piece").getAttribute("color") 
        : "empty";
}

// Generates possible moves for any piece
function getPossibleMoves(startingSquareId, piece) {
    const pieceColor = piece.getAttribute("color");

    if (piece.classList.contains("pawn")) {//for the pawn
        getPawnMoves(startingSquareId, pieceColor);
    }
    else if (piece.classList.contains("rook")) {//for the rooooooook!
        getRookMoves(startingSquareId, pieceColor);
    }
    else if (piece.classList.contains("bishop")){//for the bishop
        getBishopMoves(startingSquareId, pieceColor);
    }
    else if (piece.classList.contains("knight")){// for the horsey(there a problem with the black knights)
        getKnightMoves(startingSquareId, pieceColor);
    }
    else if (piece.classList.contains("queen")){//for the queen
        getQueenMoves(startingSquareId, pieceColor);
    }
    else if (piece.classList.contains("king")){//for the king
        getKingMoves(startingSquareId, pieceColor);
    }
}
function isWithinBounds(squareId){
    const rank = parseInt(squareId.charAt(1));
    const file = squareId.charAt(0);

    if( rank > 8 || rank < 1 || file.charCodeAt(0) < 'a'.charCodeAt(0) || file.charCodeAt(0) > 'h'.charCodeAt(0)){
        return false;
    }
    return true;
}

// Helper functions for pawn moves
function getPawnMoves(startingSquareId, pieceColor) {    diagonalPawnCaptures(startingSquareId, pieceColor);
    forwardPawnMoves(startingSquareId, pieceColor);
    // enPassant(startingSquareId, pieceColor); 
}

function diagonalPawnCaptures(startSquareId, pieceColor) {
    const file = startSquareId.charAt(0);
    const rank = startSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor === "white" ? 1 : -1;
    const newRank = rankNumber + direction;

    for (let i = -1; i <= 1; i += 2) {
        const newFile = String.fromCharCode(file.charCodeAt(0) + i);
        if (newFile >= "a" && newFile <= "h") {
            const newSquareId = newFile + newRank;
            const newSquare = document.getElementById(newSquareId);
            const squareContent = isSquareOccupied(newSquare);

            if (squareContent !== "empty" && squareContent !== pieceColor) {
                legalSquares.push(newSquareId);
            }
        }
    }
}

function forwardPawnMoves(startSquareId, pieceColor) {
    const file = startSquareId.charAt(0);
    const rank = startSquareId.charAt(1);
    const rankNumber = parseInt(rank);
    const direction = pieceColor === "white" ? 1 : -1;
    let newRank = rankNumber + direction;

    let newSquareId = file + newRank;
    let newSquare = document.getElementById(newSquareId);
    let squareContent = isSquareOccupied(newSquare);
    
    if (squareContent === "empty") {
        legalSquares.push(newSquareId);

        // Check for double move from starting position
        if ((pieceColor === "white" && rankNumber === 2) || (pieceColor === "black" && rankNumber === 7)) {
            newRank += direction;
            newSquareId = file + newRank;
            newSquare = document.getElementById(newSquareId);
            squareContent = isSquareOccupied(newSquare);

            if (squareContent === "empty") {
                legalSquares.push(newSquareId);
            }
        }
    }
}

//Functions to get the moves of each piece

//rook
function getRookMoves(startingSquareId, pieceColor) {
    const directions = [{deltaFile : 0, deltaRank : 1}, {deltaFile : 0, deltaRank : -1}, {deltaFile : 1, deltaRank : 0}, {deltaFile : -1, deltaRank : 0}];// these are the directions in the order Up ,down , left and right
    const startFile = startingSquareId.charAt(0);
    const startRank = parseInt(startingSquareId.charAt(1));

    for (const direction of directions ){
        let currentFile = startFile.charCodeAt(0); //we are getting the ascii code
        let currentRank = startRank;

        while(true){
            currentFile += direction.deltaFile;
            currentRank += direction.deltaRank;
            const tempSquareId = String.fromCharCode(currentFile) + currentRank;

            if(!isWithinBounds(tempSquareId)){break;}// if the square is not on the board

            const newFile = String.fromCharCode(currentFile);
            const newSquareId =  newFile + currentRank;
            const newSquare = document.getElementById(newSquareId);

            const squareContent = isSquareOccupied(newSquare);
            
            if(squareContent == "empty"){
                legalSquares.push(newSquareId);
            }
            else if (squareContent != pieceColor){
                legalSquares.push(newSquareId);
                break;
            }
            else{break;}
            
        }
    }   
}
//bishop
function getBishopMoves(startingSquareId, pieceColor) {
    const directions = [{deltaFile : 1, deltaRank : 1}, {deltaFile : 1, deltaRank : -1}, {deltaFile : -1, deltaRank : 1}, {deltaFile : -1, deltaRank : -1}];// these are the diagonal directions in the order north-east ,south-east, north-west  and south-west
    const startFile = startingSquareId.charAt(0);
    const startRank = parseInt(startingSquareId.charAt(1));

    for (const direction of directions ){
        let currentFile = startFile.charCodeAt(0); //we are getting the ascii code
        let currentRank = startRank;

        while(true){
            currentFile += direction.deltaFile;
            currentRank += direction.deltaRank;
            const tempSquareId = String.fromCharCode(currentFile) + currentRank;

            if(!isWithinBounds(tempSquareId)){break;}// if the square is not on the board

            const newFile = String.fromCharCode(currentFile);
            const newSquareId =  newFile + currentRank;
            const newSquare = document.getElementById(newSquareId);

            const squareContent = isSquareOccupied(newSquare);
            
            if(squareContent == "empty"){
                legalSquares.push(newSquareId);
            }
            else if (squareContent != pieceColor){
                legalSquares.push(newSquareId);
                break;
            }
            else{break;}
            
        }
    }
}
    
    //knight
    function getKnightMoves(startingSquareId, pieceColor) {
        // Convert file (a-h) to an index (0-7) and rank (1-8) to an index (0-7)
        const fileIndex = startingSquareId.charCodeAt(0) - "a".charCodeAt(0);
        const rankIndex = parseInt(startingSquareId[1], 10) - 1;
      
        // Define the eight possible moves for a knight
        const potentialMoves = [
          { dFile: 1, dRank: 2 },
          { dFile: -1, dRank: 2 },
          { dFile: 1, dRank: -2 },
          { dFile: -1, dRank: -2 },
          { dFile: 2, dRank: 1 },
          { dFile: 2, dRank: -1 },
          { dFile: -2, dRank: 1 },
          { dFile: -2, dRank: -1 }
        ];
      
        potentialMoves.forEach(move => {
          // Calculate the new coordinates
          const newFileIndex = fileIndex + move.dFile;
          const newRankIndex = rankIndex + move.dRank;
      
          // Check if the new coordinates are within bounds (0 to 7)
          if (newFileIndex < 0 || newFileIndex > 7 || newRankIndex < 0 || newRankIndex > 7) {
            return; // Skip moves that are off the board
          }
      
          // Convert numeric coordinates back to algebraic notation (e.g., 'e4')
          const newFile = String.fromCharCode(newFileIndex + "a".charCodeAt(0));
          const newRank = (newRankIndex + 1).toString();
          const newSquareId = newFile + newRank;
      
          // Retrieve the square element and determine its occupancy
          const newSquare = document.getElementById(newSquareId);
          const squareContent = isSquareOccupied(newSquare);
      
          // If the square is empty or occupied by an opponent, it is legal
          if (squareContent === "empty" || squareContent !== pieceColor) {
            legalSquares.push(newSquareId);
          }
        });
      }
      

//Queen Moves
function getQueenMoves(startingSquareId, pieceColor){
        getBishopMoves(startingSquareId, pieceColor);
        getRookMoves(startingSquareId, pieceColor);
}

//King Moves
function getKingMoves(startingSquareId, pieceColor){
    const directions =[{deltaFile: 1,deltaRank: 1}, {deltaFile: -1, deltaRank: -1},//north-east and south-west
                    {deltaFile: 1,deltaRank: 0}, {deltaFile: -1, deltaRank: 0},//east and west
                    {deltaFile: 0,deltaRank: 1}, {deltaFile: 0, deltaRank: -1},//north aand south
                    {deltaFile: -1,deltaRank: 1}, {deltaFile: 1, deltaRank: -1}//south-east and north-west
                ];
    
                const startFile = startingSquareId.charAt(0);
                const startRank = parseInt(startingSquareId.charAt(1));
            
                for (const direction of directions ){
        
                    const currentFile = startFile.charCodeAt(0) + direction.deltaFile; 
                    const currentRank = startRank + direction.deltaRank;
            
                    const newSquareId = String.fromCharCode(currentFile) + currentRank;
            
                    if(!isWithinBounds(newSquareId)){continue;}// if the square is not on the board
            
                    const newSquare = document.getElementById(newSquareId);
                    const squareContent = isSquareOccupied(newSquare);
                        
                    if(squareContent == "empty" || squareContent != pieceColor){
                        legalSquares.push(newSquareId);
                    }
                }
}

