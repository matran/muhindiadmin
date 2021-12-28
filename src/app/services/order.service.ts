import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { Department } from '../models/department';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(order: Order){
    return this.httpClient.post(`${this.uri}/orders`,order);
  }

  public updateData(order: Order){
    return this.httpClient.put(`${this.uri}/orders`,order);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/orders/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Order[]>(`${this.uri}/orders`);
  }
  public changeOrderStatus(order: Order){
    return this.httpClient.put(`${this.uri}/orders`,order);
  }
}
