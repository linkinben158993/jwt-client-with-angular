import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class HomeGuardService implements CanActivate, CanLoad {

  constructor(private authService: AuthServiceService, private router: Router) { }

  canActivate(): boolean {
    return this.canLoad();
  }
  canLoad(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    return this.authService.isLoggedIn();
  }
}
