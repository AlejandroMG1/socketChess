import { ChessService } from "src/services/chess-service.service";
import { Move } from "./auxiliars";
import { take } from 'rxjs/operators';

export class ChessBoard {
    board: Piece[][];
    kings: number[][];
    mate: boolean;
    move(piece: Piece, x, y): boolean {
        let moved = false;
        const first_x = piece.posX;
        const first_y = piece.posY;
        if (piece.isLegalMove(x, y, 0, true)) {
            if(piece.type === 5){
                this.kings[(piece.color)][0] = x;
                this.kings[(piece.color)][0] = y;
            }
            let future_board = this.chessService.cloneBoard(this);
            console.log(future_board);
            future_board.board[y][x] = piece;
            future_board.board[first_y][first_x] = null;
            let beforex = piece.posX;
            let beforey = piece.posY;
            piece.posX = x;
            piece.posY = y;
            moved = true;
            this.chessService.futureBoard.next(future_board);
            this.chessService.resetCheck();/* 
            console.log(this.chessService.blackCheck.value); */
            this.chessService.changeTrigger(true);
            this.chessService.changeTrigger(false);
            let actualCheck = 0;
            /* let suscription = this.chessService.semaphore.subscribe() */
            this.chessService.semaphore.pipe(take(32)).subscribe(
                (data) => {
                    console.log(data);
                    if (data === 0) {/* 
                        console.log(this.chessService.futureBoard);
                        console.log(this.chessService.blackCheck.value); */
                        if (piece.color === 0) {
                            if (this.chessService.whiteCheck.value.length > 0) {
                                moved = false;
                                piece.posX = beforex;
                                piece.posY = beforey;
                                if(piece.type === 5){
                                    this.kings[(piece.color)][0] = beforex;
                                    this.kings[(piece.color)][0] = beforey;
                                }
                                return;
                            }
                        } else {
                            console.log(this.chessService.blackCheck.value.length);
                            if (this.chessService.blackCheck.value.length > 0) {
                                moved = false;
                                piece.posX = beforex;
                                piece.posY = beforey;
                                if(piece.type === 5){
                                    this.kings[(piece.color)][0] = beforex;
                                    this.kings[(piece.color)][0] = beforey;
                                }
                                this.chessService.up();
                                return;
                            }
                        }
                        this.board[y][x] = piece;   
                        this.board[first_y][first_x] = null
                        console.log(this);
                        this.chessService.chessBoard.next(this);
                        this.chessService.up();
                        this.chessService.UpdateSendTrigger(true);
                    }
                }
            )
            /* console.log(piece.check(this)); */
        }
        return moved
    };

    oponentMove(move: Move) {
        const piece = this.board[move.orgY][move.orgX]
        this.board[move.destY][move.destX] = piece;
        this.board[move.orgY][move.orgX] = null;
        piece.posX = move.destX;
        piece.posY = move.destY;
        this.chessService.futureBoard.next(this);
        this.chessService.changeTrigger(true);
        this.chessService.changeTrigger(false);
        this.chessService.up();
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
                        this.kings[i < 4 ? 1 : 0][0] = j;
                        this.kings[i < 4 ? 1 : 0][1] = i;
                        this.kings[i < 4 ? 1 : 0][2] = 0;
                    }
                } else {
                    this.board[i][j] = null;
                }
            }
        }
    };
    checkMate(board: ChessBoard) {

    };
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
    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {
        return false
    };
    validateMove(x: number, y: number, check: 0 | 1): boolean {
        return false;
    };
    check(cheeseBoard: ChessBoard) {
        return true
    }
}

class Tower extends Piece {
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 1;
        this.chesseService.trigger.subscribe(
            (data) => {
                if (data) {
                    let board = this.chesseService.futureBoard.value;
                    if (this.check(board)) {
                        this.chesseService.addCheck(this);
                    }
                    this.chesseService.down()
                }
            }
        )
    }

    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {
        const chessboard: ChessBoard = board ? board : this.chesseService.chessBoard.getValue();
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

    check(cheeseBoard: ChessBoard) {
        return this.isLegalMove(cheeseBoard.kings[(this.color + 1) % 2][0], cheeseBoard.kings[(this.color + 1) % 2][1], cheeseBoard.kings[(this.color + 1) % 2][2], false, cheeseBoard)
    }
}

class Horse extends Piece {
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 3;
        this.chesseService.trigger.subscribe(
            (data) => {
                if (data) {
                    let board = this.chesseService.futureBoard.value;
                    if (this.check(board)) {
                        this.chesseService.addCheck(this);
                    }
                    this.chesseService.down()
                }
            }
        )
    }

    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {

        const chessboard: ChessBoard = board ? board : this.chesseService.chessBoard.getValue();
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

    check(cheeseBoard: ChessBoard) {
        return this.isLegalMove(cheeseBoard.kings[(this.color + 1) % 2][0], cheeseBoard.kings[(this.color + 1) % 2][1], cheeseBoard.kings[(this.color + 1) % 2][2], false, cheeseBoard)
    }
}

class King extends Piece {
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 5;
        this.chesseService.trigger.subscribe(
            (data) => {
                if (data) {
                    let board = this.chesseService.futureBoard.value;
                    if (this.check(board)) {
                        this.chesseService.addCheck(this);
                    }
                    this.chesseService.down()
                }
            }
        )
    }

    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {

        const chessboard: ChessBoard = board ? board : this.chesseService.chessBoard.getValue();
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

    check(cheeseBoard: ChessBoard) {
        return this.isLegalMove(cheeseBoard.kings[(this.color + 1) % 2][0], cheeseBoard.kings[(this.color + 1) % 2][1], cheeseBoard.kings[(this.color + 1) % 2][2], false, cheeseBoard)
    }
}

class Pawn extends Piece {
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 0;
        this.chesseService.trigger.subscribe(
            (data) => {
                if (data) {
                    let board = this.chesseService.futureBoard.value;
                    if (this.check(board)) {
                        this.chesseService.addCheck(this);
                    }
                    this.chesseService.down()
                }
            }
        )
    }

    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {
        const chessboard: ChessBoard = board ? board : this.chesseService.chessBoard.getValue();
        let legal = false;
        let checkPiece: Piece[] = [];
        if (checkKing && (x == chessboard.kings[(this.color + 1) % 2][0] && 1 == chessboard.kings[(this.color + 1) % 2][1])) {
            legal = false
            return legal;
        }
        if ((this.color == 0 && y == this.posY - 1) || (this.color == 1 && y == this.posY + 1)) {
            if (x == this.posX) {
                if (check == 0) {
                    legal = (chessboard.board[y][x] == null);
                }
            } else if (Math.abs(x - this.posX) == 1) {
                if (check == 0) {
                    legal = (chessboard.board[y][x] != null) && (chessboard.board[y][x].color != this.color);
                }
            }
        }
        return legal;
    }
    check(cheeseBoard: ChessBoard) {
        return this.isLegalMove(cheeseBoard.kings[(this.color + 1) % 2][0], cheeseBoard.kings[(this.color + 1) % 2][1], cheeseBoard.kings[(this.color + 1) % 2][2], false, cheeseBoard)
    }
}

class Bishop extends Piece {
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 2;
        this.chesseService.trigger.subscribe(
            (data) => {
                if (data) {
                    let board = this.chesseService.futureBoard.value;
                    if (this.check(board)) {
                        this.chesseService.addCheck(this);
                    }
                    this.chesseService.down()
                }
            }
        )
    }

    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {

        const chessboard: ChessBoard = board ? board : this.chesseService.chessBoard.getValue();
        let legal = false;
        let checkPiece: Piece[] = [];
        if (checkKing && (x == chessboard.kings[(this.color + 1) % 2][0] && 1 == chessboard.kings[(this.color + 1) % 2][1])) {
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
                inMiddle = chessboard.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + xSing;
            }
            if (inMiddle) {
                legal = false;
            } else {
                legal = (chessboard.board[actY][actX] != null && chessboard.board[actY][actX].color != this.color) || (chessboard.board[actY][actX] == null)
            }
        }
        return legal;
    }

    check(cheeseBoard: ChessBoard) {
        return this.isLegalMove(cheeseBoard.kings[(this.color + 1) % 2][0], cheeseBoard.kings[(this.color + 1) % 2][1], cheeseBoard.kings[(this.color + 1) % 2][2], false, cheeseBoard)
    }
}

class Queen extends Piece {
    constructor(posx, posy, color, chessService) {
        super(posx, posy, color, chessService);
        this.type = 4;
        this.chesseService.trigger.subscribe(
            (data) => {
                if (data) {
                    let board = this.chesseService.futureBoard.value;
                    if (this.check(board)) {
                        this.chesseService.addCheck(this);
                    }
                    this.chesseService.down()
                }
            }
        )
    }

    isLegalMove(x: number, y: number, check: number, checkKing: boolean, board?: ChessBoard): boolean {

        const chessboard: ChessBoard = board ? board : this.chesseService.chessBoard.getValue();
        let legal = false;
        let checkPiece: Piece[] = [];
        if (checkKing && (x == chessboard.kings[(this.color + 1) % 2][0] && 1 == chessboard.kings[(this.color + 1) % 2][1])) {
            legal = false
            return legal;
        }
        const ySing = Math.sign(y - this.posY);
        const xSing = Math.sign(x - this.posX);
        let actY = this.posY + ySing;
        let actX = this.posX + xSing;
        let inMiddle = false;
        if ((Math.abs(x - this.posX) == Math.abs(y - this.posY))) {
            while ((actX != x && actY != y) && !inMiddle) {
                inMiddle = chessboard.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + xSing;
            }
            if (inMiddle) {
                legal = false;
            } else {
                legal = (chessboard.board[actY][actX] != null && chessboard.board[actY][actX].color != this.color) || (chessboard.board[actY][actX] == null)
            }
        } else if ((xSing == 0) || (ySing == 0)) {
            while ((actX != x || actY != y) && !inMiddle) {
                inMiddle = chessboard.board[actY][actX] != null;
                actY = actY + ySing;
                actX = actX + xSing;
            }
            if (inMiddle) {
                legal = false;
            } else {
                legal = (chessboard.board[actY][actX] != null && chessboard.board[actY][actX].color != this.color) || (chessboard.board[actY][actX] == null)
            }
        }
        return legal;
    }

    check(cheeseBoard: ChessBoard) {
        return this.isLegalMove(cheeseBoard.kings[(this.color + 1) % 2][0], cheeseBoard.kings[(this.color + 1) % 2][1], 0, false, cheeseBoard)
    }
}
