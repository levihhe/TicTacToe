const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector("#statusText");
const restartBtn = document.querySelector("#restartBtn");
const menuContainer = document.querySelector("#menuContainer");
const twoPlayerBtn = document.querySelector("#twoPlayerBtn");
const onePlayerBtn = document.querySelector("#onePlayerBtn");
const gameContainer = document.querySelector("#gameContainer");
let vsComputer = false;
const winConditions = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];
let options = ["","","","","","","","",""];
let currentPlayer = "X";
let running = false;

twoPlayerBtn.addEventListener("click", () => {
    vsComputer = false;
    startGame();
});

onePlayerBtn.addEventListener("click", () => {
    vsComputer = true;
    startGame();
});

function startGame() {
    menuContainer.style.display = "none";
    gameContainer.style.display = "block";
    initializeGame();
}

function initializeGame() {
    cells.forEach(cell => cell.addEventListener("click",cellClicked));
    restartBtn.addEventListener("click",restartGame);
    statusText.textContent =  `${currentPlayer} jön`;
    running = true;
}
function cellClicked(){
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] != "" || !running) {
        return;
    }

    updateCell(this,cellIndex);
    checkWinner();

    if (vsComputer && running) {
        computerMove();
    }
}
function computerMove() {
    function findWinningMove(player) {
        for (let condition of winConditions) {
            let [a, b, c] = condition;
            if (options[a] === player && options[b] === player && options[c] === "") return c;
            if (options[a] === player && options[c] === player && options[b] === "") return b;
            if (options[b] === player && options[c] === player && options[a] === "") return a;
        }
        return null;
    }

    let winningMove = findWinningMove("O");
    if (winningMove !== null) {
        options[winningMove] = "O";
        cells[winningMove].textContent = "O";
        checkWinner();
        return;
    }

    let blockingMove = findWinningMove("X");
    if (blockingMove !== null) {
        options[blockingMove] = "O";
        cells[blockingMove].textContent = "O";
        checkWinner();
        return;
    }

    if (options[4] === "") {
        options[4] = "O";
        cells[4].textContent = "O";
        checkWinner();
        return;
    }

    for (let i = 0; i < options.length; i++) {
        if (options[i] === "") {
            options[i] = "O";
            cells[i].textContent = "O";
            checkWinner();
            return;
        }
    }
}
function updateCell(cell,index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}
function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer} jön`;
}
function checkWinner() {
    let roundWon = false;

    for(let i = 0;i<winConditions.length;i++) {
        const condition = winConditions[i];
        const cellA = options[condition[0]];
        const cellB = options[condition[1]];
        const cellC = options[condition[2]];

        if(cellA == ""  || cellB == ""  || cellC == "") {
            continue;
        }
        if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    } 

    if(roundWon) {
        statusText.textContent = `${currentPlayer} nyert`;
        running = false;
    }
    else if(!options.includes("")) {
        statusText.textContent = "Döntetlen";
        running = false;
    }
    else {
        changePlayer();
    }
}
function restartGame() {
    currentPlayer = "X";
    options = ["","","","","","","","",""];
    statusText.textContent = `${currentPlayer} jön`;
    cells.forEach(cell => cell.textContent = "");
    running = true;
}