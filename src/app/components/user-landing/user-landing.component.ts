import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { AdminUserService } from 'src/app/services/userService/admin-user.service';
import { AppState, selectAuthState } from 'src/app/stores/app.states';

@Component({
  selector: 'app-user-landing',
  templateUrl: './user-landing.component.html',
  styleUrls: ['./user-landing.component.css']
})
export class UserLandingComponent implements OnInit {
  username: string = '';
  role: string = '';
  profile: any = null;
  loading = false;
  error: string | null = null;

  constructor(
    private store: Store<AppState>,
    private authService: AuthServiceService,
    private userService: AdminUserService
  ) {}

  ngOnInit(): void {
    this.store.select(selectAuthState).subscribe((state: any) => {
      this.username = state?.user?.username ?? '';
      this.role = state?.role ?? '';
    });
    this.loadProfile();
  }

  loadProfile(): void {
    const token = this.authService.getAccessToken();
    if (!token) return;
    this.loading = true;
    this.userService.getUserProfile(token).subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load profile.';
        this.loading = false;
      }
    });
  }
}
