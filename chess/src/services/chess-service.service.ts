import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChessBoard } from 'src/classes/pieces';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  public chessBoard: BehaviorSubject<ChessBoard> = new BehaviorSubject(null);
  public semaphore: BehaviorSubject<number> = new BehaviorSubject(12);
  public trigger:BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() { }

  up() {
    this.semaphore.next(12);
  }

  down() {
    let value = this.semaphore.value;
    this.semaphore.next(value - 1);
  }

  changeTrigger(value){
    this.trigger.next(value);
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
