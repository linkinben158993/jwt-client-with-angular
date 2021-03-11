import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class NavGuardService implements CanActivate, CanLoad{

  constructor(private authService: AuthServiceService, private router: Router) { }


  canActivate(){
    return this.canLoad();
  }

  canLoad(){
    if(!this.authService.isLoggedIn()){
      this.router.navigate(['/login']);
    }
    return this.authService.isLoggedIn();
  }
}
