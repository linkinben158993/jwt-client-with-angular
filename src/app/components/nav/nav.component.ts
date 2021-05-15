import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { DataService } from 'src/app/services/data/data.service';
import { NotificationService } from 'src/app/services/notificationService/notification.service';

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
    private message: NotificationService) {
    this.display = false;
    this.subscription = this.dataService.onGetCommand.subscribe((item) => {
      if (item['message']['msgCommand'] === 'START_PROGRESS_BAR') {
        this.startProgressDisplay();
      }
      if (item['message']['msgCommand'] === 'STOP_PROGRESS_BAR') {
        this.stopProgressDisplay();
      }
      if (item['message']['msgBody']) {
        this.message.showNotification(item['message']['msgBody'], 3);
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
}
