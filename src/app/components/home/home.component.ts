import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(overlayContainer: OverlayContainer, private authenticate: AuthServiceService, private router: Router) { 
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }

  ngOnInit(): void {

  }

  logoutProcess(){
    
  }
}
