import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {FormGroup,FormControl, FormBuilder, Validators} from '@angular/forms'
 import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
 
@Component({
  selector: 'app-token-validate',
  templateUrl: './token-validate.component.html',
  styleUrls: ['./token-validate.component.css']
})
export class TokenValidateComponent implements OnInit{



  constructor(private formBuilder:FormBuilder,
    private http:HttpClient,
     private router:Router){}

    TokenValidate!: FormGroup;
    errorMessage: string | null = null; // Initialize with null or an initial value


    ngOnInit(): void {
      this.TokenValidate = this.formBuilder.group({
        Token:['',{
                validators:[Validators.required]
          }] 
    });
  }
  getErrorMessageToken(){
    const field = this.TokenValidate.get("Token");
  
    if (field?.hasError('required')){
      return 'The token is required'
    }
    return ''
  }

  private apiUrlToken = 'https://localhost:7219/Users/TokenValidate'; 

  TokenService(user: any): Observable<any> {

    return this.http.post<any>(this.apiUrlToken,user);

  }


TokenValidateMethod(){
  let userInfoString:any = sessionStorage.getItem('userInfo');

    const userInfo = JSON.parse(userInfoString);
  
  const emailAddress = userInfo.emailAddress;
  const { Token } = this.TokenValidate.value; 
  const user = { EmailAddress:emailAddress , Token };

  this.TokenService(user).subscribe(
    response => {
      console.log('Token', response);
      if (response){
        this.router.navigate(['/Home']);

      }
    },
    error => {
      console.log(error.error);
         this.errorMessage = error.error;
    }
  );






}




}
