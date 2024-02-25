import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms'
import { LoginServiceService } from '../Users/login-service.service';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit{

 
  constructor(private formBuilder:FormBuilder,
              private userService:LoginServiceService,
              private router:Router){}
  
    ChangePassword!: FormGroup;


    password(formGroup: FormGroup) {
      let Password:any = formGroup.get('Password')?.value;
      let ConfirmPassword:any = formGroup.get('ConfirmPassword')?.value;
      var IsPassMatched = Password === ConfirmPassword;
      console.log(IsPassMatched);
      return Password == ConfirmPassword ? false : { passwordNotMatch: true };
    }

   ngOnInit(): void {
      this.ChangePassword = this.formBuilder.group({
       
          Password:['',{
            validators:[Validators.required,Validators.minLength(8)
              , Validators.pattern(/^(?=.*[!@#$%^&*])/)
            ]
      }],
      ConfirmPassword:['',{
        validators:[Validators.required,Validators.minLength(8)
          , Validators.pattern(/^(?=.*[!@#$%^&*])/)
        ]
  }]
    }, {
      validators: this.password.bind(this)
    }
    );
  }

  getErrorMessageConfirmPassword(){
    const field = this.ChangePassword.get("ConfirmPassword");
  
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
  
  getErrorMessagePassword(){
    const field = this.ChangePassword.get("Password");
  
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
  
 ChangePasswordMethod(){
  let userInfoString:any = sessionStorage.getItem('userInfo');

    const userInfo = JSON.parse(userInfoString);
    const emailAddress = userInfo.emailAddress;
    
  console.log(userInfo);
     const { Password } = this.ChangePassword.value; 
    const user = { EmailAddress:emailAddress , Password };
  console.log(user);
  this.userService.ChangePassword(user).subscribe(
        response => {
          console.log('Password changed successful:', response);
          if (response){
            this.router.navigate(['/login']);

          }
        },
        error => {
          console.log(error.error);
             this.errorMessage = error.error;
        }
      );
    
      }
  }
  