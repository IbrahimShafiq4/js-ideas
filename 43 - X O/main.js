// Select the game title element from the document
let title = document.querySelector('.game-title');

// Initialize the turn to 'x'
let turn = 'x';

// Initialize an array to store the state of the squares
let squares = [];

// Flag to determine if the game is in "1 vs Computer" mode
let isOneVsComputer = false;

// Flag to track if the game has ended
let gameOver = false;

// Function to handle a move when a square is clicked
function game(id) {
    // If the game is over, do nothing
    if (gameOver) return;

    // Get the clicked element by its id
    let element = document.getElementById(id);
    
    // Check if the square is empty
    if (element.innerHTML == '') {
        // Set the innerHTML to the current turn ('X' or 'O')
        element.innerHTML = turn.toUpperCase();
        
        // Add the class corresponding to the current turn
        element.classList.add(turn);
        
        // Switch turns
        turn = turn === 'x' ? 'o' : 'x';
        
        // Update the game title to indicate the next player's turn
        title.innerHTML = `${turn.toUpperCase()} Turn`;
        
        // Check for a winner
        checkWinner();

        // If it's "1 vs Computer" mode and the game is not over, let the computer make a move
        if (isOneVsComputer && turn === 'o' && !gameOver) {
            // Add a slight delay for the computer's move for better UX
            setTimeout(computerMove, 500);
        }
    }
}

// Function for the computer to make a move
function computerMove() {
    // Find all empty squares
    let emptySquares = [];
    for (let i = 1; i < 10; i++) {
        if (document.getElementById(`item-${i}`).innerHTML == '') {
            emptySquares.push(i);
        }
    }

    // If there are empty squares available
    if (emptySquares.length > 0) {
        // Choose a random empty square
        let randomIndex = Math.floor(Math.random() * emptySquares.length);
        let element = document.getElementById(`item-${emptySquares[randomIndex]}`);
        
        // Set the innerHTML to 'O'
        element.innerHTML = 'O';
        
        // Add the 'o' class
        element.classList.add('o');
        
        // Switch turns
        turn = 'x';
        
        // Update the game title to indicate the next player's turn
        title.innerHTML = `${turn.toUpperCase()} Turn`;
        
        // Check for a winner
        checkWinner();
    }
}

// Function to check for a winner or a draw
function checkWinner() {
    // Store the current state of the squares
    for(let i = 1; i < 10; i++) {
        squares[i] = document.getElementById(`item-${i}`).innerHTML;
    }

    // Define the winning combinations
    const winningCombos = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
        [1, 5, 9],
        [3, 5, 7]
    ];

    // Check each winning combination
    for (let combo of winningCombos) {
        if (squares[combo[0]] && squares[combo[0]] === squares[combo[1]] && squares[combo[0]] === squares[combo[2]]) {
            // If a winning combination is found, display the winner
            title.innerHTML = `${squares[combo[0]]} Wins!`;
            
            // Set the gameOver flag to true
            gameOver = true;
            setTimeout(resetGame, 1000)
            return;
        }
    }

    // Check for a draw (all squares are filled and no winner)
    if (squares.every(square => square !== '')) {
        // If it's a draw, display "Draw!"
        title.innerHTML = 'Draw!';
        
        // Set the gameOver flag to true
        gameOver = true;
        setTimeout(resetGame, 1000)
    }
}

// Function to reset the game
function resetGame() {
    // Clear all squares
    for(let i = 1; i < 10; i++) {
        let element = document.getElementById(`item-${i}`);
        element.innerHTML = '';
        element.classList.remove('x', 'o');
    }
    
    // Reset the turn to 'x'
    turn = 'x';
    
    // Update the game title to indicate the first player's turn
    title.innerHTML = `${turn.toUpperCase()} Turn`;
    
    // Clear the squares array
    squares = [];
    
    // Set the gameOver flag to false
    gameOver = false;
}

// Function to toggle between "1 vs Player" and "1 vs Computer" modes
function toggleOneVsComputer() {
    // Toggle the isOneVsComputer flag
    isOneVsComputer = !isOneVsComputer;
    
    // Reset the game
    resetGame();
    
    // Update the button text based on the current mode
    document.getElementById('one-vs-computer').innerHTML = isOneVsComputer ? 'Switch to 1 vs Player' : 'Switch to 1 vs Computer';
}
