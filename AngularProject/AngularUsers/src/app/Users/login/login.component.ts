import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl, FormBuilder, Validators} from '@angular/forms'
import { LoginServiceService } from '../Users/login-service.service';
import { Route } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

 
constructor(private formBuilder:FormBuilder,
            private userService:LoginServiceService,
            private router:Route){}

  LoginForm!: FormGroup;

 ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
        username:['',{
              validators:[Validators.required,Validators.email]
        }],
        password:['',{
          validators:[Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*[!@#$%^&*])/)]
    }]
  });
}

getErrorMessageUserName(){
  const field = this.LoginForm.get("username");

  if (field?.hasError('required')){
    return 'The username is required'
  }
  if (field?.hasError('email')){
    return 'The invalid username email format'
  }

  return ''
}

getErrorMessagePassword(){
  const field = this.LoginForm.get("password");

  if (field?.hasError('required')){
    return 'The password is required'
  }
  if (field?.hasError('minlength')) {
    return 'The password must be at least 8 characters long';
  }
  if (field?.hasError('pattern')) {
    return 'The password must contain at least one special character (!@#$%^&*)';
  }
  return ''
}

  login(){

    //this.router.resolve
    console.warn(this.LoginForm.value);
  }

}
