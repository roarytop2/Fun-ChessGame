import { legalSquares } from '../drag.js';
import { isSquareOccupied } from './utils.js';
import { isWithinBounds } from './utils.js';

export function getBishopMoves(startingSquareId, pieceColor) {
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
