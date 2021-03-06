//_________________________________________________________________global variables
const BOARD_SIZE = 8;
const WHITE_PLAYER = "white";
const DARK_PLAYER = "dark";
const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const KING = "king";
const QUEEN = "queen";
const CHESS_BOARD_ID = 'chess-board';
const PIECES = ["rook", "knight", "bishop", "king", "queen", "bishop", "knight", "rook"]
let table;
let pieces = [];
let game;
let selectedPiece;
let getPiece = undefined;
let beforeEat = false;
let cantEat = false;
let c = 1;


//receive a cell that we want to add the img to,the type of the piece(pawn,king,etc...),the name-"white-type"/"dark-type",row and col (the same of the cell)
function addImage(cell, type, name, row, col) {
  const image = document.createElement("img");
  image.src = "images/" + type + "/" + name + ".svg";
  image.setAttribute("id", row + " " + col);
  cell.appendChild(image);
}

let selectedCell = undefined;


function tryUpdateSelectedPiece(row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove('options');
      table.rows[i].cells[j].classList.remove('onIt');
      table.rows[i].cells[j].classList.remove('beforeEat');

      //remove the castling-("you can castle") Paragraphs
      let removeWhiteCastling = document.getElementById("whiteCastling")
      if (removeWhiteCastling !== null) {
        removeWhiteCastling.remove();
      }
      let removeDarkCastling = document.getElementById("darkCastling")
      if (removeDarkCastling !== null) {
        removeDarkCastling.remove();
      }

    }

  }


  // Show possible moves
  const piece = game.boardData.getPiece(row, col);
  if (piece !== undefined && game.boardData.getTurn() === piece.getPlayer()) {
    let possibleMoves = piece.getPossibleMoves(game.boardData);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];

      if (!piece.cantEat) {
        cell.classList.add('options');
      }
    }
  }
  table.rows[row].cells[col].classList.add('onIt');
  selectedPiece = piece;
  game.canCastle(game.kingHasBeenMoved, game.rookHasBeenMoved, selectedPiece);

}


function onCellClick(row, col) {
  //clear previous selected move
  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.
  if (selectedPiece !== undefined && game.movePiece(row, col, selectedPiece)) {
    selectedPiece = undefined;
    // Recreate whole board
    createChessBoard(game.boardData);
  }
  else {

    tryUpdateSelectedPiece(row, col);
    if (game.winner !== undefined && c === 1) {
      winnerPopup(game.winner);
      c++;
    }
  }
}

//create a div that pop up and says that the player x wins
function winnerPopup(gameWinner) {
  const winnerPopup = document.createElement('div');
  winnerPopup.textContent = gameWinner + ' player wins!';
  winnerPopup.classList.add('winner-popup');
  table.appendChild(winnerPopup)

}

//create the chess board
function createChessBoard(boardData) {
  table = document.getElementById(CHESS_BOARD_ID);
  if (table !== null) {
    table.remove();
  }

  let body = document.getElementsByTagName("body")[0];

  table = document.createElement("table");
  table.id = CHESS_BOARD_ID;

  tblBody = document.createElement("tbody");
  let thead = document.createElement("thead");
  table.appendChild(thead);
  table.appendChild(tblBody);
  body.appendChild(table);

  for (let row = 0; row < 8; row++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let text = document.createTextNode(String.fromCharCode(97 + row));
    th.appendChild(text);
    for (let col = 0; col < 8; col++) {
      let td = document.createElement("td");
      tr.appendChild(td);
      tr.appendChild(th);
      td.setAttribute("id", col);
      if ((row + col) % 2 == 0) {
        td.className = "black";
      } else {
        td.className = "white";
      }
      td.addEventListener("click", () => onCellClick(row, col));
    }
    tblBody.appendChild(tr);
    thead.appendChild(th);
  }

  table.setAttribute("border", "4");

  // add images to the board
  for (let piece of boardData.pieces) {
    addImage(
      tblBody.rows[piece.row].cells[piece.col],
      piece.player,
      piece.type,
      piece.row,
      piece.col
    );
  }

}


function initGame() {
  game = new Game();
  createChessBoard(game.boardData);

  //btn that reload the page ("Replay" button)
  let replayBtn = document.getElementById("replayBtn");
  replayBtn.addEventListener("click", () => { document.location.reload(); });
}

window.addEventListener("load", initGame);

