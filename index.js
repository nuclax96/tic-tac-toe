"use-strict";
let gameMode = 1;
const huPlayer = "O";
const aiPlayer = "X";
let passedCombination = [];

const gameBoard = (function () {
  let gameOver = false;
  let boardArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];

  const markCell = function (element) {
    if (!element) return;
    if (element.textContent !== "") return;
    element.textContent = gameController.getCurrentPlayerSign();
  };
  const resetTurn = function () {
    player1.turn = true;
    player2.turn = false;
  };
  const highlightCells = function (arr) {
    const cells = document.querySelectorAll(".cell");
    const tempArr = [];
    cells.forEach((e) => {
      if (arr.includes(Number(e.dataset["cellnumber"]))) {
        e.classList.add("win");
      }
    });
  };

  const newGame = function () {
    const statusHeading = document.querySelector(".status-heading");
    statusHeading.textContent = "Start";
    gameBoard.boardArr = ["0", "1", "2", "3", "4", "5", "6", "7", "8"];
    gameBoard.gameOver = false;
    resetTurn();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((item) => {
      item.classList.remove("win");
      item.textContent = "";
    });
  };

  const getFreeCells = function (arr) {
    const tempArr = arr.filter((item) => {
      if (item.match(/[0-9]/g)) {
        return true;
      }
    });
    return tempArr;
  };
  return {
    boardArr,
    getFreeCells,
    newGame,
    markCell,
    gameOver,
    highlightCells,
  };
})();

const Player = function (name, sign, Ai, turn, playerNumber) {
  return { name, sign, Ai, turn, playerNumber };
};

const player1 = Player("Player1", "O", false, true, 1);
let player2;
// const PlayerAI = Player("PlayerAI", "O", true, false, 2);

const gameController = (function () {
  const startGame = function (mode) {
    if (mode === 1) {
      player2 = new Player("AI", "X", true, false, 2);
    } else if (mode === 2) {
      player2 = new Player("Player2", "X", false, false, 2);
    }
  };

  const declareWinner = function (winner, winCells) {
    const statusHeading = document.querySelector(".status-heading");
    gameBoard.gameOver = true;
    statusHeading.textContent = `The winner is ${winner}`;
  };

  const changeStatusHeading = function (text) {
    const statusHeading = document.querySelector(".status-heading");
    statusHeading.textContent = `${text}`;
  };
  const getCurrentPlayerSign = function () {
    if (player1.turn === true) {
      return player1.sign;
    }
    if (player2.turn === true) {
      return player2.sign;
    }
  };

  const getCurrentPlayerNumber = function () {
    if (player1.turn) {
      return 1;
    }
    if (player2.turn) {
      return 2;
    }
  };
  const flipTurn = function (currPlayer) {
    if (currPlayer === 1) {
      player1.turn = false;
      player2.turn = true;
    }
    if (currPlayer === 2) {
      player2.turn = false;
      player1.turn = true;
    }
  };
  const isValidMove = function (index) {
    if (
      gameBoard.boardArr[index] === "O" ||
      gameBoard.boardArr[index] === "X"
    ) {
      return false;
    } else {
      return true;
    }
  };

  const winCond = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Checking the status of the game after each move
  const checkGameStatus = function (board, i) {
    const index = Number(i);
    const tempArr = gameBoard.boardArr;
    let currentPlayerSign = getCurrentPlayerSign();
    return winCond
      .filter((item) => item.includes(index))
      .some((combinations) => {
        let flag = combinations.every((index) => {
          return tempArr[index] === currentPlayerSign;
        });
        if (flag === true) {
          passedCombination = combinations;
        }
        return flag;
      });
  };

  const checkDraw = function () {
    let draw = true;
    gameBoard.boardArr.forEach((item) => {
      if (item.match(/[0-9]/g)) {
        draw = false;
      }
    });
    return draw;
  };

  // Improve this function
  const makeMove = function (index) {
    if (player1.turn) {
      gameBoard.boardArr[index] = player1.sign;
      const status = checkGameStatus(index);

      if (status) {
        declareWinner(player1.name);
        gameBoard.highlightCells(passedCombination);
        return;
      }
      if (checkDraw()) {
        changeStatusHeading("Draw");
      }

      return;
    }
    if (player2.turn) {
      gameBoard.boardArr[index] = player2.sign;
      const status = checkGameStatus(index);
      if (status) {
        declareWinner(player2.name);
        gameBoard.highlightCells(passedCombination);
        return;
      }
      if (checkDraw()) {
        changeStatusHeading("Draw");
      }
      return;
    }
  };
  return {
    winCond,
    startGame,
    makeMove,
    getCurrentPlayerSign,
    flipTurn,
    getCurrentPlayerNumber,
    checkGameStatus,
    declareWinner,
    passedCombination,
    isValidMove,
  };
})();

const methodsAI = (function () {
  const bestMove = function () {
    return miniMax(gameBoard.boardArr, aiPlayer);
  };

  const checkWin = function (arr, sign) {
    const tempArr = arr;
    let currentPlayerSign = sign;
    return gameController.winCond.some((combinations) => {
      let flag = combinations.every((index) => {
        return tempArr[index] === currentPlayerSign;
      });
      if (flag === true) {
        passedCombination = combinations;
      }
      return flag;
    });
  };

  const miniMax = function (newBoard, player) {
    let availSpots = gameBoard.getFreeCells(newBoard);

    //Terminal Nodes conditions
    if (checkWin(newBoard, huPlayer)) {
      return { score: -10 };
    } else if (checkWin(newBoard, aiPlayer)) {
      return { score: 10 };
    } else if (availSpots.length === 0) {
      return { score: 0 };
    }
    //Collect each of the scores from the empty spots

    let moves = [];

    for (let i = 0; i < availSpots.length; i++) {
      let move = {};
      move.index = newBoard[availSpots[i]];
      newBoard[availSpots[i]] = player;

      if (player == aiPlayer) {
        let result = miniMax(newBoard, huPlayer);
        move.score = result.score;
      } else {
        let result = miniMax(newBoard, aiPlayer);
        move.score = result.score;
      }

      newBoard[availSpots[i]] = move.index;
      moves.push(move);
    }

    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = 10000;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    return moves[bestMove];
  };

  return { bestMove, miniMax };
})();

const boardListeners = (function () {
  // Elements
  const boardCellContainer = document.querySelector(".container");
  const newGameBtn = document.querySelector(".new-game-btn");

  //Listeners
  newGameBtn.addEventListener("click", gameBoard.newGame);

  boardCellContainer.addEventListener("click", (e) => {
    if (gameBoard.gameOver) return;
    if (!e.target.classList.contains("cell")) return;
    const cellNumber = e.target.dataset["cellnumber"];
    if (!gameController.isValidMove(cellNumber)) {
      return;
    }
    let playerNumber = gameController.getCurrentPlayerNumber();
    gameController.makeMove(cellNumber);
    gameBoard.markCell(e.target);
    gameController.flipTurn(playerNumber);

    //Game Mode ===1 means AI turn
    if (gameMode === 1) {
      playerNumber = 2;
      //Minimax gives the next index to be marked;
      const index = methodsAI.bestMove().index;
      gameController.makeMove(index);
      const cellEl = document.querySelectorAll(".cell");
      let updateEl;
      cellEl.forEach((item) => {
        if (item.dataset["cellnumber"] === index) {
          updateEl = item;
        }
      });

      gameBoard.markCell(updateEl);

      const status = gameController.checkGameStatus(gameBoard.boardArr, index);
      gameController.flipTurn(playerNumber);

      if (status) {
        gameController.declareWinner(player2.name);
        gameBoard.highlightCells(passedCombination);
        return;
      }

      // What to do with the returnred index ?????
      return;
    }
  });
})();
gameController.startGame(gameMode);
