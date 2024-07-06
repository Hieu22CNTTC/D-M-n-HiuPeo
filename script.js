const gameBoard = document.getElementById('gameBoard');
const restartGame = document.getElementById('restartGame');
const message = document.getElementById('message');
const rows = 10;
const cols = 10;
const minesCount = 20;
let board = [];
let mines = [];
let revealedCellsCount = 0;

const createBoard = () => {
    gameBoard.innerHTML = '';
    board = [];
    mines = [];
    revealedCellsCount = 0;
    message.textContent = '';
    
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = {
                revealed: false,
                mine: false,
                adjacentMines: 0,
                element: document.createElement('div')
            };
            board[i][j].element.classList.add('cell');
            board[i][j].element.addEventListener('click', () => revealCell(i, j));
            gameBoard.appendChild(board[i][j].element);
        }
    }
    placeMines();
    calculateAdjacentMines();
};

const placeMines = () => {
    let placedMines = 0;
    while (placedMines < minesCount) {
        const row = Math.floor(Math.random() * rows);
        const col = Math.floor(Math.random() * cols);
        if (!board[row][col].mine) {
            board[row][col].mine = true;
            mines.push({ row, col });
            placedMines++;
        }
    }
};

const calculateAdjacentMines = () => {
    for (const mine of mines) {
        const { row, col } = mine;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !board[newRow][newCol].mine) {
                    board[newRow][newCol].adjacentMines++;
                }
            }
        }
    }
};

const revealCell = (row, col) => {
    if (board[row][col].revealed) return;
    board[row][col].revealed = true;
    board[row][col].element.classList.add('revealed');
    revealedCellsCount++;

    if (board[row][col].mine) {
        board[row][col].element.classList.add('mine');
        message.textContent = 'Ôi không! Bạn Đã Đạp Vào Mìn Rồi 😥';
        revealAllMines();
    } else {
        if (board[row][col].adjacentMines > 0) {
            board[row][col].element.textContent = board[row][col].adjacentMines;
        } else {
            for (let i = -1; i <= 1; i++) {
                for (let j = -1; j <= 1; j++) {
                    const newRow = row + i;
                    const newCol = col + j;
                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    }

    checkWin();
};

const revealAllMines = () => {
    for (const mine of mines) {
        board[mine.row][mine.col].revealed = true;
        board[mine.row][mine.col].element.classList.add('revealed', 'mine');
    }
};

const checkWin = () => {
    if (revealedCellsCount === rows * cols - minesCount) {
        message.textContent = 'Chúc mừng! Bạn đã chiến thắng trò chơi😍💐!';
    }
};

restartGame.addEventListener('click', createBoard);

createBoard();
