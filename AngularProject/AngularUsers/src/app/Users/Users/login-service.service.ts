import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  constructor(private http:HttpClient) { }

  private apiUrl = 'https://localhost:7219/Users/LoginUser'; 

  private apiUrlChangePassword = 'https://localhost:7219/Users/ChangePassword'; 

  loginUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user);
  }

  ChangePassword(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrlChangePassword, user);
  }
}
