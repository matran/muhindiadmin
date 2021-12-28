import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
 
  public getOrderCount(month:number){
    return this.httpClient.get(`${this.uri}/ordercount/${month}`);
  }
}
