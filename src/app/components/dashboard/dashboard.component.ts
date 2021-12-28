import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxIzitoastService } from 'ngx-izitoast';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppCookieService } from 'src/app/models/app-cookie-service';
import { JWTTokenService } from 'src/app/models/jwttoken-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
   name:any=""
   response:any
  constructor(public iziToast: NgxIzitoastService,private router: Router,private tokenService: JWTTokenService,private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.name=localStorage.getItem('firstname')
  }

  openProductDetails(){
  this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
     this.router.navigate(['/productdetails']));
}

logout() :void {  
  this.authenticationService.logout().pipe(
    catchError(err => of([]))).subscribe(results => {
    this.response=results
    if(this.response.status=='success'){  
     this.tokenService.signOut()
     localStorage.clear()  
     localStorage.setItem('LoggedIn','false');
     this.router.navigate(['/login']); 
    }else if(this.response.status=='fail'){
      this.showFailMessage(this.response.message)
    }else{
      this.showFailMessage('Connection error check your internet connection.contact technical support if problem persist')
    }
  });    
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
