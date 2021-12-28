import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { Customer } from '../models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(customer: Customer){
    return this.httpClient.post(`${this.uri}/authusers`,customer);
  }
   public updateData(customer: Customer){
    return this.httpClient.put(`${this.uri}/authusers`,customer);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/authusers/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Customer[]>(`${this.uri}/users`);
  }
}
