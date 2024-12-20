import { EventEmitter, Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { Subject } from 'rxjs';
import { Settings } from '../interfaces/settings.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public orders: any;
  public settings: Settings = { order_button_side_left: false, list_location_visible: true };

  public orderUpdate$ = new EventEmitter();

  constructor(private apiService: ApiService) {
  }

  public getOrders(): any {
    return this.apiService.getItems('orders');
  }

  public getImage(collection: string, id: string, filename: string, size?: string) {
    return `${this.apiService.API_URL}/files/${collection}/${id}/${filename}${size ? `?thumb=${size}` : ''}`;
  }
}
