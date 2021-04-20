import { Component } from '@angular/core';
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

  chesseBoard: ChessBoard = new ChessBoard(this.chessService)

  constructor(private chessService: ChessService, private socketService: SocketService) {
    this.chesseBoard.defaulBoard()
    this.chessService.chessBoard.next(this.chesseBoard);
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection().subscribe((data) => {
      this.room = data.room
      this.color = data.color
      this.oponentMoves();
    });

  }

  oponentMoves = () => {
    this.socketService.gedMoved(this.room, this.color).subscribe((data) => {
      this.chesseBoard.oponentMove(data);
    });
  }

  performAction(x, y) {
    const piece = this.chesseBoard.board[y][x]
    if (this.selectedPiece) {
      if (piece && piece.color == this.color) {
        this.selectedPiece = piece
      } else {
        const orgX = this.selectedPiece.posX
        const orgY = this.selectedPiece.posY
        if (this.chesseBoard.move(this.selectedPiece, x, y)) {
          this.socketService.sendMove(orgX, orgY, x, y, this.room, this.color);
        }

      }
    } else if (piece && piece.color == this.color) {
      this.selectedPiece = piece
    }
  }
}
