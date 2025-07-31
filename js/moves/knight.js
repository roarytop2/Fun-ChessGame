import { legalSquares } from '../drag.js';
import { isSquareOccupied } from './utils.js';

 export function getKnightMoves(startingSquareId, pieceColor) {
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