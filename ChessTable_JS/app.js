//_________________________________________________________________global variables
const BOARD_SIZE = 8;
const WHITE_TYPE = "white";
const DARK_TYPE = "dark";
const PAWN = "pawn";
const ROOK = "rook";
const KNIGHT = "knight";
const BISHOP = "bishop";
const KING = "king";
const QUEEN = "queen";

let table;
let pieces = [];
let boardData;
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

  setMove(row, col) {
    this.row = row;
    this.col = col;
  }

  getPossibleMoves() {
    // Get relative moves
    let relativeMoves;
    if (this.type === PAWN) {
      relativeMoves = this.getPawnRelativeMoves();
    } else if (this.type === ROOK) {
      relativeMoves = this.getRookRelativeMoves();
    } else if (this.type === KNIGHT) {
      relativeMoves = this.getKnightRelativeMoves();
    } else if (this.type === BISHOP) {
      relativeMoves = this.getBishopRelativeMoves();
    } else if (this.type === KING) {
      //   console.log(this.getKingRelativeMoves());
      relativeMoves = this.getKingRelativeMoves();
    } else if (this.type === QUEEN) {
      relativeMoves = this.getQueenRelativeMoves();
    } else {
      console.log("Unknown type", type);
    }
    //console.log("relativeMoves", relativeMoves);

    // Get absolute moves
    let absoluteMoves = [];
    for (let relativeMove of relativeMoves) {
      const absoluteRow = this.row + relativeMove[0];
      const absoluteCol = this.col + relativeMove[1]; //6+7
      //console.log(relativeMove[1]);
      absoluteMoves.push([absoluteRow, absoluteCol]);
    }
    //console.log("absoluteMoves", absoluteMoves);

    // Get filtered absolute moves
    let filteredMoves = [];
    for (let absoluteMove of absoluteMoves) {
      const absoluteRow = absoluteMove[0];
      const absoluteCol = absoluteMove[1];
      // console.log(absoluteCol);
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

  //to do :make relative move absolute
  //todo: filter out moves that are out of bounds

  getPawnRelativeMoves() {
    let result = [];
    if (this.player == DARK_TYPE) {
      if (boardData.getPiece(this.row - 1, this.col) === undefined) {
        result.push([-1, 0]);
      }
    }
    else if (boardData.getPiece(this.row + 1, this.col) === undefined) {
      result.push([1, 0]);
    }
    return result;
  }

  getRookRelativeMoves() {
    let result = [];
    let isAfter = true;
    for (let i = 1; i < BOARD_SIZE; i++) {
      if (boardData.getPiece(i + this.row, this.col) === undefined) {
        result.push([i, 0]);
      }

      if (boardData.getPiece(-i + this.row, this.col) === undefined) {
        result.push([-i, 0]);
      }

      if (boardData.getPiece(this.row, i + this.col) === undefined) {
        result.push([0, i]);
      }

      if (boardData.getPiece(this.row, -i + this.col) === undefined) {
        result.push([0, -i]);
      }
    }
    return result;
  }

  getKnightRelativeMoves() {
    let result = [];
    for (let i = -1; i <= 1; i++) {
      if (i !== 0) {
        if (boardData.getPiece(this.row + 2, i + this.col) === undefined) {
          result.push([2, i]);
        }
        if (boardData.getPiece(this.row - 2, i + this.col) === undefined) {
          result.push([-2, i]);
        }
      }
    }

    return result;
  }


  getBishopRelativeMoves() {
    let isAfter = true;
    let result = [];
    for (let i = 1; i < BOARD_SIZE; i++) {
      if (
        boardData.getPiece(i + this.row, i + this.col) === undefined &&
        isAfter === true
      ) {
        isAfter = false;
        console.log(isAfter);
        result.push([i, i]);
      }
      isAfter = true;
      if (boardData.getPiece(i + this.row, -i + this.col) == undefined) {
        isAfter = false;
        result.push([i, -i]);
      }
      isAfter = true;
      if (boardData.getPiece(-i + this.row, -i + this.col) === undefined) {
        result.push([-i, -i]);
        isAfter = false;
      }
      isAfter = true;
      if (boardData.getPiece(-i + this.row, i + this.col) === undefined) {
        result.push([-i, i]);
      }
    }
    console.log(result);
    return result;
  }


  getKingRelativeMoves() {
    let result = [];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i !== 0) || (j !== 0)) {
          //console.log("[" + i + "," + j + "]");
          if (boardData.getPiece(i + this.row, j + this.col) === undefined)
            result.push([i, j]);
        }
      }
    }

    return result;
  }

  getQueenRelativeMoves() {
    let result = [];
    for (let i = 1; i < BOARD_SIZE; i++) {
      if (boardData.getPiece(i + this.row, this.col) === undefined) {
        result.push([i, 0]);
      }
      if (boardData.getPiece(-i + this.row, this.col) === undefined) {
        result.push([-i, 0]);
      }
      if (boardData.getPiece(this.row, i + this.col) === undefined) {
        result.push([0, i]);
      }
      if (boardData.getPiece(this.row, -i + this.col) === undefined) {
        result.push([0, -i]);
      }
      if (boardData.getPiece(i + this.row, i + this.col) === undefined) {
        result.push([i, i]);
      }
      if (boardData.getPiece(i + this.row, -i + this.col) === undefined) {
        result.push([i, -i]);
      }
      if (boardData.getPiece(-i + this.row, -i + this.col) === undefined) {
        result.push([-i, -i]);
      }
      if (boardData.getPiece(-i + this.row, i + this.col) === undefined) {
        result.push([-i, i]);
      }
    }
    return result;
  }
}
//________________________________________________________________________________________________________Class BoardData
class BoardData {
  constructor(pieces) {
    this.pieces = pieces;
  }

  getPiece(row, col) {
    for (let piece of this.pieces) {
      if (piece.row === row && piece.col === col) {
        return piece;
      }
    }
  }

  //the function receive new row and col that we want to move to and a piece that we want to move to this location. its return a piece with new location
  movePiece(row, col, piece) {
    if (inRules(piece, row, col)) {
      addImage(table.rows[row].cells[col], piece.player, piece.type, row, col);
      removeImage(
        table.rows[piece.row].cells[piece.col],
        piece.player,
        piece.type,
        piece.row,
        piece.col
      );
      //----------------------------------
      piece.setMove(row, col);
      let newLocation = new BoardData(piece);
      return newLocation;
      //--------------------------------------
      // }
    }
  }

  //check if there is a player in front of the piece and check that the piece dont  go over(מעל שחקן אחר) another player instead of knight
  // freeToRide(player) {
  //   // console.log(this.pieces);
  //   let row = player.row;
  //   let col = player.col;
  //   if (player.type === ROOK) {
  //     for (let piece of this.pieces) {
  //       //  console.log(piece.row);

  //       if (piece.row === row || piece.col === col) {
  //         for (let i = 7; i > 0; i--) {
  //           if (
  //             this.getPiece(row, i) !== undefined &&
  //             player !== this.getPiece(row, i)
  //           ) {
  //             return false;
  //           }
  //         }
  //       }
  //       return true;
  //     }
  //   }

  //   if (player.type === BISHOP) {
  //     for (let piece of this.pieces) {
  //       if (
  //         this.getPiece(row + 1, col + 1) !== undefined ||
  //         this.getPiece(row - 1, col + 1) !== undefined ||
  //         this.getPiece(row + 1, col - 1) !== undefined ||
  //         this.getPiece(row - 1, col - 1) !== undefined
  //       ) {
  //         return false;
  //       } else return true;
  //     }
  //   }
  // }
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
//check if you can go there(without checking if there is a player in front of you!!!!)
function inRules(actualPiece, row, col) {
  let possibleMoves = [];
  possibleMoves = actualPiece.getPossibleMoves();
  console.log(possibleMoves);
  // console.log(arr.length);
  for (let i = 0; i < possibleMoves.length; i++) {
    if (possibleMoves[i][0] == row && possibleMoves[i][1] == col) {
      return true;
    }
  }
  return false;
}

let selectedCell = undefined;

function onCellClick(e, row, col) {
  //clear previus selected move
  //console.log(boardData.getPiece(row, col) + " hello");
  for (let i = 0; i < BOARD_SIZE; i++) {
    for (let j = 0; j < BOARD_SIZE; j++) {
      table.rows[i].cells[j].classList.remove("options");
    }
  }
  //show possible moves
  const piece = boardData.getPiece(row, col);
  if (piece !== undefined) {
    getPiece = boardData.getPiece(row, col);
    let possibleMoves = piece.getPossibleMoves();
    for (let possibleMove of possibleMoves) {
      // console.log(possibleMove);
      const cell = table.rows[possibleMove[0]].cells[possibleMove[1]];
      cell.classList.add("options");
    }
  } else {
    if (getPiece !== undefined) {
      //receive the selected piece and send it to movepiece that needs to change the place of the piece
      console.log(getPiece);
      //-----------------------------------------------------
      const pieceSetMovement = boardData.movePiece(row, col, getPiece);
      //-----------------------------------------------------
      // console.log(move.pieces.row);

      getPiece = undefined;
    }
  }
  let td = document.getElementsByTagName("td");
  //clear previus selected cell
  if (selectedCell !== undefined) {
    selectedCell.classList.remove("onIt");
  }
  //show selected cell
  selectedCell = e.currentTarget;

  selectedCell.classList.add("onIt");

  // table.addEventListener("click", (e) => {
  //   movePiece();
  // });
}

//_____________________________________________________________________________________getInitialPieces
function getInitialPieces() {
  let result = [];

  //addFirstRowPieces();
  addFirstRowPieces(result, 0, WHITE_TYPE);
  addFirstRowPieces(result, 7, DARK_TYPE);
  for (let i = 0; i < 8; i++) {
    result.push(new Piece(1, i, "pawn", WHITE_TYPE));
    result.push(new Piece(6, i, "pawn", DARK_TYPE));
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

function createChessBoard() {
  let body = document.getElementsByTagName("body")[0];

  let h1 = document.createElement("h1");
  let text2 = document.createTextNode("Chess Board Of Noam Benzimra");
  h1.appendChild(text2);
  body.appendChild(h1);

  table = document.createElement("table");

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
  boardData = new BoardData(getInitialPieces());
  // console.log(pieces);
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
window.addEventListener("load", createChessBoard);
