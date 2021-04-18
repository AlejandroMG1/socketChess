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
    isLegalMove(x:number, y:number, check: 0 | 1):boolean{
        return false
    };
    validateMove(x:number, y:number, check: 0 | 1):boolean{
        return false;
    };
    check(cheeseBoard:ChessBoard){}
}

1/3/5;

class pawn extends Piece {
    constructor(){
        super();
        this.type = 0;
    }
}

class tower extends Piece{
    constructor(posx, posy){
        super();
        this.posX = posx;
        this.posY = posy;
        this.type = 1;
    }
}