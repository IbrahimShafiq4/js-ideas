// Game state variables
let currentPlayer = 'X'; // Current player (X or O)
let gameState = Array(9).fill(null); // Array representing the game board
let gameActive = true; // Flag to track if game is active
let gameMode = null; // 'pvp' for player vs player, 'pvc' for player vs computer
let lastWinClass = null; // Track the last winning line class added

// DOM elements
const board = document.querySelector('.board');
const statusDisplay = document.querySelector('.status');
const restartButton = document.querySelector('.restart-btn');
const pvpButton = document.getElementById('pvp-btn');
const pvcButton = document.getElementById('pvc-btn');

// Winning conditions (indices of winning combinations)
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
];

// Initialize the game
function initializeGame() {
    // Clear the board
    board.innerHTML = '';

    // Reset game state
    gameState = Array(9).fill(null);
    gameActive = true;
    currentPlayer = 'X';

    // Remove any winning line classes
    if (lastWinClass) {
        board.classList.remove(lastWinClass);
        lastWinClass = null;
    }

    // Remove game over class
    board.classList.remove('game-over');

    // Update status based on game mode
    if (gameMode === 'pvp') {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    } else if (gameMode === 'pvc') {
        statusDisplay.textContent = currentPlayer === 'X' ? 'Your turn (X)' : 'Computer is thinking...';
    } else {
        statusDisplay.textContent = 'Select game mode to start';
    }

    // Create cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    // If it's computer's turn first in PVC mode, make a move
    if (gameMode === 'pvc' && currentPlayer === 'O') {
        setTimeout(computerMove, 500); // Small delay for better UX
    }
}

// Handle cell click
function handleCellClick(e) {
    // If game is not active or no game mode selected, ignore click
    if (!gameActive || !gameMode) return;

    const clickedCell = e.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    // If cell already filled, ignore click
    if (gameState[clickedCellIndex] !== null) return;

    // Update game state and UI
    gameState[clickedCellIndex] = currentPlayer;
    updateCell(clickedCell, clickedCellIndex);

    // Check for win or draw
    const result = checkResult();
    if (result === 'win') {
        handleWin();
    } else if (result === 'draw') {
        handleDraw();
    } else {
        changePlayer();

        // If it's computer's turn in PVC mode, make a move
        if (gameMode === 'pvc' && currentPlayer === 'O' && gameActive) {
            setTimeout(computerMove, 500); // Small delay for better UX
        }
    }
}

// Update cell with player's symbol
function updateCell(cell, index) {
    const symbol = document.createElement('p');
    symbol.className = currentPlayer === 'X' ? 'player-x' : 'player-o';
    symbol.textContent = currentPlayer;
    cell.appendChild(symbol);
}

// Check game result (win, draw, or continue)
function checkResult() {
    // Check for win
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return 'win';
        }
    }

    // Check for draw
    return !gameState.includes(null) ? 'draw' : 'continue';
}

// Handle win
function handleWin() {
    gameActive = false;

    // Update status message
    if (gameMode === 'pvp') {
        statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    } else {
        if (currentPlayer === 'X') {
            statusDisplay.textContent = 'You win!';
        } else {
            statusDisplay.textContent = 'Computer wins!';
        }
    }

    // Add game over class
    board.classList.add('game-over');

    // Draw winning line
    drawWinningLine();
}

// Handle draw
function handleDraw() {
    gameActive = false;
    statusDisplay.textContent = 'Game ended in a draw!';
    board.classList.add('game-over');
}

// Change player turn
function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    // Update status message
    if (gameMode === 'pvp') {
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    } else {
        statusDisplay.textContent = currentPlayer === 'X' ? 'Your turn (X)' : 'Computer is thinking...';
    }
}

// Draw winning line on the board
function drawWinningLine() {
    // Remove previous winning line if any
    if (lastWinClass) {
        board.classList.remove(lastWinClass);
    }

    // Find the winning combination
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            // Set the line color based on winner
            const lineColor = currentPlayer === 'X' ? '#000EFF' : '#AB0022';
            board.style.setProperty('--clr', lineColor);

            // Determine line type and position
            if (i < 3) { // rows
                const rowPositions = ['50px', '155px', '260px'];
                board.style.setProperty('--pos', rowPositions[i]);
                lastWinClass = 'win-row';
            } else if (i < 6) { // columns
                const colPositions = ['50px', '155px', '260px'];
                board.style.setProperty('--pos', colPositions[i - 3]);
                lastWinClass = 'win-column';
            } else if (i === 6) { // diagonal 1
                lastWinClass = 'win-diagonal-1';
            } else { // diagonal 2
                lastWinClass = 'win-diagonal-2';
            }

            board.classList.add(lastWinClass);
            break;
        }
    }
}

// Computer move logic using Minimax algorithm
function computerMove() {
    if (!gameActive || currentPlayer !== 'O') return;

    // Find the best move using Minimax
    const bestMove = findBestMove();

    // Get the cell element for the best move
    const cell = board.querySelector(`[data-index="${bestMove}"]`);

    // Make the move
    gameState[bestMove] = 'O';
    updateCell(cell, bestMove);

    // Check for win or draw
    const result = checkResult();
    if (result === 'win') {
        handleWin();
    } else if (result === 'draw') {
        handleDraw();
    } else {
        changePlayer();
    }
}

// Minimax algorithm to find the best move
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove = null;

    // Try all possible moves
    for (let i = 0; i < 9; i++) {
        // If spot is available
        if (gameState[i] === null) {
            // Make the move
            gameState[i] = 'O';

            // Call minimax for the opponent's move
            const score = minimax(gameState, 0, false);

            // Undo the move
            gameState[i] = null;

            // Update best score and move
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Minimax algorithm implementation
function minimax(board, depth, isMaximizing) {
    // Check terminal states
    const result = checkTerminalState(board);
    if (result !== null) {
        return result;
    }

    if (isMaximizing) {
        // Computer's turn (maximizing player)
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'O';
                const score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        // Player's turn (minimizing player)
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === null) {
                board[i] = 'X';
                const score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check terminal state for minimax (win/lose/draw)
function checkTerminalState(board) {
    // Check for win
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a] === 'O' ? 10 : -10; // Computer wins = 10, Player wins = -10
        }
    }

    // Check for draw
    if (!board.includes(null)) {
        return 0; // Draw
    }

    // Game not finished
    return null;
}

// Event listeners
restartButton.addEventListener('click', initializeGame);

pvpButton.addEventListener('click', () => {
    gameMode = 'pvp';
    initializeGame();
});

pvcButton.addEventListener('click', () => {
    gameMode = 'pvc';
    initializeGame();
});

// Initialize the game on page load
initializeGame();