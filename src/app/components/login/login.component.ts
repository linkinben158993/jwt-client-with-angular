import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private authenticate: AuthServiceService, private router: Router) { }

  ngOnInit(): void {
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
      this.authenticate.login(this.formGroup.value).subscribe((result) => {
        console.log("Component:", result);
        if(result.response){
          console.log("Success");
          alert(result.response.message + " Motherfucker!");
          this.router.navigate(['/home']);  
        }
        else{
          console.log("Failed");
          alert(result[0].error.message + " Motherfucker!");
        }
      });
    }
    else {
      alert("Must Fill In Information To Login");
    }
  }

  registerProcess() {
    console.log("Sup Bitch");

  }
}
