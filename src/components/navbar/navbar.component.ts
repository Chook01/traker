import { NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { NavigationStart, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DataService } from '../../services/data.service';
import { NotificationItem } from '../../interfaces/notification.interface';
import { CollectionResponse } from '../../interfaces/collection.interface';

interface Item {
  text: string;
  icon: string;
  badge: number;
  route: string;
}

@Component({
  selector: 'app-navbar',
  imports: [NgForOf, TuiTabBar, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent implements OnInit {

  private router = inject(Router);
  private dataService = inject(DataService);

  protected activeItemIndex = 0;

  public visible: boolean = false;

  protected readonly items: Item[] = [
    {
      text: 'Narudžbe',
      icon: '@tui.package-check',
      badge: 0,
      route: 'order'
    },
    {
      text: 'Inventar',
      icon: '@tui.clipboard-list',
      route: 'inventory',
      badge: 0,
    },
    {
      text: 'Obavijesti',
      icon: '@tui.bell',
      route: 'notifications',
      badge: 1,
    },
  ];

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.getNotificationCount();

        // if(event.url.includes('login')) {
        //   this.visible = false;
        // } else {
        //   this.visible = true;
        // }

        if (event.url.includes('inventory')) {
          this.activeItemIndex = 1;
        } else if (event.url.includes('notifications')) {
          this.activeItemIndex = 2;
        } else {
          this.activeItemIndex = 0;
        }
      }
    });
  }

  private getNotificationCount(): void {
    this.dataService.getNotifications().subscribe((noti: CollectionResponse) => {
      const notificationItem = this.items.find((item: Item) => item.route == 'notifications');
      if (!notificationItem) return;
      notificationItem.badge = noti.totalItems;
    });
  }

  protected onClick(item: Item): void {
    item.badge = 0;
    if (item.route == 'inventory') {
      this.router.navigateByUrl('/inventory');
    }
    else if (item.route == 'order') {
      this.router.navigateByUrl('/');
    }
    else if (item.route == 'notifications') {
      this.router.navigateByUrl('/notifications');
    }
  }
}
