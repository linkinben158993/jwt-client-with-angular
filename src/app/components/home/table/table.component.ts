import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Users } from 'src/app/models/admin-users/users.model';
import { DataService } from 'src/app/services/data/data.service';
import { AdminUserService } from 'src/app/services/userService/admin-user.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnInit {
  displayedColumns: string[] = ['no', 'uId', 'fullName', 'email', 'role'];
  dataSource: MatTableDataSource<Users>;
  subscription: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private usersService: AdminUserService,
    private dataService: DataService) {
  }

  ngOnInit(): void {
    console.log('Do On Init Stuff!');
    this.dataSource = new MatTableDataSource();
    this.dataService.onGetCommand.emit({
      message: {
        msgCommand: 'START_PROGRESS_BAR',
      },
      isReload: false,
    });
    this.subscription = this.dataService.onGetCommand.subscribe((item) => {
      if (item['isReload']) {
        this.loadAllUsers();
      }
    });
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.usersService.getAllUser().subscribe((data) => {
      // Contract-first (O-4b): UserResponse carries a flat `role` string ("NO_ROLE" sentinel when unassigned)
      // instead of the old nested roles[] entity graph.
      const dataWithRole = data.map((item) => ({
        ...item,
        role: (!item.role || item.role === 'NO_ROLE') ? 'No Role Yet!' : item.role,
      }));
      this.dataSource.data = dataWithRole;
    }, error => error, () => {
      this.dataService.onGetCommand.emit({
        message: {
          msgBody: 'Fetch all users comlete!',
          msgCommand: 'STOP_PROGRESS_BAR',
        },
        isReload: false,
      });
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
