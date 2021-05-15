import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataService } from 'src/app/services/data/data.service';
import { AdminUserService } from 'src/app/services/userService/admin-user.service';
import { AppState, selectAuthState } from 'src/app/stores/app.states';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  getState: Observable<any>;

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'All Users', cols: 1, rows: 1 },
        ];
      }

      return [
        { title: 'All Users', cols: 1, rows: 1 },
      ];
    })
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private dataService: DataService,
    private usersService: AdminUserService) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.getState.subscribe((state) => {
      console.log('Init Home:', state);
    });
  }

  grantBasicUserRole(event): void {
    event.preventDefault();
    this.dataService.onGetCommand.emit({
      message: {
        msgCommand: 'START_PROGRESS_BAR',
      }
    });
    this.adminChangeRole();
  }

  private adminChangeRole(): void {
    this.usersService.updateAllUnRoledUser().subscribe((data) => {
      console.log('User service success:', data);
      this.dataService.onGetCommand.emit({
        message: {
          msgBody: 'Change role success!',
          msgCommand: 'STOP_PROGRESS_BAR',
        },
        isReload: true,
      });
    }, (error) => {
      console.log('User service error:', error);
      this.dataService.onGetCommand.emit({
        message: {
          msgBody: 'Change role error!',
          msgCommand: 'STOP_PROGRESS_BAR',
        },
        isReload: true,
      });
    });
  }
}
