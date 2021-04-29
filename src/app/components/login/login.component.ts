import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { LogIn, SignUp } from 'src/app/stores/actions/auth.actions';
import { AppState, selectAuthState } from 'src/app/stores/app.states';
import { NotificationService } from 'src/app/services/notificationService/notification.service'
import { MatDialog } from '@angular/material/dialog';
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

  constructor(
    private store: Store<AppState>,
    private message: NotificationService,
    public dialog: MatDialog) {
    this.getState = this.store.select(selectAuthState);
  }

  ngOnInit(): void {
    this.getState.subscribe((state) => {
      console.log('Login on init state:', state);
    })
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

  registerProcess(): void {
    console.log('Open Modal Bitch');
    const dialogRef = this.dialog.open(ModalComponent, {
      width: '300px',
      height: '300px',
      data: { action: 'register', username: '', password: '' }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (!result.username || !result.password) {
        this.message.showNotification('Must Fill In Information To Register', 3);
      }
      else {
        this.store.dispatch(new SignUp({ username: result.username, password: result.password }));
      }
    });
  }
}
