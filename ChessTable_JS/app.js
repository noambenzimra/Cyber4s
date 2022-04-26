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
let boardData;
let selectedPiece;
let getPiece = undefined;
let beforeEat = false;

//____________________________________________________________________global function. like-addImage,addimageByIndex,onCellClick
function addImage(cell, type, name, row, col) {
  //receive a cell that we want to add the img to,the type of the piece(pawn,king,etc...),the name-"white-type"/"dark-type",row and col (the same of the cell)
  const image = document.createElement("img");
  image.src = "images/" + type + "/" + name + ".svg";
  image.setAttribute("id", row + " " + col);
  cell.appendChild(image);
}

//check if you can go there
function inRules(row, col, piece) {
  let possibleMoves = [];
  possibleMoves = piece.getPossibleMoves(boardData);
  for (const possibleMove of possibleMoves) {
    if (possibleMove[0] === row && possibleMove[1] === col) {
      return true;
    }
  }
  return false;
}
let selectedCell = undefined;

function tryUpdateSelectedPiece(row, col) {
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove('options');
      table.rows[i].cells[j].classList.remove('onIt');
      table.rows[i].cells[j].classList.remove('beforeEat');

    }
  }
  // Show possible moves
  const piece = boardData.getPiece(row, col);
  if (piece !== undefined && boardData.getTurn() === piece.getPlayer()) {
    let possibleMoves = piece.getPossibleMoves(boardData);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add('options');

    }
  }
  table.rows[row].cells[col].classList.add('onIt');
  selectedPiece = piece;
}


function onCellClick(row, col) {
  //clear previous selected move
  let opponentMoves = []
  let rowList = []
  let colList = []
  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.
  if (selectedPiece !== undefined && boardData.movePiece(row, col, selectedPiece)) {
    selectedPiece = undefined;
    if (beforeEat) {
      const cell = table.rows[row].cells[col];
      cell.classList.add('beforeEat');
    }

    // Recreate whole board - this is not efficient, but doesn't affect user experience
    createChessBoard(boardData);
  }
  else {
    tryUpdateSelectedPiece(row, col);
  }
}
function initGame() {
  // Create list of pieces (32 total)
  boardData = new BoardData();
  createChessBoard(boardData);
}



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

    // tr.appendChild(img.src);
    for (let col = 0; col < 8; col++) {
      let td = document.createElement("td");
      tr.appendChild(td);
      tr.appendChild(th);
      //let x=i,y=j
      td.setAttribute("id", col);
      if ((row + col) % 2 == 0) {
        td.className = "black";
      } else {
        td.className = "white";
      }
      //___________________________________________________________________________
      //firstClick = [i, j];
      // console.log(firstClick + "firstClick");
      td.addEventListener("click", () => onCellClick(row, col));
      //___________________________________________________________________________
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
window.addEventListener("load", initGame);
