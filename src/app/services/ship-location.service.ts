import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from '../models/app-settings';
import { ShipLocation } from '../models/ship-location';

@Injectable({
  providedIn: 'root'
})
export class ShipLocationService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(location: ShipLocation){
    return this.httpClient.post(`${this.uri}/locations`,location);
  }

  public updateData(location: ShipLocation){
    return this.httpClient.put(`${this.uri}/locations`,location);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/locations/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<ShipLocation[]>(`${this.uri}/locations`);
  }
}
