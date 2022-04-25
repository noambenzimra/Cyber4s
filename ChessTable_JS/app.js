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
let table;
let pieces = [];
let boardData;
let selectedPiece;
// let firstClick = [];
// let secondClick = [];
let getPiece = undefined;
//___________________________________________________________________________________________________________Class Piece

class Piece {
  constructor(row, col, type, player) {
    this.row = row;
    this.col = col;
    this.type = type;
    this.player = player;
  }

  getPlayer() {
    return this.player;
  }

  setMove(row, col) {
    this.row = row;
    this.col = col;
  }

  getPossibleMoves(boardData) {
    // Get relative moves
    let moves;
    if (this.type === PAWN) {
      moves = this.getPawnMoves();
    } else if (this.type === ROOK) {
      moves = this.getRookMoves(boardData);
    } else if (this.type === KNIGHT) {
      moves = this.getKnightMoves(boardData);
    } else if (this.type === BISHOP) {
      moves = this.getBishopMoves(boardData);
    } else if (this.type === KING) {
      //   console.log(this.getKingRelativeMoves());
      moves = this.getKingMoves(boardData);
    } else if (this.type === QUEEN) {
      moves = this.getQueenMoves(boardData);
    } else {
      console.log("Unknown type", type);
    }

    // Get absolute moves
    //console.log(moves);
    if (this.type === PAWN) {
      let pawnAbsoluteMoves = [];
      for (let relativeMove of moves) {
        const absoluteRow = this.row + relativeMove[0];
        const absoluteCol = this.col + relativeMove[1]; //6+7  
        pawnAbsoluteMoves.push([absoluteRow, absoluteCol]);

      }
      moves = pawnAbsoluteMoves;
    }


    // Get filtered absolute moves
    let filteredMoves = [];
    for (let absoluteMove of moves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      if (
        absoluteRow >= 0 &&
        absoluteRow <= 7 &&
        absoluteCol >= 0 &&
        absoluteCol <= 7
      ) {
        filteredMoves.push(absoluteMove);
      }
    }
    //console.log("filteredMoves", filteredMoves);
    return filteredMoves;
  }


  //return the pawn moves ,without the move that the piece have another piece in front of him
  getPawnMoves() {
    //  console.log(boardData);
    let result = [];
    if (this.player == DARK_PLAYER) {
      //console.log((boardData.getPiece(this.row - 1, this.col)) + "helooooooooooooooooooooo");
      if (boardData.isEmpty(this.row - 1, this.col) || (boardData.isPlayer(this.row - 1, this.col, WHITE_PLAYER))) {
        if (boardData.isPlayer(this.row - 1, this.col - 1, WHITE_PLAYER)) {
          result.push([-1, -1]);
        }
        else if (boardData.isPlayer(this.row - 1, this.col + 1, WHITE_PLAYER)) {
          result.push([-1, +1]);
        }

        if (this.row === 6) {
          result.push([-1, 0]);
          result.push([-2, 0]);
        }
        else {
          result.push([-1, 0]);
        }
      }
    }
    //console.log(boardData.isEmpty(this.row + 1, this.col));
    else if ((boardData.isEmpty(this.row + 1, this.col)) || (boardData.isPlayer(this.row + 1, this.col, DARK_PLAYER))) {

      if (boardData.isPlayer(this.row + 1, this.col - 1, DARK_PLAYER)) {
        result.push([1, -1]);
      }
      else if (boardData.isPlayer(this.row + 1, this.col + 1, DARK_PLAYER)) {
        result.push([1, 1]);
      }
      if (this.row === 1) {

        result.push([2, 0]);
        result.push([1, 0]);
      }
      else {
        result.push([1, 0]);
      }

    }
    return result;
  }

  getRookMoves(boardData) {
    let result = [];
    result = result.concat(this.getMovesInDirection(-1, 0, boardData));
    result = result.concat(this.getMovesInDirection(1, 0, boardData));
    result = result.concat(this.getMovesInDirection(0, -1, boardData));
    result = result.concat(this.getMovesInDirection(0, 1, boardData));
    return result;
  }
  getMovesInDirection(directionRow, directionCol, boardData) {
    let result = [];
    for (let i = 1; i < BOARD_SIZE; i++) {
      let row = this.row + directionRow * i;
      let col = this.col + directionCol * i;
      if (boardData.isEmpty(row, col)) {
        result.push([row, col]);
      } else if (boardData.isPlayer(row, col, this.getOpponent())) {
        result.push([row, col]);
        return result;
      }
      else if (boardData.isPlayer(row, col, this.player)) {
        return result;
      }
    }
    return result;
  }
  //return the knight moves
  getKnightMoves(boardData) {
    let result = [];
    const relativeMoves = [[2, 1], [2, -1], [-2, 1], [-2, -1], [-1, 2], [1, 2], [-1, -2], [1, -2]];
    for (let i = -2; i < 3; i++) {
      for (let j = -2; j < 3; j++) {
        relativeMoves.push([])
      }
    }
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player))//if there is not a player or its an opponent player go in
      {
        result.push([row, col]);
      }
    }
    return result;
  }


  //return the bishop moves ,without the move that the piece have another piece in front of him
  getBishopMoves() {
    let result = [];
    result = result.concat(this.getMovesInDirection(-1, -1, boardData));
    result = result.concat(this.getMovesInDirection(-1, 1, boardData));
    result = result.concat(this.getMovesInDirection(1, -1, boardData));
    result = result.concat(this.getMovesInDirection(1, 1, boardData));
    return result;
  }
  //return the king moves
  getKingMoves() {
    let result = [];
    const relativeMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (let relativeMove of relativeMoves) {
      let row = this.row + relativeMove[0];
      let col = this.col + relativeMove[1];
      if (!boardData.isPlayer(row, col, this.player)) {//if there is not a player or its an opponent player go in
        result.push([row, col]);
      }
    }
    return result;
  }

  //return the queen moves ,without the move that the piece have another piece in front of him
  getQueenMoves(boardData) {
    let result = this.getBishopMoves(boardData);
    result = result.concat(this.getRookMoves(boardData));
    return result;
  }

  getOpponent() {
    if (this.player === WHITE_PLAYER) {
      return DARK_PLAYER;
    }
    return WHITE_PLAYER;
  }
  getRow() {
    return this.row;
  }
  getCol() {
    return this.col;
  }
}
//________________________________________________________________________________________________________Class BoardData
class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  //receive row and col and return the piece that is at this location
  getPiece(row, col) {
    for (let piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
  }

  isEmpty(row, col) {
    return this.getPiece(row, col) === undefined;
  }

  isPlayer(row, col, player) {
    const piece = this.getPiece(row, col);
    return piece != undefined && piece.player === player;
  }

  //the function receive new row and col that we want to move to and the piece that we want to move to this location. its return true or false if the piece has moved
  movePiece(row, col, piece) {

    if (inRules(row, col, piece)) {
      this.removePiece(row, col);
      piece.row = row;
      piece.col = col;

      // piece.setMove(row, col);
      //let newLocation = new BoardData(piece);
      return true;
    }
    return false;
  }

  //list that get a list of possible moves and return a list of opponent moves
  oponnentList(possibleMoves) {
    let result = []
    let player = ""
    let counter = 0;
    for (let possiblemove of possibleMoves) {
      let piece = this.getPiece(possiblemove[0], possiblemove[1])
      if (piece !== undefined) {
        if (piece.getPlayer() === WHITE_PLAYER) {
          player = WHITE_PLAYER;
          // console.log("white");
        }
        else {
          player = DARK_PLAYER;
          // console.log("dark");
        }
        if (piece.getOpponent() !== player) {
          counter++;
          result.push([piece])
        }
      }
    }
    if (counter !== 0) {

      //console.log(result);
      return result;
    }
    return 0;

  }

  removePiece(row, col) {
    console.log("heloooooooooooooooooooooooooo");
    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i];
      if (piece.row === row && piece.col === col) {
        // Remove piece at index i
        this.pieces.splice(i, 1);
      }
    }
  }

  //this function gets the row and col of the oponnent plaer and the piece of the player that we play with and its eat the player
  eat(row, col, piece) {
    let i = 0;
    if (i < 1) {
      const actualPiece = this.getPiece(row, col)
      console.log(actualPiece);
      removeImage(table.rows[row].cells[col], actualPiece.player, actualPiece.type, row, col);
      console.log("image removed");
      // this.movePiece(row, col, piece)
      addImage(table.rows[row].cells[col], piece.player, piece.type, row, col);
      console.log("image added");
      removeImage(table.rows[piece.getRow()].cells[piece.getCol()], piece.player, piece.type, piece.getRow(), piece.getCol());
      console.log("image removed2");
      piece.setMove(row, col);
      console.log("set");
      let newLocation = new BoardData(piece);
      // i++;
      return newLocation;
    }

  }
}
//____________________________________________________________________global function. like-addImage,addimageByIndex,onCellClick
function addImage(cell, type, name, row, col) {
  //receive a cell that we want to add the img to,the type of the piece(pawn,king,etc...),the name-"white-type"/"dark-type",row and col (the same of the cell)
  const image = document.createElement("img");
  image.src = "images/" + type + "/" + name + ".svg";
  image.setAttribute("id", row + " " + col);
  cell.appendChild(image);
}
function removeImage(cell, type, name, row, col) {
  //receive the same thing of add img and remove the img from the same cell that it got
  const image = document.getElementById(row + " " + col);
  image.remove();
}
//check if you can go there
function inRules(row, col, piece) {
  let possibleMoves = [];
  //console.log(piece);
  possibleMoves = piece.getPossibleMoves(boardData);
  // console.log(arr.length);
  for (const possibleMove of possibleMoves) {
    if (possibleMove[0] === row && possibleMove[1] === col) {
      return true;
    }
  }
  return false;
}
let selectedCell = undefined;

function eatOpponnent(e, row, col, piece) {
  boardData.eat(row, col, piece);
}

function showMovesForPiece(row, col) {
  console.log('showMovesForPiece');
  // Clear all previous possible moves
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove('options');
      table.rows[i].cells[j].classList.remove('onIt');
    }
  }

  // Show possible moves
  const piece = boardData.getPiece(row, col);
  if (piece !== undefined) {
    let possibleMoves = piece.getPossibleMoves(boardData);
    for (let possibleMove of possibleMoves) {
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add('options');
    }
  }

  table.rows[row].cells[col].classList.add('onIt');
  selectedPiece = piece;
}


function onCellClick(e, row, col) {
  //clear previous selected move
  let opponentMoves = []
  let rowList = []
  let colList = []


  // selectedPiece - The current selected piece (selected in previous click)
  // row, col - the currently clicked cell - it may be empty, or have a piece.
  if (selectedPiece === undefined) {
    showMovesForPiece(row, col);
  }
  else {
    if (boardData.movePiece(row, col, selectedPiece)) {
      selectedPiece = undefined;

      // Recreate whole board - this is not efficient, but doesn't affect user experience
      createChessBoard(boardData);
      console.log("created");
    } else {
      showMovesForPiece(row, col);
    }
  }

  //clear previous selected cell
  if (selectedCell !== undefined) {
    selectedCell.classList.remove("onIt");
  }
  //show selected cell
  selectedCell = e.currentTarget;
  selectedCell.classList.add("onIt");
}

//_____________________________________________________________________________________getInitialPieces
function getInitialPieces() {
  let result = [];

  //addFirstRowPieces();
  addFirstRowPieces(result, 0, WHITE_PLAYER);
  addFirstRowPieces(result, 7, DARK_PLAYER);
  for (let i = 0; i < 8; i++) {
    result.push(new Piece(1, i, "pawn", WHITE_PLAYER));
    result.push(new Piece(6, i, "pawn", DARK_PLAYER));
  }
  return result;
}
function addFirstRowPieces(result, row, player) {
  result.push(new Piece(row, 0, "rook", player));
  result.push(new Piece(row, 1, "knight", player));
  result.push(new Piece(row, 2, "bishop", player));
  result.push(new Piece(row, 3, "king", player));
  result.push(new Piece(row, 4, "queen", player));
  result.push(new Piece(row, 5, "bishop", player));
  result.push(new Piece(row, 6, "knight", player));
  result.push(new Piece(row, 7, "rook", player));
}

//_____________________________________________________________create the board itself
function initGame() {
  // Create list of pieces (32 total)
  boardData = new BoardData(getInitialPieces());
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
      td.addEventListener("click", (event) => onCellClick(event, row, col));
      //___________________________________________________________________________
    }
    tblBody.appendChild(tr);
    thead.appendChild(th);
  }

  table.setAttribute("border", "4");

  //pieces = getInitialPieces();

  console.log(boardData);
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
