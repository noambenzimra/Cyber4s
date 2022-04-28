class Game {
    constructor(firstPlayer) {
        this.boardData = new BoardData();
        this.winner = undefined;
    }

    //the function receive new row and col that we want to move to and the piece that we want to move to this location. its return true or false if the piece has been moved
    movePiece(row, col, piece) {
        if (this.inRules(row, col, piece)) {

            if (this.boardData.getTurn() === piece.getPlayer()) {
                const removedPiece = this.boardData.removePiece(row, col);
                piece.row = row;
                piece.col = col;
                //if the piece thathas been eaten is the king stop the game(return false)
                if (removedPiece !== undefined && removedPiece.getType() === 'king') {
                    this.winner = piece.player;
                    return false;
                }
                //check if the pawn has been arrived to its opponent first row and if he arrived transform him to a queen
                if (piece.type === 'pawn') {
                    if (piece.player === WHITE_PLAYER && piece.row === 7) {
                        this.changeToQueen(piece);
                    }
                    else if (piece.player === DARK_PLAYER && piece.row === 0) {
                        this.changeToQueen(piece);
                    }
                }
                //after every click i want that the color of the actual player that needs to play transform itself to red 
                let div_White = document.getElementById("div_White")
                let div_Dark = document.getElementById("div_Dark")
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

                //this func check that the king is not in check
                this.previousPiecesPlayer();

                //this func show us if a pieces was eaten and if it was so its show us on the screen wich piece
                if (removedPiece !== undefined)
                    this.addEatenPiece(removedPiece);


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

    //func that change automaticly the pawn to queen when he get to the opponent border
    changeToQueen(piece) {
        if (piece.type === 'pawn' && piece.player === WHITE_PLAYER && piece.row === 7) {
            piece.type = 'queen'
        }
        else if (piece.type === 'pawn' && piece.player === DARK_PLAYER && piece.row === 0) {
            piece.type = 'queen'
        }
        return piece;
    }


    //a func that check if there is a check in the game and alert the players
    previousPiecesPlayer() {
        // Find the pieces of the previous player has on the board:
        let previousPiecesPlayer = [];
        for (let piece of this.boardData.pieces) {
            if (piece.getOpponent() === this.boardData.getTurn()) {
                previousPiecesPlayer.push(piece);
            }
        }

        // Get an array of possible moves of each soldier of the player who played last:
        let possibleMoves = [];
        for (let piece of previousPiecesPlayer) {
            possibleMoves = possibleMoves.concat(piece.getPossibleMoves(this.boardData));
        }
        // Finding the oponnent King's Location(row, col)
        let kingIndex;
        for (let piece of this.boardData.pieces) {
            if (piece.type === KING && piece.player === this.boardData.getTurn()) {
                kingIndex = [piece.row, piece.col];
            }
        }
        // Check if one of the next cells that the last player can advance to is the King's cell:
        for (let i = 0; i < possibleMoves.length; i++) {
            if (possibleMoves[i][0] === kingIndex[0] && possibleMoves[i][1] === kingIndex[1]) {

                let piece = this.boardData.getPiece(kingIndex[0], kingIndex[1]);

                //if there is a check its gonna create a paragraph and the players gonna see that there is a check(in red color)
                if (piece.player === DARK_PLAYER) {
                    let div_Dark = document.getElementById("div_Dark")
                    const Check = document.createElement("p");
                    Check.setAttribute('id', 'checkDark');
                    Check.textContent = "Check!";
                    div_Dark.appendChild(Check);
                }
                else {
                    let div_White = document.getElementById("div_White")
                    const Check = document.createElement("p");
                    Check.setAttribute('id', 'checkWhite');
                    Check.textContent = "Check!";
                    div_White.appendChild(Check);
                }
                return true;
            }
        }
        //this erase the "check" sign if there is not a check
        let p1 = document.getElementById("checkDark")
        let p2 = document.getElementById("checkWhite")
        if (p1 !== null) {
            p1.remove();
        }
        if (p2 !== null) {
            p2.remove();
        }
        return false;
    }

    //create an image and add it to the screen if a pieces was eaten
    addEatenPiece(removedPiece) {
        const image = document.createElement("img");
        image.src = "images/" + removedPiece.player + "/" + removedPiece.type + ".svg";
        if (removedPiece.player === WHITE_PLAYER) {
            div_Dark.appendChild(image);
        }
        else {
            div_White.appendChild(image);
        }

    }

    //TODO:CASTLING

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
