import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TuiAccordion } from '@taiga-ui/kit';
import { TuiButton, TuiIcon } from '@taiga-ui/core';
import { ListItemComponent } from '../list-item/list-item.component';
import { DataService } from '../../services/data.service';
import { Order } from '../../interfaces/order.interface';
import { NgFor, NgIf } from '@angular/common';
import { tuiDialog } from '@taiga-ui/core';
import { ItemComponent } from '../item/item.component';
import { Subscription } from 'rxjs';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [TuiAccordion, TuiIcon, ListItemComponent, NgFor, NgIf, TuiButton, LoadingComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent implements OnInit, OnDestroy {

  private dataService = inject(DataService);

  public items: {
    order: Order[],
    done: Order[],
    delivery: Order[],
    payment: Order[],
  } = {
      order: [],
      done: [],
      delivery: [],
      payment: [],
    }

  public isOrdersLoading: boolean = true;
  public orderButtonPositionLeft = false;

  public orderUpdateSubscription: Subscription = new Subscription;


  public ngOnInit(): void {
    this.getOrders();
    this.orderButtonPositionLeft = this.getOrderButtonPosition();

    this.handleOrderUpdateSubscription();
  }

  public ngOnDestroy(): void {
    this.orderUpdateSubscription.unsubscribe();
  }

  private readonly dialog = tuiDialog(ItemComponent, {
    dismissible: true,
    label: 'Nova narudžba',
  });

  private handleOrderUpdateSubscription(): void {
    this.orderUpdateSubscription = this.dataService.orderUpdate$.subscribe(() => {
      console.log("[ DEBUG ] - Order update detected...")
      this.getOrders();
    });
  }

  private getOrders() {
    console.log("[ DEBUG ] - Fetching orders...")
    this.dataService.getOrders().subscribe((orders: { items: Order[] }) => {

      this.resetOrders();

      orders.items.forEach((order: Order) => {
        order.description = order.description.replaceAll("<p>", "");
        order.description = order.description.replaceAll("</p>", "");
        order.description = order.description.replaceAll("<br>", "&#10;");
        if (order.status === 'order') this.items.order.push(order);
        if (order.status === 'done') this.items.done.push(order);
        if (order.status === 'delivery') this.items.delivery.push(order);
        if (order.status === 'payment') this.items.payment.push(order);
      });

      this.isOrdersLoading = false;
    });
  }

  private resetOrders() {
    console.log("[ DEBUG ] - Orders reseted...")
    this.items = {
      order: [],
      done: [],
      delivery: [],
      payment: [],
    }
  }

  protected showDialog(): void {

    const data: Order = {
      client: '',
      collectionId: '',
      collectionName: '',
      created: '',
      description: '',
      id: '',
      images: [],
      location: 'unknown',
      status: 'order',
      updated: '',
      thumbnails: [],
    }

    this.dialog(data).subscribe({
      next: (data) => {
        console.info(`Dialog emitted data = ${data}`);
        if (data == 'success') {
          this.getOrders();
        }
      },
      complete: () => {
        console.info('Dialog closed');
      },
    });
  }

  private getOrderButtonPosition() {
    return this.dataService && this.dataService.settings.order_button_side_left ? true : false;
  }
}
