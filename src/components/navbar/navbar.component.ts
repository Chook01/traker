import { NgForOf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TuiButton } from '@taiga-ui/core';
import { TuiTabBar } from '@taiga-ui/addon-mobile';
import { NavigationStart, Router } from '@angular/router';

interface Item {
  text: string;
  icon: string;
  badge: number;
  route: string;
}

@Component({
  selector: 'app-navbar',
  imports: [NgForOf, TuiTabBar],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  standalone: true,
})
export class NavbarComponent implements OnInit {

  private router = inject(Router);

  protected activeItemIndex = 0;

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
        if (event.url.includes('inventory')) {
          this.activeItemIndex = 1;
        } else {
          this.activeItemIndex = 0;
        }
      }
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
  }
}
