import { renderBoard } from './board.js';
import { allowDrop, drop, drag } from './drag.js';
import { Game } from './game.js';
import { Bot } from './bot.js';
import { playCheckmate } from './sounds.js';

window.game = new Game();
const bot = new Bot(window.game, 'black'); // Bot plays black

// Initialize game
renderBoard(window.game, drag);
setupEventListeners();

function setupEventListeners() {
    const boardSquares = document.getElementsByClassName("square");
    for (let square of boardSquares) {
        square.addEventListener("dragover", allowDrop);
        square.addEventListener("drop", handleDrop);
    }
}

function handleDrop(ev) {
    const game = window.game;

    // Player move
    drop(ev, game);
    setupEventListeners(); // Re-attach listeners after potential re-render

    // Check if promotion is pending
    if (game.pendingPromotion) {
        showPromotionModal(game.pendingPromotion.color, game.pendingPromotion.square);
        return; // Don't check game over or trigger bot yet
    }

    checkGameOver(game);

    // If turn switched to black, bot plays
    if (game.turn === 'b' && !game.isGameOver) {
        setTimeout(() => {
            bot.makeMove();

            // Check if bot promotion is pending
            if (game.pendingPromotion) {
                // Auto-promote to Queen for bot
                game.promotePawn(game.pendingPromotion.square, 'q');
            }

            renderBoard(game, drag);
            setupEventListeners(); // Re-attach listeners after re-render
            checkGameOver(game);
        }, 500); // Small delay for realism
    }
}

function showPromotionModal(color, square) {
    const modal = document.getElementById('promotionModal');
    modal.setAttribute('data-color', color);
    modal.style.display = 'flex';

    // Add event listeners to promotion buttons
    const buttons = document.querySelectorAll('.promotion-btn');
    buttons.forEach(btn => {
        btn.onclick = () => {
            const pieceType = btn.getAttribute('data-piece');
            window.game.promotePawn(square, pieceType);
            modal.style.display = 'none';

            // Re-render board
            renderBoard(window.game, drag);
            setupEventListeners();

            // Check game over after promotion
            checkGameOver(window.game);

            // If turn switched to black (after promotion), bot plays
            if (window.game.turn === 'b' && !window.game.isGameOver) {
                setTimeout(() => {
                    bot.makeMove();

                    // Check if bot promotion is pending
                    if (window.game.pendingPromotion) {
                        // Auto-promote to Queen for bot
                        window.game.promotePawn(window.game.pendingPromotion.square, 'q');
                    }

                    renderBoard(window.game, drag);
                    setupEventListeners();
                    checkGameOver(window.game);
                }, 500);
            }
        };
    });
}

function checkGameOver(game) {
    const state = game.getGameState();
    if (state !== 'playing') {
        const modal = document.getElementById('gameOverModal');
        const title = document.getElementById('gameOverTitle');
        const message = document.getElementById('gameOverMessage');

        modal.style.display = 'flex';

        if (state === 'checkmate') {
            const winner = game.winner === 'white' ? 'White' : 'Black';
            title.innerText = "Checkmate!";
            message.innerText = `${winner} wins!`;
            playCheckmate(); // Play checkmate sound
        } else {
            title.innerText = "Stalemate";
            message.innerText = "Game is a draw.";
        }
    }
}
