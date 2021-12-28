import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettings } from '../models/app-settings';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private uri = AppSettings.API_ENDPOINT;
  response:any
  constructor(private httpClient: HttpClient) { }
  public getToken(){
    return this.httpClient.get(`${this.uri}/refreshtoken`);
  }

}
