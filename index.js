"use-strict";

const gameBoard = (function () {
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
    element.textContent = gameController.getCurrentPlayerSign();
  };
  const resetTurn = function () {
    player1.turn = true;
    player2.turn = false;
  };

  const newGame = function () {
    boardArr = boardArr.map((item) => {
      return "";
    });
    resetTurn();
    console.log(boardArr);
    const cells = document.querySelectorAll(".cell");

    cells.forEach((item) => {
      item.textContent = "";
    });
  };
  return { boardArr, display, newGame, markCell };
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
      const status = checkGameStatus(index);
      if (status) {
        declareWinner(1);
      }

      return;
    }
    if (player2.turn) {
      gameBoard.boardArr[index] = player2.sign;
      checkGameStatus();
      const status = checkGameStatus(index);
      if (status) {
        declareWinner(2);
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
    if (!e.target.classList.contains("cell")) return;
    const cellNumber = e.target.dataset["cellnumber"];
    const playerNumber = gameController.getCurrentPlayerNumber();
    gameController.makeMove(cellNumber);
    gameBoard.markCell(e.target);
    gameController.flipTurn(playerNumber);
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
