import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl, FormBuilder, Validators} from '@angular/forms'
import { LoginServiceService } from '../Users/login-service.service';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

 
constructor(private formBuilder:FormBuilder,
            private userService:LoginServiceService,
            private router:Router){}

  LoginForm!: FormGroup;

 ngOnInit(): void {
    this.LoginForm = this.formBuilder.group({
      EmailAddress:['',{
              validators:[Validators.required,Validators.email]
        }],
        Password:['',{
          validators:[Validators.required,Validators.minLength(8), Validators.pattern(/^(?=.*[!@#$%^&*])/)]
    }]
  });
}

getErrorMessageEmailAddress(){
  const field = this.LoginForm.get("EmailAddress");

  if (field?.hasError('required')){
    return 'The username is required'
  }
  if (field?.hasError('email')){
    return 'The invalid EmailAddress format'
  }

  return ''
}

getErrorMessagePassword(){
  const field = this.LoginForm.get("Password");

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


errorMessage: string | null = null; // Initialize with null or an initial value

  login(){
console.log(this.LoginForm.value);
const { EmailAddress, Password } = this.LoginForm.value;
  const user = { EmailAddress, Password }; 
 

this.userService.loginUser(user).subscribe(
      response => {
        console.log(response);
        if (response.isFirstTimeLogin){
          sessionStorage.setItem('userInfo', JSON.stringify(response));
          this.router.navigate(['/changePassword']);
        }
        else if (response){
          this.router.navigate(['/Token']);

        }
      },
      error => {
        console.log(error.error);
        // if (error.status === 400 && error.error && error.error.message) {
        //   // Display the error message in errorMessage
           this.errorMessage = error.error;
        // }
      }
    );
  
    }
}
