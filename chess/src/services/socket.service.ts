import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { Move } from 'src/classes/auxiliars';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket;

  constructor() { }

  setupSocketConnection(): Observable<any> {
    this.socket = io(environment.SOCKET_ENDPOINT);
    return new Observable((observer) => {
      this.socket.on('getPlayer', (data) => {
        observer.next(data)
      })
    })
  }

  sendStart(room:number){
    this.socket.emit('start', room)
  }

  getStart(room): Observable<any> {
    console.log(''+room+'start');
    
    return new Observable((observer) => {
      this.socket.on(''+room+'start', (data) => {
        console.log(data);
        
        observer.next(data)
      })
    })
  }

  sendMove(orgX: number, orgY: number, destX: number, destY: number, room: number, color: number) {
    this.socket.emit('move', { room, color, orgX, orgY, destX, destY })
  }

  gedMoved(room,color): Observable<Move> {
    return new Observable<Move>((observer) => {
      this.socket.on('' + room +((color+1)%2)+ 'move', (data) => {
        observer.next(data)
      })
    })
  }
}