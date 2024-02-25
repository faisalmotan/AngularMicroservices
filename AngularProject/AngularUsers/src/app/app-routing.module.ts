import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// const routes: Routes = [];
import { LoginComponent } from './Users/login/login.component';
import { ChangepasswordComponent } from './Users/changepassword/changepassword.component';
 import { HomeComponent } from './home/home.component';
import { TokenValidateComponent } from './users/token-validate/token-validate.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'changePassword', component: ChangepasswordComponent },
  { path: 'Token', component: TokenValidateComponent },
  { path: 'Home', component: HomeComponent },
  
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
