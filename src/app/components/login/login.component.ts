import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { LogIn } from 'src/app/stores/actions/auth.actions';
import { AppState, selectAuthState } from 'src/app/stores/app.states';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;
  getState: Observable<any>;
  errorMessage: string | null;

  constructor(private store: Store<AppState>, private authenticate: AuthServiceService, private router: Router) {
    this.getState = this.store.select(selectAuthState);
   }

  ngOnInit(): void {
    this.getState.subscribe((state)=>{
      console.log("Login on init state:", state);
    })
    this.initForm();
  }

  initForm() {
    this.formGroup = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  loginProcess() {
    if (this.formGroup.valid) {
      this.store.dispatch(new LogIn(this.formGroup.value));
    }
    else {
      alert("Must Fill In Information To Login");
    }
  }

  registerProcess() {
    console.log("Sup Bitch");
  }
}
