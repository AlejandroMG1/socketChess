import { ChessService } from "src/services/chess-service.service";
import { Move } from "./auxiliars";

export class ChessBoard {
    board: Piece[][];
    kings: number[][];
    mate: boolean;
    move(piece: Piece, x, y): boolean {
        let moved = false;
        const first_x = piece.posX;
        const first_y = piece.posY;
        if (piece.isLegalMove(x, y, 0, true)) {
            this.board[y][x] = piece;
            this.board[first_y][first_x] = null;
            piece.posX = x;
            piece.posY = y;
            moved = true;
        }
        return moved
    };

    oponentMove(move: Move) {
        const piece = this.board[move.orgY][move.orgX]
        this.board[move.destY][move.destX] = piece;
        this.board[move.orgY][move.orgX] = null;
        piece.posX = move.destX;
        piece.posY = move.destY;
    }


    constructor(private chessService: ChessService) {

    }
    defaulBoard() {
        this.board = [];
        this.kings = [];
        let counter = 0;
        for (let i = 0; i < 8; i++) {
            this.board[i] = [];
            for (let j = 0; j < 8; j++) {
                if (i == 1 || i == 6) {
                    this.board[i][j] = new Pawn(j, i, i < 4 ? 1 : 0, this.chessService)
                } else if (i == 0 || i == 7) {
                    if (j == 0 || j == 7) {
                        this.board[i][j] = new Tower(j, i, i < 4 ? 1 : 0, this.chessService)
                    } else if (j == 1 || j == 6) {
                        this.board[i][j] = new Horse(j, i, i < 4 ? 1 : 0, this.chessService)
                    } else if (j == 2 || j == 5) {
                        this.board[i][j] = new Bishop(j, i, i < 4 ? 1 : 0, this.chessService)
                    } else if (j == 3) {
                        this.board[i][j] = new Queen(j, i, i < 4 ? 1 : 0, this.chessService)
                    } else if (j == 4) {
                        this.board[i][j] = new King(j, i, i < 4 ? 1 : 0, this.chessService)
                        this.kings[i < 4 ? 1 : 0] = [];
                        this.kings[i < 4 ? 1 : 0][0] = i;
                        this.kings[i < 4 ? 1 : 0][1] = j;
                        this.kings[i < 4 ? 1 : 0][2] = 0;
                    }
                } else {
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
    chesseService: ChessService
    constructor(x: number, y: number, color: 0 | 1, chessService: ChessService) {
        this.posX = x;
        this.posY = y;
        this.color = color
        this.chesseService = chessService
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
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 1;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        const chessboard: ChessBoard = this.chesseService.chessBoard.getValue();
        if ((chessboard.board[y][x] != null) && (chessboard.board[y][x].color == this.color)) {
            return false;
        } else if (checkKing && (x == chessboard.kings[(this.color + 1) % 2][0] && 1 == chessboard.kings[(this.color + 1) % 2][1])) {
            return false
        }
        if (x == this.posX) {
            if (y >= this.posY) {
                for (let i = this.posY + 1; i < y; i++) {
                    if (chessboard.board[i][x]) {
                        return false;
                    }
                }
                return true;
            } else {
                for (let i = this.posY - 1; i > y; i--) {
                    if (chessboard.board[i][x]) {
                        return false;
                    }
                }
                return true;
            }
        }
        else if (y == this.posY) {
            if (x >= this.posX) {
                for (let i = this.posX + 1; i < x; i++) {
                    if (chessboard.board[y][i]) {
                        return false;
                    }
                }
                return true;
            } else {
                for (let i = this.posX - 1; i > x; i--) {
                    if (chessboard.board[y][i]) {
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
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 3;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        const chessboard: ChessBoard = this.chesseService.chessBoard.getValue();
        if ((chessboard.board[y][x] != null) && (chessboard.board[y][x].color == this.color)) {
            return false;
        } else if (checkKing && (x == chessboard.kings[(this.color + 1) % 2][0] && 1 == chessboard.kings[(this.color + 1) % 2][1])) {
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
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 5;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean): boolean {
        const chessboard: ChessBoard = this.chesseService.chessBoard.getValue();
        if ((chessboard.board[y][x] != null) && (chessboard.board[y][x].color == this.color)) {
            return false;
        } else if (checkKing && (x == chessboard.kings[(this.color + 1) % 2][0] && 1 == chessboard.kings[(this.color + 1) % 2][1])) {
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
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 0;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean) {
        let legal = false;
        const board = this.chesseService.chessBoard.getValue();
        let checkPiece: Piece[] = [];
        if (checkKing && (x == board.kings[(this.color + 1) % 2][0] && 1 == board.kings[(this.color + 1) % 2][1])) {
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
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 2;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean) {
        let legal = false;
        const board = this.chesseService.chessBoard.getValue();
        let checkPiece: Piece[] = [];
        if (checkKing && (x == board.kings[(this.color + 1) % 2][0] && 1 == board.kings[(this.color + 1) % 2][1])) {
            legal = false
            return legal;
        }
        if ((Math.abs(x - this.posX) == Math.abs(y - this.posY))) {
            let inMiddle = false;
            const ySing = Math.sign(y - this.posY);
            const xSing = Math.sign(x - this.posX);
            let actY = this.posY + ySing;
            let actX = this.posX + xSing;
            while ((actX != x && actY != y) && !inMiddle) {
                inMiddle = board.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + xSing;
            }
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
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 4;
    }

    isLegalMove(x: number, y: number, check: 0 | 1, checkKing: boolean) {
        let legal = false;
        const board = this.chesseService.chessBoard.getValue();
        let checkPiece: Piece[] = [];
        if (checkKing && (x == board.kings[(this.color + 1) % 2][0] && 1 == board.kings[(this.color + 1) % 2][1])) {
            legal = false
            return legal;
        }
        const ySing = Math.sign(y - this.posY);
        const xSing = Math.sign(x - this.posX);
        let actY = this.posY + ySing;
        let actX = this.posX + xSing;
        if ((Math.abs(x - this.posX) == Math.abs(y - this.posY)) || (xSing == 0) || (ySing == 0)) {
            let inMiddle = false;
            while ((actX != x && actY != y) && !inMiddle) {
                inMiddle = legal = board.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + xSing;
            }
            if (inMiddle) {
                legal = false;
            } else {
                legal = (board.board[actY][actX] != null && board.board[actY][actX].color != this.color) || (board.board[actY][actX] == null)
            }
        }
        return legal;
    }
}
