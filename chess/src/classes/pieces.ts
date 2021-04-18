export class ChessBoard{
    board: Piece [][];
    kings : number[][];
    mate: boolean;
    move(piece:Piece, x,y){};
    checkMate(){};
    promotion(){};
}

export class Piece{
    type: 0 | 1 | 2 | 3 | 4 | 5; // 0:peon, 1: torre, 2: alfil, 3: caballo, 4: reina, 5:rey
    posX: number;
    posY: number;
    color: 0 | 1; //0 las blancas y 1 las negras
    constructor(x:number,y:number, color:0 | 1){
        this.posX = x;
        this.posY = y;
        this.color = color
    }
    isLegalMove(x:number, y:number, check: 0 | 1):boolean{
        return false
    };
    validateMove(x:number, y:number, check: 0 | 1):boolean{
        return false;
    };
    check(cheeseBoard:ChessBoard){}
}


class pawn extends Piece {
    constructor(){
        super();
        this.type = 0;
    }
}

class Tower extends Piece{
    constructor(posx, posy, color){
        super(posx, posy,color);
        this.type = 1;
    }

    chessboard: ChessBoard;

    isLegalMove(x:number, y:number, check: 0 | 1): boolean{
        if(this.chessboard[y][x].color == this.color){
            return false;
        }
        if(x == this.posX){
            if(y >= this.posY){
                for (let i = this.posY; i < y; i++){
                    if(this.chessboard[i][x]){
                        return false;
                    }
                }
                return true;
            }else{
                for (let i = this.posY; i > y; i--){
                    if(this.chessboard[i][x]){
                        return false;
                    }
                }
                return true;
            }
        }
        else if (y == this.posY){
            if(x >= this.posX){
                for (let i = this.posX; i < x; i++){
                    if(this.chessboard[y][i]){
                        return false;
                    }
                }
                return true;
            }else{
                for (let i = this.posX; i > x; i--){
                    if(this.chessboard[y][i]){
                        return false;
                    }
                }
                return true;
            }
        }else{
            return false;
        }
    }
}

class Horse extends Piece{
    constructor(posx, posy, color){
        super(posx, posy,color);
        this.type = 3;
    }

    chessboard: ChessBoard;

    isLegalMove(x:number, y:number, check: 0 | 1):boolean{
        if(this.chessboard[y][x].color == this.color){
            return false;
        }
        if(Math.abs(x-this.posX) == 2 && Math.abs(y-this.posY) == 1){
            return true;
        }
        else if(Math.abs(x-this.posX) == 1 && Math.abs(y-this.posY) == 2){
            return true;
        }else{
            return false;
        }
    };
}

class King extends Piece{
    constructor(posx, posy, color){
        super(posx, posy,color);
        this.type = 3;
    }

    chessboard: ChessBoard;

    isLegalMove(x:number, y:number, check: 0 | 1):boolean{
        if(this.chessboard[y][x].color == this.color){
            return false;
        }
        if(Math.abs(x - this.posX) < 2 && Math.abs(y - this.posY) < 2){
            return true;
        }else{
            return false;
        }
    };
}