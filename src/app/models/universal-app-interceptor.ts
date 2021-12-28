import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { RefreshTokenService } from "../services/refresh-token.service";
import { AppCookieService } from "./app-cookie-service";
import { AppSettings } from "./app-settings";
import { JWTTokenService } from "./jwttoken-service";

@Injectable()
export class UniversalAppInterceptor implements HttpInterceptor{
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
constructor(private router : Router, private tokenService: JWTTokenService,private refreshService: RefreshTokenService) { }
    
  intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>  {
    const token = sessionStorage.getItem("access_token")
    req = req.clone({
      withCredentials:true,
      url:  req.url,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && !req.url.includes('api/authad') && error.status === 401) {
        return this.handle401Error(req, next);
      }
      return throwError(error);
    }));
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
        return this.refreshService.getToken().pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;
            this.tokenService.saveToken(token.access_token);
            this.refreshTokenSubject.next(token.access_token);
            
            return next.handle(this.addTokenHeader(request, token.access_token));
          }),
          catchError((err) => {
            this.isRefreshing = false;
            console.log(err)
            this.router.navigate(['/login']);    
            this.tokenService.signOut();
            return throwError(err);
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    return request.clone( { withCredentials:true,
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

