import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { DataService } from 'src/app/services/data/data.service';
import { Subscription } from 'rxjs';

export interface Participants {
  name: string;
  position: number;
}

@Component({
  selector: 'app-participants',
  templateUrl: './participants.component.html',
  styleUrls: ['./participants.component.css']
})
export class ParticipantsComponent implements OnInit, OnDestroy {

  private handlerSubscription: Subscription;

  displayedColumns: string[] = ['select', 'position', 'name'];
  onlineUsers: TableVirtualScrollDataSource<Participants> = new TableVirtualScrollDataSource<Participants>();
  selection = new SelectionModel<Participants>(true, []);

  constructor(private dataService: DataService) {
    this.handlerSubscription = this.dataService.onGetCommand.subscribe((data) => {
      if (data.message.msgCommand === 'UPDATE_PARTICIPANTS') {
        this.onlineUsers.data = data.data;
      }
    });
  }

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.onlineUsers.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.handlerSubscription.unsubscribe();
  }


  applyFilter(filterValue: string): void {
    this.onlineUsers.filter = filterValue.trim().toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.onlineUsers.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selection.clear() :
      this.onlineUsers.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Participants): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
