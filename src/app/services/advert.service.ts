import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Advert } from '../models/advert';
import { AppSettings } from '../models/app-settings';

@Injectable({
  providedIn: 'root'
})
export class AdvertService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(advert: FormData){
    return this.httpClient.post(`${this.uri}/adverts`,advert);
  }

  public updateData(advert: FormData){
    return this.httpClient.put(`${this.uri}/adverts`,advert);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/adverts/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Advert[]>(`${this.uri}/adverts`);
  }
}
