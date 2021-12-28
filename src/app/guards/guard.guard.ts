import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppCookieService } from '../models/app-cookie-service';
import { JWTTokenService } from '../models/jwttoken-service';

@Injectable({
  providedIn: 'root'
})
export class GuardGuard implements CanActivate {
  constructor(private cookieService: AppCookieService,private router: Router,private jwtService: JWTTokenService) { }  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
 
      if (this.isLoggedIn()) {      
        return true;      
        }else{
        this.router.navigate(['/login']);      
        return false;
        }
  }


  public isLoggedIn(): boolean {      
    let status = false;      
    if (localStorage.getItem('LoggedIn') == "true") {      
       status = true;      
    }    
    else {      
       status = false;      
       }      
    return status;      
    }
  
}
