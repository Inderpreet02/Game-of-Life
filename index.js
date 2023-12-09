"use strict";
const BOARD_ROWS = 32;
const BOARD_COLS = BOARD_ROWS;
function createBoard() {
    const board = [];
    for (let r = 0; r < BOARD_ROWS; r++) {
        board.push(new Array(BOARD_ROWS).fill(0));
    }
    return board;
}
const stateColors = ["#202020", "red", "#145114", "#41414"];
const canvasid = "app";
const app = document.getElementById(canvasid);
if (app === null) {
    throw new Error(`Could not find canvas ${canvasid}`);
}
const ctx = app.getContext("2d");
app.height = 800;
app.width = 800;
if (ctx === null) {
    throw new Error(`Could not initialize 2d context`);
}
const nextId = "next";
const next = document.getElementById(nextId);
if (next == null) {
    throw new Error(`Could not find de buttin ${nextId}`);
}
const CELL_WIDTH = app.width / BOARD_COLS;
const CELL_HEIGHT = app.height / BOARD_ROWS;
let currentBoard = createBoard();
let nextBoard = createBoard();
function countNbors(board, nbors, r0, c0) {
    nbors.fill(0);
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr != 0 || dc != 0) {
                const r = r0 + dr;
                const c = c0 + dc;
                if (0 <= r && r <= BOARD_ROWS) {
                    if (0 <= c && c <= BOARD_COLS) {
                        nbors[board[r % BOARD_ROWS][c % BOARD_COLS]]++;
                    }
                }
            }
        }
    }
}
function computeNextBoard(states, current, next) {
    const DEAD = 0;
    const ALIVE = 1;
    const nbors = new Array(states).fill(0);
    console.log(current, next);
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            countNbors(current, nbors, r, c);
            switch (current[r][c]) {
                case DEAD:
                    if (nbors[ALIVE] === 3) {
                        next[r][c] = ALIVE;
                    }
                    else {
                        next[r][c] = DEAD;
                    }
                    break;
                case ALIVE:
                    if (nbors[ALIVE] === 2 || nbors[ALIVE] === 3) {
                        next[r][c] = ALIVE;
                    }
                    else {
                        next[r][c] = DEAD;
                    }
                    break;
            }
        }
    }
    console.log(nbors);
}
function render(ctx, board) {
    if (ctx === null) {
        return;
    }
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, app.height, app.width);
    for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
            ctx.fillStyle = stateColors[board[r][c]];
            const x = c * CELL_WIDTH;
            const y = r * CELL_HEIGHT;
            ctx.fillRect(x, y, CELL_WIDTH, CELL_HEIGHT);
        }
    }
}
app.addEventListener("click", (e) => {
    const col = Math.floor(e.offsetX / CELL_WIDTH);
    const row = Math.floor(e.offsetY / CELL_HEIGHT);
    currentBoard[row][col] = 1;
    render(ctx, currentBoard);
});
next.addEventListener("click", () => {
    computeNextBoard(2, currentBoard, nextBoard);
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
    render(ctx, currentBoard);
});
render(ctx, currentBoard);
