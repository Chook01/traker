import { Component } from '@angular/core';
import { ListComponent } from '../../components/list/list.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
})
export class OrdersComponent { }
