import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChessBoard } from 'src/classes/pieces';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  public chessBoard:BehaviorSubject<ChessBoard> = new BehaviorSubject(null)

  constructor() { }
}
