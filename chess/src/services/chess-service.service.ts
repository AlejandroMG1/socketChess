import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChessBoard, Piece } from 'src/classes/pieces';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  public chessBoard:BehaviorSubject<ChessBoard> = new BehaviorSubject(null)

  public whiteCheck:BehaviorSubject<Piece[]> = new BehaviorSubject([]) 

  public blackCheck:BehaviorSubject<Piece[]> = new BehaviorSubject([]) 

  public futureBoard:BehaviorSubject<ChessBoard> = new BehaviorSubject(null)

  constructor() { }
}
