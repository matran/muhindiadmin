import { HttpClient, HttpErrorResponse, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppSettings } from '../models/app-settings';
import { Product } from '../models/product';
import { ProductImage } from '../models/product-image';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private uri = AppSettings.API_ENDPOINT;
  constructor(private httpClient: HttpClient) { }
  public saveData(product: Product){
    return this.httpClient.post(`${this.uri}/products`,product);
  }
   public updateData(product: Product){
    return this.httpClient.put(`${this.uri}/products`,product);
  }
 
  public deleteData(id: string){
    return this.httpClient.delete(`${this.uri}/products/${id}`);
  }
 
  public getData(){
    return this.httpClient.get<Product[]>(`${this.uri}/products`);
  }
  public uploadProductPhoto(file: File,product_id: string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('file', file);
    formData.append('productid',product_id)
    const req = new HttpRequest('POST', `${this.uri}/uploadproductimage`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

  public uploaDataWithImage(formData:FormData): Observable<any>  {
    return this.httpClient.post(`${this.uri}/withimage`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
 
  }

  public updateWithImage(formData:FormData): Observable<any> {
    return this.httpClient.put(`${this.uri}/withimage`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }


  public getImages(id: string): Observable<any> {
    return this.httpClient.get(`${this.uri}/productimage/${id}`);
  }
  
  public deleteImage(id: string){
    return this.httpClient.delete(`${this.uri}/productimage/${id}`);
  }
  public setFeatured(product: Product){
    return this.httpClient.put(`${this.uri}/featured`,product);
  }
  public setImageType(product:ProductImage){
    return this.httpClient.post(`${this.uri}/proimage`,product); 
  }
  
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }
}
