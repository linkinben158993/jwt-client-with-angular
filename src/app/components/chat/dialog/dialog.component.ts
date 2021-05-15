import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data/data.service';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: any;
  classname: string;
}


// People message
const people: Tile[] = [
  { text: 1, cols: 1, rows: 2, color: 'lightblue', classname: 'icon' },
  { text: 2, cols: 4, rows: 1, color: 'lightgreen', classname: 'message' },
  { text: 3, cols: 2, rows: 1, color: 'lightpink', classname: 'action-1' },
  { text: 4, cols: 2, rows: 1, color: '#DDBDF1', classname: 'action-2' },
];

// My message
const mine: Tile[] = [
  { text: 2, cols: 4, rows: 1, color: 'lightgreen', classname: 'message' },
  { text: 1, cols: 1, rows: 2, color: 'lightblue', classname: 'icon' },
  { text: 3, cols: 2, rows: 1, color: 'lightpink', classname: 'action-1' },
  { text: 4, cols: 2, rows: 1, color: '#DDBDF1', classname: 'action-2' },
];


@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit, OnDestroy {

  private handlerSubscription: Subscription;

  @Input() dialogs: any[];
  @Input() messageHandler: Observable<any>;

  constructor(private dataService: DataService) {
    this.handlerSubscription = this.dataService.onGetCommand.subscribe((data) => {
      if (data.message.msgCommand === 'APPEND_CHAT') {
        this.dialogs.push(data.data);
      }
      if (data.message.msgCommand === 'APPEND_LIST_CHAT') {
        this.dialogs = this.dialogs.concat(data.data);
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.handlerSubscription.unsubscribe();
  }
}
