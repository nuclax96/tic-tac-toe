"use-strict";

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

  const flipTurn = function () {};
  const isValidMove = function (index) {
    if (gameBoard.boardArr[index] !== "") {
      console.log("Wrong Move");
      return false;
    } else {
      return true;
    }
  };
  const checkGameStatus = function () {};

  const makeMove = function (index) {
    if (!isValidMove(index)) {
      return;
    }
    if (player1.turn) {
      gameBoard.boardArr[index] = player1.sign;
      gameBoard.markCell(index);
      checkGameStatus();
      player1.turn = false;
      player2.turn = true;
      return;
    }
    if (player2.turn) {
      gameBoard.boardArr[index] = player2.sign;
      gameBoard.markCell(index);
      player2.turn = false;
      player1.turn = true;
      return;
    }
  };
  return { startGame, makeMove };
})();

gameController.startGame();
gameController.makeMove(1);
gameController.makeMove(0);
gameController.makeMove(2);
gameController.makeMove(3);
gameController.makeMove(4);
gameController.makeMove(5);
gameController.makeMove(6);
gameController.makeMove(7);
gameController.makeMove(8);
console.log(gameBoard.boardArr);
