import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChessBoard, Piece } from 'src/classes/pieces';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  public chessBoard: BehaviorSubject<ChessBoard> = new BehaviorSubject(null);
  public semaphore: BehaviorSubject<number> = new BehaviorSubject(32);
  public trigger: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public whiteCheck: BehaviorSubject<Piece[]> = new BehaviorSubject([])

  public blackCheck: BehaviorSubject<Piece[]> = new BehaviorSubject([])

  public futureBoard: BehaviorSubject<ChessBoard> = new BehaviorSubject(null)

  public sendTrigger:  BehaviorSubject<boolean> = new BehaviorSubject(false)

  constructor() { }

  UpdateSendTrigger(value: boolean){
    this.sendTrigger.next(value);
  }

  addCheck(piece: Piece) {
    if (piece.color === 1) {
      this.whiteCheck.value.push(piece);
    }else{
      this.blackCheck.value.push(piece);
    }
  }

  resetCheck(){
    this.whiteCheck.next([]);
    this.blackCheck.next([]);
  }

  up() {
    this.semaphore.next(32);
  }

  down() {
    let value = this.semaphore.value;
    this.semaphore.next(value - 1);
  }

  changeTrigger(value) {
    this.trigger.next(value);
  }

  cloneBoard(board: ChessBoard) {
    let aux1 = this.cloneMatrix(board.board);
    let aux2 = this.cloneMatrix(board.kings);
    let auxboard = Object.assign({}, board);
    auxboard.board = aux1;
    auxboard.kings = aux2;
    return auxboard;
  }

  cloneMatrix(value: any) {
    let clonned = [];
    value.forEach(element => {
      clonned.push(Object.assign({}, element));
    });
    return clonned;
  }

  deep<T>(value: T): T {
    if (typeof value !== "object" || value === null) {
      return value;
    }
    if (Array.isArray(value)) {
      return this.deepArray(value);
    }
    return this.deepObject(value);
  }

  private deepObject<T>(source: T) {
    const result = {};
    Object.keys(source).forEach((key) => {
      const value = source[key];
      result[key] = this.deep(value);
    }, {});
    return result as T;
  }

  private deepArray(collection) {
    return collection.map((value) => {
      return this.deep(value);
    });
  }

}
