import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppCookieService } from 'src/app/models/app-cookie-service';
import { AppSettings } from 'src/app/models/app-settings';
import { JWTTokenService } from 'src/app/models/jwttoken-service';
import { User } from 'src/app/models/user';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  response:any
  disabled=false
  constructor(private tokenService: JWTTokenService,private router : Router,private authenticationService: AuthenticationService,public iziToast: NgxIzitoastService,public formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]]
    })  
  }

  doAction(): void {
    let login=this.loginForm.value;
    let user=new User()
    user.role=login.role
    user.email=login.email
    user.password=login.password
    this.disabled=true
    this.authenticationService.login(user).pipe(
      catchError(err => of([]))).subscribe(results => {
      this.disabled=false
      this.response=results
      if(this.response.status=='success'){
     this.tokenService.saveToken(this.response.access_token)
       localStorage.setItem('LoggedIn', "true");
       localStorage.setItem('firstname',this.response.data.firstname)
       this.router.navigate(['/']).then(() => {
        //window.location.reload();
      });
      }else if(this.response.status=='fail'){
        this.showFailMessage(this.response.message)
      }else{
        this.showFailMessage('Connection error check your internet connection.contact technical support if problem persist')
      }
    });
  }
  get getControl(){
    return this.loginForm.controls;
  }

  
  public hasError = (controlName: string, errorName: string) =>{
    return this.loginForm.controls[controlName].hasError(errorName);
  }



  showSuccessMessage(message:string){
    this.iziToast.success({
      title: 'Successful',
      message: message,
      position: 'bottomCenter' 
    });
  }

  showFailMessage(message:string){
    this.iziToast.error({
      title: 'Failed',
      message: message,
      position: 'bottomCenter' 
    });
  }

}
