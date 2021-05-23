import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { NotificationService } from 'src/app/services/notificationService/notification.service';
import { LogIn, SignUp } from 'src/app/stores/actions/auth.actions';
import { AppState, selectAuthState } from 'src/app/stores/app.states';
import { ModalComponent } from './modal/modal.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  getState: Observable<any>;
  errorMessage: string | null;
  registerUser: any;
  socialProvider: string;

  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private message: NotificationService,
    public dialog: MatDialog) {
    this.getState = this.store.select(selectAuthState);
    this.socialProvider = 'http://localhost:4201/oauth2/login';
    this.route.params.subscribe((params) => {
      if (params?.credential) {
        const credential = jwt_decode(params.credential);
        const credentialObject = JSON.parse(credential['sub']);
        console.log(credentialObject);
      }
    });
  }

  ngOnInit(): void {
    this.getState.subscribe((state) => {
      console.log('Login on init state:', state);
      if (state.errorMessage) {
        this.message.showNotification(state.errorMessage, 3);
      }
    });
    this.initForm();
  }

  initForm(): void {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginProcess(): void {
    if (this.formGroup.valid) {
      this.store.dispatch(new LogIn(this.formGroup.value));
    }
    else {
      this.message.showNotification('Must Fill In Information To Login', 3);
    }
  }

  registerWithGoogle(): void {
    // Spring Boot OAuth2 Login Form
    // const socialLoginUrl = this.socialProvider;
    // const width = 1000;
    // const height = 800;
    // const top = (window.outerHeight - height) / 2;
    // const left = (window.outerWidth - width) / 2;
    // const socialLoginWindow
    // = window.open(socialLoginUrl, 'Social Login', `width=${width} height=${height},scrollbars=0,top=${top},left=${left}`);
    // setInterval(() => {
    //   if (socialLoginWindow == null || socialLoginWindow.closed) {
    //     console.log('Is closed:', socialLoginWindow.closed);
    //   }
    // }, 1000);

    window.location.href = this.socialProvider;
  }

  registerProcess(): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '400px',
      height: '500px',
      data: { action: 'register', username: '', password: '', dob: '' }
    });

    dialogRef.afterClosed().subscribe(
      {
        next: (result) => {
          if (result) {
            if (!result.username || !result.password || !result.dob) {
              this.message.showNotification('Must Fill In Information To Register', 3);
              console.log('The dialog was closed without data!');
            }
            else {
              const formattedDate = new Date(result.dob).toISOString().substr(0, 10);
              this.store.dispatch(new SignUp({ email: result.username, password: result.password, dob: formattedDate }));
              console.log('The dialog was closed with data!');
            }
          }
        },
        error: (err) => {
          console.log(err);
        }
      }
    );
  }
}
