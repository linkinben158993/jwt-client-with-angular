import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../services/authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthServiceService, private router: Router) { }

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);
    }
    return !this.authService.isLoggedIn();
  }
}
