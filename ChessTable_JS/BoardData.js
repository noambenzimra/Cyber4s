class BoardData {
    constructor() {
        this.initPieces();
        this.turn = 0;
    }
    initPieces() {
        this.pieces = [];

        for (let i = 0; i < 8; i++) {
            this.pieces.push(new Piece(0, i, PIECES[i], WHITE_PLAYER));
            this.pieces.push(new Piece(1, i, "pawn", WHITE_PLAYER));
            this.pieces.push(new Piece(6, i, "pawn", DARK_PLAYER));
            this.pieces.push(new Piece(7, i, PIECES[i], DARK_PLAYER));
        }
    }

    //this func return the turn of which player (after a click its gonna add 1 to this.turn and its gonna check if its even or odd)
    getTurn() {
        if (this.turn % 2 == 0) {
            return WHITE_PLAYER;
        }
        return DARK_PLAYER;
    }

    //receive row and col and return the piece that is at this location
    getPiece(row, col) {
        for (let piece of this.pieces) {
            if (piece.row === row && piece.col === col) {
                return piece;
            }
        }
    }

    //check if the place that we send it with row and col is empty
    isEmpty(row, col) {
        return this.getPiece(row, col) === undefined;
    }

    //check if there is a player in the place and which player it is (it depends what player we sent to the func)
    isPlayer(row, col, player) {
        const piece = this.getPiece(row, col);
        return piece != undefined && piece.player === player;
    }

    //remove a piece that we sent to here and the return the piece after that we removed it
    removePiece(row, col) {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.row === row && piece.col === col) {
                // Remove piece at index i
                beforeEat = true;
                this.pieces.splice(i, 1);
                return piece;
            }
        }
    }
}