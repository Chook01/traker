import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { TuiButton, TuiTitle } from '@taiga-ui/core';
import { TuiAppBar } from '@taiga-ui/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TuiAppBar, TuiButton, TuiTitle],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {

  private router = inject(Router);

  public isSettingsVisible: boolean = false;
  public isBackVisible: boolean = false;
  public routeTitle: 'Radni nalog' | 'Inventar' = 'Radni nalog';

  private routeNavigationSubscription: Subscription = new Subscription();

  public ngOnInit(): void {
    this.handleRouteSubscription();
  }

  private onRouteChange(event: NavigationStart): void {

    if(event.url.includes('inventory')) {
      this.routeTitle = 'Inventar';
    }
    else {
      this.routeTitle = 'Radni nalog';
    }

    if (event.url.includes('settings')) {
      this.isSettingsVisible = false;
      this.isBackVisible = true;
    }
    else {
      this.isSettingsVisible = true;
      this.isBackVisible = false;
    }
  }

  private handleRouteSubscription(): void {
    this.routeNavigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.onRouteChange(event);
      }
    });
  }

  public ngOnDestroy(): void {
    this.routeNavigationSubscription.unsubscribe();
  }

  public returnToHome(): void {
    this.router.navigate(['/']);
  }

  public openSettings(): void {
    this.router.navigate(['/settings']);
  }

}
