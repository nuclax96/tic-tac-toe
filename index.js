"use-strict";

const gameBoard = (function () {
  let gameOver = false;
  let boardArr = ["", "", "", "", "", "", "", "", ""];
  const display = function () {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // console.log(boardArr[3 * i + j]);
      }
      //   console.log("Line break");
    }
  };
  const markCell = function (element) {
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
    gameBoard.boardArr = boardArr.map((item) => {
      return "";
    });
    gameBoard.gameOver = false;
    resetTurn();
    const cells = document.querySelectorAll(".cell");
    cells.forEach((item) => {
      item.classList.remove("win");
      item.textContent = "";
    });
  };
  return { boardArr, display, newGame, markCell, gameOver, highlightCells };
})();

const Player = function (name, sign, Ai, turn, playerNumber) {
  return { name, sign, Ai, turn, playerNumber };
};

const player1 = Player("Player1", "X", false, true, 1);
const player2 = Player("Player2", "O", false, false, 2);

const gameController = (function () {
  const startGame = function () {
    console.log("Game Started");
    gameBoard.display();
  };

  let passedCombination = [];

  const declareWinner = function (winner, winCells) {
    const statusHeading = document.querySelector(".status-heading");
    gameBoard.gameOver = true;
    statusHeading.textContent = `The winner is Player ${winner}`;
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
    if (gameBoard.boardArr[index] !== "") {
      console.log("Wrong Move");
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
  const checkGameStatus = function (i) {
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

  const makeMove = function (index) {
    if (!isValidMove(index)) {
      return;
    }
    if (player1.turn) {
      gameBoard.boardArr[index] = player1.sign;
      const status = checkGameStatus(index);

      if (status) {
        declareWinner(1);
        gameBoard.highlightCells(passedCombination);
      }

      return;
    }
    if (player2.turn) {
      gameBoard.boardArr[index] = player2.sign;
      checkGameStatus();
      const status = checkGameStatus(index);
      if (status) {
        declareWinner(2);
        gameBoard.highlightCells(passedCombination);
      }
      return;
    }
  };
  return {
    startGame,
    makeMove,
    getCurrentPlayerSign,
    flipTurn,
    getCurrentPlayerNumber,
  };
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
    const playerNumber = gameController.getCurrentPlayerNumber();
    gameController.makeMove(cellNumber);
    gameBoard.markCell(e.target);
    gameController.flipTurn(playerNumber);
  });
})();
gameController.startGame();
