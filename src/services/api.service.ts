import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http = inject(HttpClient);

  public API_URL = 'https://order-api.graver-elite.com/api';

  public userData = {
    JWT_TOKEN: '',
    id: '',

  }

  public getItem(collection: string, id: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.get(`${this.API_URL}/collections/${collection}/records/${id}`, {headers: headers});
  }

  public getItems(collection: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.get(`${this.API_URL}/collections/${collection}/records?sort=-updated&perPage=70`, {headers: headers});
  }

  public getItemsByFilter(collection: string, filter: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.get(`${this.API_URL}/collections/${collection}/records?filter=(${filter})`, {headers: headers});
  }

  public loginUser(username: string, password: string) {
    return this.http.post(`${this.API_URL}/collections/users/auth-with-password`, { identity: username, password });
  }

  public createOrder(data: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.post(`${this.API_URL}/collections/orders/records`, data, { headers: headers });
  }

  public updateOrder(data: any, id?: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.patch(`${this.API_URL}/collections/orders/records/${id}`, data, { headers: headers });
  }

  public updateCollectionItem(collection: string, id: string, data: any) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.patch(`${this.API_URL}/collections/${collection}/records/${id}`, data, { headers: headers });
  }

  public deleteOrder(id: string) {
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', this.userData.JWT_TOKEN);
    return this.http.delete(`${this.API_URL}/collections/orders/records/${id}`, {headers: headers});   
  }

}
