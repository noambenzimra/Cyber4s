class Game {
    constructor() {
        this.boardData = new BoardData();
        this.kingHasBeenMoved = [];
        // this.currentPlayer = firstPlayer;
    }

    //the function receive new row and col that we want to move to and the piece that we want to move to this location. its return true or false if the piece has moved
    movePiece(row, col, piece) {
        if (this.inRules(row, col, piece)) {
            if (this.boardData.getTurn() === piece.getPlayer()) {
                this.boardData.removePiece(row, col);
                piece.row = row;
                piece.col = col;
                this.boardData.turn++;
                if (piece.getType() === 'king') {
                    this.kingHasBeenMoved(piece);
                }
                if (piece.getType() === 'rook') {
                    this.rookHasBeenMoved(piece);
                }
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
            if (possibleMove[0] === row && possibleMove[1] === col && !piece.cantEat) {
                return true;
            }
        }
        return false;
    }

    //func that checking if there was a first move anf if there was it returning a list of the color of the player and true
    //TODO:check what to put in the list before its returning this and where (maybe in the constructor(?))
    kingHasBeenMoved(piece) {
        let player = piece.getPlayer();
        let kingHasBeenMoved = [player, true];
        return kingHasBeenMoved;
    }
    //func that checking if there was a first move anf if there was it returning a list of the color of the player and the starting row and col of the rook(its like an id) and true
    //TODO:check what to put in the list before its returning this and where (maybe in the constructor(?))
    rookHasBeenMoved(piece) {
        let player = piece.getPlayer();
        let startRow = piece.getStartRow();
        let startCol = piece.getStartCol();
        let rookHasBeenMoved = [player, startRow, startCol, true];
        return rookHasBeenMoved;
    }


    isEmptyBetween(king, rook) {
        //TODO:chack that its empty between the king and the rook
    }

    // canCastle(kingHasBeenMoved,rookHasBeenMoved){
    //TODO:check that the pieces were never moved and that there is not pieces between the both 
    //TODO:check how i can click on specific cell and itll do automaticly castle (maybe special color or an alert msg)
    // }


}