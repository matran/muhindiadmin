import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
private uri = AppSettings.API_ENDPOINT;
constructor(private httpClient: HttpClient) { }
public login(info: User){
  return this.httpClient.put(`${this.uri}/authad`,info);
}
public register(info: User){
  return this.httpClient.post(`${this.uri}/authad`,info);
}
public logout(){
  return this.httpClient.get(`${this.uri}/logout`);
}
}
