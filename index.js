"use-strict";

// Event Listeners

const gameBoard = (function () {
  const boardArr = ["", "", "", "", "", "", "", "", ""];
  const display = function () {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        // console.log(boardArr[3 * i + j]);
      }
      //   console.log("Line break");
    }
  };
  const markCell = function () {};

  const resetBoard = function () {};
  return { boardArr, display, resetBoard, markCell };
})();

const Player = function (name, sign, Ai, turn) {
  return { name, sign, Ai, turn };
};

const player1 = Player("Player1", "X", false, true);
const player2 = Player("Player2", "O", false, false);

const gameController = (function () {
  const startGame = function () {
    console.log("Game Started");
    gameBoard.display();
  };

  const declareWinner = function (winner) {
    console.log("The winner is Player ", winner);
  };
  const getCurrentPlayerSign = function () {
    if (player1.turn === true) {
      return player1.sign;
    }
    if (player2.turn === true) {
      return player2.sign;
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
    let flag = true;
    let currentPlayerSign = getCurrentPlayerSign();

    return winCond
      .filter((item) => item.includes(index))
      .some((combinations) => {
        return combinations.every((index) => {
          return tempArr[index] === currentPlayerSign;
        });
      });
  };

  const makeMove = function (index) {
    if (!isValidMove(index)) {
      return;
    }
    if (player1.turn) {
      gameBoard.boardArr[index] = player1.sign;
      gameBoard.markCell(index);
      const status = checkGameStatus(index);
      if (status) {
        declareWinner(1);
      }

      flipTurn(1);
      return;
    }
    if (player2.turn) {
      gameBoard.boardArr[index] = player2.sign;
      gameBoard.markCell(index);
      checkGameStatus();
      const status = checkGameStatus(index);
      if (status) {
        declareWinner(2);
      }
      flipTurn(2);
      return;
    }
  };
  return { startGame, makeMove };
})();

const boardListeners = (function () {
  // Elements
  const boardCellContainer = document.querySelector(".container");

  boardCellContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("cell")) return;
    const cellNumber = e.target.dataset["cellnumber"];
    gameController.makeMove(cellNumber);
    console.log(gameBoard.boardArr);
  });
})();
gameController.startGame();
// gameController.makeMove(0); //X
// gameController.makeMove(4); //O
// gameController.makeMove(1); //X
// gameController.makeMove(8); //o
// gameController.makeMove(2);
// gameController.makeMove(3);
// gameController.makeMove(6);
// gameController.makeMove(7);
// gameController.makeMove(5);
// // console.log(gameBoard.boardArr);
