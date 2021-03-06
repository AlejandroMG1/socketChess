import { Component } from '@angular/core';
import { take } from 'rxjs/operators';
import { ChessBoard, Piece } from 'src/classes/pieces';
import { ChessService } from 'src/services/chess-service.service';
import { SocketService } from 'src/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'chess';

  selectedPiece: Piece = null;

  targetCordinates: number[] = [];

  room: number;

  color: number;

  moveAllowed = false;

  wWin = false;

  chesseBoard: ChessBoard = new ChessBoard(this.chessService)

  constructor(private chessService: ChessService, private socketService: SocketService) {
    this.chesseBoard.defaulBoard()
    this.chessService.chessBoard.next(this.chesseBoard);
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection().subscribe((data) => {
      this.room = data.room
      this.color = data.color
      if (this.color == 0) {
        this.startGame();
      } else if (this.color == 1) {
        this.socketService.sendStart(this.room)
      }
      this.oponentMoves();
      this.getWWin();
    });

  }

  oponentMoves = () => {
    this.socketService.gedMoved(this.room, this.color).subscribe((data) => {
      this.chesseBoard.oponentMove(data);
      this.moveAllowed = true;
    });
  }

  startGame = () => {
    this.socketService.getStart(this.room).subscribe((start) => {
      console.log(start);
      this.moveAllowed = true;
    })
  }

  getWWin = () => {
    this.socketService.getWWin(this.room,this.color).subscribe((win) => {
      this.wWin = true;
      this.moveAllowed = false;
    })
  }

  performAction(x, y) {
    if (this.moveAllowed) {
      const piece = this.chesseBoard.board[y][x]
      if (this.selectedPiece) {
        if (piece && piece.color == this.color) {
          this.selectedPiece = piece
        } else {
          const orgX = this.selectedPiece.posX
          const orgY = this.selectedPiece.posY;
          this.chesseBoard.move(this.selectedPiece, x, y);
          this.chessService.sendTrigger.pipe(take(1)).subscribe((data) => {
            if (data) {
              this.socketService.sendMove(orgX, orgY, x, y, this.room, this.color);
              this.moveAllowed = false;
              console.log("here");
              this.chessService.UpdateSendTrigger(false);
            }
          });
        }
      } else if (piece && piece.color == this.color) {
        this.selectedPiece = piece
      }
    }
  }
}
