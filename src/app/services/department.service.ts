import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { Department } from '../models/department';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(product: Department){
    return this.httpClient.post(`${this.uri}/department`,product);
  }

  public updateData(product: Department){
    return this.httpClient.put(`${this.uri}/department`,product);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/department/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Department[]>(`${this.uri}/department`);
  }
}
