class Piece {
    constructor(row, col, type, player) {
        this.row = row;
        this.startRow = row;
        this.col = col;
        this.startRow = row;
        this.type = type;
        this.player = player;
        this.cantEat = false;
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
            moves = this.getKingMoves(boardData);
        } else if (this.type === QUEEN) {
            moves = this.getQueenMoves(boardData);
        } else {
            console.log("Unknown type", type);
        }

        // Get absolute moves
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
        return filteredMoves;
    }


    //return the pawn moves
    getPawnMoves() {
        let result = [];
        if (this.player === DARK_PLAYER) {
            if (game.boardData.isEmpty(this.row - 1, this.col) || (game.boardData.isPlayer(this.row - 1, this.col, WHITE_PLAYER))) {
                if (game.boardData.isPlayer(this.row - 1, this.col - 1, WHITE_PLAYER)) {
                    result.push([-1, -1]);
                    this.eatSign(this.row - 1, this.col - 1);
                    this.cantEat = false;
                }
                if (game.boardData.isPlayer(this.row - 1, this.col + 1, WHITE_PLAYER)) {
                    result.push([-1, +1]);
                    this.eatSign(this.row - 1, this.col + 1);
                    this.cantEat = false;
                }

                if (this.row === 6) {
                    if ((game.boardData.isEmpty(this.row - 1, this.col))) {
                        result.push([-1, 0]);
                    }
                    if ((game.boardData.isEmpty(this.row - 2, this.col))) {
                        result.push([-2, 0]);
                    }

                }

                else if ((game.boardData.isEmpty(this.row - 1, this.col))) {
                    result.push([-1, 0]);
                }
            }
        }
        else if ((game.boardData.isEmpty(this.row + 1, this.col)) || (game.boardData.isPlayer(this.row + 1, this.col, DARK_PLAYER))) {
            if (game.boardData.isPlayer(this.row + 1, this.col - 1, DARK_PLAYER)) {
                result.push([1, -1]);
                this.eatSign(this.row + 1, this.col - 1);
                this.cantEat = false;
            }
            if (game.boardData.isPlayer(this.row + 1, this.col + 1, DARK_PLAYER)) {
                result.push([1, 1]);
                this.eatSign(this.row + 1, this.col + 1);
                this.cantEat = false;
            }
            if (this.row === 1) {
                if ((game.boardData.isEmpty(this.row + 1, this.col))) {
                    result.push([1, 0]);
                }
                if ((game.boardData.isEmpty(this.row + 2, this.col))) {
                    result.push([2, 0]);
                }
            }
            else if ((game.boardData.isEmpty(this.row + 1, this.col))) {
                result.push([1, 0]);
            }

        }
        return result;
    }
    //return rook moves
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
            if (game.boardData.isEmpty(row, col)) {
                result.push([row, col]);
            } else if (game.boardData.isPlayer(row, col, this.getOpponent())) {
                result.push([row, col]);
                this.eatSign(row, col);
                return result;
            }
            else if (game.boardData.isPlayer(row, col, this.player)) {
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
            if (!game.boardData.isPlayer(row, col, this.player))//if there is not a player or its an opponent player go in
            {
                if (game.boardData.isPlayer(row, col, this.getOpponent())) {
                    this.eatSign(row, col);
                }
                result.push([row, col]);
            }
        }
        return result;
    }


    //return the bishop moves
    getBishopMoves() {
        let result = [];
        result = result.concat(this.getMovesInDirection(-1, -1, game.boardData));
        result = result.concat(this.getMovesInDirection(-1, 1, game.boardData));
        result = result.concat(this.getMovesInDirection(1, -1, game.boardData));
        result = result.concat(this.getMovesInDirection(1, 1, game.boardData));
        return result;
    }
    //return the king moves
    getKingMoves() {
        let result = [];
        const relativeMoves = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (let relativeMove of relativeMoves) {
            let row = this.row + relativeMove[0];
            let col = this.col + relativeMove[1];
            if (!game.boardData.isPlayer(row, col, this.player)) {//if there is not a player or its an opponent player go in
                result.push([row, col]);
                if (game.boardData.isPlayer(row, col, this.getOpponent())) {
                    this.eatSign(row, col);
                }
            }
        }
        return result;
    }

    //return the queen moves 
    getQueenMoves(boardData) {
        let result = this.getBishopMoves(boardData);
        result = result.concat(this.getRookMoves(boardData));
        return result;
    }

    //func that return the opponent
    getOpponent() {
        if (this.player === WHITE_PLAYER) {
            return DARK_PLAYER;
        }
        return WHITE_PLAYER;
    }
    getType() {
        return this.type;
    }
    getRow() {
        return this.row;
    }
    getCol() {
        return this.col;
    }

    getStartRow() {
        return this.startRow;
    }
    getStartCol() {
        return this.startCol;
    }

    //if the piece can eat someone itll change the background color into a red color
    eatSign(row, col) {
        const cell = table.rows[row].cells[col];
        cell.classList.add('beforeEat');

    }
}   