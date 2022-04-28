class Game {
    constructor(firstPlayer) {
        this.boardData = new BoardData();
        this.winner = undefined;
        this.kingHasBeenMoved = [[DARK_PLAYER, false], [WHITE_PLAYER, false]];
        this.rookHasBeenMoved = [[DARK_PLAYER, 7, 0, false], [DARK_PLAYER, 7, 7, false], [WHITE_PLAYER, 0, 0, false], [WHITE_PLAYER, 0, 7, false]];
    }

    //the function receive new row and col that we want to move to and the piece that we want to move to this location. its return true or false if the piece has been moved
    movePiece(row, col, piece) {
        if (this.inRules(row, col, piece)) {

            //this func are checking that if the player want to castle he just needs to put the rook near to the king (left or right it depends...) and this is doing the castling
            if (this.canCastle(this.kingHasBeenMoved, this.rookHasBeenMoved, piece) && piece.type === 'rook') {
                this.castling(row, col, piece);
            }

            if (this.boardData.getTurn() === piece.getPlayer()) {
                const removedPiece = this.boardData.removePiece(row, col);
                piece.row = row;
                piece.col = col;

                //check whats specific rook/king has moved to block the castling
                if (piece.type === 'king' || piece.type === 'rook') {
                    this.hasBeenMoved(piece);

                }


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
                //after every click the actual player transform itself to red ("white players turn"/"dark players turn")
                this.redNeonSign()
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
        let kingPosition;
        for (let piece of this.boardData.pieces) {
            if (piece.type === KING && piece.player === this.boardData.getTurn()) {
                kingPosition = [piece.row, piece.col];
            }
        }
        // Check if one of the next cells that the last player can advance to is the King's cell:
        for (let position = 0; position < possibleMoves.length; position++) {
            if (possibleMoves[position][0] === kingPosition[0] && possibleMoves[position][1] === kingPosition[1]) {

                let piece = this.boardData.getPiece(kingPosition[0], kingPosition[1]);

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

    //this func check if the king/the rook has been moved and if its true its gonna update in the  this.kingHasBeenMoved/this.rookHasBeenMoved(true/false)
    hasBeenMoved(piece) {
        if (piece.type === 'king') {
            if (piece.player === DARK_PLAYER) {
                this.kingHasBeenMoved[0][1] = true;
                this.rookHasBeenMoved[0][3] = true;
                this.rookHasBeenMoved[1][3] = true;
            }
            else {
                if (piece.player === WHITE_PLAYER) {
                    this.kingHasBeenMoved[1][1] = true;
                    this.rookHasBeenMoved[2][3] = true;
                    this.rookHasBeenMoved[3][3] = true;
                }
            }
        }
        else if (piece.type === 'rook') {
            if (piece.player === DARK_PLAYER) {
                if (piece.startCol === 0) {
                    this.rookHasBeenMoved[0][3] = true;
                }
                else {
                    this.rookHasBeenMoved[1][3] = true;
                }
            }
            else {
                if (piece.player === WHITE_PLAYER) {
                    if (piece.startCol === 0) {
                        this.rookHasBeenMoved[2][3] = true;
                    }
                    else {
                        this.rookHasBeenMoved[3][3] = true;
                    }
                }
            }
        }

    }


    //this func check if there is no player between the rook and the king
    isEmptyBetween(rook) {
        if (rook.player === DARK_PLAYER) {
            if (rook.col === 0) {
                let i = 1
                while (this.boardData.isEmpty(7, i)) {
                    i++
                }
                if (i === 3) {
                    return true;
                }

            }
            else {
                let i = 6
                while (this.boardData.isEmpty(7, i)) {
                    i--;
                }
                if (i === 3) {
                    return true;
                }
            }
            return false;
        }
        if (rook.player === WHITE_PLAYER) {
            if (rook.col === 0) {
                let i = 1
                while (this.boardData.isEmpty(0, i)) {
                    i++
                }
                if (i === 3) {
                    return true;
                }

            }
            else {
                let i = 6
                while (this.boardData.isEmpty(0, i)) {
                    i--;
                }
                if (i === 3) {
                    return true;
                }
            }
            return false;
        }

    }

    //this func check that you can castle (based on if the cells between the king and the rook are empty and if the rook and the king was never used before )
    //this is the arrays rookHasBeenMoved:[player,row,col,if its has been moved] and kingHasBeenMoved[player,if its has been moved]
    //this.kingHasBeenMoved = [[DARK_PLAYER,false],[WHITE_PLAYER,false]];
    //this.rookHasBeenMoved = [[DARK_PLAYER,7,0,false],[DARK_PLAYER,7,7,false],[WHITE_PLAYER,0,0,false],[WHITE_PLAYER,0,7,false]];
    canCastle(kingHasBeenMoved, rookHasBeenMoved, piece) {
        if (piece !== undefined) {
            if (piece.player === WHITE_PLAYER) {
                if (piece.col === 0) {
                    if (kingHasBeenMoved[1][1] === false && rookHasBeenMoved[2][3] === false && this.isEmptyBetween(piece)) {
                        let whiteCastling = document.createElement("p");
                        whiteCastling.textContent = "You can Castle";
                        whiteCastling.setAttribute('id', 'whiteCastling')
                        div_White.appendChild(whiteCastling)
                        return true;
                    }
                }
                else {
                    if (kingHasBeenMoved[1][1] === false && rookHasBeenMoved[3][3] === false && this.isEmptyBetween(piece)) {
                        let whiteCastling = document.createElement("p");
                        whiteCastling.setAttribute('id', 'whiteCastling')
                        whiteCastling.textContent = "You can Castle";
                        div_White.appendChild(whiteCastling);
                        return true;
                    }
                }
            }
            else {
                if (kingHasBeenMoved[0][1] === false && rookHasBeenMoved[0][3] === false && this.isEmptyBetween(piece)) {
                    let darkCastling = document.createElement("p");
                    darkCastling.setAttribute('id', 'darkCastling')
                    darkCastling.textContent = "You can Castle";
                    div_Dark.appendChild(darkCastling);
                    return true;
                }
                else if (kingHasBeenMoved[0][1] === false && rookHasBeenMoved[1][3] === false && this.isEmptyBetween(piece)) {
                    let darkCastling = document.createElement("p");
                    darkCastling.textContent = "You can Castle";
                    div_Dark.appendChild(darkCastling);
                    return true;
                }
            }
        }

    }

    //this func change do the castling between the king and the rook
    castling(row, col, piece) {
        let whiteKing = this.boardData.getPiece(0, 3);
        let DarkKing = this.boardData.getPiece(7, 3);
        if (piece.col === 7 && col === 4 && piece.player === WHITE_PLAYER) {
            whiteKing.col = 5;
        }
        else if (piece.col === 0 && col === 2 && piece.player === WHITE_PLAYER) {
            whiteKing.col = 1;
        }
        else if (piece.col === 0 && col === 2 && piece.player === DARK_PLAYER) {
            DarkKing.col = 1;
        }
        else if (piece.col === 7 && col === 4 && piece.player === DARK_PLAYER) {
            DarkKing.col = 5;
        }

        //remove the paragraph "you can castle"
        let removeWhiteCastling = document.getElementById("whiteCastling")
        if (removeWhiteCastling !== null) {
            removeWhiteCastling.remove();
        }
        let removeDarkCastling = document.getElementById("darkCastling")

        if (removeDarkCastling !== null) {
            removeDarkCastling.remove();
        }


    }

    //a func that change the color of "white/dark players turn" to red ("white players turn"/"dark players turn")
    redNeonSign() {
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
    }





}
