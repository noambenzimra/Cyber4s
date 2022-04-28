class Game {
    constructor(firstPlayer) {
        this.boardData = new BoardData();
        // this.kingHasBeenMoved = [];
        this.winner = undefined;
        // this.currentPlayer = firstPlayer;
    }

    //the function receive new row and col that we want to move to and the piece that we want to move to this location. its return true or false if the piece has moved
    movePiece(row, col, piece) {
        if (this.inRules(row, col, piece)) {
            if (this.boardData.getTurn() === piece.getPlayer()) {
                const removedPiece = this.boardData.removePiece(row, col);
                piece.row = row;
                piece.col = col;
                if (removedPiece !== undefined && removedPiece.getType() === 'king') {
                    this.winner = piece.player;
                    return false;
                }
                if (piece.type === 'pawn') {
                    if (piece.player === WHITE_PLAYER && piece.row === 7) {
                        this.changeToQueen(piece);
                    }
                    else if (piece.player === DARK_PLAYER && piece.row === 0) {
                        this.changeToQueen(piece);
                    }
                }
                // if (piece.getType() === 'king') {
                //     this.kingHasBeenMoved(piece);
                // }
                // if (piece.getType() === 'rook') {
                //     this.rookHasBeenMoved(piece);
                // }
                // let h2 = document.querySelector("h2")
                let div_White = document.getElementById("div_White")
                console.log(div_White);
                let div_Dark = document.getElementById("div_Dark")
                console.log(div_Dark);
                if (this.boardData.turn % 2 !== 0) {
                    div_White.classList.remove("whitePlayer")
                    div_Dark.classList.remove("darkSign")
                    div_White.classList.add("whiteSign")
                    div_Dark.classList.add("darkPlayer")

                }
                else {
                    div_Dark.classList.remove("darkPlayer")
                    div_White.classList.remove("whiteSign")
                    div_Dark.classList.add("darkSign")
                    div_White.classList.add("whitePlayer")
                }

                this.boardData.turn++;


                return true;
            }
        }
        return false;
    }

    //check if you can go there
    inRules(row, col, piece) {
        //  let rookHasBeenMoved = this.rookHasBeenMoved(piece);
        //  let kingHasBeenMoved = this.kingHasBeenMoved(piece);
        let possibleMoves = piece.getPossibleMoves(this.boardData);
        for (const possibleMove of possibleMoves) {
            if (this.winner !== undefined) {
                console.log("win");
                return false;
            }
            if (possibleMove[0] === row && possibleMove[1] === col && piece.cantEat == false) {
                return true;
            }

        }

        return false;
    }

    changeToQueen(piece) {
        if (piece.type === 'pawn' && piece.player === WHITE_PLAYER && piece.row === 7) {
            piece.type = 'queen'
        }
        else if (piece.type === 'pawn' && piece.player === DARK_PLAYER && piece.row === 0) {
            piece.type = 'queen'
        }
        return piece;


    }

    // kingInDanger(boardData) {
    //     //  let possibleMoves = piece.getPossibleMoves(this.boardData);
    //     // for (let possibleMove of possibleMoves) {
    //     console.log("hello");
    //     for (let i = 0; i < BOARD_SIZE; i++) {
    //         for (let j = 0; j < BOARD_SIZE; j++) {
    //             let piece = this.boardData.getPiece(i, j);
    //             if (piece === undefined) {
    //                 continue;
    //             }
    //             let possibleMoves = piece.getPossibleMoves(boardData);
    //             for (let possibleMove of possibleMoves) {
    //                 let pieceInDanger = this.boardData.getPiece(possibleMove[0], possibleMove[1]);
    //                 if (pieceInDanger === 'king') {
    //                     return true;
    //                 }
    //             }
    //         }
    //         return false;
    //     }
    // }

    //  previousPiecesPlayer() {
    //     // Find the pieces of the previous player has on the board:
    //     let previousPiecesPlayer = [];
    //     for (let piece of game.boardData.pieces) {
    //       if (piece.getOpponent() === game.currentPlayer) {
    //         previousPiecesPlayer.push(piece);
    //       }
    //     }

    //     // Get an array of possible moves of each soldier of the player who played last:
    //     let result = [];
    //     for (let piece of previousPiecesPlayer) {
    //       // console.log(piece.getPossibleMoves(game.boardData));
    //       result = result.concat(piece.getPossibleMoves(game.boardData));
    //     }

    //     // Finding the oponnent King's Location(row, col) - like this : [0, 3]
    //     let kingIndex;
    //     for (let i of game.boardData.pieces) {
    //       if (i.type === KING && i.player === game.currentPlayer) {
    //         // console.log([i.row, i.col]);
    //         kingIndex = [i.row, i.col];
    //       }
    //     }

    //     // Check if one of the next cells that the last player can advance to is the King's cell:
    //     for (let i = 0; i < result.length; i++) {
    //       if (result[i][0] === kingIndex[0] && result[i][1] === kingIndex[1]) {
    //         console.log("Check! The king is in danger");
    //         const Check = document.createElement("div");
    //         Check.classList.add("Check-position");
    //         Check.textContent = "Check!";
    //         table.appendChild(Check);
    //         return true;
    //       }
    //     }
    //   }






    //func that checking if there was a first move anf if there was it returning a list of the color of the player and true
    //TODO:check what to put in the list before its returning this and where (maybe in the constructor(?))
    // kingHasBeenMoved(piece) {
    //     let player = piece.getPlayer();
    //     let kingHasBeenMoved = [player, true];
    //     return kingHasBeenMoved;
    // }
    // //func that checking if there was a first move anf if there was it returning a list of the color of the player and the starting row and col of the rook(its like an id) and true
    // //TODO:check what to put in the list before its returning this and where (maybe in the constructor(?))
    // rookHasBeenMoved(piece) {
    //     let player = piece.getPlayer();
    //     let startRow = piece.getStartRow();
    //     let startCol = piece.getStartCol();
    //     let rookHasBeenMoved = [player, startRow, startCol, true];
    //     return rookHasBeenMoved;
    // }


    // isEmptyBetween(king, rook) {
    //     //TODO:chack that its empty between the king and the rook
    // }

    // canCastle(kingHasBeenMoved,rookHasBeenMoved){
    //TODO:check that the pieces were never moved and that there is not pieces between the both 
    //TODO:check how i can click on specific cell and itll do automaticly castle (maybe special color or an alert msg)
    // }


}
