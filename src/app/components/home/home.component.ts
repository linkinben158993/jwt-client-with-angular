import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(overlayContainer: OverlayContainer, private authenticate: AuthServiceService, private router: Router, private http: HttpClient) {
    overlayContainer.getContainerElement().classList.add('dark-theme');
  }

  ngOnInit(): void {
    console.log('Enter Home Component!');
    console.log('Bearer ' + localStorage.getItem('JWT_ACCESSS_TOKEN'));
    console.log('Authorization ' + localStorage.getItem('REFRESH_ACCESS_TOKEN'));

    const reqHeader = new HttpHeaders({
      'access_token': 'Bearer ' + localStorage.getItem('JWT_ACCESSS_TOKEN'),
      'refresh_token': 'Authorization ' + localStorage.getItem('REFRESH_ACCESS_TOKEN')
    });
    this.http.get('http://localhost:4201/api/user', { headers: reqHeader }).subscribe({
      next: data => {
        console.log(data);
      }
      , error: error => {
        console.log('Error:', error);
      }
    });
    console.log('End calling API!');
  }

  logoutProcess() {

  }
}
