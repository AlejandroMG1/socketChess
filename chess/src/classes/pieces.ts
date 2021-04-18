export class ChessBoard{
    board: Piece [][];
    kings : number[][];
    mate: boolean;
    move(piece:Piece, x,y){};
    checkMate(){};
}

export class Piece{
    type: 0 | 1 | 2 | 3 | 4 | 5; // 0:peon, 1: torre, 2: alfil, 3: caballo, 4: reina, 5:rey
    posX: number;
    posY: number;
    color: 0 | 1;
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
    promotion(){};
}

class pawn extends Piece {
    constructor(){
        super()
        this.type = 0;
    }
}