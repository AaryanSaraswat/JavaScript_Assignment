////// Global Variables ///////
let timer = 0;
let moves = 0;
let timerID;
let tooglePlayPause = false;
let resetButton = document.getElementById("reset");
let playButton = document.getElementById("play");
let overlay = document.getElementById("game-matrix-overlay");
let game;
//get from localStorage
let localGame = localStorage.getItem("Game");
let localTimer = localStorage.getItem("timer");

let correct = [
  [1, 2, 3, 4],
  [5, 6, 7, 8],
  [9, 10, 11, 12],
  [13, 14, 15, 0],
];

////// Global Variables ///////

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

function getMatrix() {
  // Initialize array with numbers 0 to 15
  let numbers = [];
  for (let i = 0; i <= 15; i++) {
    numbers.push(i);
  }

  // Shuffle the array
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }

  // Convert the shuffled array to a 4x4 matrix
  let matrix = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(numbers[i * 4 + j]);
    }
    matrix.push(row);
  }

  return matrix;
}

//make a matrix and shuffle it
function getRandomMatrix() {
  let matrix = getMatrix();
  if (isSolved(matrix) || !isSolvable(matrix)) return getRandomMatrix(); // Fixed function name
  return matrix;
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

const updateTimer = () => {
  timer++;
  document.getElementById("time").textContent = `Time:${convertTime(timer)}`;
  localStorage.setItem("timer", JSON.stringify(timer));
};

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
      }
    }
    document.getElementById("moves").textContent = `Moves:${this.state.move}`;

    //Render time
    document.getElementById("time").textContent = `Time:${convertTime(timer)}`;

    if (this.state.status === "won") {
      {
        alert("You Won!");
        resetGame();
      }
    }
  }
}

// this is a 2D array to store change in position of a cell
let positionChange = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

//handleclick function to handle click event in matrix
const handleClick = (element) => {
  let id = element.id;
  let ithIndex = parseInt(id[3]) - 1;
  let jthInddex = parseInt(id[4]) - 1;

  for (let idx = 0; idx < 4; idx++) {
    let ni = ithIndex + positionChange[idx][0];
    let nj = jthInddex + positionChange[idx][1];

    if (ni >= 0 && ni < 4 && nj >= 0 && nj < 4) {
      if (game.state.matrix[ni][nj] === 0) {
        let temp = game.state.matrix[ithIndex][jthInddex];
        game.state.matrix[ithIndex][jthInddex] = game.state.matrix[ni][nj];
        game.state.matrix[ni][nj] = temp;
        if (isSolved(game.state.matrix)) {
          clearInterval(tickId);
          game.state.status = "won";
          game.state.move++;
        } else {
          game.state.move++;
        }
        localStorage.setItem("Game", JSON.stringify(game));
        localStorage.setItem("timer", JSON.stringify(timer));
        game.render();
        return;
      }
    }
  }
};

const handleClickPlayBtn = () => {
  if (!tooglePlayPause) {
    timerID = setInterval(updateTimer, 1000);
    playButton.textContent = "Pause";
    overlay.style = "display: none;";
    disableGrid();
    tooglePlayPause = true;
    if ((game.state.status = "ready")) {
      game.setState(State.start());
      localStorage.setItem("Game", JSON.stringify(game));
    }
  } else {
    clearInterval(timerID);
    playButton.textContent = "Play";
    overlay.style = "display: flex;";
    disableGrid();
    overlay.textContent = "Click to Resume";
    tooglePlayPause = false;
  }
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

function resetGame() {
  if (timer != 0) {
    timer = 0;
    clearInterval(timerID);
    localStorage.clear();
    document.getElementById("time").textContent = `Time:${convertTime(timer)}`;
    game = new Game(State.ready());
    playButton.textContent = "Play";
    game.render();
    overlay.style = "display: flex;";
    disableGrid();
    tooglePlayPause = false;
  }
  overlay.textContent = "Click to Play";
}

//check localStorage before initalising with ready state
if (localGame != null || localTimer != null) {
  let ans = confirm("Do you want to resume the last saved game?");
  if (ans) {
    let temp = JSON.parse(localGame);
    timer = JSON.parse(localTimer);
    game = new Game(new State(temp.state.move, temp.state.matrix, "ready"));
    playButton.textContent = "Play";
    game.render();
  } else {
    // if dont want to init with localStorage
    //clear local storage from reset
    localStorage.clear();
    game = new Game(State.ready());
  }
} // if not in localStorage yet
else game = new Game(State.ready());
