import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { Subcategory } from '../models/subcategory';

@Injectable({
  providedIn: 'root'
})
export class SubcategoryService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(product: Subcategory){
    return this.httpClient.post(`${this.uri}/subcategory`,product);
  }

  public updateData(product: Subcategory){
    return this.httpClient.put(`${this.uri}/subcategory`,product);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/subcategory/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Subcategory[]>(`${this.uri}/subcategory`);
  }
}
