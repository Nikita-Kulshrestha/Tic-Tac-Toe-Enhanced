const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const resetButton = document.getElementById('restartButton'); // Ensure the ID matches your HTML
const themeToggle = document.getElementById('themeToggle');
const moveHistoryDiv = document.getElementById('moveHistory');
let currentPlayer = 'X';
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let moveHistory = [];
let playerXScore = 0;
let playerOScore = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const handleCellPlayed = (clickedCell, clickedCellIndex) => {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerText = currentPlayer;
    moveHistory.push({ player: currentPlayer, cell: clickedCellIndex });
    updateMoveHistory();
};

const handlePlayerChange = () => {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.innerText = `Player ${currentPlayer}'s turn`;
};

const handleResultValidation = () => {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === "" || b === "" || c === "") {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winCondition.forEach(index => document.getElementById(index).classList.add('winner'));
            break;
        }
    }

    if (roundWon) {
        currentPlayer === "X" ? playerXScore++ : playerOScore++;
        updateScoreboard();
        statusText.innerText = `Player ${currentPlayer} wins!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusText.innerText = "It's a draw!";
        gameActive = false;
        return;
    }

    handlePlayerChange();
};

const updateMoveHistory = () => {
    moveHistoryDiv.innerHTML = moveHistory.map((move, index) => 
        `<div>Move ${index + 1}: Player ${move.player} to Cell ${move.cell + 1}</div>`
    ).join('');
};

const updateScoreboard = () => {
    document.getElementById('playerXScore').innerText = playerXScore;
    document.getElementById('playerOScore').innerText = playerOScore;
};

const handleCellClick = (event) => {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('id'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();

    if (currentPlayer === "O" && gameActive) {
        setTimeout(handleAiMove, 500);
    }
};

const handleAiMove = () => {
    let emptyCells = gameState.map((value, index) => value === "" ? index : null).filter(index => index !== null);
    let aiMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    if (aiMove !== undefined) {
        gameState[aiMove] = currentPlayer;
        document.getElementById(aiMove).innerText = currentPlayer;
        handleResultValidation();
    }
};

// ** Restart Functionality **
const handleRestartGame = () => {
    currentPlayer = "X";
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    moveHistory = [];
    statusText.innerText = `Player ${currentPlayer}'s turn`;
    cells.forEach(cell => {
        cell.innerText = "";
        cell.classList.remove('winner');
    });
    updateScoreboard(); // Reset scoreboard if needed
};

// ** Attach Event Listener to Restart Button **
resetButton.addEventListener('click', handleRestartGame);

// You may want to attach your cell click handlers here
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Dark Mode Functionality
const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
};

// Attach event listener to the dark mode toggle button
themeToggle.addEventListener('click', toggleDarkMode);

// Winning conditions and other logic...
// (the rest of your existing JavaScript code remains the same)