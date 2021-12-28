import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { Category } from '../models/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(product: Category){
    return this.httpClient.post(`${this.uri}/category`,product);
  }

  public updateData(product: Category){
    return this.httpClient.put(`${this.uri}/category`,product);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/category/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Category[]>(`${this.uri}/category`);
  }
}
