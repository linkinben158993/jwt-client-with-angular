import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/data/data.service';
import { NotificationService } from 'src/app/services/notificationService/notification.service';
import { LogOut } from 'src/app/stores/actions/auth.actions';
import { AppState } from 'src/app/stores/app.states';
import { DialogData, ModalComponent } from '../login/modal/modal.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent {

  display: boolean;
  adminCommand: string;
  subscription: Subscription;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthServiceService,
    private dataService: DataService,
    private message: NotificationService,
    private store: Store<AppState>,
    public dialog: MatDialog) {
    this.display = false;
    this.subscription = this.dataService.onGetCommand.subscribe((item) => {
      if (item.message.msgCommand === 'START_PROGRESS_BAR') {
        this.startProgressDisplay();
      }
      if (item.message.msgCommand === 'STOP_PROGRESS_BAR') {
        this.stopProgressDisplay();
      }
      if (item.message.msgBody) {
        this.message.showNotification(item.message.msgBody, 3);
      }
    });
  }

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  isVisible(): boolean {
    return this.authService.isLoggedIn();
  }

  startProgressDisplay(): void {
    this.display = true;
  }

  stopProgressDisplay(): void {
    this.display = false;
  }

  isProgressDisplay(): boolean {
    return this.display;
  }

  processAdminReferral(): void {
    console.log('Refer new admin!');
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '600px',
      height: '500px',
      data: { action: 'refer', username: '', fullName: '', additionalInfo: [] }
    });

    dialogRef.afterClosed().subscribe(
      {
        next: (result: DialogData) => {
          if (result) {
            if (!result.username || !result.fullName) {
              this.message.showNotification('Must Fill In Information To Refer', 3);
              console.log('The dialog was closed without data!');
            }
            else {
              const { username, fullName } = result;
              if (result.additionalInfo.length > 0 || result.additionalInfo.valid) {
                console.log('Do extra stuff');
                const info = {};
                for (let i = 0; i < result.additionalInfo.length; ++i) {
                  info[result.additionalInfo.value[i].selected] = result.additionalInfo.value[i].detail;
                }
                const adminUser = {
                  username,
                  fullName,
                  ...info,
                };
                console.log('Result:', adminUser);

              } else {
                console.log('Do your stuff');
                const defaultAdminUser = {
                  username, fullName, password: 'DEFAULT-PASSWORD'
                };
                console.log('Result:', defaultAdminUser);
              }
            }
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }

  processLogout(): void {
    this.store.dispatch(new LogOut());
  }

  processEditProfile(): void {
    console.log('Edit profile here!');
  }
}
