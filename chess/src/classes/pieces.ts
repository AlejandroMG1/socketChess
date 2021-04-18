import { ChessService } from "src/services/chess-service.service";

export class ChessBoard {
    board: Piece[][];
    kings: number[][];
    mate: boolean;
    move(piece: Piece, x, y) { };
    defaulBoard() {
        this.board = [];
        for (let i = 0; i < 8; i++) {
            this.board[i]=[];
            for (let j = 0; j < 8; j++) {
                if (i == 1 || i == 6) {
                    this.board[i][j] = new Pawn(j, i, i < 4 ? 1 : 0)
                }else if(i == 0 || i == 7){
                    if(j == 0 || j == 7){
                        this.board[i][j] = new Tower(j, i, i < 4 ? 1 : 0)
                    }else if(j == 1 || j == 6){
                        this.board[i][j] = new Horse(j, i, i < 4 ? 1 : 0)
                    }else if(j == 2 || j == 5){
                        this.board[i][j] = new Bishop(j, i, i < 4 ? 1 : 0)
                    }else if(j == 3){
                        this.board[i][j] = new Queen(j, i, i < 4 ? 1 : 0)
                    }else if(j == 4){
                        this.board[i][j] = new King(j, i, i < 4 ? 1 : 0)
                    }
                }else{
                    this.board[i][j] = null;
                }
            }
        }
    };
    checkMate() { };
    promotion() { };
}

export class Piece {
    type: 0 | 1 | 2 | 3 | 4 | 5; // 0:peon, 1: torre, 2: alfil, 3: caballo, 4: reina, 5:rey
    posX: number;
    posY: number;
    color: 0 | 1; //0 las blancas y 1 las negras
    chesseService:ChessService
    constructor(x: number, y: number, color: 0 | 1) {
        this.posX = x;
        this.posY = y;
        this.color = color
    }
    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        return false
    };
    validateMove(x: number, y: number, check: 0 | 1): boolean {
        return false;
    };
    check(cheeseBoard: ChessBoard) { }
}

class Tower extends Piece {
    constructor(posx, posy, color) {
        super(posx, posy, color);
        this.type = 1;
    }

    chessboard: ChessBoard;

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        if (this.chessboard[y][x].color == this.color) {
            return false;
        } else if (checkKing && (x == this.chessboard.kings[this.color + 1 % 2][0] && 1 == this.chessboard.kings[this.color + 1 % 2][1])) {
            return false
        }
        if (x == this.posX) {
            if (y >= this.posY) {
                for (let i = this.posY; i < y; i++) {
                    if (this.chessboard[i][x]) {
                        return false;
                    }
                }
                return true;
            } else {
                for (let i = this.posY; i > y; i--) {
                    if (this.chessboard[i][x]) {
                        return false;
                    }
                }
                return true;
            }
        }
        else if (y == this.posY) {
            if (x >= this.posX) {
                for (let i = this.posX; i < x; i++) {
                    if (this.chessboard[y][i]) {
                        return false;
                    }
                }
                return true;
            } else {
                for (let i = this.posX; i > x; i--) {
                    if (this.chessboard[y][i]) {
                        return false;
                    }
                }
                return true;
            }
        } else {
            return false;
        }
    }
}

class Horse extends Piece {
    constructor(posx, posy, color) {
        super(posx, posy, color);
        this.type = 3;
    }

    chessboard: ChessBoard;

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        if (this.chessboard[y][x].color == this.color) {
            return false;
        } else if (checkKing && (x == this.chessboard.kings[this.color + 1 % 2][0] && 1 == this.chessboard.kings[this.color + 1 % 2][1])) {
            return false
        }
        if (Math.abs(x - this.posX) == 2 && Math.abs(y - this.posY) == 1) {
            return true;
        }
        else if (Math.abs(x - this.posX) == 1 && Math.abs(y - this.posY) == 2) {
            return true;
        } else {
            return false;
        }
    };
}

class King extends Piece {
    constructor(posx, posy, color) {
        super(posx, posy, color);
        this.type = 5;
    }

    chessboard: ChessBoard;

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        if (this.chessboard[y][x].color == this.color) {
            return false;
        } else if (checkKing && (x == this.chessboard.kings[this.color + 1 % 2][0] && 1 == this.chessboard.kings[this.color + 1 % 2][1])) {
            return false
        }
        if (Math.abs(x - this.posX) < 2 && Math.abs(y - this.posY) < 2) {
            return true;
        } else {
            return false;
        }
    };
}

class Pawn extends Piece {
    constructor(x: number, y: number, color: 0 | 1) {
        super(x, y, color)
        this.type = 0;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean) {
        let legal = false;
        const board = this.chesseService.chessBoard.getValue();
        let checkPiece: Piece[] = [];
        if (checkKing && (x == board.kings[this.color + 1 % 2][0] && 1 == board.kings[this.color + 1 % 2][1])) {
            legal = false
            return legal;
        }

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

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean) {
        let legal = false;
        const board = new ChessBoard();
        let checkPiece: Piece[] = [];
        if (checkKing && (x == board.kings[this.color + 1 % 2][0] && 1 == board.kings[this.color + 1 % 2][1])) {
            legal = false
            return legal;
        }
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

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean) {
        let legal = false;
        const board = this.chesseService.chessBoard.getValue();
        let checkPiece: Piece[] = [];
        if (checkKing && (x == board.kings[this.color + 1 % 2][0] && 1 == board.kings[this.color + 1 % 2][1])) {
            legal = false
            return legal;
        }
        const ySing = Math.sign(y - this.posY);
        const xSing = Math.sign(x - this.posX);
        let actY = this.posY;
        let actX = this.posX;
        if ((Math.abs(x - this.posX) == Math.abs(y - this.posY)) || (xSing == 0) || (ySing == 0)) {
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
