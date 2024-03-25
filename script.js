function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
]

let nord = [ "#2e3440", "#3b4252", "#434c5e", "#4c566a", "#d8dee9", "#e5e9f0", "#eceff4", "#8fbcbb", "#88c0d0", "#81a1c1", "#5e81ac", "#bf616a", "#d08770", "#ebcb8b", "#a3be8c", "#b48ead" ];
tileColours = [ nord[10], nord[15], nord[14], nord[13], nord[12], nord[11] ];

function renderBoard() {
    let boardElement = document.getElementsByClassName("game-board")[0];
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
            let element = boardElement.rows[i].cells[j];
            if (board[i][j] !== 0) {
                element.innerHTML = board[i][j].toString();
                element.style.backgroundColor = tileColours[(Math.log2(board[i][j]) - 1) % tileColours.length];
            }
            else {
                element.innerHTML = "&nbsp;";
                element.style.backgroundColor = nord[7];
            }
        }
}

function processInput(direction) {
    if (direction === "w")
        for (let j = 0; j < 4; j++) {
            let queue = [];
            for (let i = 0; i < 4; i++)
                if (board[i][j] !== 0) {
                    queue.push(board[i][j]);
                    board[i][j] = 0;
                }

            for (let k = 0; k + 1 < queue.length; k++)
                if (queue[k] === queue[k + 1]) {
                    queue[k] *= 2;
                    queue.splice(k + 1, 1);
                }

            for (let i = 0; i < queue.length; i++)
                board[i][j] = queue[i];
        }

    if (direction === "s")
        for (let j = 0; j < 4; j++) {
            let queue = [];
            for (let i = 3; i >= 0; i--)
                if (board[i][j] !== 0) {
                    queue.push(board[i][j]);
                    board[i][j] = 0;
                }

            for (let k = 0; k + 1 < queue.length; k++)
                if (queue[k] === queue[k + 1]) {
                    queue[k] *= 2;
                    queue.splice(k + 1, 1);
                }

            for (let i = 0; i < queue.length; i++)
                board[3 - i][j] = queue[i];
        }

    if (direction === "a")
        for (let i = 0; i < 4; i++) {
            let queue = [];
            for (let j = 0; j < 4; j++)
                if (board[i][j] !== 0) {
                    queue.push(board[i][j]);
                    board[i][j] = 0;
                }

            for (let k = 0; k + 1 < queue.length; k++)
                if (queue[k] === queue[k + 1]) {
                    queue[k] *= 2;
                    queue.splice(k + 1, 1);
                }

            for (let j = 0; j < queue.length; j++)
                board[i][j] = queue[j];
        }

    if (direction === "d")
        for (let i = 0; i < 4; i++) {
            let queue = [];
            for (let j = 3; j >= 0; j--)
                if (board[i][j] !== 0) {
                    queue.push(board[i][j]);
                    board[i][j] = 0;
                }

            for (let k = 0; k + 1 < queue.length; k++)
                if (queue[k] === queue[k + 1]) {
                    queue[k] *= 2;
                    queue.splice(k + 1, 1);
                }

            for (let j = 0; j < queue.length; j++)
                board[i][3 - j] = queue[j];
        }
}

function directionIsDeadlocked(direction) {
    let prevBoard = structuredClone(board);
    processInput(direction);
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (board[i][j] !== prevBoard[i][j]) {
                board = structuredClone(prevBoard);
                return false;
            }
    return true;
}

function isInTerminateState() {
    if (!directionIsDeadlocked("w"))
        return false;
    if (!directionIsDeadlocked("s"))
        return false;
    if (!directionIsDeadlocked("a"))
        return false;
    if (!directionIsDeadlocked("d"))
        return false;
    return true;
}

function updateBoard(direction) {
    if (isInTerminateState())
        alert("Game over!");

    if (directionIsDeadlocked(direction))
        return;

    processInput(direction);

    let emptyTilesCount = 0;
    for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
            if (!board[i][j])
                emptyTilesCount += 1;
    
    if (emptyTilesCount) {
        let newTileId = randInt(0, emptyTilesCount - 1);
        for (let id = 0, i = 0; i < 4; i++)
            for (let j = 0; j < 4; j++)
                if (!board[i][j]) {
                    if (id === newTileId)
                        board[i][j] = randInt(1, 2) * 2;
                    id += 1;
                }
    }

    renderBoard();

    if (isInTerminateState())
        alert("Game over!");
}

function resetBoard() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    let tile0 = randInt(0, 15);
    let x0 = tile0 % 4, y0 = (tile0 - x0) / 4;
    let tile1 = randInt(0, 14);
    if (tile1 >= tile0)
        tile1 += 1;
    let x1 = tile1 % 4, y1 = (tile1 - x1) / 4;

    board[x0][y0] = randInt(1, 2) * 2;
    board[x1][y1] = randInt(1, 2) * 2;

    renderBoard();
}

window.onload = function() {
    resetBoard();
};

document.addEventListener("keyup", function(event) {
    let key = event.key;
    if (key === "ArrowUp" || key === "W")
        key = "w";
    if (key === "ArrowDown" || key === "S")
        key = "s";
    if (key === "ArrowLeft" || key === "A")
        key = "a";
    if (key === "ArrowRight" || key === "D")
        key = "d";
    if (key === "R")
        key = "r";

    console.log(key);

    if (["w", "s", "a", "d"].includes(key))
        updateBoard(key);

    if (key === "r")
        resetBoard();
});