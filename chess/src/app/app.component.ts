import { Component } from '@angular/core';
import { ChessBoard, Piece } from 'src/classes/pieces';
import { ChessService } from 'src/services/chess-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chess';

  selectedPiece:Piece = null;

  targetCordinates:number[]=[];

  chesseBoard:ChessBoard = new ChessBoard()

  constructor(private chessService:ChessService){
    this.chesseBoard.defaulBoard()
    this.chessService.chessBoard.next(this.chesseBoard);
  }

  performAction(x,y){
    const piece = this.chesseBoard.board[y][x]
    if(this.selectedPiece){
      if(piece){
        this.selectedPiece = piece
      }else{
        console.log(this.selectedPiece.isLegalMove(x,y,0,false));
      }
    }else if(piece){
        this.selectedPiece = piece
      }
  }
}
