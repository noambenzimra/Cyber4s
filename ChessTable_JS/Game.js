class Game {
    constructor() {
        this.boardData = new BoardData();
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
                return true;
            }
        }
        return false;
    }

    //check if you can go there
    inRules(row, col, piece) {
        let possibleMoves = [];
        possibleMoves = piece.getPossibleMoves(game.boardData);
        for (const possibleMove of possibleMoves) {
            if (possibleMove[0] === row && possibleMove[1] === col) {
                return true;
            }
        }
        return false;
    }

}