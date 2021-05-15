import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private commandSource = new BehaviorSubject('Default Message');

  currentCommand = this.commandSource.asObservable();

  onGetCommand: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  changeCommand(command: any): void {
    this.commandSource.next(command);
  }

  getCommand(command: any): void {
    this.onGetCommand.emit(command);
  }
}
