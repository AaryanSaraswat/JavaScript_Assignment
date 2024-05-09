let correct = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 99],
];

class Cell {
  constructor(i, j) {
    this.i = i;
    this.j = j;
  }

  checkIndexing(x, y) {
    return x >= 0 && x < 4 && y >= 0 && y < 4;
  }

  getUp() {
    if (this.checkIndexing(this.i, this.j - 1))
      return new Cell(this.i, this.j - 1);
    return null;
  }
  getDown() {
    if (this.checkIndexing(this.i, this.j + 1))
      return new Cell(this.i, this.j + 1);
    return null;
  }
  getLeft() {
    if (this.checkIndexing(this.i - 1, this.j))
      return new Cell(this.i - 1, this.j);
    return null;
  }
  getRight() {
    if (this.checkIndexing(this.i + 1, this.j))
      return new Cell(this.i + 1, this.j);
    return null;
  }

  getAllAdjacentCells() {
    let arr = [this.getUp(), this.getDown(), this.getLeft(), this.getRight()];

    arr = arr.filter((cell) => cell !== null); // Fixed filter function

    return arr; // Added return statement
  }

  getRandomAdjacentCells() {
    const adj = this.getAllAdjacentCells();
    let idx = Math.floor(Math.random() * adj.length);
    const c = adj[idx];
    return c;
  }
}

class State {
  constructor(move, matrix, status) {
    // this.time = time;
    this.move = move;
    this.matrix = matrix;
    this.status = status;
  }

  static ready() {
    return new State(
      0,
      [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      "ready"
    );
  }

  static start() {
    return new State(0, getRandomMatrix(), "playing");
  }
}

//function to swap 2 functions in a cell
const swapCells = (grid, cell1, cell2) => {
  let temp = grid[cell1.i][cell1.j];
  grid[cell1.i][cell1.j] = grid[cell2.i][cell2.j];
  grid[cell2.i][cell2.j] = temp;
};

//make a matrix and shuffle it
function getRandomMatrix() {
  // Fixed function name
  let matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 0],
  ];
  // return matrix;
  let emptyCell = new Cell(3, 3);
  for (let i = 0; i < 1000; i++) {
    const cellToBeSwappedWith = emptyCell.getRandomAdjacentCells();
    swapCells(matrix, emptyCell, cellToBeSwappedWith);
    emptyCell = cellToBeSwappedWith;
  }

  if (isSolved(matrix) || !isSolvable(matrix)) return matrix; // Fixed function name
  return getRandomMatrix();
}

//function to check whether the matrix is completed?
const isSolved = (matrix) => {
  return (
    matrix[0][0] === 1 &&
    matrix[0][1] === 2 &&
    matrix[0][2] === 3 &&
    matrix[0][3] === 4 &&
    matrix[1][0] === 5 &&
    matrix[1][1] === 6 &&
    matrix[1][2] === 7 &&
    matrix[1][3] === 8 &&
    matrix[2][0] === 9 &&
    matrix[2][1] === 10 &&
    matrix[2][2] === 11 &&
    matrix[2][3] === 12 &&
    matrix[3][0] === 13 &&
    matrix[3][1] === 14 &&
    matrix[3][2] === 15 &&
    matrix[3][3] === 0
  );
};

//function to check whether the matrix is solvable by inversionCount
const isSolvable = (matrix) => {
  let arr = [];
  for (let i = 0; i <= 3; i++) {
    for (let j = 0; j <= 3; j++) {
      arr.push(matrix[i][j]);
    }
  }

  let cnt = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) cnt++;
  }

  return (cnt & 1) == 0;
};

const convertTime = () => {
  let h = Math.floor(timer / 60);
  let m = timer % 60;
  if (isNaN(m)) m = 0;
  // console.log(h, m);
  return `${h < 10 ? "0" + h : h}:${m < 10 ? "0" + m : m}`;
};

let timer = 0;
let moves = 0;
let timerID;

convertTime(timer);
const updateTimer = () => {
  timer++;
  document.getElementById("time").textContent = `Time:${convertTime(timer)}`;
  localStorage.setItem("timer", JSON.stringify(timer));
};

let flag = false;

class Game {
  constructor(state) {
    this.state = state;
  }

  init() {
    // let ans = new Game(State.ready());
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const matCell = document.getElementById(`row${i + 1}${j + 1}`);
        matCell.textContent =
          this.state.matrix[i][j] === 0
            ? ` `
            : this.state.matrix[i][j].toString();
        // matCell.addEventListener("click", this.handleClickCell(new Cell(i, j)));
      }
    }
    // return ans;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.render();
  }

  render() {
    // Render matrix
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const matCell = document.getElementById(`row${i + 1}${j + 1}`);
        matCell.textContent =
          this.state.matrix[i][j] === 0
            ? ` `
            : this.state.matrix[i][j].toString();
        if (this.state.matrix[i][j] == correct[i][j]) {
          matCell.style.backgroundColor = "#d4ee9f";
        } else matCell.style.backgroundColor = "#cfcfcf";

        // matCell.addEventListener("click", this.handleClickCell(new Cell(i, j)));
      }
    }

    // Render button
    if (flag == false) {
      if (this.state.status === "playing") playButton.textContent = "Pause";
      playButton.removeEventListener("click", playBtnEventId);
      playButton.addEventListener("click", pause);
    }

    // Render move
    // console.log(this.state.move);
    document.getElementById("moves").textContent = `Moves:${this.state.move}`;

    if (this.state.status === "won") {
      {
        alert("You Won!");
        resetGame();
      }
    }
  }
}

let dx = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const handleClick = (e) => {
  let id = e.id;
  let i = parseInt(id[3]) - 1;
  let j = parseInt(id[4]) - 1;
  //   console.log("Clicked cell:", id, "at position:", i, j);

  for (let idx = 0; idx < 4; idx++) {
    let ni = i + dx[idx][0];
    let nj = j + dx[idx][1];

    // console.log("Available cells", ni, nj);
    if (ni >= 0 && ni < 4 && nj >= 0 && nj < 4) {
      //   console.log("Checking adjacent cell at position:", ni, nj);
      if (game.state.matrix[ni][nj] === 0) {
        // console.log("Found adjacent empty cell at:", ni, nj);
        // Swap the values directly in the matrix
        let temp = game.state.matrix[i][j];
        game.state.matrix[i][j] = game.state.matrix[ni][nj];
        game.state.matrix[ni][nj] = temp;
        if (isSolved(game.state.matrix)) {
          clearInterval(tickId);
          game.state.status = "won";
          game.state.move++;
        } else {
          game.state.move++;
        }
        localStorage.setItem("Game", JSON.stringify(game));
        game.render();
        return;
      }
    }
  }
  //   console.log("No adjacent empty cell found.");
};

let overlay = document.getElementById("game-matrix-overlay");

const overlayHiddenResume = () => {
  overlay.style = "display: none;";
  resume();
};

const pause = () => {
  clearInterval(timerID);
  playButton.textContent = "Play";
  playButton.removeEventListener("click", pause);
  playButton.addEventListener("click", resume);
  overlay.style = "display: flex;";
  disableGrid();
  overlay.textContent = "Click to Resume";
};

const resume = () => {
  timerID = setInterval(updateTimer, 1000);
  playButton.textContent = "Pause";
  playButton.removeEventListener("click", resume);
  playButton.addEventListener("click", pause);
  playButton.addEventListener("click", pause);
  overlay.style = "display: none;";
  disableGrid();
};

const disableGrid = () => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const matCell = document.getElementById(`row${i + 1}${j + 1}`);
      if (matCell.hasAttribute("disabled")) matCell.removeAttribute("disabled");
      else matCell.setAttribute("disabled", "true");
    }
  }
};

// console.log(game.state.status);
let playButton = document.getElementById("play");

let playBtnEventId = () => {
  timerID = setInterval(updateTimer, 1000);
  game.setState(State.start());
  overlay.style = "display: none;";
  disableGrid();
};
playButton.addEventListener("click", playBtnEventId);
overlay.addEventListener("click", playBtnEventId);

function resetGame() {
  if (timer != 0) {
    timer = 0;
    clearInterval(timerID);
    localStorage.clear();
    document.getElementById("time").textContent = `Time:${convertTime(timer)}`;
    game = new Game(State.ready());
    playButton.textContent = "Play";
    game.render();
    playButton.removeEventListener("click", playBtnEventId);
    playButton.removeEventListener("click", pause);
    playButton.removeEventListener("click", resume);
    playButton.addEventListener("click", playBtnEventId);
    overlay.style = "display: flex;";
    overlay.removeEventListener("click", overlayHiddenResume);
    overlay.addEventListener("click", playBtnEventId);
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const matCell = document.getElementById(`row${i + 1}${j + 1}`);
        matCell.setAttribute("disabled", "true");
      }
    }
  }
  overlay.textContent = "Click to Play";
}

let resetButton = document.getElementById("reset");
resetButton.addEventListener("click", resetGame);

let game;
//get from localStorage
let localGame = localStorage.getItem("Game");
let localTimer = localStorage.getItem("timer");

//check localStorage before initalising with ready state
if (localGame != null) {
  let ans = confirm("Do you want to resume the last saved game?");
  if (ans) {
    let temp = JSON.parse(localGame);
    timer = JSON.parse(localTimer);
    console.log(localTimer);

    game = new Game(new State(temp.state.move, temp.state.matrix, "ready"));
    playButton.textContent = "Play";
    game.render();
    playButton.removeEventListener("click", pause);
    playButton.addEventListener("click", resume);
    overlay.removeEventListener("click", playBtnEventId);
    overlay.addEventListener("click", overlayHiddenResume);
  } // if dont want to init with localStorage
  else {
    //clear local storage from reset
    game = new Game(State.ready());
  }
} // if not in localStorage yet
else game = new Game(State.ready());
