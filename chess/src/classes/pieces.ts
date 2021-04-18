export class ChessBoard {
    board: Piece[][];
    kings: number[][];
    mate: boolean;
    move(piece: Piece, x, y) { };
    checkMate() { };
}

export class Piece {
    type: 0 | 1 | 2 | 3 | 4 | 5; // 0:peon, 1: torre, 2: alfil, 3: caballo, 4: reina, 5:rey
    posX: number;
    posY: number;
    color: 0 | 1;
    constructor(x: number, y: number, color: 0 | 1) {
        this.posX = x;
        this.posY = y;
        this.color = color
    }
    isLegalMove(x: number, y: number, check: 0 | 1): boolean {
        return false
    };
    validateMove(x: number, y: number, check: 0 | 1): boolean {
        return false;
    };
    check(cheeseBoard: ChessBoard) { }
    promotion() { };
}

class Pawn extends Piece {
    constructor(x: number, y: number, color: 0 | 1) {
        super(x, y, color)
        this.type = 0;
    }

    isLegalMove(x: number, y: number, check: 0 | 1) {
        let legal = false;
        const board = new ChessBoard();
        let checkPiece: Piece[] = [];

        if ((this.color == 0 && y == this.posY - 1) || (this.color == 1 && y == this.posY + 1)) {
            if (x == this.posX) {
                if (check == 0) {
                    legal = (board.board[y][x] == null);
                }
            } else if (Math.abs(x - this.posX) == 1) {
                if (check == 0) {
                    legal = (board.board[y][x] != null) && (board.board[y][x].color != this.color);
                }
            }
        }
        return legal;
    }
}

class Bishop extends Piece {
    constructor(x: number, y: number, color: 0 | 1) {
        super(x, y, color)
        this.type = 2;
    }

    isLegalMove(x: number, y: number, check: 0 | 1) {
        let legal = false;
        const board = new ChessBoard();
        let checkPiece: Piece[] = [];
        if ((Math.abs(x - this.posX) == Math.abs(y - this.posY))) {
            let inMiddle = false;
            const ySing = Math.sign(y - this.posY);
            const xSing = Math.sign(x - this.posX);
            let actY = this.posY;
            let actX = this.posX;
            do {
                inMiddle = legal = board.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + ySing;
            } while ((actX != x && actY != y) && !inMiddle)
            if (inMiddle) {
                legal = false;
            } else {
                legal = (board.board[actY][actX] != null && board.board[actY][actX].color != this.color) || (board.board[actY][actX] == null)
            }
        }
        return legal;
    }
}

class Queen extends Piece {
    constructor(x: number, y: number, color: 0 | 1) {
        super(x, y, color)
        this.type = 4;
    }

    isLegalMove(x: number, y: number, check: 0 | 1) {
        let legal = false;
        const board = new ChessBoard();
        let checkPiece: Piece[] = [];
        const ySing = Math.sign(y - this.posY);
        const xSing = Math.sign(x - this.posX);
        let actY = this.posY;
        let actX = this.posX;
        if ((Math.abs(x - this.posX) == Math.abs(y - this.posY))||(xSing == 0) || (ySing==0)){
            let inMiddle = false;
            do {
                inMiddle = legal = board.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + ySing;
            } while ((actX != x && actY != y) && !inMiddle)
            if (inMiddle) {
                legal = false;
            } else {
                legal = (board.board[actY][actX] != null && board.board[actY][actX].color != this.color) || (board.board[actY][actX] == null)
            }
        }
        return legal;
    }
}
