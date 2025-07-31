import { legalSquares } from '../drag.js';
import { isSquareOccupied } from './utils.js';

export function getKingMoves(startingSquareId, pieceColor){
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